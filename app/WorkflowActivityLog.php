<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkflowActivityLog extends Model
{
    protected $table = 'workflow_activity_log';
    protected $fillable = ['workflow_submission_id','user_id','start_state','action','end_state'];
    protected $casts = ['start_state' => 'object','action' => 'object','end_state' => 'object'];

    public function workflow() {
        return $this->belongsTo(Workflow::class);
    }
    public function workflowSubmission() {
        return $this->belongsTo(WorkflowSubmission::class);
    }
}