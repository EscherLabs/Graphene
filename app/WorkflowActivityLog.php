<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkflowActivityLog extends Model
{
    protected $table = 'workflow_activity_log';
    protected $fillable = ['workflow_instance_id','workflow_submission_id','user_id','start_state','action','end_state','data','status'];
    protected $casts = ['data' => 'object'];

    public function workflowInstance() {
        return $this->belongsTo(WorkflowInstance::class);
    }
    public function workflowSubmission() {
        return $this->belongsTo(WorkflowSubmission::class);
    }
}