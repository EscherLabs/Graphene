<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use Storage;
use App\WorkflowSubmissionFile;
use App\WorkflowSubmission;
use App\User;
use App\Group;

class WorkflowSubmissionFileController extends Controller
{
    private $root_dir = '';
    private $file_dir = '';
    private $file_dir_DEPRECATED = '';

    public function __construct() {
        $this->root_dir = config('filesystems.disks.local.root');
        $this->file_dir = 'sites/'.config('app.site')->id.'/workflow_submissions/files';
    }
    
    public function get(WorkflowSubmission $workflow_submission, WorkflowSubmissionFile $file) {
        if ($workflow_submission->id != $file->workflow_submission_id) {
            return response('File '.$file->id.' does not belong to workflow submission '.$workflow_submission->id, 400);
        }
        $max_age = 0; // Don't Cache Files
        $headers = [
            "Cache-Control"=>"max-age=".$max_age,
            "Pragma"=>"cache",
            "Content-Disposition"=>'inline; filename="'.$file->name.'.'.$file->ext.'"'
        ];
        $file_path = $this->root_dir.'/'.$this->file_dir.'/'.$file->id.'.'.$file->ext;
        if (file_exists($file_path) && is_file($file_path)) {
            return response()->file($file_path, $headers);
        } else {
            return response('File Not Found', 404);
        }
    }
    public function list_all_files(Request $request, WorkflowSubmission $workflow_submission) {
        $files = WorkflowSubmissionFile::where('workflow_submission_id',$workflow_submission->id)->get();
        return $files;
    }

    public function create(Request $request, WorkflowSubmission $workflow_submission)
    {
         $file = new File([
            'workflow_submission_id'=>$workflow_submission->id,
            'name'=>pathinfo($request->file('file')->getClientOriginalName(), PATHINFO_FILENAME),
            'mime_type'=>$request->file('file')->getClientMimeType(),
            'ext'=>pathinfo($request->file('file')->getClientOriginalName(), PATHINFO_EXTENSION),
        ]);
        $file->save();

        $path = Storage::putFileAs(
            $this->file_dir, $request->file('file'), $file->id.'.'.$file->ext
        );
        return $file;
    }

    public function update(Request $request, WorkflowSubmission $workflow_submission, WorkflowSubmissionFile $file)
    {
        if ($workflow_submission->id != $file->workflow_submission_id) {
            return response('File '.$file->id.' does not belong to workflow submission '.$workflow_submission->id, 400);
        }
        $data = $request->all();
        $file->update($data);
        return $file;
    }

    public function destroy(WorkflowSubmission $workflow_submission, WorkflowSubmissionFile $file)
    {
        if ($workflow_submission->id != $file->workflow_submission_id) {
            return response('File '.$file->id.' does not belong to workflow submission '.$workflow_submission->id, 400);
        }
        $img = $this->file_dir.'/'.$file->id.'.'.$file->ext;
        Storage::delete($this->file_dir.'/'.$file->id.'.'.$file->ext);
        if ($file->delete()) {
            return 1;
        }
    }
}
