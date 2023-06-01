<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Site extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = ['domain','name','theme','templates','auth','auth_config','proxyserver_config'];
    protected $casts = ['theme' => 'object','templates' => 'object','auth_config' => 'object'];

    public function members() {
      return $this->hasMany(SiteMember::class);
    }
    public function groups() {
      return $this->hasMany(Group::class);
    }
    public function apps() {
      return $this->hasMany(App::class);
    }
    public function endpoints() {
      return $this->hasMany(Endpoint::class);
    }
    public function list_members()
    {
      return $this->members()->with('user')->get();
    }

    public function list_admins()
    {
      return $this->members()->with('user')->where('site_admin','=',1)->get()->pluck('user');
    }

    public function add_member($user, $site_admin = false, $site_developer = false)
    {
      self::remove_member($user); // First Delete the member from the site
      $site_member = SiteMember::create(['site_id'=>$this->id,'user_id'=>$user->id,
        'site_developer'=>$site_developer?1:0,'site_admin'=>$site_admin?1:0]);
      return $site_member;
    }
    public function remove_member($user)
    {
      return SiteMember::remove($this->id,$user->id);
    }

    public function getProxyserverConfigAttribute($config_string)
    {
      if (!is_null($config_string) && $config_string != '') {
        $configs = json_decode($config_string);
        if (is_array($configs)) {
          foreach($configs as $index => $config) {
            if (isset($config->password)) {
              $configs[$index]->password = '*****';
            }
          }
          return $configs;
        } else {
          return [];
        }
      } else {
        return null;
      }
    }

    public function setProxyserverConfigAttribute($configs)
    {
      if (is_array($configs)) {
        foreach($configs as $index => $config) {
          if (isset($config['password']) && $config['password'] != '*****') {
            $configs[$index]['password'] = encrypt($config['password']);
          } else {
            $orig_config = $this->get_proxyserver_by_slug($config['slug']);
            $configs[$index]['password'] = encrypt($orig_config->password);
          }
        }
        $this->attributes['proxyserver_config'] = json_encode($configs);
      }
    }

    public function get_proxyserver_by_slug($slug)
    {
      $config_string = $this->attributes['proxyserver_config'];
      if (!is_null($config_string) && $config_string != '') {
        $configs = json_decode($config_string);
        if (is_array($configs)) {
          foreach($configs as $config) {
            if (isset($config->slug) && $config->slug == $slug) {
              $config->password = decrypt($config->password);
              return $config;
            }
          }
        } 
      } else {
        return null;
      }
    }
}
