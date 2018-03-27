<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppVersion extends Model
{
    protected $fillable = ['app_id','summary','description','stable','code','user_id'];
    protected $casts = ['code' => 'object'];

    public function app() {
      return $this->belongsTo(App::class);
    }
    public function app_instances() {
      return $this->hasOne(AppInstance::class);
    }  
    public function user() {
      return $this->belongsTo(User::class);
    }
}
