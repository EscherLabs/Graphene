<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable as Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['first_name', 'last_name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token','created_at','updated_at'];
    protected $appends = ['options','groups','content_admin_groups','apps_admin_groups','site_admin','site_developer','tags','tags_array'];

    /* Transient Properties not saved in the database */
    public $developer_apps = [];
    public $groups = [];
    public $content_admin_groups = [];
    public $apps_admin_groups = [];
    public $tags = [];
    public $tags_array = [];
    public $site_admin = false;
    public $site_developer = false;
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
    public function getContentAdminGroupsAttribute() {
        return $this->content_admin_groups;
    }
    public function getAppsAdminGroupsAttribute() {
      return $this->apps_admin_groups;
    }
    public function getSiteAdminAttribute() {
        return ($this->site_admin == 1);
    }
    public function getSiteDeveloperAttribute() {
        return ($this->site_developer == 1);
    }
    public function getTagsAttribute() {
      return $this->tags;
    }
    public function getTagsArrayAttribute() {
      return $this->tags_array;
    }

}
