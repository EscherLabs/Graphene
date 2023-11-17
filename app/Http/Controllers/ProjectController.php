<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Group;
use App\Project;
use App\User;
// use App\ProjectVersion;
// use App\ProjectDevelopers;
use Illuminate\Http\Request;
use \Carbon\Carbon;
// use App\Libraries\Templater;
use App\Libraries\PageRenderer;

class ProjectController extends Controller
{
  public function admin(Project $project, $report=null) {
    
    $project->load(['reports'=>function($q){
      $q->currentVersion();
    }]);
    foreach($project->reports as $key=>$projectReport){

      $project->reports[$key]->config = $projectReport->versions[0]->config;
      $project->reports[$key]->version_id = $projectReport->versions[0]->id;
      $project->reports[$key]->title = $projectReport->name;

      // dd($project->reports[$key]);
      unset($projectReport->versions);
      unset($projectReport->pivot);
    }

    // return $project;
    return response(view('adminVue',['data'=>$project, 'id'=>$project->id, 'project'=>$project, 'resource'=>'Project']));

  }
  public function view(Request $request, $project) {
    return $project;
  }
  public function list_all_projects(Request $request) {
    return Project::get();
    if (Auth::user()->site_developer || Auth::user()->site_admin) {
        $projects = Project::with('user')->where('site_id',config('app.site')->id)->orderBy('name')->get();
    } else {
        $projects = Project::with('user')->where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_projects)->orderBy('name')->get();
    }
    return $projects;
  }

  public function create(Request $request) {
    // return $request;
    $this->validate($request, ['name'=>['required']]);

    $data = $request->all();
    if(!$request->has('user_id') || $data['user_id'] == ""){
      $data['user_id'] = Auth::user()->id;
    }
    $project = new Project($data);
    $project->site_id = Auth::user()->site->id;
    $project->save();

    // $project->add_developer(Auth::user(), true);
    $project_version = new ProjectVersion($data);
    $project_version->config = [];
    $project_version->project_id = $project->id;
    $project_version->save();
    return Project::with('user')->where('id',$project->id)->first();
  }

  public function update(Request $request, Project $project) {  
    $project->update($request->all());
    $project->save();
    return Project::with('user')->where('id',$project->id)->first();

  }

  public function destroy(Project $project) {
      if ($project->delete()) {
          return 1;
      }
  }



    // public function list_user_projects(Request $request) {
    //     return Project::where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_projects)->orderBy('name')->get();
    // }
    // public function list_user_group_projects(Request $request, $group_id) {
    //     return Project::whereHas('project_instances', function($query) use ($group_id) {
    //         $query->where('group_id','=',$group_id);
    //     })->orWhereIn('id',Auth::user()->developer_projects)->orderBy('name')->get();
    // }

    // public function show(Project $project) {
    //     return ProjectVersion::where('project_id','=',$project->id)->orderBy('created_at', 'desc')->first();
    // }

 

    // public function code(Request $request, Project $project) { 
    //     $project_version = ProjectVersion::where('project_id','=',$project->id)->orderBy('created_at', 'desc')->first();
    //     $post_data = $request->all();
    //     if(!isset($post_data['updated_at']) && !isset($post_data['force']) ){
    //         abort(403, $project_version);
    //     }

    //     $first = Carbon::parse($post_data['updated_at']);
    //     $second = Carbon::parse($project_version->updated_at);

    //     if(is_null($project_version) || $project_version->stable){
    //         $project_version = new ProjectVersion();
    //         $project_version->project_id = $project->id;
    //     }else if(!($first->gte($second) || isset($post_data['force']))){
    //         abort(409, $project_version);
    //     }
    //     $code = $request->code;
    //     $code['form'] = json_decode($code['form']);
    //     $project_version->code = $code;

    //     $project_version->user_id = Auth::user()->id;
    //     $project_version->save();
    //     return $project_version;
    // }
    // public function publish(Request $request, Project $project) { 
    //     $project_version = ProjectVersion::where('project_id','=',$project->id)->orderBy('created_at', 'desc')->where('stable','=',0)->first();
    //     if($project_version) {
    //         $project_version->summary = $request->summary;
    //         $project_version->description = $request->description;
    //         $project_version->stable = true;
    //         $project_version->user_id = Auth::user()->id;
    //         $project_version->save();
    //         return $project_version;
    //     }else{
    //         abort(409, 'No changes have been made since last published.<br><br> To publish please save changes.');
    //     }
    // }

    // public function versions(Request $request, Project $project) { 
    //     $project_versions = ProjectVersion::select('id','summary','created_at','updated_at','user_id')
    //         ->with('user')->where('project_id','=',$project->id)->where('stable','=',1)
    //         ->orderBy('created_at', 'desc')->get();
    //     // foreach($project_versions as $i => $project_version) {
    //     //     $last_name = !is_null($project_version->toArray()['user'])?'('.$project_version->toArray()['user']['last_name'].')':'';
    //     //     $project_versions[$i]->label = $project_version->updated_at->format('Y-m-d').' - '.$project_version->summary.' '.$last_name;
    //     // }
    //     return $project_versions;
    // }

    // public function version(Request $request, Project $project, ProjectVersion $version) { 

    //     return $version;
    // }


    // public function list_developers(Project $project)
    // {
    //     return User::select('id','unique_id','first_name','last_name','email')->whereHas('project_developers', function($query) use ($project) {
    //       $query->where('project_id','=',$project->id);
    //     })->whereHas('site_members', function($query) use ($project) {
    //         $query->where('site_id','=',config('app.site')->id);
    //     })->get();
    // }
    // public function list_all_developers()
    // {
    //     return User::select('id','unique_id','first_name','last_name','email')
    //         ->has('project_developers')
    //         ->orWhereHas('site_members', function($query) {
    //             $query->where('site_developer','=',true);
    //         })
    //         ->whereHas('site_members', function($query) {
    //             $query->where('site_id','=',config('app.site')->id);
    //         })
    //         ->get();
    // }
    // public function add_developer(Project $project, User $user, Request $request)
    // {
    //     if ($request->has('status')) {
    //         return $project->add_developer($user,$request->status);
    //     } else {
    //         return $project->add_developer($user);
    //     }
    // }
    // public function remove_developer(Project $project, User $user)
    // {
    //     return $project->remove_developer($user);
    // }

    // public function summary(Request $request) {
    //     if (!Auth::check()) { /* User is not Authenticated */
    //         abort(403);
    //     }
    //     $renderer = new PageRenderer();
    //     return $renderer->render([
    //         'config'=>[
    //             "sections"=>[
    //                 [[
    //                     "title"=>"Projects",
    //                     "widgetType"=>"ProjectStatus",
    //                     "container"=>true
    //                 ]],[[
    //                     "title"=>"Available Projects",
    //                     "widgetType"=>"Projects",
    //                     "titlebar"=>true,
    //                     "container"=>true
    //                 ]]],
    //             "layout"=>'<div class="col-sm-9 cobler_container"></div><div class="col-sm-3 cobler_container"></div>'
    //         ],
    //         'resource'=>'project',
    //         'id'=>'',
    //         'name'=>'Project Dashboard',
    //         'menu' => $this->menu
    //     ]);        
    // }


    // public function assignments(Request $request) {
    //     if (!Auth::check()) { /* User is not Authenticated */
    //         abort(403);
    //     }
    //     $renderer = new PageRenderer();
    //     return $renderer->render([
    //         'config'=>[
    //             "sections"=>[
    //                 [[
    //                     "title"=>"Project Assignments",
    //                     "widgetType"=>"ProjectAssignments",
    //                     "container"=>true
    //                 ]]],
    //             "layout"=>'<div class="col-sm-12 cobler_container"></div>'
    //         ],
    //         'resource'=>'project',
    //         'id'=>'1',
    //         'name'=>'Project Assignments',
    //         'menu' => $this->menu
    //     ]);        
    // }

    // public function history(Request $request) {
    //     if (!Auth::check()) { /* User is not Authenticated */
    //         abort(403);
    //     }
    //     $renderer = new PageRenderer();
    //     return $renderer->render([
    //         'config'=>[
    //             "sections"=>[
    //                 [[
    //                     "title"=>"Project History",
    //                     "widgetType"=>"ProjectHistory",
    //                     "container"=>true
    //                 ]]],
    //             "layout"=>'<div class="col-sm-12 cobler_container"></div>'
    //         ],
    //         'resource'=>'project',
    //         'id'=>'2',
    //         'name'=>'Project History',
    //         'menu' => $this->menu
    //     ]);        
    // }
}
