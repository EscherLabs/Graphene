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
    
    /**
    * Set the keys for a save update query.
    * This is a fix for tables with composite keys
    * TODO: Investigate this later on
    *
    * @param  \Illuminate\Database\Eloquent\Builder  $query
    * @return \Illuminate\Database\Eloquent\Builder
    */
    protected function setKeysForSaveQuery(\Illuminate\Database\Eloquent\Builder $query) {
        if (is_array($this->primaryKey)) {
            foreach ($this->primaryKey as $pk) {
                $query->where($pk, '=', $this->original[$pk]);
            }
            return $query;
        }else{
            return parent::setKeysForSaveQuery($query);
        }
    }
}
