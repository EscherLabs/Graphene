<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class App extends Model
{
    protected $fillable = ['name', 'code'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function app_instances() {
      return $this->hasMany(AppInstance::class);
    }
    public function developers()
    {
      return $this->hasMany(AppDevelopers::class);
    }
}
