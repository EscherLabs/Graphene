<?php

namespace App\Http\Controllers;

use Gate;
use App\WorkflowInstance;
use App\Workflow;
use App\WorkflowVersion;
use App\WorkflowSubmission;
use App\WorkflowActivityLog;
use App\Endpoint;
use App\Group;
use App\UserPreference;
use App\User;
use App\Page;
use App\ResourceCache;
use App\UserOption;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
use App\Libraries\Templater;
use App\Libraries\PageRenderer;
use \Carbon\Carbon;
use App\Libraries\CustomAuth;
use App\Libraries\ResourceService;
use Illuminate\Support\Arr;

class WorkflowInstanceController extends Controller
{
    public function __construct() {
        // $this->middleware('auth')->except('run','fetch', 'get_data');
        $this->customAuth = new CustomAuth();
        $this->resourceService = new ResourceService($this->customAuth);
    }

    public function list_all_workflow_instances(Request $request) {
        if (Auth::user()->site_admin) {
            $workflow_instances = WorkflowInstance::select('id','workflow_id','group_id','workflow_version_id','name','slug','icon','order','device','unlisted','public','configuration')
                ->with(array('workflow','group'=>function($q){
                    $q->with('endpoints');
                }))
                ->whereHas('group', function($q){
                    $q->where('site_id','=',config('app.site')->id);
                })->orderBy('group_id','desc')->orderBy('order','desc');
        } else {
            $workflow_instances = WorkflowInstance::select('id','workflow_id','group_id','workflow_version_id','name','slug','icon','order','device','unlisted','public','configuration')
                ->with(array('workflow','group'=>function($q){
                    $q->with('endpoints');
                }))
                ->whereHas('group', function($q){
                    $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->apps_admin_groups);
                })->orderBy('group_id','desc')->orderBy('order','desc');
            }
        if($request->has('workflow_id')){
            $workflow_instances->where('workflow_id','=',$request->get('workflow_id'));
        }
        return $workflow_instances->get();
    }

    public function list_user_workflow_instances($group_id = null,Request $request) {
        if (!Auth::check()) {
            abort(403); // You must be authenticated to fetch links
        }
        if (!is_null($group_id)) {
            $composite_groups = GroupComposite::where('group_id','=',$group_id)->pluck('composite_group_id')->toArray();
            $common_groups = array_values(array_intersect(array_merge([$group_id],$composite_groups),Auth::user()->groups));
            $workflows = WorkflowInstance::whereIn('group_id',$common_groups)->orderBy('name')->get();
        } else {
            $workflows = WorkflowInstance::whereIn('group_id',Auth::user()->groups)->orderBy('name')->get();
        }
        return $workflows;

    }
    
    public function admin(WorkflowInstance $workflow_instance) {
        $workflow_instance->load(array('group'=>function($query){
            $query->with(array('composites'=>function($query){
                $query->with('group')->get();
            }));
        }));
        return view('admin', ['resource'=>'workflow_instance','id'=>$workflow_instance->id, 'group'=>$workflow_instance->group]);
    }

    public function show(WorkflowInstance $workflow_instance) {

        $myWorkflow = WorkflowInstance::with('workflow')->with('group')->where('id', '=', $workflow_instance->id)->first();

        $myWorkflow->findVersion();
        return $myWorkflow;
    }
	public function pages(WorkflowInstance $workflow_instance)
	{
        $pages = Page::with('group')->where('group_id', '=',  $workflow_instance->group_id)->get();
		$page_list = [];
		foreach($pages as $page){
            $sections = $page->content;
            if(isset($sections)){
                foreach($sections->sections as $section){
                    foreach($section as $widget){
                        if($widget->widgetType === 'workflow'){
                            if(isset($widget->workflow_id) && $widget->workflow_id == $workflow_instance->id){
                                unset($page->content);
                                $page_list[] = $page;
                                break 2;
                            }
                        }
                    }
                }
            }
		}
		return $page_list;
	}

    public function create(Request $request) {
        $this->validate($request,['name'=>['required']]);
        $workflow_instance = new WorkflowInstance($request->all());
        $workflow_instance->workflow_version_id = null;
        $workflow_instance->workflow_id = $request->get('workflow_id');
        $workflow_instance->group_id = $request->get('group_id');
        if(isset($request['groups'])){
            $workflow_instance['groups'] = array_filter($request['groups']);
        }
        $workflow_instance->save();
        return $workflow_instance;
    }

    public function update(Request $request, WorkflowInstance $workflow_instance) {
        $data = $request->all();
        if(isset($data['groups'])){
            $data['groups'] = array_filter($data['groups']);
        }

        $workflow_instance->update($data);
        return WorkflowInstance::where('id', '=',$workflow_instance->id)->first();
    }

    public function destroy(WorkflowInstance $workflow_instance){
        if ($workflow_instance->delete()) {
            return 1;
        }
    }

    public function run($group, $slug = null, Request $request) {
        return $this->render("main", $group, $slug, $request);
    }

    public function render($renderer = "main", $group, $slug, Request $request) {
        if(!is_numeric($group)) {
            $groupObj = Group::with('composites')->where('slug','=',$group)->first();
			$group = $groupObj->id;
		}else{
    		$groupObj = Group::with('composites')->where('id','=',$group)->first();
        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $myWorkflow = WorkflowInstance::with('workflow')
                ->where('group_id','=', $group)->where('slug', '=', $slug)->with('workflow')->first();

            if (is_null($myWorkflow)) { 
                abort(404); 
            }
            
            if($myWorkflow->public == 0) {
                $this->authorize('fetch' ,$myWorkflow);
            }
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myWorkflow = WorkflowInstance::with('workflow')->where('group_id','=', $group)->where('slug', '=', $slug)->where('public','=',true)->first();
            if (is_null($myWorkflow)) { 
                $return = $this->customAuth->authenticate($request);
                if(isset($return)){
                    return $return;
                }
            }
        }

        $myWorkflow->findVersion();

        $current = WorkflowSubmission::where('user_id','=',$current_user->id)->where('workflow_instance_id','=',$myWorkflow->id)->where('status','=','new')->with('files')->orderBy('updated_at','desc')->first();
        if($request->has('saved')){
            $current = WorkflowSubmission::where('user_id','=',$current_user->id)->where('workflow_instance_id','=',$myWorkflow->id)->where('status','new')->where('id','=',$request->get('saved'))->with('files')->first();
        }

        $saved = WorkflowSubmission::where('user_id','=',$current_user->id)->where('workflow_instance_id','=',$myWorkflow->id)->where('status','new')->orderBy('updated_at', 'desc')->get();
        if($myWorkflow != null) {
            $renderer = new PageRenderer();
            return $renderer->render([
                'group'=>$groupObj,
                'config'=>[
                    "sections"=>[
                        [[
                            "title"=>$myWorkflow->name,
                            "user"=>Auth::user(),
                            "submission"=>$current,
                            "all"=>$saved,
                            "workflow"=>$myWorkflow,
                            "instance_id"=>$myWorkflow->id,
                            "widgetType"=>"Workflow",
                            "resources"=>$this->fetch($myWorkflow,$request,$current),
                            "container"=>true
                        ]],
                    [[
                        "title"=>$myWorkflow->name,
                        "user"=>Auth::user(),
                        "submission"=>$current,
                        "all"=>$saved,
                        "workflow"=>$myWorkflow,
                        "instance_id"=>$myWorkflow->id,
                        "widgetType"=>"WorkflowSummary",
                        "resources"=>$this->fetch($myWorkflow,$request,$current),
                        "container"=>true
                    ]]],
                    "layout"=>'<div class="col-lg-offset-2 col-lg-6 col-md-12 col-sm-12 cobler_container"></div><div class="col-lg-2 col-md-12 col-sm-12 cobler_container workflow_sidebar" style="position:sticky"></div></div>'
                ],
                'id'=>$myWorkflow->id,
                'resource'=>'workflow',
                'name'=>$myWorkflow->name,
            ]);
        }
        abort(404,'Workflow not found');
    }
    public function context(WorkflowSubmission $workflow_submission, Request $request) {
        $myWorkflow = WorkflowInstance::with('workflow')->find($workflow_submission->workflow_instance_id);
        if($myWorkflow != null) {
            $myWorkflow->findVersion();
            $workflow_submission->load('files');
            return [
                "title"=>$myWorkflow->name,
                "submission"=>$workflow_submission,
                "workflow"=>$myWorkflow,
                "instance_id"=>$myWorkflow->id,
                "resources"=>$this->fetch($myWorkflow, $request, $workflow_submission),
            ];
        }
        abort(404,'Workflow not found');
    }
    public function report(WorkflowInstance $workflow_instance,Request $request) {
        return view('admin', ['resource'=>'workflow_instance_report','id'=>$workflow_instance->id, 'group'=>$workflow_instance->group]);
    }
    public function raw(WorkflowInstance $workflow_instance,Request $request) {
        return view('admin', ['resource'=>'workflow_instance_raw_data','id'=>$workflow_instance->id, 'group'=>$workflow_instance->group]);
    }

    private function is_assoc_arr($arr) {
        return (is_array($arr) && count(array_filter(array_keys($arr), 'is_string')) > 0);
    }

    private function flatten($arr,&$flat,$parent='') {
        if (is_string($arr) || is_bool($arr) || is_numeric($arr)) {
            return $arr;
        }
        if (is_array($arr) && !$this->is_assoc_arr($arr)) {
            $cat = [];
            foreach($arr as $elem) {
                if (is_string($elem) || is_bool($elem) || is_numeric($elem)) {
                    $cat[] = $elem;
                } else {
                    return 'Unsupported Form Type';
                }
            }
            return '"'.implode('", "',$cat).'"';
        }
        if (is_object($arr) || $this->is_assoc_arr($arr)) {
            foreach($arr as $key => $ar) {
                $children = $this->flatten($ar,$flat,$parent.$key.'_');
                if (!is_null($children)) {
                    $flat[$parent.$key] = $children;
                }
            }
            return null;
        }
    }
    public function getcsv(WorkflowInstance $workflow_instance, Request $request) {
        $submissions = WorkflowSubmission::with('workflowVersion')
            ->with('user')
            ->where('workflow_instance_id','=',$workflow_instance->id)
            ->where('status',"!=",'new')
            ->orderBy('created_at')->get();
        $all_submissions = [];
        $all_keys = [];
        $csv = '';
        foreach($submissions as $submission) {
            $flat = [];
            $this->flatten($submission->data,$flat);
            $data = array_merge($flat, [
                'status' => $submission->status,
                'state' => $submission->state,
                'unique_id' => $submission->user->unique_id,
                'first_name' => $submission->user->first_name,
                'last_name' => $submission->user->last_name,
                'email' => $submission->user->email,
                'created_at' => $submission->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $submission->updated_at->format('Y-m-d H:i:s'),
                'report_url' => '=HYPERLINK("'.URL::to('/workflows/report/'.$submission->id).'","Open Report")'
            ]);
            $all_keys = array_unique(array_merge($all_keys,array_keys($data)),SORT_REGULAR);
            $all_submissions[] = $data;
        }
        $csv .= '"'.implode('","',$all_keys).'"'."\n";
        foreach($all_submissions as $submission) {
            $row = [];
            foreach($all_keys as $key) {
                if (isset($submission[$key])) {
                    $row[] = str_replace('"','""',$submission[$key]);
                } else {
                    $row[] = '';
                }
            }
            $csv .= '"'.implode('","',$row).'"'."\n";
        }
        return response($csv,200)->header('Content-Type','text/csv')
            ->header('Content-Disposition','attachment; filename="'.$workflow_instance->name.'_workflow.csv"');
    }

    public function getraw(WorkflowInstance $workflow_instance, Request $request) {
        $all_fields = [
            ["type"=>"hidden","name"=>"_w_id",],
            ["type"=>"select","name"=>"_w_status","label"=>"Status","options"=>["open",'closed']],
            ["type"=>"select","name"=>"_w_state","label"=>"State","options"=>Arr::pluck($workflow_instance->version->code->flow,'name')],
            ["type"=>"text","name"=>"_w_unique_id","label"=>"Unique ID",],
            ["type"=>"text","name"=>"_w_submitter","label"=>"Submitter",],
            ["type"=>"text","name"=>"_w_email","label"=>"Email",],
            ["type"=>"text","name"=>"_w_created_at","label"=>"Created"],
            ["type"=>"text","name"=>"_w_updated_at","label"=>"Updated"],
        ];
        $submissions = WorkflowSubmission::with('workflowVersion')
            ->with('user')
            ->where('workflow_instance_id','=',$workflow_instance->id)
            ->where('status',"!=",'new')
            ->orderBy('created_at')->get();
        $all_submissions = [];
        $all_keys = [];
        foreach($submissions as $submission) {
            $flat = [];
            $this->flatten($submission->data,$flat);
            $workflow_metadata = [
                '_w_id' => $submission->id,
                '_w_status' => $submission->status,
                '_w_state' => $submission->state,
                '_w_unique_id' => $submission->user->unique_id,
                '_w_submitter' => $submission->user->first_name.' '.$submission->user->last_name,
                '_w_email' => $submission->user->email,
                '_w_created_at' => $submission->created_at->format('Y-m-d H:i:s'),
                '_w_updated_at' => $submission->updated_at->format('Y-m-d H:i:s'),
            ];
            $data = array_merge($flat,$workflow_metadata);
            $all_keys = array_unique(array_merge($all_keys,array_keys($flat)),SORT_REGULAR);
            $all_submissions[] = $data;
        }
        foreach($all_keys as $key) {
            $all_fields[] = ["type"=>"text","name"=>$key,"label"=>$key];
        }
        return ['data'=>$all_submissions,'schema'=>$all_fields];
    }

    public function list_user_workflow_instance_submissions(WorkflowInstance $workflow_instance, Request $request, $status=null) {
        if (is_null($status)) {
            $submissions = WorkflowSubmission::where('user_id',Auth::user()->id)->get();
        } else {
            $submissions = WorkflowSubmission::where('user_id',Auth::user()->id)
                ->where('status',$status)->get();
        }
        return $submissions;
    }



    /* ----- section Borrowed from AppInstance  - refactor to use common code ----- */


    public function fetch(WorkflowInstance $workflow_instance,Request $request,WorkflowSubmission $workflow_submission=null) {
        // dd($workflow_instance);

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            if (is_null($workflow_submission)) {
                // Make sure that the person can fetch the current instance (submission is null)
                $this->authorize('fetch' ,$workflow_instance);
            } else {
                // Make sure that the person can view the requested submission
                if (Gate::denies('view', $workflow_submission)) {
                    abort(403);
                }
            }
        } else { /* User is not Authenticated */
            $current_user = new User;
            if (is_null($workflow_instance)) { abort(403); }
        }

        // Public Workflows May not work correctly?  Need to reinvestigate this.
        // Removing for now.
        // if (!$workflow_instance->public) {
        //     $this->authorize('get_data', $workflow_instance);
        // }

        return $this->resourceService->fetch($workflow_instance, $workflow_submission, $request->all());
    }

    public function get_data(WorkflowInstance $workflow_instance,  $endpoint_name,Request $request, WorkflowSubmission $workflow_submission=null) {

        if (!$workflow_instance->public) {
            $this->authorize('get_data', $workflow_instance);
        }
        $data = $this->resourceService->get_data_int($workflow_instance,$workflow_submission , $endpoint_name, $request->all());

        // $data = self::get_data_int($workflow_instance, $endpoint_name, $request);

        if (is_array($data['content']) || is_object($data['content'])) {
            $content_type = 'application/json';
            $data['content'] = json_encode($data['content']);
        } else if (is_bool($data['content']) || is_numeric($data['content'])) {
            $content_type = 'application/json';
            $data['content'] = (string)$data['content'];
        } else {
            $content_type = 'text/plain';
        }
        return response($data['content'], $data['code'])->header('Content-Type', $content_type);
    }

    /* ----- End section from AppInstance ----- */




}
