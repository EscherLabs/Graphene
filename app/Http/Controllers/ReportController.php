<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Group;
use App\Report;
use App\User;
use App\AppInstance;
// use App\Project;
use App\ProjectInstance;
use App\ReportVersion;
use App\ReportDevelopers;
use Illuminate\Http\Request;
use \Carbon\Carbon;
// use App\Libraries\Templater;
use App\WorkflowInstance;
use App\WorkflowSubmission;
use App\Libraries\PageRenderer;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
  public function __construct() {
    $this->menu = [[
        "name"=> "My Workflows",
        "slug"=> "workflow_dashboard",
        "type"=> "workflow",
        "url"=> "/workflows",
        "id"=>""
    ],[
        "name"=> "My Assignments",
        "slug"=> "workflow_assignments",
        "type"=> "workflow",
        "url"=> "/workflows/assignments",
        "id"=>"1"
    ],[
        "name"=> "My History",
        "slug"=> "workflow_history",
        "type"=> "workflow",
        "url"=> "/workflows/history",
        "id"=>"2"
    ]];
  }

  public function view(Request $request, ProjectInstance $pi, $report) {
    if (!Auth::check()) { /* User is not Authenticated */
      abort(403);
  }
  $renderer = new PageRenderer();
  // $group = 1;
  // $slug = "c";
  // $projectID = 1;


  $pi->load(['project'=>function($query){
    $query->with(['reports'=>function($q){
      $q->currentVersion();
    }]);
  }]);


$reportWidgets = [];
$reports = [];

foreach($pi->project->reports as $projectReport){
  $version = $projectReport->versions[0];
  $config = $version->config;
    $grouped = [];
    if($report == $projectReport->id){
      $group_by = "status";
      if($request->has('group_by')){
        $group_by = $request->get('group_by');
      }else{
        if(isset($config->resource->group_by)){
          $group_by = $config->resource->group_by;
        }
      }

      $query = DB::table('workflow_submissions')->where('status',"!=",'new')->where('workflow_instance_id','=',$config->resource->id);
      if($group_by == 'assignee'){

      $config->resource->group_by = 'assignment_id';
        $grouped  = $query->groupBy(['assignment_id','assignment_type'])->select('assignment_id','assignment_type', DB::raw('count(*) as total'))->get();

      }else{

        $config->resource->group_by = $group_by;
        $grouped  = $query->groupBy([$group_by])->select($group_by, DB::raw('count(*) as total'))->get();
      }
    }
  $reports[] = ["title"=>$projectReport->name];
  $reportWidgets[] = [ 
    "active"=>($report==$projectReport->id),
    "project_id"=>$pi->id,
    "title"=>$projectReport->name,
    "id"=>$projectReport->id,
    "version_id"=>$version->id,
    "config"=>$config,
    // "resource"=>$config->resource,
    "groupings"=>count($grouped)>1?$grouped:false,
    "widgetType"=>$config->display,
    "container"=>true
  ];

}


return view('project',[
  'project'=>['id'=>1,'name'=>"NewProj",'slug'=>"newproj"], 
  'id'=>$report, 
  // 'report'=>$pi->project->reports[0], 
  'resource'=>'report',
  'data'=>[
    'reports'=>$reportWidgets,
    // 'report_id'=>$report,
    'project'=>['id'=>1,'name'=>"NewProj",'slug'=>"newproj"], 
    'id'=>intval($report), 
    // 'report'=>$pi->project->reports[0], 
    // 'resource'=>'report',
    // 'apps'=>[],
    // 'forms'=>[],
    // 'resources'=>[],
  ]
]);

return $renderer->render([
  // 'group'=>$groupObj,
  'config'=>[
      "sections"=>[[[
        "title"=>$pi->name,
        "widgetType"=>"Menu",
        "reports"=>$reportWidgets,
        "titlebar"=>true,
        "container"=>true
    ]],$reportWidgets],
      "layout"=>'<div  data-cobler="container" class="h-full relative min-w-[20em] shrink-0 border rounded-sm"></div><div data-cobler="container" class="h-full relative flex-1 border rounded-sm"></div>',
  ],
  // 'uapp'=>$myApp,
  // 'scripts'=>$scripts,
  'template'=>'project/report',
  // 'styles'=>$styles,
  'id'=>$report,
  'resource'=>'project.report',
  'name'=>'Project Reports',
]);
  }

  public function admin(Report $report) {
    
    $report->load('versions');
    return response(view('adminVue',['project'=>['id'=>1,'name'=>"NewProj",'slug'=>"newproj"], 'id'=>$report->id, 'report'=>$report, 'resource'=>'reports']));

      return response(view('adminReport', ['report'=>ReportVersion::with('report')->where('report_id','=',$report->id)->orderBy('created_at', 'desc')->first()]))
      ->header('Content-Type', 'text/html')
      ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
      ->header('Expires', '0')
      ->header('Pragma', 'no-cache');
  }
  
  public function list_all_reports(Request $request) {
    return Report::get();
    if (Auth::user()->site_developer || Auth::user()->site_admin) {
        $reports = Report::with('user')->where('site_id',config('app.site')->id)->orderBy('name')->get();
    } else {
        $reports = Report::with('user')->where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_reports)->orderBy('name')->get();
    }
    return $reports;
  }

  public function create(Request $request) {
    $this->validate($request, ['name'=>['required']]);

    $data = $request->all();
    if(!$request->has('user_id') || $data['user_id'] == ""){
      $data['user_id'] = Auth::user()->id;
    }
    $report = new Report($data);
    $report->site_id = Auth::user()->site->id;
    $report->save();

    $report_version = new ReportVersion($data);
    $report_version->config = [];
    $report_version->report_id = $report->id;
    $report_version->save();
    return Report::with('user')->where('id',$report->id)->first();
  }

  public function update(Request $request, Report $report) {  
    $report->update($request->all());

    return $request->all();
    $report->save();
    return Report::with('user')->where('id',$report->id)->first();

  }

  public function destroy(Report $report) {
      if ($report->delete()) {
          return 1;
      }
  }

  private static function Flatten($fields, &$fieldlist, $path=[]){
    foreach($fields as $key=>$field){
      $pathArray = array_merge($path,[$field->name]);
      $keyPath = implode('.', $pathArray);
      $subFields = [];
      $field->ref = $keyPath;
      if(isset($field->fields)){
        $subFields = $field->fields;
        unset($field->fields);
      }

      $fieldlist[] = $field;
      if(count($subFields))ReportController::Flatten($subFields,$fieldlist,$pathArray);
    }
  }
  public function getFieldList(WorkflowInstance $workflow_instance, Request $request) {
    $workflow_instance->findVersion();
    $fields = [];
    ReportController::Flatten($workflow_instance->version->code->form->fields, $fields);
  
    return $fields;
  }
  static function parseParam($param, $target=[]){
    if(!empty($param)){
      $target=[[],[]];
      foreach ( explode(',', $param) as $item){
        $itemSplit = explode('!', $item);
        $index = count($itemSplit)-1;
        $target[$index][] = $itemSplit[$index];
      }
    }
    return $target;
  }

  public function paginate_workflow_submissions(WorkflowInstance $workflow_instance, Request $request) {


    if (!Auth::check()) { abort(403); }

    $status =$request->get('status');
    if(empty($status)){
      $status = "new";
    }

    $limit =$request->get('limit');
    if(empty($limit)){
      $request->get('per_page');
      if(empty($limit)){
        $limit = 10;
      }
    }

    $query = WorkflowSubmission::where('workflow_instance_id','=',$workflow_instance->id)
      ->hasState(ReportController::parseParam($request->get('state')))
      ->where('status', $request->has('status')?"=":"!=",$status);
   
      // $query->dataFilter($request->get('q'));
      $query->filter($request->get('q'));
      
    $search = $request->get('search');
    if(!empty($search)){
        $query->where(DB::raw('CONCAT(data, " ", state, "", title)'),'LIKE', "%$search%");
    }
    
      // $query->where('data','LIKE', "%$q%");
      // $query->whereJsonContains('data', $q);


    if($request->has('updated_at')){
      $dates = explode(',',$request->get('updated_at'));

      $dates[0] = (isset($dates[0]))?$dates[0]:null;
      $dates[1] = (isset($dates[1]))?$dates[1]:null;
      $query->updatedBetweenDates($dates);
    }

    if($request->has('created_at')){
      $dates = explode(',',$request->get('created_at'));

      $dates[0] = (isset($dates[0]))?$dates[0]:null;
      $dates[1] = (isset($dates[1]))?$dates[1]:null;
      $query->createdBetweenDates($dates);
    }

    $order = ReportController::parseParam($request->get('sort'),[[],['updated_at']]);
    foreach($order[0] as $asc){
      $query->orderBy($asc, 'asc');
    }
    foreach($order[1] as $desc){
      $query->orderBy($desc, 'desc');
    }


    $group_by = $request->get('group_by');
    if(!empty($group_by)){
      if($group_by == 'assignee'){
        $group_by = ['assignment_id','assignment_type'];
      }
      return DB::table('workflow_submissions')->where('workflow_instance_id','=',$workflow_instance->id)->groupBy($group_by)->select($group_by, DB::raw('count(*) as total'))->get();
    }

   $query->select('id','user_id','state','status','assignment_id','assignment_type','title','data','workflow_version_id','created_at','updated_at','opened_at')
    ->with('owner')
  
  
    ->with(['logs'=>function($q){

      // $q->with('user');
      $q->select('id','action','status','start_state','end_state','comment','user_id','created_at','workflow_submission_id','signature')->with("actor");
    }]);
    
    $submissions = ($limit !== false)?$query->paginate($limit)->onEachSide(2):$query->get();
   
    foreach($submissions as $submission) {  
      $submission->getAssignment();
      // $submission->logs();
      unset($submission->assignment_type); 
      unset($submission->assignment_id); 
      unset($submission->user_id); 
      unset($submission->workflow_version_id); 
      unset($submission->owner->id);

      foreach($submission['logs'] as $log) { 

        unset($log->user_id); 
        if(!is_null($log->actor)){
        unset($log->actor->id); 
        }
      }
    }
    return $submissions->withPath('');
  }
}
