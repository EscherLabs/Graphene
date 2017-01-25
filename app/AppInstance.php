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
    public function user_preferences() {
      return $this->hasMany(UserPreference::class);
    }
}
