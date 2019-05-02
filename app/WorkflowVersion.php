<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkflowVersion extends Model
{
    protected $fillable = ['workflow_id','summary','description','stable','code','user_id'];
    protected $casts = ['code' => 'object'];

    public function workflow() {
      return $this->belongsTo(Workflow::class);
    }
    public function workflow_instances() {
      return $this->hasOne(WorkflowInstance::class);
    }  
    public function user() {
      return $this->belongsTo(User::class);
    }
}
