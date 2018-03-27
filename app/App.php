<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class App extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = ['name','description','tags','user_id'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function app_instances() {
      return $this->hasMany(AppInstance::class);
    }
    public function user() {
      return $this->belongsTo(User::class);
    }
    public function developers()
    {
      return $this->hasMany(AppDeveloper::class);
    }
    public function versions()
    {
      return $this->hasMany(AppVersion::class);
    }
    // public function list_developers()
    // {
    //     $app_id = $this->id;
    //     $developers = User::whereHas('app_developers', function($query) use ($app_id) {
    //       $query->where('app_id','=',$app_id);
    //     });
    //     return $developers;
    // }
    public function add_developer(User $user, $status = false)
    {
        self::remove_developer($user); // First Delete the developer from the app
        $app_developer = AppDeveloper::create(['app_id'=>$this->id,'user_id'=>$user->id,
          'status'=>$status]);
        return $user;
    }
    public function remove_developer(User $user)
    {
        AppDeveloper::where('app_id', $this->id)->where('user_id',$user->id)->delete();
    }

}
