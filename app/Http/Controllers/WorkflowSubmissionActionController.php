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
use App\WorkflowSubmissionFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
use App\Libraries\Templater;
use App\Libraries\PageRenderer;
use \Carbon\Carbon;
use App\Libraries\CustomAuth;
use App\Libraries\JSExecHelper;
use App\Libraries\ResourceService;
use \Ds\Vector;
use Storage;

class WorkflowSubmissionActionController extends Controller {
    public function __construct() {
        // 01/19/2020, AKT - Authentication checks were moved to the public methods
        // Reason: Internal function call from Kernel could not be able to have an authenticated user
//        $this->customAuth = new CustomAuth();
//        $this->resourceService = new ResourceService($this->customAuth);
    }

    public function create(WorkflowInstance $workflow_instance, Request $request,$save_or_submit='submit') {
        //01/20/2021, AKT - Added the code below to check if the user is authenticated
        $this->customAuth = new CustomAuth();
        $this->resourceService = new ResourceService($this->customAuth);

        $myWorkflowInstance = WorkflowInstance::with('workflow')
            ->where('id', '=', $workflow_instance->id)->with('workflow')->first();
        if(is_null($myWorkflowInstance)) {
            abort(404,'Workflow not found');
        }
        $myWorkflowInstance->findVersion();
        $current_user = Auth::check()?Auth::user():(new User);

        // Get any existing workflow submissions with a 'new' status
        $workflow_submission = WorkflowSubmission::where('user_id',$current_user->id)
            ->where('workflow_instance_id',$workflow_instance->id)
            ->where('status','new')->first();
        if (is_null($workflow_submission)) {
            $workflow_submission = new WorkflowSubmission();
        }
        $workflow_submission->workflow_id = $myWorkflowInstance->workflow_id;
        $workflow_submission->workflow_instance_id = $myWorkflowInstance->id;
        $workflow_submission->workflow_version_id = $myWorkflowInstance->version->id;
        $workflow_submission->workflow_instance_configuration = $myWorkflowInstance->configuration;
        $workflow_submission->data = $request->has('_state')?$request->get('_state'):(Object)[];
        $workflow_submission->state = $myWorkflowInstance->configuration->initial;
        $workflow_submission->status = 'new';
        $workflow_submission->user_id = $current_user->id;
        $workflow_submission->assignment_type = 'user';
        $workflow_submission->assignment_id = Auth::user()->id;
        $workflow_submission->save();
        if ($save_or_submit === 'save') {
            return $workflow_submission;
        } else if ($save_or_submit === 'submit'){
            return $this->action($workflow_submission, $request);
        }
    }

    public function api_create(WorkflowInstance $workflow_instance, Request $request, $unique_id, $start_state, $action) {
        //04/23/2021, AKT - Added the code below to check if the user is authenticated
        $this->customAuth = new CustomAuth();
        $this->resourceService = new ResourceService($this->customAuth);

        if ($request->has('enforce_permissions') && $request->enforce_permissions === 'false') {
            // Don't check permissions!
        } else {
            $this->authorize('create_submission',$workflow_instance);
        }
        $new_request = new Request();
        $new_request->setMethod('POST');
        $new_request->request->add([
            '_flowstate' => $start_state,
            '_state' => $request->has('data')?$request->data:(Object)[],
            'action' => $action,
            'comment' => $request->has('comment')?$request->comment:null,
            'signature' => $request->has('signature')?$request->signature:null,
        ]);
        return $this->create($workflow_instance,$new_request,'submit');
    }

