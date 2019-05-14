<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Group;
use App\User;
use App\Page;
use App\GroupAdmins;
use App\GroupMembers;
use App\AppInstance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class GroupController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }
    
    public function list_all_groups(Request $request)
    {
        if (Auth::user()->site_admin) {
            $groups = Group::where('site_id',config('app.site')->id)->orderBy('order')->get();
        } else {
            $groups = Group::where('site_id',config('app.site')->id)->whereIn('id',array_merge(Auth::user()->content_admin_groups,Auth::user()->apps_admin_groups))->orderBy('order')->get();
        }
        return $groups;
    }
    public function list_user_groups(Request $request) {
        return Group::where('site_id',config('app.site')->id)->whereIn('id',array_merge(Auth::user()->content_admin_groups,Auth::user()->apps_admin_groups))->orderBy('order')->get();
    }

    public function show(Group $group)
    {
        return $group;
    }

    public function summary(Group $group)
    {
        return Group::with(
            array('composites'=>function($query){
                $query->with(array('group'=>function($query){
                        $query->select('slug', 'id'); 
                    })
                );
            })
        )
        ->with(array('pages'=>function($query){
            $query->select('id','group_id', 'name', 'slug', 'public')->orderBy('updated_at');
        }))
        ->with(array('app_instances'=>function($query){
            $query->select('id','group_id','app_id','name', 'public', 'slug')
            ->with(array('app'=>function($query){
                $query->select('id','name');
            }))->orderBy('updated_at');
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
        ->with('pagesCount')
        ->with('appinstancesCount')
        ->with('workflowinstancesCount')
        ->with('linksCount')
        ->find($group->id);
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


    public function update_group_by_slug(Request $request, $slug)
    {
        //Slug will be added here if new because it is fillable
        //If we chage this field the above will need to be considered
        $group = Group::firstOrNew(
            ['slug' => $slug, 'site_id' => config('app.site')->id]
        );

        $group->update($request->all());

        //This must be set seperately because it is not fillable
        $group->site_id = config('app.site')->id;

        //Name has no default options, so if one does not exist we must set it
        if(!isset($group->name)){
            $group->name = $slug;
        }

        $group->save();
        return $group;
    }

    public function members_by_slug(Request $request, $slug) {   
        set_time_limit ( 600 );
        if(!isset($slug)){
            if($request->has('slug')) {
                $slug = $request->get('slug');
            }else{
                abort(400);
            }
        }

        //Slug will be added here if new because it is fillable
        //If we chage this field the above will need to be considered
        $group = Group::where(
            ['slug' => $slug, 'site_id' => config('app.site')->id]
        )->firstOrFail();

        if($request->has('status')){
          return $group->members()->where('status', '=', $request->get('status'))->with('bulkuser')->get()->pluck('bulkuser');
        }else{
          return $group->members()->with('bulkuser')->get()->pluck('bulkuser');
        }
    }

    public function add_members_by_slug(Request $request, $slug) {
        set_time_limit ( 600 );

        if(!isset($slug)){
            if($request->has('slug')) {
                $slug = $request->get('slug');
            }else{
                abort(400);
            }
        }

        $group = Group::where(
            ['slug' =>  $slug, 'site_id' => config('app.site')->id]
        )->firstOrFail();

        foreach($request->get('members') as $member) {
            $user = User::where(['unique_id' => $member['unique_id']])->orWhere(['email' => $member['email']])->first();
            if(!isset($user)){
                $user_exists = false;
                $user = new User($member);
            }else{
                $user_exists = true;
                $user->update($member);
            }
            //This must be set seperately because it is not fillable
            $user->unique_id = $member['unique_id'];
            if(isset($member['params'])){
                $user->params = array_merge((array)$user->params, $member['params']);
            }
            $user->save();
            // 7/23/18 -- Added by TJC to Add User to Site (If New User)
            if (!$user_exists) {
                config('app.site')->add_member($user,false,false);
            }
            $group->add_member($user, 'external');
        }

        return $group;
    }

    public function remove_members_by_slug(Request $request, $slug) {
        set_time_limit ( 600 );
        if(!isset($slug)){
            if($request->has('slug')) {
                $slug = $request->get('slug');
            }else{
                abort(400);
            }
        }

        $group = Group::where(
            ['slug' => $slug, 'site_id' => config('app.site')->id]
        )->firstOrFail();

        foreach($request->get('members') as $member){
            $user = User::where(
                ['unique_id' => $member['unique_id']], $member
            )->first();
            if(isset($user)){
                $group->remove_member($user);                
            }
        }

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
        if (isset($group->membersCount) && $group->membersCount->aggregate > 1000) {
            return $group->members()->where('status','=','internal')->with('user')->get();
        } else {
            return $group->list_members();
        }
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
        return $group->add_admin(
            $user,
            $request->has('content_admin')?$request->content_admin:0,
            $request->has('apps_admin')?$request->apps_admin:0);
    }
    public function remove_admin(Group $group, User $user)
    {
        return $group->remove_admin($user);
    }
    public function list_composites(Group $group)
    {
        return $group->list_composites()->pluck('group')->toArray();;
    }
    public function add_composite(Group $group, Group $composite_group)
    {
        return $group->add_composite($composite_group);
    }
    public function remove_composite(Group $group, Group $composite_group)
    {
        return $group->remove_composite($composite_group);
    }
    public function list_images(Group $group)
    {
        return $group->list_images();
    }
    public function list_pages(Group $group)
    {
        return $group->list_pages();
    }
    public function list_appinstances(Group $group)
    {
        return $group->list_appinstances();
    }
    public function list_workflowinstances(Group $group)
    {
        return $group->list_workflowinstances();
    }
    public function list_endpoints(Group $group)
    {
        return $group->list_endpoints();
    }
    public function list_tags(Group $group)
    {
        return $group->list_tags();
    }
    public function list_links(Group $group)
    {
        return $group->list_links();
    }
    public function order()
	{
        $order = Input::get('order');
        foreach($order as $item){
            $group = Group::find($item['id']);
            $group->order = (int) $item['index'];
            $group->save();
        }
	}

    public function pages_order(Group $group)
	{
        $order = Input::get('order');
        foreach($order as $item){
            $page = Page::find($item['id']);
            $page->order = (int) $item['index'];
            $page->save();
        }
	}

    public function appinstances_order(Group $group)
	{
        $order = Input::get('order');
        foreach($order as $item){
            $ai = AppInstance::find($item['id']);
            $ai->order = (int) $item['index'];
            $ai->save();
        }
	}
}
