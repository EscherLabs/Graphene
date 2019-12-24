<?php

namespace App\Http\Controllers;

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

class WorkflowInstanceController extends Controller
{
    public function __construct() {
        // $this->middleware('auth')->except('run','fetch', 'get_data');

        $this->customAuth = new CustomAuth();
    }

    public function list_all_workflow_instances(Request $request) {
        if (Auth::user()->site_admin) {
            $workflow_instances = WorkflowInstance::select('id','workflow_id','group_id','workflow_version_id','name','slug','icon','order','device','unlisted','public')
                ->with('workflow')
                ->whereHas('group', function($q){
                    $q->where('site_id','=',config('app.site')->id);
                })->orderBy('group_id','order');
        } else {
            $workflow_instances = WorkflowInstance::select('id','workflow_id','group_id','workflow_version_id','name','slug','icon','order','device','unlisted','public')
                ->with('workflow')
                ->whereHas('group', function($q){
                    $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->apps_admin_groups);
                })->orderBy('group_id','order');
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
        $workflow_instance->load(array('group'=>function($query){}));
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
        $workflow_instance->save();
        return $workflow_instance;
    }

    public function update(Request $request, WorkflowInstance $workflow_instance) {
        $data = $request->all();
        if($request->workflow_version_id == -1 || $request->workflow_version_id == ''){$data['workflow_version_id'] = null;}

        if(isset($data['groups'])){
            $data['groups'] = json_decode($data['groups']);
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


        $current = WorkflowSubmission::where('user_id','=',$current_user->id)->where('workflow_instance_id','=',$myWorkflow->id)->where('status','=','new')->with('files')->first();
        if($myWorkflow != null) {
            $renderer = new PageRenderer();
            return $renderer->render([
                'group'=>$groupObj,
                'config'=>[
                    "sections"=>[[],
                        [[
                            "title"=>$myWorkflow->name,
                            "user"=>Auth::user(),
                            "current"=>$current,
                            "workflow"=>$myWorkflow,
                            "workflow_id"=>$myWorkflow->id,
                            "widgetType"=>"Workflow",
                            "container"=>true
                        ]],
                    []],
                    "layout"=>'<div class="col-lg-offset-2 col-md-offset-1 col-lg-8 col-md-10 col-sm-12 cobler_container"></div></div>'
                ],
                'id'=>$myWorkflow->id,
                'resource'=>'workflow',
                'name'=>$myWorkflow->name,
            ]);
        }
        abort(404,'Workflow not found');
    }

    public function report(WorkflowInstance $workflow_instance,Request $request) {


        return view('admin', ['resource'=>'workflow_instance_report','id'=>$workflow_instance->id, 'group'=>$workflow_instance->group]);



        // if (Auth::user()->site_developer || Auth::user()->site_admin) {
        //     $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->orderBy('name')->get();
        // } else {
        //     $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_workflows)->orderBy('name')->get();
        // }

        // if (Auth::check()) { /* User is Authenticated */
        //     $current_user = Auth::user();
        //     $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        // } else{
        //     abort(404); 
        // }

        // $template = new Templater();
        // return $template->render([
        //     'mygroups'=>$links,
        //     'name'=>'workflow',
        //     'slug'=>'workflow',
        //     'id'=>0,
        //     'data'=>[],
        //     'config'=>json_decode('{"sections":[[{"title":"Workflow Submissions","widgetType":"WorkflowReport","container":true,"titlebar":true,"options":{"id":'.$workflow_instance->id.'}}],[{"title":"Workflows","widgetType":"Workflows","titlebar":true,"container":true}]],"layout":"<div class=\"col-sm-9 cobler_container\"></div><div class=\"col-sm-3 cobler_container\"></div>"}'),
        //     // 'group'=>(Object)array("id"=>"0"),
        //     'scripts'=>[],
        //     'styles'=>[],
        //     'template'=>"main",
        //     'apps'=>(Object)[],
        //     'resource'=>'flow'
        // ]);
        // return $workflows;
    }

    private function flatten($arr,&$flat,$parent='') {
        if (is_string($arr) || is_bool($arr) || is_numeric($arr)) {
            return $arr;
        }
        if (is_array($arr)) {
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
        if (is_object($arr)) {
            foreach($arr as $key => $ar) {
                $children = $this->flatten($ar,$flat,$parent.$key.'.');
                if (!is_null($children)) {
                    $flat[$parent.$key] = $children;
                }
            }
            return null;
        }
    }    

    public function getcsv(WorkflowInstance $workflow_instance, Request $request) {
        $submissions = $workflow_instance->submissions()->with('user')->get();
        $all_submissions = [];
        $all_keys = [];
        $csv = '';
        foreach($submissions as $submission) {
            $flat = [];
            $this->flatten($submission->data,$flat);
            $data = array_merge($flat, [
                'status' => $submission->status,
                'state' => $submission->state,
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

    public function list_user_workflow_instance_submissions(WorkflowInstance $workflow_instance, Request $request, $status=null) {
        if (is_null($status)) {
            $submissions = WorkflowSubmission::where('user_id',Auth::user()->id)->get();
        } else {
            $submissions = WorkflowSubmission::where('user_id',Auth::user()->id)
                ->where('status',$status)->get();
        }
        return $submissions;
    }

}