    private function detect_infinite_loop() {
        if (!isset($GLOBALS['action_stack_depth'])) {
            $GLOBALS['action_stack_depth']=0;
        } else {
            $GLOBALS['action_stack_depth']++;
            if ($GLOBALS['action_stack_depth'] > config('app.workflow_max_loop')) {
                return true;
            }
        }
        return false;
    }
    private function set_first_action_state($state_data) {
        if (!isset($GLOBALS['first_action_state_data'])) {
            $GLOBALS['first_action_state_data']=$state_data;
        } 
    }
    private function get_first_action_state() {
        if (isset($GLOBALS['first_action_state_data'])) {
            return $GLOBALS['first_action_state_data'];
        } else {
            return false;
        }
    }
    // 01/14/2021, AKT -  Added a new parameter with a default value for automated workflow actions
    public function action(WorkflowSubmission $workflow_submission, Request $request,$is_internal=false){
        //01/20/2021, AKT - Added the code below to check if the actions is taken internally
        //If not, then check for authentication
        if(!$is_internal){
            $this->customAuth = new CustomAuth();
            $this->resourceService = new ResourceService($this->customAuth);
        }

        if ($this->detect_infinite_loop()) {
            return response('Infinite Loop Detected! Quitting!', 508);
        }
        $m = new \Mustache_Engine;
        $myWorkflowInstance = WorkflowInstance::with('workflow')->where('id', '=', $workflow_submission->workflow_instance_id)->first();
        $myWorkflowInstance->findVersion();
        $owner = User::find($workflow_submission->user_id);
        $start_state = $workflow_submission->state;
        $start_assignment = $workflow_submission->only('assignment_type','assignment_id');
        $flow = $myWorkflowInstance->version->code->flow;
        $methods = $myWorkflowInstance->version->code->methods;
        // Determine Previous State (Object) -- State we are leaving
        $previous_state = Arr::first($flow, function ($value, $key) use ($workflow_submission) {
            return $value->name === $workflow_submission->state;
        });
        $previous_status = $workflow_submission->status;
        // Get Action (Object)
        $action = Arr::first($previous_state->actions, function ($value, $key) use ($request) {
            return $value->name === $request->get('action');
        });  
        // Set New State (String)
        $workflow_submission->state = $action->to;   
        // Determine New State (Object) -- State we are entering
        $state = Arr::first($flow, function ($value, $key) use ($workflow_submission) {
            return $value->name === $workflow_submission->state;
        });     
        // Set New Status (String)
        if(isset($state->status)){
            $workflow_submission->status = $state->status;
        }else{
            $workflow_submission->status = 'open';
        }             

        $state_data = [];
        $state_data['id'] = $workflow_submission->id;
        $state_data['is'] = $state_data['was'] = $state_data['previous'] = [];
        $state_data['form'] = $workflow_submission->data = (object)array_merge((array)$workflow_submission->data, (array)$request->get('_state'));
        $state_data['report_url'] = URL::to('/workflows/report/'.$workflow_submission->id);
        $state_data['owner'] = $owner->only('first_name','last_name','email','unique_id','params');
        $state_data['owner']['is'] = [];

        // 01/05/2021, AKT - Added $is_internal the actor of the workflow
        if (isset($previous_state->logic) || $is_internal
        ) {
            $state_data['actor'] = null;
            $state_data['owner']['is']['actor'] = false;
        } else {
            $state_data['actor'] = Auth::user()->only('first_name','last_name','email','unique_id','params');
            $state_data['owner']['is']['actor'] = ($owner->id === Auth::user()->id);
        }
        $state_data['action'] = Arr::only((array)$action,['label','name','type']);
        $state_data['workflow'] = $myWorkflowInstance->workflow->only('name','description');
        $state_data['workflow']['instance'] = $myWorkflowInstance->only('group_id','slug','name','icon','public','configuration');
        $state_data['workflow']['version'] = $myWorkflowInstance->version->only('id','summary','description','stable');
        $state_data['comment'] = ($request->has('comment'))?$request->get('comment'):null;
        $state_data['previous']['status'] = $previous_status;
        $state_data['previous']['state'] = $previous_state->name;
        $state_data['was']['open'] = ($state_data['previous']['status']=='open')?true:false;
        $state_data['was']['closed'] = ($state_data['previous']['status']=='closed')?true:false;
        $state_data['was']['initial'] = ($myWorkflowInstance->configuration->initial == $state_data['previous']['state']);
        $state_data['datamap'] = $state_data['assignment'] = [];
        foreach($myWorkflowInstance->configuration->map as $resource){
            $state_data['datamap'][$resource->name] = $resource->value;
        }
        $state_data['status'] = $workflow_submission->status;
        $state_data['state'] = $state->name;
        if (!isset($state->actions)) { $state->actions = []; }
        //01/20/2021, AKT - Replaced array_map with a foreach to avoid returned null values when nothing matches
        // This change was necessary in order to avoid internal or not actionable actions in the emails
//        $state_data['actions'] = array_map(function ($ar) {
//            return Arr::only((array)$ar,['label','name','type']);
//        }, $state->actions);
        $state_data['actions']=[];
        foreach($state->actions as $ar){
            if(!isset($ar->assignment) || // See if an assignment is made for the action. If not, then add it to the list of actions
                (isset($ar->assignment) && // If assignment is set, then check
                ($ar->assignment->type === 'user') || ($ar->assignment->type === 'group')) // If the action is either user group type
                ){
                $state_data['actions'][]= Arr::only((array)$ar,['label','name','type']); // Add the action to the list of actions to be sent in the email
            }
        }
        $state_data['is']['actionable'] = (count($state_data['actions'])>0);
        $state_data['is']['open'] = ($state_data['status']=='open')?true:false;
        $state_data['is']['closed'] = ($state_data['status']=='closed')?true:false;
        $state_data['is']['initial'] = ($myWorkflowInstance->configuration->initial == $state_data['state']);
        if (isset($state->assignment) && !isset($state->logic)) {
            $state_data['assignment']['type'] = $workflow_submission->assignment_type = $state->assignment->type;
            $state_data['assignment']['id'] = $m->render($state->assignment->id, $state_data);
        } else {
            $workflow_submission->assignment_type = 'internal';
            $state_data['assignment'] = null;
        }
        // Add History to State Data (For use in Logic Blocks and anywhere else)
        $state_data['history'] = $workflow_submission->history;

        // Check Permissions 
        if (isset($state->logic)) {
            // No Permission Check for Logic Block
        } else {

            // 01/14/2021, AKT - Added is_internal to make sure the code below won't run if the action function is called by an automated job.
            if (isset($action->assignment) && !$is_internal) {  // This action can be performed by action asignee
                $action_assignment_type = $m->render($action->assignment->type, $state_data);
                $action_assignment_id = $m->render($action->assignment->id, $state_data);
                if (($action_assignment_type === 'user' && $action_assignment_id === Auth::user()->unique_id) || 
                    ($action_assignment_type === 'group' && Auth::user()->group_member($action_assignment_id))) {
                    // Continue!
                } else {
                    return response('Permission Denied', 403);
                }        
            } else { // This action can be performed by the state assignee
                if ($start_assignment['assignment_type']== "internal" || ($start_assignment['assignment_type'] === 'user' && $start_assignment['assignment_id'] === Auth::user()->id) ||
                    ($start_assignment['assignment_type'] === 'group' && Auth::user()->group_member($start_assignment['assignment_id']))) {
                    // Continue!
                } else {
                    return response('Permission Denied', 403);
                }
            }
        }

        // Determine Assignment
        if (isset($state->logic)) {
            // Logic States have no assignments
            $workflow_submission->assignment_id = null;
        } else {
            if (isset($state->assignment->resource) && $state->assignment->resource != '') {
                // Perform Dynamic Assignment
                $this->determineAssignment();
            } else {
                if($state->assignment->type == "user"){
                    $user = User::where("unique_id", '=', $state_data['assignment']['id'])->first();
                    if(is_null($user)) { throw new \Exception('Assigned User Does Not Exist'); }
                    $workflow_submission->assignment_id = $user->id;
                    $state_data['assignment']['user'] = $user->only('first_name','last_name','email','unique_id','params');
                } else if ($state->assignment->type == "group"){
                    // 01/14/2021, AKT - Added a condition to check if the code is being run internally.
                    // Otherwise, it won't require the site_id because we won't have it.
                    if(!$is_internal) {
                        $group = Group::where("id", '=', $state_data['assignment']['id'])->where('site_id', config('app.site')->id)->first();
                    }
                    else{
                        $group = Group::where("id", '=', $state_data['assignment']['id'])->first();
                    }
                    if(is_null($group)) { throw new \Exception('Assigned Group Does Not Exist'); }
                    $workflow_submission->assignment_id = $group->id;
                    $state_data['assignment']['group'] = $group->only('name','slug','id');
                    $state_data['assignment']['group']['members'] = $group->members()->with('bulkuser')->get()->pluck('bulkuser')->toArray();
                } else {
                    throw new \Exception('Invalid Assignment (User or Group Does Not Exist!)');
                }
            }
        }

        // Execute Any Relevant Previous State Exit Tasks
        if(isset($previous_state->onLeave)){
            $this->executeTasks($previous_state->onLeave, $state_data, $workflow_submission, $myWorkflowInstance);
        }
        // Execute Any Relevant Action Tasks
        if(isset($action->tasks)){
            $this->executeTasks($action->tasks, $state_data, $workflow_submission, $myWorkflowInstance);
        }        
        // Execute Any Relevant New State Entry Tasks
        if(isset($state->onEnter)){
            $this->executeTasks($state->onEnter, $state_data, $workflow_submission, $myWorkflowInstance);
        }

        // Update Submission Object In DB
        $workflow_submission->update();
        
        $this->logAction($workflow_submission,$start_state,$start_assignment,$state_data['action']['name'],$request->get('comment'),$request->get('signature'));
        
        // Save off the first "human-initiated" action state, for use
        // later when we save emails.  Note: This function does nothing
        // on non-human actions.
        $this->set_first_action_state($state_data);

        // Check if this state has attached logic
        if (isset($state->logic)) {
            if (is_string($state->logic)) {
                $method_name = $state->logic;
                // Lookup Logic Method
                $method = Arr::first($methods, function ($value, $key) use ($method_name) {
                    // return $value->name === $method_name;
                    return "method_".$key === $method_name;
                }); // Needs error handling if this is null!
                $method_code = $method->content;
            } else {
                $method_code = 'return true;';
            }
            $jsexec = new JSExecHelper(['_'=>'lodash.min.js','moment'=>'moment.js']);
            $logic_result = $jsexec->run($method_code,$state_data);

            // 01/14/2021, AKT - Added $is_internal parameter to the action() function calls below to send the current value of $is_internal
            if ($logic_result['success']===false) {
                $request->merge(['action'=>'error','comment'=>json_encode($logic_result['error'])]);
                return $this->action($workflow_submission, $request,$is_internal); // action = error
            } else if ($logic_result['success']===true && $logic_result['return'] == true) { // is truthy
                $comment = isset($logic_result['console']['comment'])?implode("\n",$logic_result['console']['comment']):json_encode($logic_result['console']);
                $request->merge(['action'=>'true','comment'=>$comment]);
                return $this->action($workflow_submission, $request,$is_internal); //action = true
            } else if ($logic_result['success']===true && $logic_result['return'] == false) { // is falsy
                $comment = isset($logic_result['console']['comment'])?implode("\n",$logic_result['console']['comment']):json_encode($logic_result['console']);
                $request->merge(['action'=>'false','comment'=>$comment]);
                return $this->action($workflow_submission, $request,$is_internal); // action = false
            }
        }
        else if(!isset($myWorkflowInstance->configuration->suppress_emails) || 
                !$myWorkflowInstance->configuration->suppress_emails){

            // Reset Email State Data to info for last "human" action. (Non-logic)
            $first_action_state_data = $this->get_first_action_state($state_data);
            $email_state_data = $state_data;
            if ($first_action_state_data !== false) {
                $email_state_data['was'] = $first_action_state_data['was'];
                $email_state_data['actor'] = $first_action_state_data['actor'];
                $email_state_data['action'] = $first_action_state_data['action'];
                $email_state_data['comment'] = $first_action_state_data['comment'];
                $email_state_data['previous'] = $first_action_state_data['previous'];
            }
            $this->send_default_emails($email_state_data);
        }
        return WorkflowSubmission::with('workflowVersion')->with('workflow')->where('id', '=', $workflow_submission->id)->first();
    }

