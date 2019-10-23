<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkflowSubmissionFile extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $table = 'workflow_submission_files';
    protected $fillable = ['workflow_submission_id','name','ext','mime_type'];
    protected $appends = ['path'];

    /* Transient Properties not saved in the database */
    public $path = '';

    public function workflowSubmission() {
      return $this->belongsTo(WorkflowSubmission::class);
    }

    public function getPathAttribute() {
        return url('/api/workflowsubmissions/'.$this->workflow_submission_id.'/files/'.$this->id);
    }
}
