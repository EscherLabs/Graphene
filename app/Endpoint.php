<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Endpoint extends Model
{
    protected $fillable = ['name', 'type', 'config'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function group() {
      return $this->belongsTo(Group::class);
    }
}
