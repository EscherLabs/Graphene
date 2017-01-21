<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class App extends Model
{
    protected $fillable = ['name', 'code'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function app_instances() {
      return $this->hasMany(AppInstance::class);
    }
    public function developer_users()
    {
        return $this->belongsToMany(Group::class, 'app_developers', 
        'app_id', 'user_id');
    }
}
