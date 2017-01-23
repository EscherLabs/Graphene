<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
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
      return $this->hasMany(GroupMember::class);
    }
    public function admins() {
      return $this->hasMany(GroupAdmin::class);
    }

    public function list_admins()
    {
        return $this->admins()->with('user')->get();
    }
    public function add_admin(User $user,$status = Null)
    {
        $status = 0;
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
    public function add_member(User $user, $status = Null)
    {
        $status = 0;
        $group_admin = GroupAdmin::updateOrCreate(['group_id'=>$this->id,'user_id'=>$user->id],
          ['status'=>$status]);
        return $group_admin;
    }
    public function remove_member(User $user)
    {
        GroupMember::where('group_id',$this->id)->where('user_id',$user->id)->delete();
    }
}
