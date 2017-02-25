<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Endpoint extends Model
{
    protected $fillable = ['name', 'type', 'config'];

    public function getConfigAttribute($value) {
      return json_decode($value);
    }
    public function setConfigAttribute($value) {
      $this->attributes['config'] = json_encode($value);
    }

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function group() {
      return $this->belongsTo(Group::class);
    }
}
