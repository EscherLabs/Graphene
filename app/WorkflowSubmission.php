<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkflowSubmission extends Model
{
    protected $fillable = ['workflow_version_id','user_id','assignment_type','assignment_id','state','data','status'];
    protected $casts = ['data' => 'object',];

    public function workflow() {
        return $this->belongsTo(Workflow::class);
    }
    public function workflowVersion() {
        return $this->belongsTo(WorkflowVersion::class);
    }
}