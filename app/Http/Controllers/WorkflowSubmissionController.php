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
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
use App\Libraries\Templater;
use \Carbon\Carbon;
use App\Libraries\CustomAuth;
use \Ds\Vector;

class WorkflowSubmissionController extends Controller
{
    public function __construct() {
        // $this->middleware('auth')->except('run','fetch', 'get_data');

        $this->customAuth = new CustomAuth();
    }

    public function create($group, $workflow_id = null, Request $request) {
        if(!is_numeric($group)) {
            $groupObj = Group::with('composites')->where('slug','=',$group)->where('site_id',config('app.site')->id)->first();
			$group = $groupObj->id;
		}else{
    		$groupObj = Group::with('composites')->where('id','=',$group)->where('site_id',config('app.site')->id)->first();
        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();

            $myWorkflowInstance = WorkflowInstance::with('workflow')
                ->where('group_id','=', $group)->where('id', '=', $workflow_id)->with('workflow')->first();

            if (is_null($myWorkflowInstance)) { 
                abort(404); 
            }
            
            if($myWorkflowInstance->public == 0) {
                $this->authorize('fetch' ,$myWorkflowInstance);
            }
            $links = Group::AppsPages()->where('unlisted','=',0)->where('site_id',config('app.site')->id)->orderBy('order')->get();
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myWorkflowInstance = WorkflowInstance::with('workflow')->where('group_id','=', $group)->where('id', '=', $workflow_id)->where('public','=',true)->first();
            if (is_null($myWorkflowInstance)) { 
                $return = $this->customAuth->authenticate($request);
                if(isset($return)){
                    return $return;
                }
            }
            $links = Group::publicAppsPages()->where('unlisted','=',0)->where('site_id',config('app.site')->id)->orderBy('order')->get();
        }

        if($myWorkflowInstance != null) {
            $myWorkflowInstance->findVersion();

            $workflow_submission = new WorkflowSubmission();
            $workflow_submission->workflow_id = $myWorkflowInstance->workflow_id;
            $workflow_submission->workflow_instance_id = $myWorkflowInstance->id;
            $workflow_submission->workflow_version_id = $myWorkflowInstance->version->id;
            $workflow_submission->workflow_instance_configuration = $myWorkflowInstance->configuration;
            $workflow_submission->data = array();
            $workflow_submission->state = $myWorkflowInstance->configuration->initial;
            $workflow_submission->user_id = $current_user->id;
            
            $workflow_submission->save();
            return $this->action($workflow_submission, $request);
        }
        abort(404,'Workflow not found');
    }

