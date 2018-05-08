<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable as Notifiable;
use Illuminate\Support\Facades\Crypt;

class APIUser extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['app_name', 'config','site_id'];
    protected $hidden = ['app_secret'];
    protected $casts = ['config' => 'object'];
    protected $table = 'api_users';

    public function site() {
      return $this->belongsTo(Site::class);
    }

    public function setAppSecretAttribute($secret)
    {
      $this->attributes['app_secret'] = Crypt::encryptString($secret);
    }

    public function getAppSecretAttribute() {
      if (isset($this->attributes['app_secret'])) { 
        $secret = Crypt::decryptString($this->attributes['app_secret']); 
      } else {
        $secret = null;
      }
      return $secret;
    }


}
