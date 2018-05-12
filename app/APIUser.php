<?php

namespace App;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable as Notifiable;
use Illuminate\Support\Facades\Hash;

class APIUser extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['app_name', 'config','site_id'];
    // protected $hidden = ['app_secret'];
    protected $casts = ['config' => 'object'];
    protected $table = 'api_users';

    public function site() {
      return $this->belongsTo(Site::class);
    }

    public function setAppSecretAttribute($secret) {
      if ($secret !== '*****') {
        $this->attributes['app_secret'] = Hash::make($secret);
      }
    }

    public function getAppSecretAttribute($secret) {
      return '*****';
    }

    public function check_app_secret($secret) {
      return Hash::check($secret, $this->attributes['app_secret']);
    }


}
