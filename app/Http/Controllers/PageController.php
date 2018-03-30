<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Page;
use App\User;
use App\Group;
use App\AppVersion;
use App\AppInstance;
use Illuminate\Http\Request;
use App\Libraries\Templater;

class PageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except('show', 'run');
    }
    
    public function list_all_pages(Request $request) {
        if (Auth::user()->site_admin) {
            $pages = Page::select('id','group_id','name','slug','icon','order','unlisted','device','public')->whereHas('group', function($q){
                $q->where('site_id','=',config('app.site')->id);
            })->orderBy('group_id','order')->get();
        } else {
            $pages = Page::select('id','group_id','name','slug','icon','order','unlisted','device','public')->whereHas('group', function($q){
                $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->content_admin_groups);
            })->orderBy('group_id','order')->get();
        }
        return $pages;
    }

    public function show(Page $page)
    {
        if (!$page->public) {
            $this->authorize('get_data', $page);
        } 
        return $page;
    }

    public function create(Request $request)
    {
        $page = new Page($request->all());
        $page->save();
        return $page;
    }

    public function update(Request $request, Page $page)
    {
        $data = $request->all();
        if(isset($data['content'])){
            $data['content'] = json_decode($data['content']);
        }        
        if(isset($data['mobile_order'])){
            $data['mobile_order'] = json_decode($data['mobile_order']);
        }
        $page->update($data);
        return $page;
    }

    public function destroy(Page $page)
    {
        if ($page->delete()) {
            return 1;
        }
    }

    public function run($group, $slug = null, Request $request) {
        if(!is_numeric($group)) {
			// $groupObj = Group::with('composites')->where('slug','=',$group)->first();
			// $group = $groupObj->id;
            $groupObj = Group::where('slug','=',$group)->first();

            if (Auth::user()->site_admin || Auth::user()->group_admin($groupObj->id)) {
                $groupObj->load(array('composites'=>function($query){
                    $query->with(array('group'=>function($query){
                    $query->select('name','id');
                }))->select('group_id','composite_group_id');
                }));
            }else{
                $groupObj->load('composites');
            }            
            
			$group = $groupObj->id;
		}else{
            if (Auth::user()->site_admin || Auth::user()->group_admin($agroup)) {
                $groupObj = Group::with(array('composites'=>function($query){
                    $query->with(array('group'=>function($query){
                    $query->select('name','id');
                }))->select('group_id','composite_group_id');
                }))->where('id','=',$group)->first();
                $group = $groupObj->id;
            }else{
    			$groupObj = Group::with('composites')->where('id','=',$group)->first();
            }
        }

        if(isset($slug)){
            $myPage = Page::where('group_id','=', $group)->where('slug', '=', $slug)->first();
        }else{
            // Redirect to first page or first app in this group
            $myPage = Page::where('group_id','=', $group)->first();
            if(!is_null($myPage)){
                return redirect('/page/'.$groupObj->slug.'/'.$myPage->slug);
            } else {
                $myAppInstance = AppInstance::where('group_id','=', $group)->first();
                if(!is_null($myAppInstance)){
                    return redirect('/app/'.$groupObj->slug.'/'.$myAppInstance->slug);
                } else {
                    abort(404);
                }
            }
        }

        // Get a list of all the micro app instances on the page
        $uapp_instances = [];
        if(isset($myPage->content)){
        foreach($myPage->content->sections as $column_index => $column) {
            foreach($column as $widget) {
                if ($widget->widgetType === 'uApp') {
                    if(isset($widget->app_id)) {
                        $uapp_instances[] = $widget->app_id;
                    }
                }
            }
        }}

        if($myPage->public == 0) {
            // if(!Auth::check() || !in_array($group, Auth::user()->groups)) {
            //     abort(403, 'Access denied');
            // }
            $this->authorize('get', $myPage);
        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $apps = AppInstance::whereIn('id', $uapp_instances)->with('app')->get();
            $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
            // dd($links);
        } else { /* User is not Authenticated */
            $current_user = new User;
            $apps = AppInstance::whereIn('id', $uapp_instances)->where('public', '=', 1)->with('app')->get();
            $links = Group::publicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        }
        /* This should probably be fixed -- we're looping through all the apps to find the correct app version code */
        foreach($apps as $key => $app) {
            $myAppVersion = AppVersion::where('id','=',$app->app_version_id)->first();
            $apps[$key]->app->code = $myAppVersion->code;
        }


        if($myPage != null) {
            if(!isset($myPage->content)){
                $config = '""';
            }else{
                $config = $myPage->content;
            }            
            if(!isset($myPage->mobile_order)){
                $myPage->mobile_order = [];
            }
            
            $template = new Templater();
            return $template->render([
                'apps_pages'=>$links, 
                'apps'=>$apps, 
                'name'=>$myPage->name, 
                'slug'=>$myPage->slug, 
                'config'=>$config, 
                'data'=>$myPage->mobile_order, 
                'id'=>$myPage->id,
                'group'=>$groupObj
            ]);
            // return view('timtest',[
            //     'links'=>$links, 
            //     'apps'=>$apps, 
            //     'name'=>$myPage->name, 
            //     'slug'=>$myPage->slug, 
            //     'config'=>$config, 
            //     'id'=>$myPage->id
            // ]);
        }
        abort(404,'Page not found');
    }
}
