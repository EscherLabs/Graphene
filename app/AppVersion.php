<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppVersion extends Model
{
    protected $fillable = ['summary','stable'];
    protected $casts = ['code' => 'object'];

    public function app() {
      return $this->belongsTo(App::class);
    }
    public function app_instances() {
      return $this->hasOne(AppInstance::class);
    }   
}
