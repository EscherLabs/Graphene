<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable as Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['first_name', 'last_name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];
    protected $appends = ['options','groups'];

    /* Transient Properties not saved in the database */
    public $developer_apps = [];
    public $groups = [];
    public $admin_groups = [];
    public $site_admin = false;
    public $developer = false;
    public $site = null;
    public $options = null;

    protected $casts = ['params' => 'object'];

    public function site_members() {
      return $this->belongsTo(SiteMember::class);
    }
    public function group_members() {
      return $this->hasMany(GroupMember::class);
    }
    public function group_admins() {
      return $this->hasMany(GroupAdmin::class);
    }
    public function app_instance_options() {
      return $this->belongsTo(UserOption::class);
    }
    public function app_developers() {
      return $this->hasMany(AppDeveloper::class);
    }
    public function getOptionsAttribute() {
        return $this->options;
    }
    public function getGroupsAttribute() {
        return $this->groups;
    }
}
