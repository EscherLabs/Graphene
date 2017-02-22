<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\User;
use App\Site;
use App\SiteMember;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        $memberships = Site::find(Auth::user()->site_id)->list_members();
        $users = [];
        foreach($memberships as $membership) {
            $users[] = $membership->user;
        }
        return $users;
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

        $site = Site::find(Auth::user()->site_id);
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
