<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserDashboard extends Model
{
    protected $fillable = ['user_id', 'config'];
    protected $primaryKey = 'user_id';

    public $incrementing = false;
    
    public function user() {
      return $this->belongsTo(User::class);
    }
}
