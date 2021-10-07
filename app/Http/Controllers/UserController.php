<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\User;
use App\Site;
use App\Group;
use App\SiteMember;
use Illuminate\Http\Request;
use App\Libraries\NicknameLookup;
use Illuminate\Support\Facades\DB;


class UserController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }
    
    public function index()
    {
        // Broken??
        // return User::whereHas('site_members', function($q){
        //     $q->where('site_id','=',config('app.site')->id);
        // })->get();

        $memberships = config('app.site')->list_members();
        $users = [];
        foreach($memberships as $membership) {
            $users[] = $membership->user;
        }
        return $users;
    }

    public function search(Request $request, $search_string='') {
        if ($search_string === '') {
            return [];
        }
        $search_elements_parsed = preg_split('/[\s,]+/',strtolower($search_string));
        $search = []; $users = [];
        if (count($search_elements_parsed) === 1 && $search_elements_parsed[0]!='') {
            $search[0] = $search_elements_parsed[0];
            $query = User::select('id','unique_id','first_name','last_name','email','params')
                ->where(function ($query) use ($search) {
                    $query->where('unique_id','=',$search[0])
                        ->orWhere('id','=',$search[0].'%')
                        ->orWhere('first_name','like',$search[0].'%')
                        ->orWhere('last_name','like',$search[0].'%')
                        ->orWhere('email','like',$search[0].'%');
                })->whereHas('site_members', function($query) {
                    $query->where('site_id','=',config('app.site')->id);
                })->orderBy('first_name', 'asc')->orderBy('last_name', 'asc');
        } else if (count($search_elements_parsed) > 1) {
            $search[0] = $search_elements_parsed[0];
            $search[1] = $search_elements_parsed[count($search_elements_parsed)-1];
            $query = User::select('id','unique_id','first_name','last_name','email','params')
                ->where(function ($query) use ($search) {
                    $query->where(function ($query) use ($search) {
                        $query->where('first_name','like',$search[0].'%')
                            ->where('last_name','like',$search[1].'%');
                    })->orWhere(function ($query) use ($search) {
                        $query->where('first_name','like',$search[1].'%')
                            ->where('last_name','like',$search[0].'%');
                    });
                })->whereHas('site_members', function($query) {
                    $query->where('site_id','=',config('app.site')->id);
                })->orderBy('first_name', 'asc')->orderBy('last_name', 'asc');
        }
        if ($request->has('groups')) {
            if (is_array($request->groups)) {
                $groups = $request->groups;
            } else if (is_string($request->groups)) {
                $groups = explode(',',$request->groups);
            }
            $query->whereHas('group_members', function($query) use ($groups) {
                $query->whereIn('group_id',$groups);
            });
        }
        if ($request->has('exclude_groups')) {
            if (is_array($request->exclude_groups)) {
                $exclude_groups = $request->exclude_groups;
            } else if (is_string($request->exclude_groups)) {
                $exclude_groups = explode(',',$request->exclude_groups);
            }
            $query->whereDoesntHave('group_members', function($query) use ($exclude_groups) {
                $query->whereIn('group_id',$exclude_groups);
            });
        }
        if ($request->has('exclude_users')) {
            if (is_array($request->exclude_users)) {
                $exclude_users = $request->exclude_users;
            } else if (is_string($request->exclude_users)) {
                $exclude_users = explode(',',$request->exclude_users);
            }
            $query->whereNotIn('unique_id',$exclude_users);
        }
        if ($request->has('app_developers')) {
            $query->where(function($query) use ($request) {
                if (is_array($request->app_developers)) {
                    $filter_ids = $request->app_developers;
                } else if (is_string($request->app_developers)) {
                    $filter_ids = explode(',',$request->app_developers);
                }
                $filter_ids = array_filter($filter_ids, function($a) {return $a !== "";});
                $query->whereHas('app_developers', function($query) use ($filter_ids) {
                    if (!empty($filter_ids)) {
                        $query->whereIn('app_id',$filter_ids);
                    }
                })->orWhereHas('site_members', function($query) {
                    $query->where('site_developer','=',1)->where('site_id','=',config('app.site')->id);
                });    
            });
        }
        if ($request->has('workflow_developers')) {
            $query->where(function($query) use ($request) {
                if (is_array($request->workflow_developers)) {
                    $filter_ids = $request->workflow_developers;
                } else if (is_string($request->workflow_developers)) {
                    $filter_ids = explode(',',$request->workflow_developers);
                }
                $filter_ids = array_filter($filter_ids, function($a) {return $a !== "";});
                $query->whereHas('workflow_developers', function($query) use ($filter_ids) {
                    if (!empty($workflow_id)) {
                        $query->whereIn('workflow_id',$filter_ids);
                    }
                })->orWhereHas('site_members', function($query) {
                    $query->where('site_developer','=',1)->where('site_id','=',config('app.site')->id);
                });
            });
        }
        $users = $query->limit(25)->get()->toArray();
        foreach($users as $index => $user) {
            $users[$index] = array_intersect_key($user, array_flip(['id','unique_id','first_name','last_name','email','params']));
        }
        return $users;
    }

    public function show(User $user)
    {
        return $user;
    }

    public function info(User $user)
    {
        $user->load(array('site_members'=>function($query){
            $query->where('site_id','=',config('app.site')->id);
        }));
        $user->load(array('app_developers'=>function($query){
            $query->with(array('app'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->withTrashed()->select('id','site_id','name','deleted_at');
            }))->select('app_id','user_id');
        })); 
        //->whereNull('deleted_at')
        $user->load(array('workflow_developers'=>function($query){
            $query->with(array('workflow'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->withTrashed()->select('id','site_id','name','deleted_at');
            }))->select('workflow_id','user_id');
        }));
        $user->load(array('group_admins'=>function($query){
            $query->with(array('group'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->withTrashed()->select('id','site_id','name','slug','deleted_at');
            }))->select('group_id','user_id','content_admin','apps_admin');
        }));
        $user->load(array('group_members'=>function($query){
            $query->with(array('group'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->withTrashed()->select('id','site_id','name','slug','deleted_at');
            }))->select('group_id','user_id');
        }));

        $user_site = SiteMember::where('user_id','=',$user->id)
            ->where('site_id','=',config('app.site')->id)->first();

        $user->site_admin = $user_site->site_admin;
        $user->site_developer = $user_site->site_developer;
        return $user;
    }
    public function update_site_permissions(Request $request,User $user)
    {
        if (Auth::user()->site_admin) {
            $site = Site::find(config('app.site')->id);
            $site->add_member($user,$request->site_admin?1:0,$request->site_developer?1:0);
        }
        return SiteMember::where('site_id','=',config('app.site')->id)->where('user_id','=',$user->id)->first();
    }
    
    public function init(Request $request)
    {
        $site = Site::find(config('app.site')->id);
        if(!count(User::get())){
          if(!empty($request->first_name) && !empty($request->last_name) && !empty($request->email) && !empty($request->password && !empty($request->unique_id))){
            $user = new User($request->all());
            $user->password = bcrypt($request->password);

            $user->save();
    
            $site->add_member($user,1, 1);
            $group = Group::first();
            $group->add_member($user,1);
            $group->add_admin($user,1);

            Auth::login($user, true);
            return $user;
    
          }
          return $request->first_name;
        }
        
    }


    public function create(Request $request)
    {
        $this->validate($request,['first_name'=>['required'],'last_name'=>['required'],'email'=>['required']]);

        $id = $request->unique_id;
        $email = $request->email;

        $users = User::select('id')
                     ->where(function ($query) use ($id, $email) {
                       $query->where('unique_id','=',$id)
                       ->orWhere('email','=',$email);
                    })->whereHas('site_members', function($query) {
                        $query->where('site_id','=',config('app.site')->id);
                    })->get();
        
        if($users->isEmpty()){
            $user = new User($request->all());
            if(!empty($user->password)){
                $user->password = bcrypt($request->password);
            }
            $user->save();

            $site = Site::find(Auth::user()->site->id);
            if ($request->has('developer') && $request->has('site_admin')) {
                $site->add_member($user,$request->site_admin, $request->developer);
            } else {
                $site->add_member($user);
            }
            return $user;
        }
        else{
            return response(['error'=>'User with that email or unique id already exists.'], 400);
        }
    }

    public function update(Request $request, User $user)
    {
        $user->update($request->all());
        if ($request->has('unique_id')) {
            $user->unique_id = $request->unique_id;
            $user->save();
        }
        return $user;
    }

    public function impersonate(Request $request, User $user)
    {
        Auth::login($user, true);
        return redirect()->to('/');
    }

    public function destroy(User $user)
    {
        if ($user->delete()) {
            return 1;
        }
    }
}
