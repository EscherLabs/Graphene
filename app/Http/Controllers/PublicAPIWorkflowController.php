<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use App\WorkflowSubmission;
use App\WorkflowInstance;
use \Carbon\Carbon;


class PublicAPIWorkflowController extends Controller
{

    private $user_fields = ['id','email','first_name','last_name','unique_id'];
    public function __construct() {
    }

    public function get_submission(Request $request, WorkflowSubmission $submission) {
        $complex_submission = WorkflowSubmission::select('id','workflow_instance_id','user_id','assignment_type','assignment_id','state','data','status','created_at','updated_at')
            ->with(['user'=>function($query){
                $query->select($this->user_fields);
            }])
            ->with(['assignment_group'=>function($query){
                $query->select('id','name','slug')->where('site_id',config('app.site')->id);
            }])
            ->with(['assignment_user'=>function($query){
                $query->select($this->user_fields);
            }])
            ->with(['logs'=>function($query){
                $query->select('workflow_submission_id','id','user_id','start_state','end_state','action','comment','data','signature','status','updated_at')
                ->with(['user'=>function($query){
                    $query->select($this->user_fields);
                }])->oldest();
            }])
            ->with(['files'=>function($query){
                $query->with(['user'=>function($query){
                    $query->select($this->user_fields);
                }])->with(['deleted_by'=>function($query){
                    $query->select($this->user_fields);
                }])->oldest()->withTrashed();
            }])
            ->where('id',$submission->id)->first();
        
        if($complex_submission->assignment_type == "user"){
            $complex_submission->asignee = $complex_submission->assignment_user;
        } else {
            $complex_submission->asignee = $complex_submission->assignment_group;
        }
        unset($complex_submission->assignment_user); unset($complex_submission->assignment_group); 
        return $complex_submission;
    }

    /* 
        NOTICE: 
        This function is written in all RAW SQL (not using Eloquent) in an effort to make the API
        as fast as possible.  This is not the preferred way of writing these, and this should
        not generally be copied as a matter of practice except in cases where we are dealing 
        with huge amounts of data which spans multiple tables.
    */
    public function get_all_instance_submissions(Request $request, WorkflowInstance $instance) {
        $paginate = true;
        if ($request->has('all') && $request->all === 'true') {
            $paginate = false;
        }
         $validator = Validator::make($request->all(), [
            'status' => Rule::in('open','closed','new')
        ]);
        if($validator->fails()){
            return response()->json(['error'=>'Your request did not pass validation','info'=>$validator->messages()], 200);
        }
        $query = DB::table('workflow_submissions')
            ->select('workflow_submissions.id','state','data','status','assignment_type','assignment_id',
                'workflow_submissions.created_at','workflow_submissions.updated_at',
                'assignment_users.first_name as assignment_first_name', 'assignment_users.last_name  as assignment_last_name', 'assignment_users.email as assignment_email', 'assignment_users.unique_id as assignment_unique_id',
                'users.first_name', 'users.last_name', 'users.email', 'users.unique_id',
                'groups.name', 'groups.slug')
            ->leftJoin('users', 'workflow_submissions.user_id', '=', 'users.id')
            ->leftJoin('users as assignment_users', 'workflow_submissions.assignment_id', '=', 'assignment_users.id')
            ->leftJoin('groups', 'workflow_submissions.assignment_id', '=', 'groups.id')
            ->where('workflow_instance_id','=',$instance->id)
            ->whereNull('workflow_submissions.deleted_at')
            ->orderBy('updated_at','desc');
        if ($request->has('status')) {
            $query->where('status','=',$request->status);
        }
        if ($request->has('unique_id')) {
            $query->where('users.unique_id','=',$request->unique_id);
        }
        if ($paginate) {
            $rows = $query->paginate(100);
        } else {
            $rows = $query->get();
        }
        $submissions = collect();
        foreach($rows as $row) {
            $submission = (Object)Arr::only((Array)$row,['id','assignment_type','state','status','created_at','updated_at']);
            $submission->data = json_decode($row->data,true);
            $submission->user = Arr::only((Array)$row,['email','first_name','last_name','unique_id']);
            if (isset($submission->data['_encrypted']) && $submission->data['_encrypted']===true && isset($submission->data['data'])) {
                $submission->data = json_decode(decrypt($submission->data['data']),true);
            }
            if ($row->assignment_type === 'user') {
                $submission->asignee = [
                    'unique_id'=> $row->assignment_unique_id,   'email' => $row->assignment_email,
                    'first_name'=> $row->assignment_first_name, 'last_name'=> $row->assignment_last_name,
                ]; 
            } else if ($row->assignment_type === 'group') {
                $submission->asignee = Arr::only((Array)$row,['name','slug']);
            }
            $submissions[] = $submission;
        }
        if ($paginate) {
            $rows->setCollection($submissions);
            return $rows;
        } else {
            return $submissions;
        }
    }
}
