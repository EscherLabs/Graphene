<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProjectInstance extends Model
{
    protected $fillable = ['name', 'slug', 'public', 'config'];
    protected $casts = ['config'=>'object'];
    // protected $casts = ['options' => 'object', 'user_options_default' => 'object', 'resources' => 'object','groups'=>'array','public' => 'boolean','unlisted'=>'boolean'];
    // protected $appends = ['hidden_xs', 'hidden_sm', 'hidden_md', 'hidden_lg', 'composite_limit'];

    /* Transient Properties not saved in the database */
    public $hidden_xs = false;
    public $hidden_sm = false;
    public $hidden_md = false;
    public $hidden_lg = false;
    public $composite_limit = false;
    
    public function group() {
      return $this->belongsTo(Group::class);
    }
    public function project() {
      return $this->belongsTo(Project::class);
    }
    public function projectVersion() {
      return $this->belongsTo(ProjectVersion::class);
    }


    //todo: currently grabbing latest nead to look at selected configurations

    public function loadVersions() {
      if(!isset($this->project))return;

      if(isset($this->project->reports) && count($this->project->reports)){
        foreach($this->project->reports as $key=>$report){
          $rv = ReportVersion::where('report_id','=',$report->id)->first();
          if($rv !== null){
            $this->project->reports[$key]['config'] = $rv->config;
          }
        }
      }

      if(isset($this->project->workflows) && count($this->project->workflows)){
        foreach($this->project->workflows as $key=>$workflow){
          $wfv =WorkflowVersion::where('workflow_id','=',$workflow->id)->first();
          if($wfv !== null){
            $this->project->workflows[$key]['code'] = $wfv->code;
          }
        }
      }
      
      if(isset($this->project->apps) && count($this->project->apps)){
        foreach($this->project->apps as $key=>$app){
          $av =AppVersion::where('app_id','=',$app->id)->first();
          if($av !== null){
            $this->project->apps[$key]['code'] = $av->code;
          }
        }
      }
      
      // $myWorkflowVersion = ReportVersion::where('id','=',$this->version['id'])->first();

      // $this->workflow->code = $myWorkflowVersion->code;
      // $this->workflow->version = $myWorkflowVersion->id;
    }
    // public function user_options() {
    //   return $this->hasOne(UserOption::class);
    // }
    // public function set_user_options($user, $user_options)
    // {
    //     if(!is_null(UserOption::where(['user_id'=>$user->id, 'project_instance_id'=>$this->id])->first())) {
    //         UserOption::where('project_instance_id', $this->id)->where('user_id',$user->id)->delete();
    //     }
    //     return UserOption::updateOrCreate(['project_instance_id'=>$this->id, 'user_id'=>$user->id],
    //       ['options'=>$user_options]);
    // }   
    
    // public function reports() {
    //   return $this->hasMany(Report::class);
    // }
    // public function apps() {
    //   return $this->hasMany(App::class);
    // }
    // public function workflows() {
    //   return $this->hasMany(Worfklow::class);
    // }
    // public function forms() {
    //   return $this->hasMany(Form::class);
    // }
    // public function resources() {
    //   return $this->hasMany(Resource::class);
    // }
    // public function grids() {
    //   return $this->hasMany(Grid::class);
    // }

    // public function scopeGetReports($query)
    // {
    //     return $query->with(array('versions'=>function($q){
    //         $q->orderBy('created_at', 'desc');
    //         $q->select('id','updated_at','created_at','app_id');
    //     }));
    // }




    // public function getHiddenXsAttribute()
    // {
    //     return ($this->device === 1 || $this->device === 2);  
    // }
    // public function getHiddenSmAttribute()
    // {
    //     return ($this->device === 1 || $this->device === 4);  
    // }
    // public function getHiddenMdAttribute()
    // {
    //     return ($this->device === 3 || $this->device === 4);  
    // }
    // public function getHiddenLgAttribute()
    // {
    //     return ($this->device === 3 || $this->device === 4);  
    // }
    // public function getCompositeLimitAttribute() {
    //     return (is_array($this->groups) && count($this->groups) > 0);
    // }
    // public function getVersionAttribute() {
    //     $myProjectVersion;
        
    //     if(is_null($this->project_version_id)){
    //         $myProjectVersion = ProjectVersion::where('project_id','=',$this->project_id)->orderBy('created_at', 'desc')->select('project_id','id','summary','description','code->resources as resources','code->forms as forms')->first();
    //     }else if($this->project_version_id == 0){
    //         $myProjectVersion = ProjectVersion::where('project_id','=',$this->project_id)->where('stable','=',1)->orderBy('created_at', 'desc')->select('project_id','created_at','summary','description', 'id','stable','code->resources as resources','code->forms as forms')->first();
    //     }else{
    //         $myProjectVersion = ProjectVersion::where('id','=',$this->project_version_id)->select('id','project_id','summary','description','code->resources as resources','code->forms as forms')->first();
    //     }

    //     if(isset($myProjectVersion->resources)){
    //         $myProjectVersion->resources = JSON_decode($myProjectVersion->resources);
    //     }
    //     if(isset($myProjectVersion->forms)){
    //         $myProjectVersion->forms = JSON_decode($myProjectVersion->forms);
    //         foreach($myProjectVersion->forms as $form){
    //             $form->content = JSON_decode($form->content);
    //         }
    //     }

    //     return $myProjectVersion;
    // }
    // public function findVersion() {
    //     // $myProjectVersion;
    //     // if(is_null($this->project_version_id)){
    //     //     $myProjectVersion = ProjectVersion::where('project_id','=',$this->project_id)->orderBy('created_at', 'desc')->first();
    //     // }else if($this->project_version_id == 0){
    //     //     $myProjectVersion = ProjectVersion::where('project_id','=',$this->project_id)->where('stable','=',1)->orderBy('created_at', 'desc')->first();
    //     // }else{
    //     //     $myProjectVersion = ProjectVersion::where('id','=',$this->project_version_id)->first();
    //     // }
    //     $myProjectVersion = ProjectVersion::where('id','=',$this->version['id'])->first();
        
    //     $this->project->code = $myProjectVersion->code;
    //     $this->project->version = $myProjectVersion->id;
    // }
}
