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
}
