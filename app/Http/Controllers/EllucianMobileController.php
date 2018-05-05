<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Group;
use App\AppInstance;
use Illuminate\Http\Request;

class EllucianMobileController extends Controller
{
    public function __construct() {
        // $this->middleware('auth')->except('config');
    }
    
    public function login() {
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

    public function userinfo() {
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

    public function config() {
        $group_apps = Group::with(['app_instances','pages','composites'])->whereHas('site', function($q){
            $q->where('domain', '=', request()->server('SERVER_NAME'));
        })->orderBy('order')->get();
        $http_protocol = 'http'.(request()->secure()?'s':'').'://';

        $ellucian_group_apps = [];
        $counter = 1;
        foreach($group_apps as $group) {
            $composites_array = array_values(array_unique(array_merge([(string)$group->id],$group->composites->map(function($item, $key) {return (string)$item->composite_group_id;})->toArray())));
            if (count($group->app_instances)>0 || count($group->pages)>0) {
                $ellucian_group_apps['mappg'.$group->id] = 
                    ['type'=>'header','name'=>$group->name,'access'=>$composites_array,
                    'hideBeforeLogin'=>"false",
                    'order'=>(string)$counter,'useBeaconToLaunch'=>'false'];
                $counter++;
                foreach($group->app_instances as $app_instance) {
                    if (!$app_instance->unlisted) {
                        $ellucian_group_apps['mappa'.$app_instance->id] = 
                            ['type'=>'web','name'=>$app_instance->name,
                            'access'=>$app_instance->public==1?['Everyone']:$composites_array,
                            'hideBeforeLogin'=>($app_instance->public==1)?"false":"true",
                            'icon'=>$http_protocol.request()->getHttpHost().'/assets/icons/fontawesome/white/36/'.
                            ((isset($app_instance->icon)&&$app_instance->icon!='')?$app_instance->icon:'cube').'.png',
                            'urls'=>['url'=>$http_protocol.request()->getHttpHost().'/app/'.$group->slug.'/'.$app_instance->slug.'?nologin&topbar=false&sidemenu=false'],'order'=>(string)$counter,
                            'useBeaconToLaunch'=>'false'];
                        $counter++;
                    }
                }
                foreach($group->pages as $page) {
                    if (!$page->unlisted) {
                        $ellucian_group_apps['mappp'.$page->id] = 
                            ['type'=>'web','name'=>$page->name,
                            'access'=>$page->public==1?['Everyone']:$composites_array,
                            'hideBeforeLogin'=>($page->public==1)?"false":"true",
                            'icon'=>$http_protocol.request()->getHttpHost().'/assets/icons/fontawesome/white/36/'.
                                ((isset($page->icon)&&$page->icon!='')?$page->icon:'file').'.png',
                            'urls'=>['url'=>$http_protocol.request()->getHttpHost().'/page/'.$group->slug.'/'.$page->slug.'?nologin&topbar=false&sidemenu=false'],'order'=>(string)$counter,
                            'useBeaconToLaunch'=>'false'];
                        $counter++;
                    }
                }
            }
        }

        return [
            'lastUpdated'=>date('c'),
            'versions'=> ['ios' => ['2.0.0'], 'android' => ['2.0.0']],
            'layout'=>[
                'defaultMenuIcon'=>'true',
                'primaryColor'=>"d85e16",
                "headerTextColor"=> "ffffff",
                "accentColor"=> "edf3f1",
                "menuIconUrl"=> "",
                "subheaderTextColor"=> "a5460f",
                "homeUrlPhone"=> "http://files.harrowakker.webnode.nl/200000058-28fec29f90/EscherOmhoogOmlaag.jpg",
                "schoolLogoPhone"=> "",
                "homeUrlTablet"=> "http://files.harrowakker.webnode.nl/200000058-28fec29f90/EscherOmhoogOmlaag.jpg",
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
            'home'=>["icons"=> "1","overlay"=> "dark"],
            "security"=> [
                "url"=> $http_protocol.request()->getHttpHost().'/ellucianmobile/userinfo',
                "logoutUrl"=> $http_protocol.request()->getHttpHost().'/logout',
                "cas"=> [
                    "loginType"=> "browser",
                    "loginUrl"=> $http_protocol.request()->getHttpHost().'/ellucianmobile/login',
                    "logoutUrl"=> $http_protocol.request()->getHttpHost().'/logout'
                ]
            ],
            'mapp' => $ellucian_group_apps
        ];
    }

}