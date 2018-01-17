<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppInstance extends Model
{
    protected $fillable = ['name', 'slug', 'public', 'options', 'user_options_default', 'resources','icon', 'app_version_id', 'unlisted'];
    protected $casts = ['options' => 'object', 'user_options_default' => 'object', 'resources' => 'object'];
    protected $appends = ['visible_xs', 'visible_sm', 'visible_md', 'visible_lg'];

    public function group() {
      return $this->belongsTo(Group::class);
    }
    public function app() {
      return $this->belongsTo(App::class);
    }
    public function appVersion() {
      return $this->belongsTo(AppVersion::class);
    }
    public function user_options() {
      return $this->hasOne(UserOption::class);
    }
    public function set_user_options($user, $user_options)
    {
        if(!is_null(UserOption::where(['user_id'=>$user->id, 'app_instance_id'=>$this->id])->first())) {
            UserOption::where('app_instance_id', $this->id)->where('user_id',$user->id)->delete();
        }
        return UserOption::updateOrCreate(['app_instance_id'=>$this->id, 'user_id'=>$user->id],
          ['options'=>$user_options]);
    }   
    public function getVisibleXsAttribute()
    {
        return ($this->device === 0 || $this->device === 3 || $this->device === 4);  
    }
    public function getVisibleSmAttribute()
    {
        return ($this->device === 0 || $this->device === 3 || $this->device === 4);  
    }
    public function getVisibleMdAttribute()
    {
        return ($this->device === 0 || $this->device === 2 || $this->device === 3);  
    }
    public function getVisibleLgAttribute()
    {
        return ($this->device === 0 || $this->device === 1 || $this->device === 2);  
    } 
}
