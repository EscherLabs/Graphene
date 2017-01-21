<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppInstance extends Model
{
    protected $fillable = ['name', 'slug', 'public'];

    public function group() {
      return $this->belongsTo(Group::class);
    }
    public function app() {
      return $this->belongsTo(App::class);
    }
    public function preferences_users()
    {
        return $this->belongsToMany(Group::class, 'user_preferences', 
        'app_instance_id', 'user_id')->withPivot('preferences');
    }
}
