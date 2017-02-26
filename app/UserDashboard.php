<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserDashboard extends Model
{
    protected $fillable = ['user_id', 'site_id', 'config'];
    public $incrementing = false;

    protected $casts = ['config' => 'object'];
    
    public function user() {
      return $this->belongsTo(User::class);
    }
}
