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
    public function member_users()
    {
        return $this->belongsToMany(Group::class, 'group_members', 
        'group_id', 'user_id')->withPivot('status');
    }
    public function admin_users()
    {
        return $this->belongsToMany(Group::class, 'group_admins', 
        'group_id', 'user_id')->withPivot('status');
    }
}
