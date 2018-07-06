<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SiteMember extends Model
{
    protected $fillable = ['site_id','user_id','site_admin','site_developer'];
    protected $primaryKey = ['user_id', 'site_id'];
    public $incrementing = false;

    public function site() {
      return $this->belongsTo(Site::class);
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
