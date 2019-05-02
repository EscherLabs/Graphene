<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkflowDeveloper extends Model
{
    protected $fillable = ['workflow_id','user_id','status'];
    protected $primaryKey = ['user_id', 'workflow_id'];
    public $incrementing = false;

    public function workflow() {
      return $this->belongsTo(Workflow::class);
    }
    public function user() {
      return $this->belongsTo(User::class);
    }
    public static function boot()
    {
      parent::boot();
      self::saved(function($model){
        $user = User::where('id','=',$model->user_id)->first();
        $user->invalidate_cache = true;
        $user->save();
      });
    }
}
