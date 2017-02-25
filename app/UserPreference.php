<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = ['app_instance_id', 'user_id', 'preferences'];
    protected $primaryKey = ['user_id', 'app_instance_id'];
    public $incrementing = false;

    public function getPreferencesAttribute($value) {
      return json_decode($value);
    }
    public function setPreferencesAttribute($value) {
      $this->attributes['preferences'] = json_encode($value);
    }

    public function app_instance() {
      return $this->belongsTo(AppInstance::class);
    }
    public function user() {
      return $this->belongsTo(User::class);
    }
}
