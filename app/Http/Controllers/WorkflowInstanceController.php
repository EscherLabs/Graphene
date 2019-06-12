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
use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
use App\Libraries\Templater;
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
            $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myWorkflow = WorkflowInstance::with('workflow')->where('group_id','=', $group)->where('slug', '=', $slug)->where('public','=',true)->first();
            if (is_null($myWorkflow)) { 
                $return = $this->customAuth->authenticate($request);
                if(isset($return)){
                    return $return;
                }
            }
            $links = Group::publicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        }

        $myWorkflow->findVersion();
        $scripts = [];
        $styles = [];
        if($myWorkflow != null) {
            $template = new Templater();
            return $template->render([
                'mygroups'=>$links,
                'name'=>$myWorkflow->name,
                'slug'=>$myWorkflow->slug,
                'id'=>$myWorkflow->id,
                'data'=>[],
                'config'=>json_decode('{"sections":[[],[{"title":"'.$myWorkflow->name.'","workflow_id":'.$myWorkflow->id.',"widgetType":"Workflow","container":true}],[]],"layout":0}'),
                'group'=>$groupObj,
                'scripts'=>$scripts,
                'styles'=>$styles,
                'template'=>$renderer,
                'apps'=>(Object)[],
                'resource'=>'flow'
            ]);

        }
        abort(404,'App not found');
    }

}