<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ResourceCache extends Model
{
    public $timestamps = false;
    protected $table = 'resource_cache';
    public $incrementing = false;
    protected $primaryKey = ['app_instance_id','url'];

    protected $fillable = ['app_instance_id','url','content','created_at'];

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
