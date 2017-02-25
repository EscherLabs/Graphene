<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserDashboard extends Model
{
    protected $fillable = ['user_id', 'config'];
    protected $primaryKey = 'user_id';

    public $incrementing = false;

    public function getConfigAttribute($value) {
      return json_decode($value);
    }
    public function setConfigAttribute($value) {
      $this->attributes['config'] = json_encode($value);
    }
    
    public function user() {
      return $this->belongsTo(User::class);
    }
}
