<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Workflow extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = ['name','description','tags','user_id'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function workflow_instances() {
      return $this->hasMany(WorkflowInstance::class);
    }
    public function user() {
      return $this->belongsTo(User::class);
    }
    public function developers()
    {
      return $this->hasMany(WorkflowDeveloper::class);
    }
    public function versions()
    {
      return $this->hasMany(WorkflowVersion::class);
    }

    public function Projects()
    {
      return $this->belongsToMany(Project::class,'project_workflows');
    }

    public function add_developer(User $user, $status = false)
    {
        self::remove_developer($user); // First Delete the developer from the workflow
        $workflow_developer = WorkflowDeveloper::create(['workflow_id'=>$this->id,'user_id'=>$user->id,
          'status'=>$status]);
        return $user;
    }
    public function remove_developer(User $user)
    {
        WorkflowDeveloper::where('workflow_id', $this->id)->where('user_id',$user->id)->delete();
    }

    public function scopeCurrentVersion($query)
    {
        return $query->with(array('versions'=>function($q){
            $q->orderBy('created_at', 'desc');
            $q->select('id','updated_at','created_at','workflow_id');
        }));
    }
}
