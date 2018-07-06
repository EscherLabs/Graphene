<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GroupAdmin extends Model
{
    protected $fillable = ['group_id','user_id','status'];
    protected $primaryKey = ['user_id', 'group_id'];
    public $incrementing = false;

    public function group() {
      return $this->belongsTo(Group::class);
    }
    public function user() {
      return $this->belongsTo(User::class);
    }
    public static function boot()
    {
      parent::boot();
      self::saved(function($model){
        $user = User::where('id','=',$model->user_id)->first();
        $user->invalidate_cache = true;
        $user->save();
      });
    }
}
