<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = ['site_id', 'first_name', 'last_name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function group_members()
    {
      return $this->hasMany(GroupMember::class);
    }
    public function group_admins()
    {
      return $this->hasMany(GroupAdmin::class);
    }
    public function app_instance_preferences()
    {
      return $this->belongsTo(AppInstancePreference::class);
    }
    public function app_developers() {
      return $this->hasMany(AppDeveloper::class);
    }
}
