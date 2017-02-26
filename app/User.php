<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = ['first_name', 'last_name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];

    /* Transient Properties not saved in the database */
    public $developer_apps = [];
    public $groups = [];
    public $admin_groups = [];
    public $site_admin = false;
    public $developer = false;
    public $site = null;

    protected $casts = ['params' => 'object'];

    public function site_members() {
      return $this->belongsTo(SiteMember::class);
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
