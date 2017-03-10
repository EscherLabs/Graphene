<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Page;
use App\User;
use App\Group;
use App\AppInstance;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except('show', 'run');
    }
    
    public function index()
    {
        $pages = Page::whereHas('group', function($q){
            $q->where('site_id','=',config('app.site')->id);
        })->get();
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
        $page->update($request->all());
        return $page;
    }

    public function destroy(Page $page)
    {
        if ($page->delete()) {
            return 1;
        }
    }

    public function run($group, $slug, Request $request) {
        if(!is_numeric($group)) {
			$groupObj = Group::where('slug','=',$group)->first();
			$group = $groupObj->id;
		}
        
        $myPage = Page::where('group_id','=', $group)->where('slug', '=', $slug)->first();

        if($myPage->public == 0) {
            if(!Auth::check() || !in_array($group, $Auth::user()->groups)) {
                App::abort(403, 'Access denied');
            }
        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $apps = AppInstance::whereIn('group_id', $current_user->groups)->with('app')->get();
            $links = Group::links()->get();
        } else { /* User is not Authenticated */
            $current_user = new User;
            $apps = AppInstance::where('public', '=', 1)->with('app')->get();
            $links = Group::publicLinks()->get();
        }

        
        if($myPage != null) {
            if(!isset($myPage->content)){
                $config = '""';
            }else{
                $config = $myPage->content;
            }
            $name = $myPage->name;
            // $links = Group::with(array('app_instances'=>function($q){
            //     $q->select('group_id','id', 'name', 'slug', 'icon');
            // },'pages'=>function($q){
            //     $q->select('group_id','id', 'name', 'slug');
            // }))->whereIn('id',$current_user->groups)->get();
            return view('dashboard',['links'=>$links, 'apps'=>$apps,'name'=>$name, 'config'=>$config, 'id'=>$myPage->id]);

        }
        abort(404,'App not found');
    }
}
