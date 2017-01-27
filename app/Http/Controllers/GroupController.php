<?php

namespace App\Http\Controllers;

use App\Group;
use App\User;
use App\GroupAdmins;
use App\GroupMembers;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        return Group::all()->where('site_id',1); // Get current Site info from??
    }

    public function show(Group $group)
    {
        return $group;
    }

    public function create(Request $request)
    {
        $this->validate($request,['name'=>['required'],'slug'=>['required']]);
        $group = new Group($request->all());
        $group->site_id = 1; // Get current Site info from??
        $group->save();
        return $group;
    }

    public function update(Request $request, Group $group)
    {
        $group->update($request->all());
        return $group;
    }

    public function destroy(Group $group)
    {
        if ($group->delete()) {
            return 1;
        }
    }
    public function list_members(Group $group)
    {
        return $group->list_members();
    }
    public function add_member(Group $group, User $user, Request $request)
    {
        if ($request->has('status')) {
            return $group->add_member($user,$request->status);
        } else {
            return $group->add_member($user);
        }
    }
    public function remove_member(Group $group, User $user)
    {
        return $group->remove_member($user);
    }
    public function list_admins(Group $group)
    {
        return $group->list_admins();
    }
    public function add_admin(Group $group, User $user, Request $request)
    {
        if ($request->has('status')) {
            return $group->add_admin($user,$request->status);
        } else {
            return $group->add_admin($user);
        }
    }
    public function remove_admin(Group $group, User $user)
    {
        return $group->remove_admin($user);
    }
}
