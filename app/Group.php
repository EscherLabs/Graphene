<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = ['name', 'slug'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function endpoints() {
      return $this->hasMany(Endpoint::class);
    }
    public function app_instances() {
      return $this->hasMany(AppInstance::class);
    }
    public function members() {
      return $this->hasMany(GroupMembers::class);
    }
    public function admins() {
      return $this->hasMany(GroupAdmins::class);
    }

    public function list_admins()
    {
        $admins = [];
        foreach($this->admins()->with('user')->get() as $group_admin) {
            $admins[] = array_merge(['status'=>$group_admin['status']],
                                      $group_admin['user']->toArray());
        }
        return $admins;
    }
    public function add_admin(User $user,$status = Null)
    {
        $status = 0;
        $group_admin = GroupAdmins::updateOrCreate(['group_id'=>$this->id,'user_id'=>$user->id],
          ['status'=>$status]);
        return $group_admin;
    }
    public function remove_admin(User $user)
    {
        GroupAdmins::where('group_id',$this->id)->where('user_id',$user->id)->delete();
    }
    public function list_members()
    {
        $members = [];
        foreach($this->members()->with('user')->get() as $group_member) {
            $members[] = array_merge(['status'=>$group_member['status']],
                                      $group_member['user']->toArray());
        }
        return $members;
    }
    public function add_member(User $user, $status = Null)
    {
        $status = 0;
        $group_admin = GroupAdmins::updateOrCreate(['group_id'=>$this->id,'user_id'=>$user->id],
          ['status'=>$status]);
        return $group_admin;
    }
    public function remove_member(User $user)
    {
        GroupMembers::where('group_id',$this->id)->where('user_id',$user->id)->delete();
    }
}
