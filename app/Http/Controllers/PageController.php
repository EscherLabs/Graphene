<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Page;
use App\User;
use App\Group;

use App\AppInstance;
use Illuminate\Http\Request;
use App\Libraries\Templater;

class PageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except('show', 'run');
    }
    
    public function index()
    {
        return Page::whereHas('group', function($q){
            $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->admin_groups);
        })->get();
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
        $data['content'] = json_decode($data['content']);
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
			$groupObj = Group::where('slug','=',$group)->first();
            $group = $groupObj->id;
		}else{
			$groupObj = Group::where('id','=',$group)->first();
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
            if(!Auth::check() || !in_array($group, Auth::user()->groups)) {
                abort(403, 'Access denied');
            }
        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $apps = AppInstance::whereIn('id', $uapp_instances)->with('app')->get();
            $links = Group::links()->get();
        } else { /* User is not Authenticated */
            $current_user = new User;
            $apps = AppInstance::whereIn('id', $uapp_instances)->where('public', '=', 1)->with('app')->get();
            $links = Group::publicLinks()->get();
        }

        if($myPage != null) {
            if(!isset($myPage->content)){
                $config = '""';
            }else{
                $config = $myPage->content;
            }
            $template = new Templater();
            return $template->render([
                'links'=>$links, 
                'apps'=>$apps, 
                'name'=>$myPage->name, 
                'slug'=>$myPage->slug, 
                'config'=>$config, 
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
        abort(404,'App not found');
    }
}