    public function action(WorkflowSubmission $workflow_submission, Request $request) {
        $m = new \Mustache_Engine;

        $myWorkflowInstance = WorkflowInstance::with('workflow')->where('id', '=', $workflow_submission->workflow_id)->first();
        $myWorkflowInstance->findVersion();

        $start_state = $workflow_submission->state;

        $flow = json_decode($myWorkflowInstance->version->code->flow);
        $oldstate = null;
        foreach($flow  as $struct) {
            if ($workflow_submission->state == $struct->name) {
                $oldstate = $struct;
                break;
            }
        }
        if(isset($oldstate->onExit)){
            $this->executeTasks($oldstate->onExit, $workflow_submission->data);
        }

        $workflow_submission->data = (object) array_merge((array) $workflow_submission->data, (array) $request->get('_state'));
        
        $owner = User::find($workflow_submission->user_id);

        $state_data = [];
        $state_data['is'] = $state_data['was'] = [];
        $state_data['form'] = $workflow_submission->data;
        $state_data['report_url'] = URL::to('/workflows/report/'.$workflow_submission->id);
        $state_data['actor'] = Auth::user()->only('first_name','last_name','email','unique_id','params');
        $state_data['owner'] = $owner->only('first_name','last_name','email','unique_id','params');
        $state_data['owner']['is'] = [];
        $state_data['owner']['is']['actor'] = ($owner->id === Auth::user()->id);
        $state_data['action'] = $request->get('action');
        $state_data['workflow'] = $myWorkflowInstance->workflow->only('name','description');
        $state_data['workflow']['instance'] = $myWorkflowInstance->only('group_id','slug','name','icon','public','configuration');
        $state_data['workflow']['version'] = $myWorkflowInstance->version->only('id','summary','description','stable');
        $state_data['comment'] = ($request->has('comment'))?$request->get('comment'):null;
        $state_data['previous_status'] = $workflow_submission->status;
        $state_data['previous_state'] = $oldstate->name;
        $state_data['was']['open'] = ($state_data['previous_status']=='open')?true:false;
        $state_data['was']['closed'] = ($state_data['previous_status']=='closed')?true:false;
        $state_data['was']['initial'] = ($myWorkflowInstance->configuration->initial == $state_data['previous_state']);
        // $state_data['config'] = [];
        $state_data['assignment'] = [];

        // foreach($myWorkflowInstance->configuration->resources as $resource){
        //     // switch($resource->type)
        //     $state_data['config']{$resource->name} = $resource->value;
        // }

        $state = null;

        foreach($oldstate->actions as $action){
            if($action->name == $request->get('action')){
                $workflow_submission->state = $action->to;
                if(isset($action->tasks)){
                    $this->executeTasks($action->tasks, $state_data);
                }
                
                foreach($flow  as $struct) {
                    if ($workflow_submission->state == $struct->name) {
                        $state = $struct;
                        break;
                    }
                }
    
                if(isset($state->status)){
                    $workflow_submission->status = $state->status;
                }else{
                    $workflow_submission->status = 'open';
                }
            }
        }

        $state_data['status'] = $workflow_submission->status;
        $state_data['state'] = $state->name;
        $state_data['actions'] = array_map(function ($ar) {
            return array_only((array)$ar,['label','name','type']);
        }, $state->actions);
        $state_data['is']['actionable'] = (count($state_data['actions'])>0);
        $state_data['is']['open'] = ($state_data['status']=='open')?true:false;
        $state_data['is']['closed'] = ($state_data['status']=='closed')?true:false;
        $state_data['is']['initial'] = ($myWorkflowInstance->configuration->initial == $state_data['state']);

        // if url is defined on assignment get data and add it to the $state_data['assignment']
        if(isset($workflow_submission->assignment->url)){
            $assignment_data;
            if(!isset($workflow_submission->assignment->data)){
                $assignment_data = array();
            }else{
                foreach($workflow_submission->assignment->data as $key=>$value){
                    $assignment_data->{$key} = $m->render($value, $state_data);
                }
            }
            $httpHelper = new HTTPHelper();
            if(isset($workflow_submission->assignment->endpoint)){
                $endpoint = Endpoint::find((int)$workflow_submission->assignment->endpoint);
                $url = $m->render($endpoint->config->url . $workflow_submission->assignment->url, $state_data);
                if ($endpoint->type == 'http_no_auth') {
                    $state_data['assignment']['data'] = $httpHelper->http_fetch( $url,"GET",$assignment_data);
                } else if ($endpoint->type == 'http_basic_auth') {
                    $state_data['assignment']['data'] = $httpHelper->http_fetch($url,"GET",$assignment_data,$endpoint->config->username, $endpoint->getSecret());
                } else {
                    abort(505,'Authentication Type Not Supported');
                }
            } else {
                $state_data['assignment']['data'] = $httpHelper->http_fetch($m->render($workflow_submission->assignment->url, $state_data),"GET", $assignment_data);
            }
        }

        $state_data['assignment']['type'] = $workflow_submission->assignment_type = $m->render($state->assignment->type, $state_data);
        $state_data['assignment']['id'] = $m->render($state->assignment->id, $state_data);

        if($state->assignment->type == "user"){
            $user = User::where("unique_id", '=', $state_data['assignment']['id'])->first();
            if($user !== null) {
                $workflow_submission->assignment_id = $user->id;
            }else{
                $user = User::where("id",'=',$state_data['assignment']['id'])->first();
                $workflow_submission->assignment_id = $user->id;
                if($user === null) {
                    throw new \Exception('Assigned User Does Not Exist');
                }
            }
            $state_data['assignment']['user'] = $user->only('first_name','last_name','email','unique_id','params');
        }else{
            $group = Group::where("id",'=',$state_data['assignment']['id'])->where('site_id',config('app.site')->id)->first();
            if($group !== null) {
                $workflow_submission->assignment_id = $group->id;
            }else{
                $group = Group::where("slug",'=',$state_data['assignment']['id'])->where('site_id',config('app.site')->id)->first();
                $workflow_submission->assignment_id = $group->id;
                if($group === null) {
                    throw new \Exception('Assigned Group Does Not Exist');
                }
            }
            $state_data['assignment']['group'] = $group->only('name','slug','id');
            $state_data['assignment']['group']['members'] = $group->members()->with('bulkuser')->get()->pluck('bulkuser')->toArray();
        }

        if(isset($state->onEnter)){
            $this->executeTasks($state->onEnter, $workflow_submission->data);
        }

        $workflow_submission->update();
        
        $this->logAction($workflow_submission,$start_state,$state_data['action'],$request->get('comment'));

        $this->send_default_emails($state_data);

        return WorkflowSubmission::with('workflowVersion')->with('workflow')->where('id', '=', $workflow_submission->id)->first();
    }

