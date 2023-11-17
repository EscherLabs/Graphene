<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable as Notifiable;

class BulkUser extends Authenticatable
{
    protected $table = 'users';
    protected $fillable = ['first_name', 'last_name', 'email', 'password'];
    protected $hidden = ['password','remember_token','created_at','updated_at','invalidate_cache','params'];
    protected $casts = ['params' => 'object'];


    
    public function group_memberships() {
        return $this->hasManyThrough(Group::class,GroupMember::class,'user_id','id','id','group_id');
    }
   
    public function scopeMemberships($query){
        return $query->with(['group_memberships'=>function($query){
            return $query->where('site_id',config('app.site')->id)->select('id','site_id','group_id','slug','name',);
        }]);
    }
    // public function getExternalGroups() {
    //     return $this->hasManyThrough(Group::class,GroupMember::class,'user_id','id','id','group_id');
    // }
   
    // public function group_pivot() {
    //     return $this->hasMany(GroupMember::class,'user_id');
    // }
    // public function getGroups()
    // {
    //     return $this->load(['group_memberships'=>function($query){
    //         $query->where(['site_id'=>config('app.site')->id])->select('id','site_id','slug','name');
    //     }])->group_memberships->map(function ($resource) {
    //         // $resource->config->uuid= $resource->uuid;
    //         return $resource->slug;
    //     });



    // $user = BulkUser::where(['unique_id'=>$unique_id])->with(['group_memberships'=>function($query){
    //     $query->where(['site_id'=>config('app.site')->id])->select('id','site_id','slug','name');
    // }])->first();



    // }

    public function Groups()
    {
        return $this->belongsToMany(Group::class, 'group_members', 'user_id','group_id')->withPivot('status')->withTimestamps();
    }

    // public function sites() {
    //     return $this->hasManyThrough(User::class,SiteMember::class,'user_id','id','id','site_id');
    // }

}
