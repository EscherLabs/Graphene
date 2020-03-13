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

    public function getAssignment() {
        if($this->assignment_type == "user"){
            $this->assignee = User::where("id", '=', $this->assignment_id)->first()->only('first_name','last_name','email','unique_id','params');
        }else{
            $this->assignee = Group::where("id",'=',$this->assignment_id)->where('site_id',config('app.site')->id)->select('name','slug','id')->first();
        }
    }
    public function getSubmittedAt() {
        $activity = WorkflowActivityLog::select('created_at')
            ->where('workflow_submission_id',$this->id)
            ->orderBy('id','asc')->first();
        if (!is_null($activity)) {
            $this->submitted_at=$activity->created_at->format('Y-m-d H:i:s');
        } else {
            $this->submitted_at = null;
        }
    }
    // public function getDataAttribute($value) {
    //     return json_decode($value);
    // }
    // public function setDataAttribute($value) {
    //     if (isset($this->workflow_instance->configuration->encrypted) && ($this->workflow_instance->configuration->encrypted === true)) {
    //         // encrypt the data first
    //         $this->attributes['data'] = ['_encrypted'=>encrypt($value),'data'=>$value];
    //     } else {
    //         $this->attributes['data'] = json_encode($value);
    //     }
    // }
}