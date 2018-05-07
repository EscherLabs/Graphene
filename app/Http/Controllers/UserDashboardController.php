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
    public function __construct() {
        // $this->middleware('auth');
        $this->customAuth = new CustomAuth();                   
    }
    
    public function index(Request $request) {
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
            $group_links = Group::has('pages', '>', 0)->AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        }else{

            $this->customAuth->authenticate();
            if(Auth::user()){
                return redirect()->back();
            }
            // $group_links = Group::has('pages', '>', 0)->PublicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();

        }
        if (isset($group_links[0])) {
            if (isset($group_links[0]->pages[0])) {
                return redirect('/page/'.$group_links[0]->slug.'/'.$group_links[0]->pages[0]->slug);
            } else if (isset($group_links[0]->app_instances[0])) {
                return redirect('/app/'.$group_links[0]->slug.'/'.$group_links[0]->app_instances[0]->slug);
            }
        }
        
        $template = new Templater();

        return $template->render([
            'apps_pages'=>$group_links,
            'name'=>"Dashboard",
            'slug'=>'',
            'apps'=>AppInstance::whereIn('group_id',$groups)->with('app')->get(), 
            'config'=>$config, 
            'id'=>Auth::user()->id
        ]);
    }

    public function update(Request $request) {
        return UserDashboard::updateOrCreate(
            ['user_id'=>Auth::user()->id, 'site_id'=>Auth::user()->site->id], 
            ['config'=>json_decode($request->config)]);
    }

}
