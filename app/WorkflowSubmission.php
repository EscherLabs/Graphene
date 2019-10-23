<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkflowSubmission extends Model
{
    use SoftDeletes;
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

    public function logs() {
        return $this->hasMany(WorkflowActivityLog::class);
    }
    public function files() {
        return $this->hasMany(WorkflowSubmissionFile::class);
    }

    public function Assignment() {

        if($this->assignment_type == "user"){
            $this->assignee = User::where("id", '=', $this->assignment_id)->first()->only('first_name','last_name','email','unique_id','params');
        }else{
            $this->assignee = Group::where("id",'=',$this->assignment_id)->where('site_id',config('app.site')->id)->select('name','slug','id')->first();
        }
    }
}