<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = ['app_instance_id','user_id','preferences'];
    public $incrementing = false;

    public function app_instance() {
      return $this->belongsTo(AppInstance::class);
    }
    public function user() {
      return $this->belongsTo(User::class);
    }
}