    private function logAction($workflow_submission, $start_state, $action, $comment){
        $activity = new WorkflowActivityLog();
        $activity->start_state = $start_state;

        // $activity->workflow_id = $workflow_submission->workflow_id;
        $activity->workflow_instance_id = $workflow_submission->workflow_instance_id;
        $activity->workflow_submission_id = $workflow_submission->id;
        $activity->data =  $workflow_submission->data;
        $activity->end_state = $workflow_submission->state;
        $activity->status = $workflow_submission->status;
        $activity->user_id = Auth::user()->id;
        $activity->comment = $comment;
        $activity->action = $action;
        $activity->save();
    }



    private function executeTasks($tasks, $data){
        $m = new \Mustache_Engine;

        foreach($tasks as $task){
            if(!isset($task->data)){
                $task->data = array();
            }else{
                foreach($task->data as $key=>$value){
                    $task->data->{$key} = $m->render($value, $data);
                }
            }
            switch($task->task) {
                case "email":
                    $content = "Workflow task taken";
                    if($task->content){
                        $content = $m->render($task->content, $data);
                    }
                    $subject = 'Workflows | You got a Workflow Email';

                    if($task->subject){
                        $subject = $m->render($task->subject, $data);
                    }
                    $to = array();//'asmallco@binghamton.edu';
                    foreach($task->to as $email){

                    // dd($email);
                        $to[] = $m->render($email, $data);
                    }
                    // More Info About the Mail API: https://laravel.com/docs/5.8/mail
                    // Note that Mail::raw is undocumented, as default mail requires 
                    // the use of blade views.
                    Mail::raw( $content, function($message) use($to, $subject) { 
                        $m = new \Mustache_Engine;
                        $message->to($to);

                        $message->subject($subject); 
                    });
                break;
                case "api":
                    $httpHelper = new HTTPHelper();
                    if(isset($task->endpoint)){
                        $endpoint = Endpoint::find((int)$task->endpoint);
                        $url = $m->render($endpoint->config->url . $task->url, $data);
                        if ($endpoint->type == 'http_no_auth') {
                            $response = $httpHelper->http_fetch( $url,"POST",$task->data);
                        } else if ($endpoint->type == 'http_basic_auth') {
                            $response = $httpHelper->http_fetch($url,"POST",$task->data,$endpoint->config->username, $endpoint->getSecret());
                        } else {
                            abort(505,'Authentication Type Not Supported');
                        }
                    }else{
                        $response = $httpHelper->http_fetch(  $m->render($task->url, $data),"POST",$task->data);
                    }
                break;
                // case "data":
                // break;
                // case "membership":
                // break;
            }
        }
    }

