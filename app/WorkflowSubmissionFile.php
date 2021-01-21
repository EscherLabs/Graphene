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
      return $this->belongsTo(BulkUser::class,'user_id_created');
    }
    public function deleted_by() {
      return $this->belongsTo(BulkUser::class,'user_id_deleted');
    }
    public function getPathAttribute() {
        return url('/api/workflowsubmissions/'.$this->workflow_submission_id.'/files/'.$this->id);
    }
    public function root_dir() {
        return config('filesystems.disks.local.root');
    }
    public function file_dir() {
        // 01/21/2021, AKT - When running an internal call from the kernel, config('app.site')->id doesn't have a site_id
        // This function is also used when purging files by an automated internal call
        // Thus, a new function (get_site_id) has been created to resolve the site_id
        return 'sites/'.$this->get_site_id().'/workflow_submissions/files';
    }
    public function get_file_path() {
        return $this->file_dir().'/'.$this->id.'.'.$this->ext;
    }
    public function get_file_path_absolute() {
        return $this->root_dir().'/'.$this->file_dir().'/'.$this->id.'.'.$this->ext;
    }
    // 01/21/2021, AKT - Returns site_id
    private function get_site_id(){
        if(!isset(config('app.site')->id)) {// Checks if app.site has an id
            // Uses the relationships between submission, instances and group to resolve the site_id
            // The query can (should?) be improved
            return $this->workflowSubmission()->first()->workflowInstance()->first()->group()->first()->site_id;
        }
        else{
            // Returns the current app.site's id (site_id)
            return config('app.site')->id;
        }
    }
}
