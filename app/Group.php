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
    public function endpoints() {
      return $this->hasMany(Endpoint::class);
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
    public function admins() {
      return $this->hasMany(GroupAdmin::class);
    }
    public function list_admins()
    {
        return $this->admins()->with('user')->get();
    }
    public function add_admin(User $user,$status = 0)
    {
        self::remove_admin($user); // First Delete the admin from the group
        $group_admin = GroupAdmin::updateOrCreate(['group_id'=>$this->id,'user_id'=>$user->id],
          ['status'=>$status]);
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
    public function add_member(User $user, $status = false)
    {
        self::remove_member($user); // First Delete the member from the group
        $group_member = GroupMember::create(['group_id'=>$this->id,'user_id'=>$user->id,
          'status'=>$status]);
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

    public function scopePublicLinks($query)
    {
        return $query->where('site_id', '=', config('app.site')->id)->with(['app_instances'=>function($q){
            $q->select('group_id','id', 'name', 'slug', 'icon', 'public');
            $q->where('public','=','1');
        },'pages'=>function($q){
            $q->select('group_id','id', 'name', 'slug', 'public');
            $q->where('public','=','1');

        }])
        ->whereHas('app_instances', function($q) {
             $q->where('public','=','1');
         })
        ->orWhereHas('pages', function($q) {
             $q->where('public','=','1');
        });
    }
    public function scopeLinks($query)
    {
        return $query->with(array('app_instances'=>function($q){
            $q->select('group_id','id', 'name', 'slug', 'icon');
        },'pages'=>function($q){
            $q->select('group_id','id', 'name', 'slug');
        }))->whereIn('id', Auth::user()->groups);
    }



}
