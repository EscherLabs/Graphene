<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GroupLink extends Model
{
    protected $fillable = ['group_id','link','title','icon','image','color','order'];

    public function group() {
      return $this->belongsTo(Group::class);
    }
}
