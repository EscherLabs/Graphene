<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Site extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = ['domain','theme'];

    public function getThemeAttribute($value) {
      return json_decode($value);
    }
    public function setThemeAttribute($value) {
      $this->attributes['theme'] = json_encode($value);
    }

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
    public function add_member(User $user, $site_admin = false, $developer = false)
    {
        self::remove_member($user); // First Delete the member from the site
        $site_member = SiteMember::create(['site_id'=>$this->id,'user_id'=>$user->id,
          'developer'=>$developer,'site_admin'=>$site_admin]);
        return $site_member;
    }
    public function remove_member(User $user)
    {
        SiteMember::where('site_id',$this->id)->where('user_id',$user->id)->delete();
    }
}
