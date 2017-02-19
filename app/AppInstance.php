<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppInstance extends Model
{
    protected $fillable = ['name', 'slug', 'public', 'configuration', 'resources','icon'];

    public function group() {
      return $this->belongsTo(Group::class);
    }
    public function app() {
      return $this->belongsTo(App::class);
    }
    public function user_preferences() {
      return $this->hasOne(UserPreference::class);
    }
    public function set_preference($user, $preferences)
    {
        if(!is_null(UserPreference::where(['user_id'=>$user->id, 'app_instance_id'=>$this->id])->first())) {
            UserPreference::where('app_instance_id', $this->id)->where('user_id',$user->id)->delete();
        }
        return UserPreference::updateOrCreate(['app_instance_id'=>$this->id, 'user_id'=>$user->id],
          ['preferences'=>$preferences]);
    }    
}
