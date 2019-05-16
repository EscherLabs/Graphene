<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Events\UpdateUser;

class AppDeveloper extends Model
{
    protected $fillable = ['app_id','user_id','status'];
    protected $primaryKey = ['user_id', 'app_id'];
    public $incrementing = false;
    protected $dispatchesEvents = ['saved'=>UpdateUser::class];

    public function app() {
      return $this->belongsTo(App::class);
    }
    public function user() {
      return $this->belongsTo(User::class);
    }
    public static function remove($app_id, $user_id) {
      $ret = AppDeveloper::where('app_id',$app_id)->where('user_id',$user_id)->delete();
      event(new UpdateUser((Object)['user_id'=>$user_id]));
      return $ret;
    }
}
