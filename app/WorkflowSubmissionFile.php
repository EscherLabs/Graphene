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
    public function user() {
      return $this->belongsTo(User::class,'user_id_created');
    }
    public function deleted_by() {
      return $this->belongsTo(User::class,'user_id_deleted');
    }
    public function getPathAttribute() {
        return url('/api/workflowsubmissions/'.$this->workflow_submission_id.'/files/'.$this->id);
    }
    public function root_dir() {
        return config('filesystems.disks.local.root');
    }
    public function file_dir() {
        return 'sites/'.config('app.site')->id.'/workflow_submissions/files';
    }
    public function get_file_path() {
        return $this->file_dir().'/'.$this->id.'.'.$this->ext;
    }
    public function get_file_path_absolute() {
        return $this->root_dir().'/'.$this->file_dir().'/'.$this->id.'.'.$this->ext;
    }
}