    public function list_user_workflow_submissions(Request $request) {
        if (!Auth::check()) {
            abort(403); // You must be authenticated to fetch links
        }
        return WorkflowSubmission::with('workflowVersion')->with('workflow')->where('user_id','=',Auth::user()->id)->get();
    }
    public function list_workflow_submission_assignments(Request $request) {
        if (!Auth::check()) {
            abort(403); // You must be authenticated to fetch links
        }
        return array('direct'=>WorkflowSubmission::with('workflowVersion')->with('workflow')->where('assignment_type',"=",'user')->where('assignment_id','=',Auth::user()->id)->get(),
        'group'=>WorkflowSubmission::with('workflowVersion')->with('workflow')->where('assignment_type',"=",'group')->whereIn('assignment_id',Auth::user()->groups)->get());

    }
    public function list_instance_workflow_submissions(WorkflowInstance $workflow_instance, Request $request) {
        if (!Auth::check()) {
            abort(403); // You must be authenticated to fetch links
        }
        return WorkflowSubmission::with('workflowVersion')->with('user')->where('workflow_id','=',$workflow_instance->id)->orderBy('created_at')->get();
    }   
    
    public function workflow_submission_log($workflow_submission, Request $request) {
        if (!Auth::check()) {
            abort(403); // You must be authenticated to fetch links
        }
        return WorkflowActivityLog::where('workflow_submission_id','=',$workflow_submission)->with('user')->orderBy('updated_at','DESC')->get();
    }

    // public function view(WorkflowSubmission $workflow_submission, Request $request) {
        
    //     if (Auth::user()->site_developer || Auth::user()->site_admin) {
    //         $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->orderBy('name')->get();
    //     } else {
    //         $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_workflows)->orderBy('name')->get();
    //     }

    //     if (Auth::check()) { /* User is Authenticated */
    //         $current_user = Auth::user();
    //         $myWorkflowInstance = WorkflowInstance::with('workflow')
    //             ->where('id','=', $workflow_submission->workflow_id)->with('workflow')->first();

    //         if (is_null($myWorkflowInstance)) { 
    //             abort(404); 
    //         }
            
    //         if($myWorkflowInstance->public == 0) {
    //             $this->authorize('fetch' ,$myWorkflowInstance);
    //         }
    //         $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
    //     } else { /* User is not Authenticated */
    //         $current_user = new User;
    //         $myWorkflowInstance = WorkflowInstance::with('workflow')
    //         ->where('id','=', $workflow_submission->workflow_id)->with('workflow')->where('public','=',true)->first();
    //         // $myWorkflowInstance = WorkflowInstance::with('workflow')->where('group_id','=', $group)->where('slug', '=', $slug)->where('public','=',true)->first();
    //         if (is_null($myWorkflowInstance)) { 
    //             $return = $this->customAuth->authenticate($request);
    //             if(isset($return)){
    //                 return $return;
    //             }
    //         }
    //         $links = Group::publicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();
    //     }

    //     if (Auth::check()) { /* User is Authenticated */
    //         $current_user = Auth::user();
    //         $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
    //     } else{
    //         abort(404); 
    //     }

    //     $myWorkflowInstance->findVersion();
    //     // if($myWorkflowInstance != null) {
    //         $template = new Templater();
    //         return $template->render([
    //             'mygroups'=>$links,
    //             'name'=>'workflow',
    //             'slug'=>'workflow',
    //             'id'=>0,
    //             'data'=>[],
    //             // 'config'=>json_decode('{"sections":[[],[{"title":"'.$myWorkflowInstance->name.'","workflow_id":'.$myWorkflowInstance->id.',"widgetType":"Workflow","container":true}],[]],"layout":"<div class=\"col-lg-offset-2 col-md-offset-1  col-lg-8 col-md-10 col-sm-12 cobler_container\"></div></div>"}'),
    //             'config'=>array("sections"=>[[array("title"=>$myWorkflowInstance->name,"data"=>$workflow_submission->data,"workflow_id"=>$myWorkflowInstance->id,"widgetType"=>"Workflow","container"=>true)]],"layout"=>"<div class=\"col-lg-offset-2 col-md-offset-1  col-lg-8 col-md-10 col-sm-12 cobler_container\"></div>"),
                
