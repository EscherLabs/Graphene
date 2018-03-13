<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cache extends Model
{
    public $timestamps = false;
    protected $fillable = ['key','value'];
}
