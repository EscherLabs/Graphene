<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Group extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = ['name', 'slug'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function composites() {
      return $this->hasMany(GroupComposite::class);
    }
    public function owners() {
      return $this->hasMany(GroupComposite::class,'composite_group_id');
    }
    public function endpoints() {
      return $this->hasMany(Endpoint::class);
    }
    public function links() {
        return $this->hasMany(Link::class);
    }  
    public function images() {
        return $this->hasMany(Image::class);
    }
    public function tags() {
        return $this->hasMany(Tag::class);
    }
	public function endpointsCount()
	{
	  return $this->hasOne(Endpoint::class)
	    ->selectRaw('group_id, count(*) as aggregate')
	    ->groupBy('group_id');
	}
	public function pagesCount()
	{
	  return $this->hasOne(Page::class)
	    ->selectRaw('group_id, count(*) as aggregate')
	    ->groupBy('group_id');
	}
	public function appinstancesCount()
	{
	  return $this->hasOne(AppInstance::class)
	    ->selectRaw('group_id, count(*) as aggregate')
	    ->groupBy('group_id');
	}
	public function linksCount()
	{
	  return $this->hasOne(Link::class)
	    ->selectRaw('group_id, count(*) as aggregate')
	    ->groupBy('group_id');
	}
    public function app_instances() {
      return $this->hasMany(AppInstance::class);
    }
    public function pages() {
      return $this->hasMany(Page::class);
    }
    
    public function members() {
      return $this->hasMany(GroupMember::class);
    }

    public function membersCount()
	{
	  return $this->hasOne(GroupMember::class)
	    ->selectRaw('group_id, count(*) as aggregate')
	    ->groupBy('group_id');
    }
    
    public function imagesCount()
	{
	  return $this->hasOne(Image::class)
	    ->selectRaw('group_id, count(*) as aggregate')
	    ->groupBy('group_id');
	}

    public function admins() {
      return $this->hasMany(GroupAdmin::class);
    }

	public function adminsCount()
	{
	  return $this->hasOne(GroupAdmin::class)
	    ->selectRaw('group_id, count(*) as aggregate')
	    ->groupBy('Group_id');
	}
    public function list_admins()
    {
        return $this->admins()->with('user')->get();
    }
    public function add_admin(User $user,$content_admin=false,$apps_admin=false)
    {
        self::remove_admin($user); // First Delete the admin from the group
        $group_admin = GroupAdmin::updateOrCreate(['group_id'=>$this->id,'user_id'=>$user->id],
          ['content_admin'=>$content_admin?1:0,'apps_admin'=>$content_admin?1:0,]);
        $group_admin->load('user');
        return $group_admin;
    }
    public function remove_admin(User $user)
    {
        GroupAdmin::where('group_id',$this->id)->where('user_id',$user->id)->delete();
    }
    public function list_members()
    {
        return $this->members()->with('user')->get();
    }
    public function add_member(User $user, $status = 'internal')
    {
        self::remove_member($user); // First Delete the member from the group
        $group_member = GroupMember::create(['group_id'=>$this->id,'user_id'=>$user->id,
          'status'=>$status]);
        $group_member->load('user');
        return $group_member;
    }
    public function remove_member(User $user)
    {
        GroupMember::where('group_id',$this->id)->where('user_id',$user->id)->delete();
    }
    public function list_composites()
    {
        return $this->composites()->with('group')->get();
    }
    public function add_composite(Group $group)
    {
        self::remove_composite($group); // First Delete the group from the composite
        $composite = GroupComposite::create([
          'group_id'=>$this->id,
          'composite_group_id'=>$group->id]);
        return $composite;
    }
    public function remove_composite(Group $group)
    {
        GroupComposite::where('group_id',$this->id)->where('composite_group_id',$group->id)->delete();
    }
    public function list_images()
    {
        return $this->images()->get();
    }
    public function list_pages()
    {
        return $this->pages()->get();
    }
    public function list_appinstances()
    {
        return $this->app_instances()->get();
    }
    public function list_endpoints()
    {
        return $this->endpoints()->get();
    } 
    public function list_tags()
    {
        return $this->tags()->get();
    } 
    public function list_links()
    {
        return $this->links()->get();
    } 
    public function scopePublicAppsPages($query)
    {
        return $query->with(['app_instances'=>function($q){
            $q->select('group_id','id', 'name', 'slug', 'icon', 'public', 'unlisted','device');
            $q->where('public','=','1');
            $q->where('unlisted','=',0);
            $q->orderBy('order');
        },'pages'=>function($q){
            $q->select('group_id','id', 'name', 'slug', 'icon', 'public', 'unlisted','device');
            $q->where('public','=','1');
            $q->where('unlisted','=',0);
            $q->orderBy('order');
        }])
        ->whereHas('app_instances', function($q) {
            $q->where('public','=','1');
            $q->where('site_id','=',config('app.site')->id);
         })
        ->orWhereHas('pages', function($q) {
            $q->where('public','=','1');
            $q->where('site_id','=',config('app.site')->id);
        });
    }
    public function scopeAppsPages($query)
    {
        return $query->with(array('app_instances'=>function($q){
            $q->select('group_id','id', 'name', 'slug', 'icon', 'unlisted','device');
            $q->where('unlisted','=',0);
            $q->orderBy('order');
        },'pages'=>function($q){
            $q->select('group_id','id', 'name', 'slug', 'icon', 'unlisted','device');
            $q->where('unlisted','=',0);
            $q->orderBy('order');
        }))->whereIn('id', Auth::user()->groups);
    }
}
