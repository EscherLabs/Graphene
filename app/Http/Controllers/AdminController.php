<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Group;
use App\App;

class AdminController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }
    
    public function index($resource = null) {
       return view('admin', ['resource'=>$resource,'id'=>'']);
    }    
    public function members(Group $group) {
       return view('admin', ['resource'=>'members','id'=>$group->id,'group'=>$group]);
    }
    public function admins(Group $group) {
       return view('admin', ['resource'=>'admins','id'=>$group->id,'group'=>$group]);
    }
    public function developers(App $app) {
       return view('admin', ['resource'=>'developers','id'=>$app->id]);
    }
    public function composites(Group $group) {
        return view('admin', ['resource'=>'composites','id'=>$group->id,'group'=>$group]);
    }
    public function tags(Group $group) {
        return view('admin', ['resource'=>'tags','id'=>$group->id,'group'=>$group]);
    }
    public function images(Group $group) {
        return view('admin', ['resource'=>'images','id'=>$group->id,'group'=>$group]);
     }
     public function links(Group $group) {
        return view('admin', ['resource'=>'links','id'=>$group->id,'group'=>$group]);
    }  
    public function pages(Group $group) {
        $group->load(['composites'=>function($q){
            $q->with(['group'=>function($qu){
                $qu->select('id','name');
            }]);
        }]);
        return view('admin', ['resource'=>'pages','id'=>$group->id,'group'=>$group]);
    }
    public function appinstances(Group $group) {
        $group->load(['composites'=>function($q){
            $q->with(['group'=>function($qu){
                $qu->select('id','name');
            }]);
        }]);
        return view('admin', ['resource'=>'appinstances','id'=>$group->id,'group'=>$group]);
    }
    public function endpoints(Group $group) {
        return view('admin', ['resource'=>'endpoints','id'=>$group->id,'group'=>$group]);
    }
    public function summary(Group $group) {
        return view('admin', ['resource'=>'group','id'=>$group->id,'group'=>$group]);
    }

    public function dashboard(Request $request) {
        $user = Auth::user();
        // $user->load(array('site_members'=>function($query){
        //     $query->where('site_id','=',config('app.site')->id);
        // }));
        $user->load(array('app_developers'=>function($query){
            //$query->where('site_id','=',config('app.site')->id)->with('app');;
            $query->whereHas('app')->with(array('app'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->with(array('app_instances'=>function($q){
                    // $q->with(array('appVersion'=>function($q){
                    //     $q->select('id','code->resources as resources','code->forms as forms');
                    // }));
                    $q->with(array('group'=>function($q){
                        $q->select('id','name');
                    }))->orderBy('updated_at', 'desc');
                },'user'=>function($q){
                    // $q->with(array('appVersion'=>function($q){
                    //     $q->select('id','code->resources as resources','code->forms as forms');
                    // }));
                }))->currentVersion();//->select('id','site_id','name','user_id');
            }))->select('app_id','user_id') ;
        }));
        $user->load(array('group_admins'=>function($query){
            $query->with(array('group'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->select('id', 'site_id' ,'name' ,'slug')->with(
                    array('composites'=>function($query){
                        $query->with(array('group'=>function($query){
                                $query->select('slug', 'id'); 
                            })
                        );
                    })
                )
                ->with(array('pages'=>function($query){
                    $query->select('id','group_id', 'name', 'slug', 'public')->orderBy('order');
                }))
                ->with(array('app_instances'=>function($query){
                    $query->select('id','group_id','app_id','name', 'public', 'slug')
                    ->with(array('app'=>function($query){
                        $query->select('id','name');
                    }))->orderBy('order');
                }))
                ->with(array('tags'=>function($query){
                    $query->select('id','group_id','name', 'value');
                }))
                ->with(array('links'=>function($query){
                    $query->select('id','group_id','title','link')->orderBy('title');
                }))
                ->with('membersCount')
                ->with('adminsCount')
                ->with('imagesCount')
                ->with('endpointsCount')
                ->with('endpoints')
                ->with('pagesCount')
                ->with('appinstancesCount')
                ->with('linksCount');
                // ->find($group->id);


            }) )->select('group_id','user_id','content_admin','apps_admin');
        }));
        $user->load(array('group_members'=>function($query){
            $query->with(array('group'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->select('id', 'site_id', 'name', 'slug');
            }))->select('group_id','user_id');
        }));
        return view('adminDashboard', ['user'=>$user]);
        return $user;

        // return Group::where('site_id', config('app.site')->id)->whereIn('id',array_merge(Auth::user()->content_admin_groups,Auth::user()->apps_admin_groups))->orderBy('order')->get();
    }
}
