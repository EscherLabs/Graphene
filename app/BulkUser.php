<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable as Notifiable;

class BulkUser extends Authenticatable
{
    protected $table = 'users';
    protected $hidden = ['password','remember_token','created_at','updated_at','invalidate_cache'];
    protected $casts = ['params' => 'object'];
}
