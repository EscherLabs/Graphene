<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = ['name','description','user_id'];

    public function site() {
      return $this->belongsTo(Site::class);
    }
    // public function report_instances() {
    //   return $this->hasMany(ReportInstance::class);
    // }
    public function user() {
      return $this->belongsTo(User::class);
    }
    // public function developers()
    // {
    //   return $this->hasMany(ReportDeveloper::class);
    // }

    public function Projects()
    {
      return $this->belongsToMany(Project::class,'project_reports');
    }
    public function versions()
    {
      return $this->hasMany(ReportVersion::class);
    }
    public function scopeCurrentVersion($query)
    {
        return $query->with(array('versions'=>function($q){
            $q->orderBy('created_at', 'desc');
            $q->select('id','updated_at','created_at','report_id','config');
        }));
    }

    // public function add_developer(User $user, $status = false)
    // {
    //     self::remove_developer($user); // First Delete the developer from the report
    //     $report_developer = ReportDeveloper::create(['report_id'=>$this->id,'user_id'=>$user->id,
    //       'status'=>$status]);
    //     return $user;
    // }
    // public function remove_developer(User $user)
    // {
    //     ReportDeveloper::where('report_id', $this->id)->where('user_id',$user->id)->delete();
    // }

    // public function scopeCurrentVersion($query)
    // {
    //     return $query->with(array('versions'=>function($q){
    //         $q->orderBy('created_at', 'desc');
    //         $q->select('id','updated_at','created_at','report_id');
    //     }));
    // }
}