    //             // json_decode('{"sections":[[],[{"title":"'.$myWorkflowInstance->name.'","workflow_id":'.$myWorkflowInstance->id.',"widgetType":"Workflow","container":true}],[]],"layout":"<div class=\"col-lg-offset-2 col-md-offset-1  col-lg-8 col-md-10 col-sm-12 cobler_container\"></div></div>"}'),
    //             // 'group'=>(Object)array("id"=>"0"),
    //             'scripts'=>[],
    //             'styles'=>[],
    //             'template'=>"main",
    //             'apps'=>(Object)[],
    //             'resource'=>'flow'
    //         ]);
    // }

    public function status(WorkflowSubmission $workflow_submission){
        return $workflow_submission;
    }

    public function destroy(WorkflowSubmission $workflow_submission){
        if ($workflow_submission->delete()) {
            return 1;
        }
    }

    public function report($workflow_submission_id,Request $request) {
        $workflow_submission = WorkflowSubmission::where('id','=',$workflow_submission_id)->with('user')->with('workflowVersion')->first();
        // if (Auth::user()->site_developer || Auth::user()->site_admin) {
        //     $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->orderBy('name')->get();
        // } else {
        //     $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_workflows)->orderBy('name')->get();
        // }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $links = Group::AppsPages()->where('unlisted','=',0)->where('site_id',config('app.site')->id)->orderBy('order')->get();
        } 
        else { /* User is not Authenticated */
            $return = $this->customAuth->authenticate($request);
            if(isset($return)){
                return $return;
            }
        }
        $workflow_submission->load('workflowInstance');

        $is_assigned = false;//(Auth::user()->site_developer || Auth::user()->site_admin);

        if($workflow_submission->assignment_type == "user"){
            $assignment = User::where("unique_id", '=', $workflow_submission->assignment_id)->select('first_name','last_name','email','unique_id','params')->first();
            $is_assigned = ($is_assigned || (Auth::user()->unique_id == $workflow_submission->assignment_id) );
        }else{
            $assignment = Group::where("id",'=',$workflow_submission->assignment_id)->where('site_id',config('app.site')->id)->select('name','slug','id')->first();
            $is_assigned = ($is_assigned || in_array($workflow_submission->assignment_id, Auth::user()->groups) );
        }

