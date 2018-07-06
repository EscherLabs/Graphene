<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppDeveloper extends Model
{
    protected $fillable = ['app_id','user_id','status'];
    protected $primaryKey = ['user_id', 'app_id'];
    public $incrementing = false;

    public function app() {
      return $this->belongsTo(App::class);
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
