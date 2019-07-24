<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkflowSubmission extends Model
{
    protected $fillable = ['workflow_id','workflow_version_id','workflow_instance_id','workflow_instance_configuration','user_id','assignment_type','assignment_id','state','data','status'];
    protected $casts = ['data' => 'object','workflow_instance_configuration'=>'object'];

    public function workflow() {
        return $this->belongsTo(Workflow::class);
    }
    public function workflowVersion() {
        return $this->belongsTo(WorkflowVersion::class);
    }
    public function workflowInstance() {
        return $this->belongsTo(WorkflowInstance::class);
    }
    public function user() {
        return $this->belongsTo(User::class);
    }
}