        // if($myWorkflowInstance != null) {
            $template = new Templater();
            return $template->render([
                'mygroups'=>$links,
                'name'=>'workflow',
                'slug'=>'workflow',
                'id'=>0,
                'data'=>[],
                // 'config'=>json_decode('{"sections":[[{"title":"'.$workflow_instance->name.' ","widgetType":"WorkflowSubmissionReport","options":'.json_encode($workflow_submission).',"titlebar":true,"container":true}]],"layout":"<div class=\"col-sm-12 cobler_container\"></div>"}'),
                'config'=>json_decode('{"sections":[[{"title":"TItle here ","widgetType":"WorkflowSubmissionReport","is_assigned":'.json_encode($is_assigned).', "assignment":'.json_encode($assignment).', "options":'.json_encode($workflow_submission).',"titlebar":true,"container":true}]],"layout":"<div class=\"col-sm-12 cobler_container\"></div>"}'),
                // 'group'=>(Object)array("id"=>"0"),
                'scripts'=>[],
                'styles'=>[],
                'template'=>"main",
                'apps'=>(Object)[],
                'resource'=>'flow'
            ]);
        // }
        return $workflows;
    }

    private function send_default_emails($state_data) {
        $m = new \Mustache_Engine;
        // Email Actor and Owner
        $email_body = '
{{to.first_name}} {{to.last_name}} - <br><br>
{{#was.initial}}The workflow "{{workflow.name}}" was just submitted by {{owner.first_name}} {{owner.last_name}}.<br>{{/was.initial}}
{{^was.initial}}An action ({{action}}) was recently taken on the "{{workflow.name}}" workflow by {{actor.first_name}} {{actor.last_name}}{{^owner.is.actor}}, which was originally submitted by / owned by {{owner.first_name}} {{owner.last_name}}{{/owner.is.actor}}.<br>{{/was.initial}}
{{#is.open}}This workflow is currently in the "{{state}}" state, and is assigned to 
    {{#assignment.user}}{{first_name}} {{last_name}}.{{/assignment.user}}
    {{#assignment.group}}
        the {{name}} group ({{#assignment.group.members}}{{first_name}} {{last_name}}, {{/assignment.group.members}})<br>
    {{/assignment.group}}
{{/is.open}}
{{#is.closed}}This workflow is now CLOSED and in the "{{state}}" state.<br>{{/is.closed}}
{{#comment}}The following comment was provided: "{{comment}}"<br>{{/comment}}
<br>You may view the current status as well as the complete history of this workflow here: {{report_url}}
';
        $subject = 'Workflow Update | '.$state_data['workflow']['instance']['name'];
        // Send Email To Owner (if the owner is not also the asignee)
        if (isset($state_data['assignment']['user']) && $state_data['assignment']['user']['unique_id'] !== $state_data['owner']['unique_id']) {
            $to = $state_data['owner'];
            $content_rendered = $m->render($email_body, array_merge($state_data,['to'=>$to]));
            // Clean up whitespaces and carriage returns
            $content_rendered = str_replace('<br>',"\n",preg_replace('!\s+!',' ',str_replace("\n",'',$content_rendered)));
            Mail::raw( $content_rendered, function($message) use($to, $subject) {
                $message->to($to['email']);
                $message->subject($subject); 
            });    
        }
        // Send Email to Actor (if different person than actor)
        if (!$state_data['owner']['is']['actor']) {
            $to = $state_data['actor'];
            $content_rendered = $m->render($email_body, array_merge($state_data,['to'=>$to]));
            // Clean up whitespaces and carriage returns
            $content_rendered = str_replace('<br>',"\n",preg_replace('!\s+!',' ',str_replace("\n",'',$content_rendered)));
            Mail::raw( $content_rendered, function($message) use($to, $subject) { 
                $message->to($to['email']);
                $message->subject($subject); 
            });
        }

        // Email Asignee(s)
        $email_body = '
{{#assignment.user}}{{first_name}} {{last_name}} - <br><br>{{/assignment.user}}
{{#assignment.group}}"{{name}}" Group Member - <br><br>{{/assignment.group}}
You have been assigned the "{{workflow.name}}" workflow, which was  
submitted by {{owner.first_name}} {{owner.last_name}}.<br>
{{#is.open}}
    The workflow is currently OPEN and in the "{{state}}" state.    
    {{^is.actionable}} There are no actions to take at this time.{{/is.actionable}} 
    {{#is.actionable}} You may take any of the following actions:{{#actions}}{{label}},{{/actions}}{{/is.actionable}}<br>
{{/is.open}}
{{#is.closed}}
    The workflow is currently CLOSED and in the "{{state}}" state. 
    {{^is.actionable}} There are no actions to take at this time.{{/is.actionable}} 
    {{#is.actionable}} You may take any of the following actions:{{#actions}}{{label}},{{/actions}}{{/is.actionable}}<br>
{{/is.closed}}
{{^was.initial}}
    This workflow was last updated by {{actor.first_name}} {{actor.last_name}} who performed
    the "{{action}}" action, and moved it into the current "{{state}}" state.  They also
    provided the following comment: "{{comment}}"<br>
{{/was.initial}}
{{#is.actionable}}
    <br>To take actions, or view the history / current status, visit the following: {{report_url}}
{{/is.actionable}}
{{^is.actionable}}
    <br>You may view the full history of this workflow here: {{report_url}}
{{/is.actionable}}
';
        $subject = 'Workflow Assignment | '.$state_data['workflow']['instance']['name'];
        if (isset($state_data['assignment']['group'])) {
            $to = Arr::pluck($state_data['assignment']['group']['members'],'email');
        } else if (isset($state_data['assignment']['user'])) {
            $to = $state_data['assignment']['user']['email'];
        }
        $content_rendered = $m->render($email_body, $state_data);
        // Clean up whitespaces and carriage returns
        $content_rendered = str_replace('<br>',"\n",preg_replace('!\s+!',' ',str_replace("\n",'',$content_rendered)));
        Mail::raw( $content_rendered, function($message) use($to, $subject) {
            $message->to($to);
            $message->subject($subject); 
        });
    }
}