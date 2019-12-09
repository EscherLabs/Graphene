<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Group;
use App\AppInstance;
use Illuminate\Http\Request;
use App\Libraries\CustomAuth;
use Illuminate\Support\Facades\Log;

class EllucianMobileController extends Controller
{
    public function __construct() {
        // $this->middleware('auth')->except('config');
        $this->customAuth = new CustomAuth();
        config(['ellucianmobile.loginType'=>
            env(config('app.site')->name.'_EM_LOGIN_TYPE','browser')]);
        config(['ellucianmobile.homeIcons'=>
            explode(',',env(config('app.site')->name.'_EM_HOME_ICONS',''))]);
    }
    
    public function login(Request $request) {
        if (config('ellucianmobile.loginType') === 'browser') {
            if(!Auth::user()){ 
                $return = $this->customAuth->authenticate($request);
                if(isset($return)){
                    return $return;
                }
            }
        } else if (config('ellucianmobile.loginType') === 'native') {
            if (Auth::attempt(['email' => $request->header('php-auth-user'), 'password' => $request->header('php-auth-pw')])) {
                // continue
            } else {
                $headers = ['WWW-Authenticate' => 'Basic'];
                return response()->make('Access Deined!', 401, $headers);
            }
        }
        return '
<!-- Copyright 2014 Ellucian Company L.P. and its affiliates. -->
<html>
<head>
    <title>Authentication Success</title>
    <style type="text/css">
    .message {
        border: 1px solid black;
        padding: 5px;
        background-color:#E9E9E9;
    }
    .stack {
        border: 1px solid black;
        padding: 5px;
        overflow:auto;
        height: 300px;
    }
    .snippet {
        padding: 5px;
        background-color:white;
        border:1px solid black;
        margin:3px;
        font-family:courier;
    }
    </style>
</head>

<body>
<div class="message">
    Logged in successfully
</div>
</body>
</html>';
    }

    public function userinfo(Request $request) {
        if (config('ellucianmobile.loginType') === 'browser') {
            if(!Auth::user()){ 
                $return = $this->customAuth->authenticate($request);
                if(isset($return)){
                    return $return;
                }
            }
        } else if (config('ellucianmobile.loginType') === 'native') {
            if (Auth::attempt(['email' => $request->header('php-auth-user'), 'password' => $request->header('php-auth-pw')])) {
                // continue
            } else {
                $headers = ['WWW-Authenticate' => 'Basic'];
                return response()->make('Access Deined!', 401, $headers);
            }
        }

        $groups = Auth::user()->group_members()->pluck('group_id');
        foreach($groups as $index => $group) {
            $groups[$index] = (string)$group;
        }
        return [
            'status'=>'success',
            'userId'=>(string)Auth::user()->id,
            'authId'=>Auth::user()->email,
            'roles'=>$groups
        ];
    }

    public function redirect(Request $request, $base_64_redirect) {
        if(!Auth::user()){ 
            $return = $this->customAuth->authenticate($request);
            if(isset($return)){
                return $return;
            }
        }
        return redirect(base64_decode($base_64_redirect));
    }