    public function api_action(WorkflowSubmission $workflow_submission, Request $request, $unique_id, $action) {
        $this->authorize('take_action',$workflow_submission);
        //04/23/2021, AKT - Added the code below to check if the user is authenticated
        $this->customAuth = new CustomAuth();
        $this->resourceService = new ResourceService($this->customAuth);

        $new_request = new Request();
        $new_request->setMethod('PUT');
        $new_request->request->add([
            '_state' => $request->has('data')?$request->data:(Object)[],
            'action' => $action,
            'comment' => $request->has('comment')?$request->comment:null,
            'signature' => $request->has('signature')?$request->signature:null,
        ]);
        return $this->action($workflow_submission,$new_request);
    }

    private function determineAssignment() {
        // if url is defined on assignment get data and add it to the $state_data['assignment']
        // if(isset($workflow_submission->assignment->url)){
        //     $assignment_data;
        //     if(!isset($workflow_submission->assignment->data)){
        //         $assignment_data = array();
        //     }else{
        //         foreach($workflow_submission->assignment->data as $key=>$value){
        //             $assignment_data->{$key} = $m->render($value, $state_data);
        //         }
        //     }
        //     $httpHelper = new HTTPHelper();
        //     if(isset($workflow_submission->assignment->endpoint)){
        //         $endpoint = Endpoint::find((int)$workflow_submission->assignment->endpoint);
        //         $url = $m->render($endpoint->config->url . $workflow_submission->assignment->url, $state_data);
        //         if ($endpoint->type == 'http_no_auth') {
        //             $state_data['assignment']['data'] = $httpHelper->http_fetch( $url,"GET",$assignment_data);
        //         } else if ($endpoint->type == 'http_basic_auth') {
        //             $state_data['assignment']['data'] = $httpHelper->http_fetch($url,"GET",$assignment_data,$endpoint->config->username, $endpoint->getSecret());
        //         } else {
        //             abort(505,'Authentication Type Not Supported');
        //         }
        //     } else {
        //         $state_data['assignment']['data'] = $httpHelper->http_fetch($m->render($workflow_submission->assignment->url, $state_data),"GET", $assignment_data);
        //     }
        // }
        // This action can only be performed by action asignee
    }

