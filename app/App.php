<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class App extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = ['name'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function app_instances() {
      return $this->hasMany(AppInstance::class);
    }
    public function developers()
    {
      return $this->hasMany(AppDeveloper::class);
    }
}