    public function config(Request $request) {
        $group_apps = Group::with(['pages' => function($query) {
            $query->orderBy('order');
        },'app_instances' => function($query) {
            $query->orderBy('order');
        },'composites'])->whereHas('site', function($q){
            $q->where('domain', '=', request()->server('SERVER_NAME'));
        })->orderBy('order')->get();
        $http_protocol = 'http'.(request()->secure()?'s':'').'://';

        $ellucian_group_apps = [];
        $counter = 1;
        $max_time = 0;
        foreach($group_apps as $group) {
            if (is_object($group->updated_at) && $group->updated_at->timestamp > $max_time) {
                $max_time = $group->updated_at->timestamp;
            }
            $composites_array = array_values(array_unique(array_merge([(string)$group->id],$group->composites->map(function($item, $key) {return (string)$item->composite_group_id;})->toArray())));
            if (count($group->app_instances)>0 || count($group->pages)>0) {
                $ellucian_group_apps['mappg'.$group->id] = 
                    ['type'=>'header','name'=>$group->name,'access'=>$composites_array,
                    'hideBeforeLogin'=>"true",
                    'order'=>(string)$counter,'useBeaconToLaunch'=>'false'];
                $counter++;
                foreach($group->pages as $page) {
                    if ($page->updated_at->timestamp > $max_time) {
                        $max_time = $page->updated_at->timestamp;
                    }
                    if (!$page->unlisted && !$page->getHiddenXsAttribute()) {
                        $ellucian_group_apps['mappp'.$page->id] = 
                            ['type'=>'web','name'=>$page->name,
                            'access'=>$page->public==1?['Everyone']:$composites_array,
                            'hideBeforeLogin'=>$page->public==1?"false":"true",
                            'icon'=>$http_protocol.request()->getHttpHost().'/assets/icons/fontawesome/white/36/'.
                                ((isset($page->icon)&&$page->icon!='')?$page->icon:'file').'.png',
                            'urls'=>['url'=>$http_protocol.request()->getHttpHost().'/r/app/'.$group->slug.'/'.$page->slug],'order'=>(string)$counter,
                            'useBeaconToLaunch'=>'false'];
                        if ($page->public==1) { $ellucian_group_apps['mappg'.$group->id]['hideBeforeLogin'] = "false"; }
                        $homeScreenOrder = array_search('p'.$page->id,config('ellucianmobile.homeIcons'));
                        if ($homeScreenOrder !== false) {
                            $ellucian_group_apps['mappp'.$page->id]['homeScreenOrder'] = (string)($homeScreenOrder+1);
                            $ellucian_group_apps['mappp'.$page->id]['hideBeforeLogin'] = "false";
                            $ellucian_group_apps['mappg'.$group->id]['hideBeforeLogin'] = "false";
                        }
                        $counter++;
                    }
                }
                foreach($group->app_instances as $app_instance) {
                    if ($app_instance->updated_at->timestamp > $max_time) {
                        $max_time = $app_instance->updated_at->timestamp;
                    }
                    if (!$app_instance->unlisted && !$app_instance->getHiddenXsAttribute()) {
                        $ellucian_group_apps['mappa'.$app_instance->id] = 
                            ['type'=>'web','name'=>$app_instance->name,
                            'access'=>$app_instance->public==1?['Everyone']:$composites_array,
                            'hideBeforeLogin'=>"true",
                            'icon'=>$http_protocol.request()->getHttpHost().'/assets/icons/fontawesome/white/36/'.
                            ((isset($app_instance->icon)&&$app_instance->icon!='')?$app_instance->icon:'cube').'.png',
                            'urls'=>['url'=>$http_protocol.request()->getHttpHost().'/ar/app/'.$group->slug.'/'.$app_instance->slug],'order'=>(string)$counter,
                            'useBeaconToLaunch'=>'false'];
                        if ($app_instance->public==1) { $ellucian_group_apps['mappg'.$group->id]['hideBeforeLogin'] = "false"; }
                        $homeScreenOrder = array_search('a'.$app_instance->id,config('ellucianmobile.homeIcons'));
                        if ($homeScreenOrder !== false) {
                            $ellucian_group_apps['mappa'.$app_instance->id]['homeScreenOrder'] = (string)($homeScreenOrder+1);
                            $ellucian_group_apps['mappa'.$app_instance->id]['hideBeforeLogin'] = "false";
                            $ellucian_group_apps['mappg'.$group->id]['hideBeforeLogin'] = "false";
                        }
                        $counter++;
                    }
                }
            }
        }

        return [
            'lastUpdated'=>date('c',$max_time),
            'versions'=> ['ios' => ['2.0.0'], 'android' => ['2.0.0']],
            'layout'=>[
                'defaultMenuIcon'=>'true',
                'primaryColor'=>"d85e16",
                "headerTextColor"=> "ffffff",
                "accentColor"=> "edf3f1",
                "menuIconUrl"=> "",
                "subheaderTextColor"=> "a5460f",
                "homeUrlPhone"=> url("/assets/img/tessellation.jpg"),
                "schoolLogoPhone"=> "",
                "homeUrlTablet"=> url("/assets/img/tessellation.jpg"),
            ],
            'about'=>[
                'icon'=>'',
                'website'=>['url'=>'https://www.escherlabs.com'],
                'phone'=>['number'=>'607-323-1234'],
                "logoUrlPhone"=> "",
                'email'=>['address'=>'tim@escherlabs.com'],
                "contact"=> "Endwell, NY",
                'version'=>['url'=>''],
            ],
            'home'=>[
                "icons"=>
                    (string)((count(config('ellucianmobile.homeIcons'))<=5)?count(config('ellucianmobile.homeIcons')):5),
                "overlay"=> "dark"
            ],
            "security"=> [
                "url"=> $http_protocol.request()->getHttpHost().'/ellucianmobile/userinfo',
                "logoutUrl"=> $http_protocol.request()->getHttpHost().'/logout',
                "cas"=> [
                    "loginType"=> config('ellucianmobile.loginType'),
                    "loginUrl"=> $http_protocol.request()->getHttpHost().'/ellucianmobile/login',
                    "logoutUrl"=> $http_protocol.request()->getHttpHost().'/logout'
                ]
            ],
            'mapp' => $ellucian_group_apps
        ];
    }

}