<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProjectVersion extends Model
{
    protected $fillable = ['project_id','summary','description','stable','config','compiled','user_id'];
    protected $casts = ['config' => 'object','compiled' => 'object'];

    public function project() {
      return $this->belongsTo(App::class);
    }
    public function project_instances() {
      return $this->hasOne(AppInstance::class);
    }  
    public function user() {
      return $this->belongsTo(User::class);
    }
}
