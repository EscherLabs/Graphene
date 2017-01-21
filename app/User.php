<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function member_groups()
    {
        return $this->belongsToMany(Group::class, 'group_members', 
        'user_id', 'group_id')->withPivot('status');
    }
    public function admin_groups()
    {
        return $this->belongsToMany(Group::class, 'group_admins', 
        'user_id', 'group_id')->withPivot('status');
    }
    public function preferences_app_instances()
    {
        return $this->belongsToMany(Group::class, 'user_preferences', 
        'user_id', 'app_instance_id')->withPivot('preferences');
    }
    public function developer_apps()
    {
        return $this->belongsToMany(Group::class, 'app_developers', 
        'user_id', 'app_id');
    }
}
