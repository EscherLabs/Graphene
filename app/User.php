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
    public function group_members()
    {
      return $this->hasMany(GroupMembers::class);
    }
    public function group_admins()
    {
      return $this->hasMany(GroupAdmins::class);
    }
    public function app_instance_preferences()
    {
      return $this->belongsTo(AppInstancePreferences::class);
    }
    public function app_developers() {
      return $this->hasMany(AppDevelopers::class);
    }
}
