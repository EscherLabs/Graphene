<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Site extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
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
      return $this->hasMany(Endpoint::class);
    }
}
