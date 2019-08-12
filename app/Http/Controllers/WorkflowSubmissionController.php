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
use Illuminate\Support\Facades\Mail;
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
            $groupObj = Group::with('composites')->where('slug','=',$group)->first();
			$group = $groupObj->id;
		}else{
    		$groupObj = Group::with('composites')->where('id','=',$group)->first();
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
            $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myWorkflowInstance = WorkflowInstance::with('workflow')->where('group_id','=', $group)->where('id', '=', $workflow_id)->where('public','=',true)->first();
            if (is_null($myWorkflowInstance)) { 
                $return = $this->customAuth->authenticate($request);
                if(isset($return)){
                    return $return;
                }
            }
            $links = Group::publicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();
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

        $state_data = array();
        $state_data['actor'] = array('first_name'=>Auth::user()->first_name,'last_name'=>Auth::user()->first_name,'email'=>Auth::user()->email,'unique_id'=>Auth::user()->unique_id) ;
        $owner = User::find($workflow_submission->user_id);
        $state_data['owner'] = array('first_name'=>$owner->first_name,'last_name'=>$owner->first_name,'email'=>$owner->email,'unique_id'=>$owner->unique_id) ;
        $state_data['action'] = $request->get('action');

        $state_data['config'] = array();
        foreach($myWorkflowInstance->configuration->resources as $resource){
            // switch($resource->type)
            $state_data['config']{$resource->name} = $resource->value;
        }

        $state = null;

        foreach($oldstate->actions as $action){
            if($action->name == $request->get('action')){
                $workflow_submission->state = $action->to;
                if(isset($action->tasks)){
                    $this->executeTasks($action->tasks, $workflow_submission->data);
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


        //if url is defined on assignment get data and add it to the $state_data['assignment']
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
                    $state_data['assignment'] = $httpHelper->http_fetch( $url,"GET",$assignment_data);
                } else if ($endpoint->type == 'http_basic_auth') {
                    $state_data['assignment'] = $httpHelper->http_fetch($url,"GET",$assignment_data,$endpoint->config->username, $endpoint->getSecret());
                } else {
                    abort(505,'Authentication Type Not Supported');
                }
            }else{
                $state_data['assignment'] = $httpHelper->http_fetch(  $m->render($workflow_submission->assignment->url, $state_data),"GET", $assignment_data);
            }
        }
        $workflow_submission->assignment_type = $m->render($state->assignment->type, $state_data);

        //Handle assignment ids - validate that they exist
        $assignment_id = $m->render($state->assignment->id, $workflow_submission->data);

        if($state->assignment->type == "user"){
            $user = User::where("unique_id", '=', $assignment_id)->first();
            if($user !== null) {
                $workflow_submission->assignment_id = $user->id;
            }else{
                $workflow_submission->assignment_id = $assignment_id;
            }
        }else{
            $group = Group::where("id",'=', $assignment_id)->first();
            if($group !== null) {
                $workflow_submission->assignment_id = $group->id;
            }else{
                $workflow_submission->assignment_id = $assignment_id;
            }
        }

        if(isset($state->onEnter)){
            $this->executeTasks($state->onEnter, $workflow_submission->data);
        }

        $workflow_submission->update();
        
        $this->logAction($workflow_submission,$start_state,$state_data['action'],$request->get('comment'));


        
        //Email owner
        $content = "Workflow task taken on workflow you own";
        $subject = 'Workflows | You got a Workflow Email';
        $to = $state_data['owner']['email'];
        Mail::raw( $content, function($message) use($to, $subject) { 
            $message->to($to);
            $message->subject($subject); 
        });

        //Email actor
        $content = "Workflow task taken by you";
        $subject = 'Workflows | You got a Workflow Email';
        $to = $state_data['actor']['email'];
        Mail::raw( $content, function($message) use($to, $subject) { 
            $message->to($to);
            $message->subject($subject); 
        });
        

        return WorkflowSubmission::with('workflowVersion')->with('workflow')->where('id', '=', $workflow_submission->id)->first();
    }

    private function logAction($workflow_submission, $start_state, $action, $comment){
        
        $activity = new WorkflowActivityLog();
        $activity->start_state = $start_state;

        $activity->workflow_id = $workflow_submission->workflow_id;
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
        return WorkflowSubmission::with('workflowVersion')->with('user')->where('workflow_id','=',$workflow_instance->id)->orderBy('updated_at','DESC')->get();
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
        if (Auth::user()->site_developer || Auth::user()->site_admin) {
            $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->orderBy('name')->get();
        } else {
            $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_workflows)->orderBy('name')->get();
        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        } 
        else { /* User is not Authenticated */
            abort(404); 

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
                'config'=>json_decode('{"sections":[[{"title":"TItle here ","widgetType":"WorkflowSubmissionReport","options":'.json_encode($workflow_submission).',"titlebar":true,"container":true}]],"layout":"<div class=\"col-sm-12 cobler_container\"></div>"}'),
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
}