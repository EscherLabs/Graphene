<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ResourceCache extends Model
{
    public $timestamps = false;
    protected $fillable = ['url','content'];
}