    private function logAction($workflow_submission, $start_state, $start_assignment, $action, $comment,$signature=null){
        $activity = new WorkflowActivityLog();
        $activity->start_state = $start_state;
        $activity->workflow_instance_id = $workflow_submission->workflow_instance_id;
        $activity->workflow_submission_id = $workflow_submission->id;
        $activity->data =  $workflow_submission->data;
        $activity->end_state = $workflow_submission->state;
        $activity->status = $workflow_submission->status;
        $activity->user_id = ($start_assignment['assignment_type']==='internal')?null:Auth::user()->id;
        $activity->assignment_type = $start_assignment['assignment_type'];
        $activity->assignment_id = $start_assignment['assignment_id'];
        $activity->comment = $comment;
        $activity->action = $action;
        $activity->signature = $signature;
        $activity->save();
    }

    private function executeTasks($tasks, $data, &$workflow_submission, &$workflow_instance){
        //02/11/2021, AT - Added support for array of different type of fields, such as users, groups and emails for the task emails
        $m = new \Mustache_Engine([
            'escape' => function($value) {
                $value = is_array($value)?implode(',',$value):$value;
                return htmlspecialchars($value, ENT_COMPAT, 'UTF-8');
            }
        ]);

        foreach($tasks as $task){
            $task->data = [];
            if(isset($task->dataset)){
                foreach($task->dataset as $datum){
                    $task->data[$datum->key] = $m->render($datum->value, $data);
                }
            }
            switch($task->task) {
                case "email":
                    if(!isset($workflow_instance->configuration->suppress_email_tasks) || !$workflow_instance->configuration->suppress_email_tasks){ 
                        $content = "Workflow Notification Email";
                        if(!is_null($task->template)){
                            $template_name = $task->template;

                            $template = Arr::first($workflow_instance->version->code->templates, function ($value, $key) use ($template_name) {
                                return "template_".$key === $template_name;
                            }); // Needs error handling if this is null!

                            if(!is_null($template)){
                                $task->content = $template->content;
                            }
                        }

                        if($task->content){
                            $content = $m->render($task->content, $data);
                        }
                        $subject = 'Workflow Notification';
                        if($task->subject){
                            $subject = $m->render($task->subject, $data);
                        }
                        $to = [];
                        foreach($task->to as $to_info){
                            if (is_string($to_info)) { /* Backwards Compatibility with old Form Structure */
                                $email_addres = $m->render($to_info, $data);
                                if (filter_var($email_addres, FILTER_VALIDATE_EMAIL)) {
                                    $to[] = $email_addres;
                                }
                            } else if (isset($to_info->email_type) && $to_info->email_type === 'email') {
                                //02/11/2021, AT - Added support for array of emails
                                $email_addresses = $m->render($to_info->email_address, $data);
                                $email_addresses = explode(',',$email_addresses);
                                foreach ($email_addresses as $email_address) {
                                    if (filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
                                        $to[] = $email_address;
                                    }
                                }
                            } else if (isset($to_info->email_type) && $to_info->email_type === 'user') {
                                //02/11/2021, AT - Added support for array of users
                                $user_unique_ids = $m->render($to_info->user, $data);
                                $user_unique_ids = explode(',',$user_unique_ids);
                                foreach ($user_unique_ids as $user_unique_id) {
                                    $user = User::select('email')->where("unique_id", '=', $user_unique_id)->first();
                                    if (!is_null($user)) { $to[] = $user->email; }
                                }
                            } else if (isset($to_info->email_type) && $to_info->email_type === 'group') {
                                //02/11/2021, AT - Added support for array of groups
                                $group_ids = $m->render($to_info->group, $data);
                                $group_ids = explode(',',$group_ids);
                                foreach ($group_ids as $group_id) {
                                    $users = User::select('email')
                                        ->whereHas('group_members', function($q) use ($group_id) {
                                            $q->where('group_id','=',$group_id);
                                        })->get();
                                    foreach($users as $user) {
                                        $to[] = $user->email;
                                    }
                                }
                            }
                        }
                        try {
                            $to = array_unique($to);
                            Mail::raw( $content, function($message) use($to, $subject) { 
                                $m = new \Mustache_Engine;
                                $message->to($to);
                                $message->subject($subject); 
                            });
                        } catch (\Exception $e) {
                            // Failed to Send Email... Continue Anyway.
                        }
                    }
                break;
                case "purge_files":
                    $files = WorkflowSubmissionFile::where('workflow_submission_id',$workflow_submission->id)->get();
                    foreach($files as $file) {
                        Storage::delete($file->get_file_path());
                        Storage::delete($file->get_file_path().'.encrypted');
                        $file->user_id_deleted = Auth::check()?Auth::user()->id:null; // To see if the user is an authenticated user/ or an internal user
                        $file->save();
                        $file->delete();
                    }
                break;
                case "resource":
                    if(isset($task->verb)){
                        $data['verb'] = $task->verb;
                    }                    
                    if(isset($task->data)){
                        $data['request'] = $task->data;

                    }
                    $data = $this->resourceService->get_data_int($workflow_instance,$workflow_submission, $task->resource, $data);
                break;
                case "purge_fields_by_name":
                    // this is a "poor man" implementation of "Purge Protected" that clears all 
                    // form values of a given name throughout the workflow history 
                    // It isn't particularly smart, and doesn't look at the form definition at all.
                    $protected_field_names = [];
                    if(isset($task->field_names) && is_array($task->field_names)){
                        $protected_field_names = $task->field_names;
                    }
                    $workflow_activity_logs = WorkflowActivityLog::where('workflow_submission_id',$workflow_submission->id)->get();
                    foreach($workflow_activity_logs as $workflow_activity_log) {
                        $log_data = $workflow_activity_log->data;
                        array_walk_recursive($log_data, function(&$item, $key) use ($protected_field_names) {
                            if (is_string($key) && in_array($key,$protected_field_names)) { $item = null; }
                        });
                        $workflow_activity_log->update(['data'=>$log_data]);
                    }
                    $submission_data = $workflow_submission->data;
                    array_walk_recursive($submission_data, function(&$item, $key) use ($protected_field_names) {
                        if (is_string($key) && in_array($key,$protected_field_names)) { $item = null; }
                    });
                    $workflow_submission->update(['data'=>$submission_data]);
                break;
            }
        }
    }

