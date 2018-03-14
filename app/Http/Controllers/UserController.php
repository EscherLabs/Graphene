<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\User;
use App\Site;
use App\SiteMember;
use Illuminate\Http\Request;
use App\Libraries\NicknameLookup;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
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
        // if (strlen($search_string)<4) {
        //     return ['error'=>'Search phrases must exceed 3 characters'];
        // }
        $search_elements_parsed = preg_split('/[\s,]+/',strtolower($search_string));
        $search_elements = [];
        $nicknameLookup = new NicknameLookup();
        foreach($search_elements_parsed as $element) {
            if ($element === '') {
                continue;
            }
            $search_elements = array_merge($search_elements,[$element],$nicknameLookup->search($element));
        }

        $matching_users = [];
        $ranking = [];
        foreach($search_elements as $element) {
            if (strlen($element)<3) {
                // For 1-2 Character searches, perform an exact match
                $users = User::select('id','unique_id','first_name','last_name','email','params')
                    ->where('first_name','=',$element)
                    ->orWhere('last_name','=',$element)
                    ->get();
            } else {
                $users = User::select('id','unique_id','first_name','last_name','email','params')
                    ->where('unique_id','=',$element)
                    ->orWhere('first_name','like',$element.'%')
                    ->orWhere('last_name','like',$element.'%')
                    ->orWhere('email','like',$element.'%')
                    ->get();
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
        if ($matching_users_count > 0 && count($results) == 0) {
            return ['error'=>'Too Many Results! Please refine your search'];
        }
        return $results;
    }

    public function show(User $user)
    {
        return $user;
    }

    public function create(Request $request)
    {
        $this->validate($request,['first_name'=>['required'],'last_name'=>['required'],'email'=>['required']]);
        $user = new User($request->all());
        $user->save();

        $site = Site::find(Auth::user()->site->id);
        if ($request->has('developer') && $request->has('site_admin')) {
            $site->add_member($user,$request->site_admin, $request->developer);
        } else {
            $site->add_member($user);
        }
        return $user;
    }

    public function update(Request $request, User $user)
    {
        $user->update($request->all());
        return $user;
    }

    public function destroy(User $user)
    {
        if ($user->delete()) {
            return 1;
        }
    }
}
