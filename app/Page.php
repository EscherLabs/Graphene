<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['group_id', 'name', 'slug', 'content', 'mobile_order','unlist','public'];

    protected $casts = ['content' => 'object', 'mobile_order' => 'object'];

    public function group() {
      return $this->belongsTo(Group::class);
    }
}