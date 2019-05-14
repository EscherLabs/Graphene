<?php

namespace App\Http\Controllers;
use App\UserDashboard;
use App\AppInstance;
use App\Group;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Libraries\Templater;
use App\Libraries\CustomAuth;

class UserDashboardController extends Controller
{
    public function __construct() {}
    
    public function index(Request $request) {
        $this->customAuth = new CustomAuth();
        $groups = [];
        if(Auth::user()) {
            $user_dashboard = UserDashboard::where('user_id','=',Auth::user()->id)->where('site_id','=',Auth::user()->site->id)->first();
            if(is_null($user_dashboard) || !isset($user_dashboard->config)){
                $config = '""';
            }else{
                $config = $user_dashboard->config;
            }
            $groups = Auth::user()->groups;

            // $links = Group::with(array('app_instances'=>function($q){
            //     $q->select('group_id','id', 'name', 'slug', 'icon', 'unlisted');
            // },'pages'=>function($q){
            //     $q->select('group_id','id', 'name', 'slug', 'unlisted');
            // }))->whereIn('id',Auth::user()->groups)->get();
            
            // Redirect to first Page or first App
            $group_links = Group::has('pages', '>', 0)->orHas('app_instances','>',0)->AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        }else{

            $return = $this->customAuth->authenticate($request);
            if(isset($return)){
                return $return;
            }
            // $group_links = Group::has('pages', '>', 0)->PublicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();

        }
        if (isset($group_links[0])) {
            if (isset($group_links[0]->pages[0])) {
                return redirect('/page/'.strtolower($group_links[0]->slug).'/'.strtolower($group_links[0]->pages[0]->slug));
            } else if (isset($group_links[0]->app_instances[0])) {
                return redirect('/app/'.strtolower($group_links[0]->slug).'/'.strtolower($group_links[0]->app_instances[0]->slug));
            }
        }
        
        $template = new Templater();

        return $template->render([
            'mygroups'=>$group_links,
            'name'=>"Dashboard",
            'slug'=>'',
            'apps'=>AppInstance::whereIn('group_id',$groups)->with('app')->get(), 
            'config'=>$config, 
            'id'=>Auth::user()->id
        ]);
    }

    public function css(Request $request) {
        $max_age = 604800; // Cache for 7 days
        $site_css = config('app.site')->select('theme')->first()->theme->css;
        return response($site_css,200)
            ->header('Content-Type', 'text/css')
            ->header('Pragma','cache')
            ->header('Cache-Control','max-age='.$max_age);
    }

    public function heartbeat(Request $request) {
        return ['status'=>true];
    }

    public function update(Request $request) {
        $this->customAuth = new CustomAuth();
        return UserDashboard::updateOrCreate(
            ['user_id'=>Auth::user()->id, 'site_id'=>Auth::user()->site->id], 
            ['config'=>json_decode($request->config)]);
    }

}
