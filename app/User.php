<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable as Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['first_name', 'last_name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token','created_at','updated_at','invalidate_cache'];
    protected $appends = ['options','groups','content_admin_groups','apps_admin_groups','site_admin','site_developer','tags','tags_array'];
    protected $casts = ['invalidate_cache' => 'boolean', 'params' => 'object'];

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

    public function site_members() {
      return $this->hasMany(SiteMember::class);
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
    public function app_versions() {
      return $this->hasMany(AppVersion::class);
    }
    public function lead_developer_apps() {
      return $this->hasMany(App::class);
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

    /* Used for Policy Methods */
    public function group_apps_admin($group_id=null) {
      if (is_null($group_id)) {
        return count($this->apps_admin_groups)>0;
      }
      return in_array($group_id,$this->apps_admin_groups);
    }
    public function group_content_admin($group_id=null) {
      if (is_null($group_id)) {
        return count($this->content_admin_groups)>0;
      }
      return in_array($group_id,$this->content_admin_groups);
    }
    public function group_admin($group_id=null) {
      if (is_null($group_id)) {
        return count($this->content_admin_groups+$this->apps_admin_groups)>0;
      }
      return in_array($group_id,$this->content_admin_groups) || in_array($group_id,$this->apps_admin_groups);
    }
    public function group_member($group_id=null) {
      if (is_null($group_id)) {
        return count($this->groups)>0;
      }
      return in_array($group_id,$this->groups);
    }
    public function app_developer($app_id=null) {
      if (is_null($app_id)) {
        return count($this->developer_apps)>0;
      }
      return in_array($app_id,$this->developer_apps);
    }    
}
