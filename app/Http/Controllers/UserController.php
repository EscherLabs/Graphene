<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\User;
use App\Site;
use App\Group;
use App\SiteMember;
use Illuminate\Http\Request;
use App\Libraries\NicknameLookup;

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

    public function search($search_string) {
        $search_elements_parsed = preg_split('/[\s,]+/',strtolower($search_string));
        $search_elements = [];
        $nicknameLookup = new NicknameLookup();
        foreach($search_elements_parsed as $element) {
            if ($element === '') {
                continue;
            }
            $search_elements = array_merge($search_elements,$nicknameLookup->search($element));
        }

        $matching_users = [];
        $ranking = [];
        foreach($search_elements as $element) {
            if (strlen($element)<3) {
                // For 1-2 Character searches, perform an exact match
                $users = User::select('id','unique_id','first_name','last_name','email','params')
                    ->where(function ($query) use ($element) {
                        $query->where('first_name','=',$element)
                            ->orWhere('last_name','=',$element);
                    })->whereHas('site_members', function($query) {
                        $query->where('site_id','=',config('app.site')->id);
                    })->get();
            } else {
                $users = User::select('id','unique_id','first_name','last_name','email','params')
                    ->where(function ($query) use ($element) {
                        $query->where('unique_id','=',$element)
                            ->orWhere('first_name','like',$element.'%')
                            ->orWhere('last_name','like',$element.'%')
                            ->orWhere('email','like',$element.'%');
                    })->whereHas('site_members', function($query) {
                        $query->where('site_id','=',config('app.site')->id);
                    })->get();
            }
            foreach($users as $user) {
                if (isset($ranking[$user->id])) {
                    $ranking[$user->id]++;
                } else {
                    $ranking[$user->id]=1;
                }
                // if (strcasecmp($user->first_name,$element)===0 || strcasecmp($user->last_name,$element)===0) {
                //     $ranking[$user->id]++; // Extra Points for an exact match
                // }
                $matching_users[$user->id] = 
                    ['id'=>$user->id, 'unique_id'=>$user->unique_id,
                    'first_name'=>$user->first_name, 'last_name'=>$user->last_name, 
                    'email'=>$user->email, 'params'=>$user->params];
            }
        }
        if (count($matching_users)===0) {
            return [];
        } 
        arsort($ranking);
        $matching_users_count = count($matching_users);
        $results = [];
        $current_rank = array_values($ranking)[0];
        foreach($ranking as $user_id => $rank) {
            if ($rank < $current_rank && $matching_users_count > 10) { // Throw out bad results
                break;
            }
            $current_rank = $rank;
            $matching_users[$user_id]['rank'] = $rank;
            $results[] = $matching_users[$user_id];
        }
        if ($matching_users_count > 0 && (count($results) == 0 || count($results) > 10)) {
            return ['error'=>'Too Many Results! Please refine your search'];
        }
        return $results;
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
            //$query->where('site_id','=',config('app.site')->id)->with('app');;
            $query->with(array('app'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->select('id','site_id','name');
            }) )->select('app_id','user_id');
        }));
        $user->load(array('group_admins'=>function($query){
            $query->with(array('group'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->select('id','site_id','name','slug');
            }) )->select('group_id','user_id','content_admin','apps_admin');
        }));
        $user->load(array('group_members'=>function($query){
            $query->with(array('group'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->select('id','site_id','name','slug');
            }))->select('group_id','user_id');
        }));

        return $user;
    }
    public function updateinfo(Request $request,User $user)
    {
        $member = SiteMember::where('site_id','=',config('app.site')->id)->where('user_id','=',$user->id)->first();

        if (Auth::user()->site_admin) {
            $member->site_admin = $request->input('site_members')[0]['site_admin'];
            $member->site_developer = $request->input('site_members')[0]['site_developer'];
            $member->save();
        }
        $user->load(array('site_members'=>function($query){
            $query->where('site_id','=',config('app.site')->id);
        }));
        $user->load(array('app_developers'=>function($query){
            $query->with(array('app'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->select('id','site_id','name');
            }) )->select('app_id','user_id');
        }));
        $user->load(array('group_admins'=>function($query){
            $query->with(array('group'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->select('id','site_id','name','slug');
            }) )->select('group_id','user_id','content_admin','apps_admin');
        }));
        $user->load(array('group_members'=>function($query){
            $query->with(array('group'=>function($query){
                $query->where('site_id','=',config('app.site')->id)->select('id','site_id','name','slug');
            }))->select('group_id','user_id');
        }));
        return $user;
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