    private function send_default_emails($state_data) {
        $m = new \Mustache_Engine;
        // Email Actor and Owner
        $email_body = '
{{to.first_name}} {{to.last_name}} - <br><br>
{{#was.initial}}The workflow "{{workflow.name}}" was just submitted by {{owner.first_name}} {{owner.last_name}}.<br><br>{{/was.initial}}
{{#actor.first_name}}{{^was.initial}}An action ({{action.label}}) was recently taken on the "{{workflow.name}}" workflow by {{actor.first_name}} {{actor.last_name}}{{^owner.is.actor}}, which was originally submitted by / owned by {{owner.first_name}} {{owner.last_name}}{{/owner.is.actor}}.<br><br>{{/was.initial}}
{{#comment}}The following comment was provided: "{{{comment}}}"<br><br>{{/comment}}{{/actor.first_name}}
{{#is.open}}This workflow is currently in the "{{state}}" state, and is assigned to 
    {{#assignment.user}}{{first_name}} {{last_name}}.<br><br>{{/assignment.user}}
    {{#assignment.group}}
        the {{name}} group.<br><br>
    {{/assignment.group}}
{{/is.open}}
{{#is.closed}}This workflow is now CLOSED and in the "{{state}}" state.<br><br>{{/is.closed}}
You may view the current status as well as the complete history of this workflow here: {{report_url}}
';
        $subject = 'Update '.$state_data['workflow']['instance']['name'].' ('.$state_data['id'].')';
        // Send Email To Owner (if the owner is not also the assignee)
        if ((isset($state_data['assignment']['user']) && $state_data['assignment']['user']['unique_id'] !== $state_data['owner']['unique_id']) 
            || isset($state_data['assignment']['group'])) {
            $to = $state_data['owner'];
            $content_rendered = $m->render($email_body, array_merge($state_data,['to'=>$to]));
            // Clean up whitespaces and carriage returns
            $content_rendered = str_replace('<br>',"\n",preg_replace('!\s+!',' ',str_replace("\n",'',$content_rendered)));
            try {
                Mail::raw( $content_rendered, function($message) use($to, $subject) {
                    $message->to($to['email']);
                    $message->subject($subject); 
                });    
            } catch (\Exception $e) {
                // Failed to Send Email... 
                // Continue Anyway.
            }

        }
        // Send Email to Actor (if different person than actor)
        if (!$state_data['owner']['is']['actor']) {
            $to = $state_data['actor'];
            $content_rendered = $m->render($email_body, array_merge($state_data,['to'=>$to]));
            // Clean up whitespaces and carriage returns
            $content_rendered = str_replace('<br>',"\n",preg_replace('!\s+!',' ',str_replace("\n",'',$content_rendered)));
            try {
                Mail::raw( $content_rendered, function($message) use($to, $subject) { 
                    $message->to($to['email']);
                    $message->subject($subject); 
                });
            } catch (\Exception $e) {
                // Failed to Send Email... 
                // Continue Anyway.
            }
        }

        // Email Asignee(s)
        $email_body = '
{{#assignment.user}}{{first_name}} {{last_name}} - <br><br>{{/assignment.user}}
{{#assignment.group}}"{{name}}" Group Member - <br><br>{{/assignment.group}}
You have been assigned the "{{workflow.name}}" workflow, which was  
submitted by {{owner.first_name}} {{owner.last_name}}.<br><br>
{{#is.closed}}The workflow is currently CLOSED and in the "{{state}}" state. <br><br>{{/is.closed}}
{{^was.initial}}
    {{#actor.first_name}}
        This workflow was last updated by {{actor.first_name}} {{actor.last_name}} who performed
        the "{{action.label}}" action.  <br><br>
        {{#comment}}They also provided the following comment: "{{{comment}}}"<br><br>{{/comment}}
    {{/actor.first_name}}
{{/was.initial}}
{{^is.actionable}} There are no actions to take at this time.<br><br>{{/is.actionable}} 
{{#is.actionable}} 
    {{#actions.1}}
        You may take any of the following actions: {{#actions}}"{{label}}", {{/actions}}<br><br>
    {{/actions.1}}
    {{^actions.1}}
        You may take the following action: "{{actions.0.label}}"<br><br>
    {{/actions.1}}
{{/is.actionable}}
{{#is.open}}The workflow is currently OPEN and in the "{{state}}" state.<br><br>{{/is.open}}
{{#is.actionable}}
    To take actions, or view the history / current status, visit the following: {{report_url}}<br><br>
{{/is.actionable}}
{{^is.actionable}}
    You may view the full history of this workflow here: {{report_url}}<br><br>
{{/is.actionable}}
';
        $subject = 'Assignment '.$state_data['workflow']['instance']['name'].' ('.$state_data['id'].')';
        if (isset($state_data['assignment']['group'])) {
            $to = Arr::pluck($state_data['assignment']['group']['members'],'email');
        } else if (isset($state_data['assignment']['user'])) {
            $to = $state_data['assignment']['user']['email'];
        }
        $content_rendered = $m->render($email_body, $state_data);
        // Clean up whitespaces and carriage returns
        $content_rendered = str_replace('<br>',"\n",preg_replace('!\s+!',' ',str_replace("\n",'',$content_rendered)));
        try {
            Mail::raw( $content_rendered, function($message) use($to, $subject) {
                $message->to($to);
                $message->subject($subject); 
            });
        } catch (\Exception $e) {
            // Failed to Send Email... 
            // Continue Anyway.
        }
    }

    // 01/12/2021, AKT - Implemented inactivity related
    public function workflow_automated_inactivity(){
        //Get all the open submissions
        $submissions =  WorkflowSubmission::where('status','open')->get();
        //Get all the workflow instances
        $all_instances = WorkflowInstance::get();

        foreach ($submissions as $submission){
            //Find the instance of the submission
            $instance = $all_instances->where('id',$submission->workflow_instance_id)->first();

            //Check if the instance exist
            if(isset($instance)){
                //Calling findVersion function to get the related version information/ data
                $instance->findVersion();

                //Getting the current state of the workflow
                $state = Arr::first($instance->workflow->code->flow,function($value,$key) use ($submission){
                    return $value->name === $submission->state;
                });
                // If the state is a valid state, then continue
                if(isset($state) && !is_null($state)){
                    if($submission->state === $state->name){
                        foreach ($state->actions as $action) { // Goes through each action of the state
                            //Checks if the action is an internal action and the last updated date is equal to or greater than delay of the internal action
                            if (isset($action->assignment) && // Checks if the action is assigned other than the assignee
                                $action->assignment->type === 'internal' &&// Checks if the action is internal(inactivity based)
                                isset($action->assignment->delay) && // Checks if the delay of the action is set
                                $submission->updated_at->diffInDays(Carbon::now()) >= $action->assignment->delay && // Checks if the days past is equal to or bigger than the delay defined in the workflow
                                isset($action->name) && !is_null($action->name)// Checks if the action's name is set
                            ) {

                                $action_request = new Request();// Creating a new request
                                $action_request->setMethod('PUT'); //Setting the request type to PUT
                                $action_request->request->add([// Setting the request parameters
                                    "action" => $action->name,
                                    "comment" => "Automated ".$action->label." action was taken due to inactivity for ".$action->assignment->delay." days"
                                ]);
                                $submission->assignment_type = $action->assignment->type; // Setting the assignment type of the action
                                $this->action($submission, $action_request, true); // runs the action method
                            }
                        }
                    }
                }
            }
        }
    }
}