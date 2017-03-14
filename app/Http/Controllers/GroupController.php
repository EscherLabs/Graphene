<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Group;
use App\User;
use App\GroupAdmins;
use App\GroupMembers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class GroupController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index(Request $request)
    {
        if (Input::has('limit') || !Auth::user()->site_admin) {
            return Group::where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->admin_groups)->get();
        } else {
            return Group::where('site_id',config('app.site')->id)->get();
        }
    }

    public function show(Group $group)
    {
        return $group;
    }

    public function create(Request $request)
    {
        $this->validate($request,['name'=>['required'],'slug'=>['required']]);
        $group = new Group($request->all());
        $group->site_id = Auth::user()->site->id;
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
    public function list_composites(Group $group)
    {
        return $group->list_composites();
    }
    public function add_composite(Group $group, Group $composite_group)
    {
        return $group->add_composite($composite_group);
    }
    public function remove_composite(Group $group, Group $composite_group)
    {
        return $group->remove_composite($composite_group);
    }
}
