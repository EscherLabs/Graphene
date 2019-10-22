<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkflowSubmissionFile extends Model
{
    protected $table = 'workflow_submission_files';
    protected $fillable = ['workflow_submission_id','name','ext','mime_type'];

    public function workflowSubmission() {
      return $this->belongsTo(WorkflowSubmission::class);
    }
}
