<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable as Notifiable;

class BulkUser extends Authenticatable
{
    protected $table = 'users';
    protected $fillable = ['first_name', 'last_name', 'email', 'password'];
    protected $hidden = ['password','remember_token','created_at','updated_at','invalidate_cache'];
    protected $casts = ['params' => 'object'];


    public function group_memberships() {
        return $this->hasManyThrough(Group::class,GroupMember::class,'user_id','id','id','group_id');
      }
}
