<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['group_id','name','value'];

    public function group() {
      return $this->belongsTo(Group::class);
    }
}
