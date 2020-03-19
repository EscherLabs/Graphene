<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Group;
use App\Workflow;
use App\User;
use App\WorkflowVersion;
use App\WorkflowDevelopers;
use Illuminate\Http\Request;
use \Carbon\Carbon;
use App\Libraries\Templater;
use App\Libraries\PageRenderer;

class WorkflowController extends Controller
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

    public function list_all_workflows(Request $request) {
        if (Auth::user()->site_developer || Auth::user()->site_admin) {
            $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->orderBy('name')->get();
        } else {
            $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_workflows)->orderBy('name')->get();
        }
        return $workflows;
    }
    public function list_user_workflows(Request $request) {
        return Workflow::where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_workflows)->orderBy('name')->get();
    }
    public function list_user_group_workflows(Request $request, $group_id) {
        return Workflow::whereHas('workflow_instances', function($query) use ($group_id) {
            $query->where('group_id','=',$group_id);
        })->orWhereIn('id',Auth::user()->developer_workflows)->orderBy('name')->get();
    }

    public function show(Workflow $workflow) {
        return WorkflowVersion::where('workflow_id','=',$workflow->id)->orderBy('created_at', 'desc')->first();
    }

    public function create(Request $request) {
        $this->validate($request,['name'=>['required']]);
        $workflow = new Workflow($request->all());
        $workflow->site_id = Auth::user()->site->id;
        $workflow->save();
        $workflow->add_developer(Auth::user(),true);
        $workflow_version = new WorkflowVersion($request->all());
        $workflow_version->code = [];
        $workflow_version->workflow_id = $workflow->id;
        $workflow_version->save();
        return $workflow;
    }

    public function code(Request $request, Workflow $workflow) { 
        $workflow_version = WorkflowVersion::where('workflow_id','=',$workflow->id)->orderBy('created_at', 'desc')->first();
        $post_data = $request->all();
        if(!isset($post_data['updated_at']) && !isset($post_data['force']) ){
            abort(403, $workflow_version);
        }

        $first = Carbon::parse($post_data['updated_at']);
        $second = Carbon::parse($workflow_version->updated_at);

        if(is_null($workflow_version) || $workflow_version->stable){
            $workflow_version = new WorkflowVersion();
            $workflow_version->workflow_id = $workflow->id;
        }else if(!($first->gte($second) || isset($post_data['force']))){
            abort(409, $workflow_version);
        }
        $code = $request->code;
        $code['form'] = json_decode($code['form']);
        $workflow_version->code = $code;

        $workflow_version->user_id = Auth::user()->id;
        $workflow_version->save();
        return $workflow_version;
    }
    public function publish(Request $request, Workflow $workflow) { 
        $workflow_version = WorkflowVersion::where('workflow_id','=',$workflow->id)->orderBy('created_at', 'desc')->where('stable','=',0)->first();
        if($workflow_version) {
            $workflow_version->summary = $request->summary;
            $workflow_version->description = $request->description;
            $workflow_version->stable = true;
            $workflow_version->user_id = Auth::user()->id;
            $workflow_version->save();
            return $workflow_version;
        }else{
            abort(409, 'No changes have been made since last published.<br><br> To publish please save changes.');
        }
    }

    public function versions(Request $request, Workflow $workflow) { 
        $workflow_versions = WorkflowVersion::select('id','summary','created_at','updated_at','user_id')
            ->with('user')->where('workflow_id','=',$workflow->id)->where('stable','=',1)
            ->orderBy('created_at', 'desc')->get();
        foreach($workflow_versions as $i => $workflow_version) {
            $last_name = ($workflow_version->toArray()['user']['last_name'] != '')?'('.$workflow_version->toArray()['user']['last_name'].')':'';
            $workflow_versions[$i]->label = $workflow_version->updated_at->format('Y-m-d').' - '.$workflow_version->summary.' '.$last_name;
        }
        return $workflow_versions;
    }

    public function version(Request $request, Workflow $workflow, WorkflowVersion $version) { 

        return $version;
    }
    public function update(Request $request, Workflow $workflow) {  
        $workflow->update($request->all());
        $workflow->save();
        return $workflow;
    }

    public function destroy(Workflow $workflow) {
        if ($workflow->delete()) {
            return 1;
        }
    }
    public function admin(Workflow $workflow) {
        return response(view('adminWorkflow', ['workflow'=>WorkflowVersion::with('workflow')->where('workflow_id','=',$workflow->id)->orderBy('created_at', 'desc')->first()]))
        ->header('Content-Type', 'text/html')
        ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
        ->header('Expires', '0')
        ->header('Pragma', 'no-cache');
    }
    public function list_developers(Workflow $workflow)
    {
        return User::select('id','unique_id','first_name','last_name','email')->whereHas('workflow_developers', function($query) use ($workflow) {
          $query->where('workflow_id','=',$workflow->id);
        })->whereHas('site_members', function($query) use ($workflow) {
            $query->where('site_id','=',config('app.site')->id);
        })->get();
    }
    public function list_all_developers()
    {
        return User::select('id','unique_id','first_name','last_name','email')
            ->has('workflow_developers')
            ->orWhereHas('site_members', function($query) {
                $query->where('site_developer','=',true);
            })
            ->whereHas('site_members', function($query) {
                $query->where('site_id','=',config('app.site')->id);
            })
            ->get();
    }
    public function add_developer(Workflow $workflow, User $user, Request $request)
    {
        if ($request->has('status')) {
            return $workflow->add_developer($user,$request->status);
        } else {
            return $workflow->add_developer($user);
        }
    }
    public function remove_developer(Workflow $workflow, User $user)
    {
        return $workflow->remove_developer($user);
    }

    public function summary(Request $request) {
        if (!Auth::check()) { /* User is not Authenticated */
            abort(403);
        }
        $renderer = new PageRenderer();
        return $renderer->render([
            'config'=>[
                "sections"=>[
                    [[
                        "title"=>"Workflows",
                        "widgetType"=>"WorkflowStatus",
                        "container"=>true
                    ]],[[
                        "title"=>"Available Workflows",
                        "widgetType"=>"Workflows",
                        "titlebar"=>true,
                        "container"=>true
                    ]]],
                "layout"=>'<div class="col-sm-9 cobler_container"></div><div class="col-sm-3 cobler_container"></div>'
            ],
            'resource'=>'workflow',
            'id'=>'',
            'name'=>'Workflow Dashboard',
            'menu' => $this->menu
        ]);        
    }


    public function assignments(Request $request) {
        if (!Auth::check()) { /* User is not Authenticated */
            abort(403);
        }
        $renderer = new PageRenderer();
        return $renderer->render([
            'config'=>[
                "sections"=>[
                    [[
                        "title"=>"Workflow Assignments",
                        "widgetType"=>"WorkflowAssignments",
                        "container"=>true
                    ]]],
                "layout"=>'<div class="col-sm-12 cobler_container"></div>'
            ],
            'resource'=>'workflow',
            'id'=>'1',
            'name'=>'Workflow Assignments',
            'menu' => $this->menu
        ]);        
    }

    public function history(Request $request) {
        if (!Auth::check()) { /* User is not Authenticated */
            abort(403);
        }
        $renderer = new PageRenderer();
        return $renderer->render([
            'config'=>[
                "sections"=>[
                    [[
                        "title"=>"Workflow History",
                        "widgetType"=>"WorkflowHistory",
                        "container"=>true
                    ]]],
                "layout"=>'<div class="col-sm-12 cobler_container"></div>'
            ],
            'resource'=>'workflow',
            'id'=>'2',
            'name'=>'Workflow History',
            'menu' => $this->menu
        ]);        
    }
}
