<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Events\UpdateUser;

class SiteMember extends Model
{
    protected $fillable = ['site_id','user_id','site_admin','site_developer'];
    protected $primaryKey = ['user_id', 'site_id'];
    public $incrementing = false;
    protected $dispatchesEvents = ['saved'=>UpdateUser::class];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function user() {
      return $this->belongsTo(User::class);
    }
    public static function remove($site_id, $user_id) {
      $ret = SiteMember::where('site_id',$site_id)->where('user_id',$user_id)->delete();
      event(new UpdateUser((Object)['user_id'=>$user_id]));
      return $ret;
    }    
}
