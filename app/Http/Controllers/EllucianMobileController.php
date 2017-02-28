<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Group;
use App\AppInstance;
use Illuminate\Http\Request;

class EllucianMobileController extends Controller
{
    public function __construct() {
        //$this->middleware('auth');
    }
    
    public function login() {
        return '<html><head><title>Authentication Success</title></head><body><div class="message">Logged in successfully</div></body></html>';
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
        $group_apps = Group::with('app_instances')->whereHas('site', function($q){
            $q->where('domain', '=', request()->server('SERVER_NAME'));
        })->get();
        //return $group_apps;
        $ellucian_group_apps = [];
        $counter = 1;
        foreach($group_apps as $group) {
            $ellucian_group_apps['mappg'.$group->id] = 
                ['type'=>'header','name'=>$group->name,'access'=>[(string)$group->id],'hideBeforeLogin'=>false,'order'=>(string)$counter];
            $counter++;
            foreach($group->app_instances as $app_instance) {
                $ellucian_group_apps['mappa'.$app_instance->id] = 
                    ['type'=>'web','name'=>$app_instance->name,'access'=>[(string)$app_instance->id],'hideBeforeLogin'=>false,
                    'urls'=>['url'=>'http://'.request()->server('SERVER_NAME').'/app/'.$app_instance->slug.'?topbar=false&sidemenu=false'],'order'=>(string)$counter];
                $counter++;
            }
        }
        //return $ellucian_group_apps;

        return [
            'lastUpdated'=>date('c'),
            'versions'=> ['ios' => ['2.0.0'], 'android' => ['2.0.0']],
            'layout'=>[
                'defaultMenuIcon'=>true,
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
                'website'=>['url'=>'http://www.escherlabs.com'],
                'phone'=>['number'=>'607-323-1234'],
                "logoUrlPhone"=> "",
                'email'=>['address'=>'tim@escherlabs.com'],
                "contact"=> "Endwell, NY",
                'version'=>['url'=>''],
            ],
            'home'=>["icons"=> "1","overlay"=> "dark"],
            "security"=> [
                "url"=> 'http://'.request()->server('SERVER_NAME').'/ellucianmobile/userinfo',
                "logoutUrl"=> 'http://'.request()->server('SERVER_NAME').'/logout',
                "cas"=> [
                    "loginType"=> "browser",
                    "loginUrl"=> 'http://'.request()->server('SERVER_NAME').'/ellucianmobile/login',
                    "logoutUrl"=> 'http://'.request()->server('SERVER_NAME').'/logout'
                ]
            ],
            'mapp' => $ellucian_group_apps
        ];
    }

}



//   "mapp": {
//     "mappg69": {
//       "type": "header",
//       "name": "Campus Life",
//       "order": "1",
//       "access": [
//         "MAIN"
//       ],
//       "hideBeforeLogin": "false"
//     },
//     "mappp163": {
//       "type": "web",
//       "name": "Live Bus View",
//       "order": "2",
//       "icon": "",
//       "urls": {
//         "url": "http://crazystairs.escherlabs.com/app/bus"
//       },
//       "access": [
//         "MAIN"
//       ],
//       "hideBeforeLogin": "false",
//       "homeScreenOrder": "1"
//     }
//   }
// }