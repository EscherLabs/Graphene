<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkflowActivityLog extends Model
{
    protected $table = 'workflow_activity_log';
    protected $fillable = ['workflow_instance_id','workflow_submission_id','user_id','start_state','action','end_state','comment','data','signature','status'];
    protected $casts = ['data'=>'array'];

    protected function serializeDate(\DateTimeInterface $date) {
        return $date->format('Y-m-d H:i:s');
    }
   
    public function workflowInstance() {
        return $this->belongsTo(WorkflowInstance::class);
    }
    public function workflowSubmission() {
        return $this->belongsTo(WorkflowSubmission::class);
    }
    public function user() {
        return $this->belongsTo(BulkUser::class,'user_id');
    }
    public function getDataAttribute($value) {
        $payload = json_decode($value,true);
        if (isset($payload['_encrypted']) && $payload['_encrypted']===true && isset($payload['data'])) {
            return json_decode(decrypt($payload['data']),false);
        } else {
            return json_decode($value,false);
        }
    }
    public function setDataAttribute($value) {
        $instance = WorkflowInstance::where('id',$this->workflow_instance_id)->select('configuration')->first();
        if (isset($instance->configuration->encrypted) && ($instance->configuration->encrypted === true)) {
            $this->attributes['data'] = json_encode(['_encrypted'=>true,'data'=>encrypt(json_encode($value))]);
        } else {
            $this->attributes['data'] = json_encode($value);
        }
    }
}