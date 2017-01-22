<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    protected $fillable = ['domain','theme'];

    public function users() {
      return $this->hasMany(User::class);
    }
    public function groups() {
      return $this->hasMany(Group::class);
    }
    public function apps() {
      return $this->hasMany(App::class);
    }
    public function endpoints() {
      return $this->hasMany(Endpoints::class);
    }
}
