<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppInstance extends Model
{
    protected $fillable = ['name', 'slug', 'public', 'options', 'user_options_default', 'resources','icon', 'app_version_id', 'unlisted','groups'];
    protected $casts = ['options' => 'object', 'user_options_default' => 'object', 'resources' => 'object','groups'=>'array'];
    protected $appends = ['hidden_xs', 'hidden_sm', 'hidden_md', 'hidden_lg'];
    
    /* Transient Properties not saved in the database */
    public $hidden_xs = false;
    public $hidden_sm = false;
    public $hidden_md = false;
    public $hidden_lg = false;
    
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
    
    public function getHiddenXsAttribute()
    {
        return ($this->device === 1 || $this->device === 2);  
    }
    public function getHiddenSmAttribute()
    {
        return ($this->device === 1 || $this->device === 4);  
    }
    public function getHiddenMdAttribute()
    {
        return ($this->device === 3 || $this->device === 4);  
    }
    public function getHiddenLgAttribute()
    {
        return ($this->device === 3 || $this->device === 4);  
    }
    
    public function findVersion() {
        $myAppVersion;
        if(is_null($this->app_version_id)){
            $myAppVersion = AppVersion::where('app_id','=',$this->id)->orderBy('created_at', 'desc')->first();
        }else if($this->app_version_id == 0){
            $myAppVersion = AppVersion::where('app_id','=',$this->id)->where('stable','=',1)->orderBy('created_at', 'desc')->first();
        }else{
            $myAppVersion = AppVersion::where('id','=',$this->app_version_id)->first();
        }
        $this->app->code = $myAppVersion->code;
        $this->app->version = $myAppVersion->id;
    }
}
