<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = ['name','description','user_id'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    // public function project_instances() {
    //   return $this->hasMany(ProjectInstance::class);
    // }
    public function user() {
      return $this->belongsTo(User::class);
    }

    public function reports() {
      return $this->belongsToMany(Report::class,'project_reports');
    }
    public function workflows() {
      return $this->belongsToMany(Workflow::class,'project_workflows');
    }
    public function apps() {
      return $this->belongsToMany(App::class,'project_apps');
    }
    // public function forms() {
    //   return $this->belongsToMany(Form::class);
    // }

    // public function developers()
    // {
    //   return $this->hasMany(ProjectDeveloper::class);
    // }
    // public function versions()
    // {
    //   return $this->hasMany(ProjectVersion::class);
    // }
    // public function add_developer(User $user, $status = false)
    // {
    //     self::remove_developer($user); // First Delete the developer from the project
    //     $project_developer = ProjectDeveloper::create(['project_id'=>$this->id,'user_id'=>$user->id,
    //       'status'=>$status]);
    //     return $user;
    // }
    // public function remove_developer(User $user)
    // {
    //     ProjectDeveloper::where('project_id', $this->id)->where('user_id',$user->id)->delete();
    // }

    // public function scopeCurrentVersion($query)
    // {
    //     return $query->with(array('versions'=>function($q){
    //         $q->orderBy('created_at', 'desc');
    //         $q->select('id','updated_at','created_at','project_id');
    //     }));
    // }
}
