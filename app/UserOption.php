<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserOption extends Model
{
    protected $fillable = ['app_instance_id', 'user_id', 'options'];
    protected $primaryKey = ['user_id', 'app_instance_id'];
    public $incrementing = false;

    protected $casts = ['options' => 'object'];

    public function app_instance() {
      return $this->belongsTo(AppInstance::class);
    }
    public function user() {
      return $this->belongsTo(User::class);
    }
}
