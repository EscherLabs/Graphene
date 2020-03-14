<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Gumlet\ImageResize;
use Storage;
use App\WorkflowSubmissionFile;
use App\WorkflowSubmission;
use App\WorkflowInstance;
use App\User;
use App\Group;

class WorkflowSubmissionFileController extends Controller
{
    public function get(WorkflowSubmission $workflow_submission, WorkflowSubmissionFile $file, $download=false) {
        if ($workflow_submission->id != $file->workflow_submission_id) {
            return response('File '.$file->id.' does not belong to workflow submission '.$workflow_submission->id, 400);
        }
        $max_age = 2592000;  // Cache File for 30 days
        $attachment_or_inline = ($download)?'attachment':'inline';
        $headers = [
            "Cache-Control"=>"max-age=".$max_age,
            "Pragma"=>"cache",
            "Content-Type" => $file->mime_type,
            "Content-Disposition"=>$attachment_or_inline.'; filename="'.$file->name.'.'.$file->ext.'"'
        ];
        $file_path = $file->root_dir().'/'.$file->file_dir().'/'.$file->id.'.'.$file->ext;
        $unencrypted_file_exists = file_exists($file_path) && is_file($file_path);
        $encrypted_file_exists = file_exists($file_path.'.encrypted') && is_file($file_path.'.encrypted');
        if ($unencrypted_file_exists) {
            return response()->file($file_path, $headers);
        } else if ($encrypted_file_exists) {
            return response()->make(decrypt(Storage::get($file->file_dir().'/'.$file->id.'.'.$file->ext.'.encrypted')), 200, $headers);            
        } else {
            return response('File Not Found', 404);
        }
    }

    public function download(WorkflowSubmission $workflow_submission, WorkflowSubmissionFile $file) {
        return $this->get($workflow_submission,$file,true);
    }

    public function list_all_files(Request $request, WorkflowSubmission $workflow_submission) {
        $files = WorkflowSubmissionFile::withTrashed()->where('workflow_submission_id',$workflow_submission->id)->get();
        return $files;
    }

    public function create(Request $request, WorkflowSubmission $workflow_submission)
    {
        $request->validate(['file' => 'required|max:10240']);
        $file = new WorkflowSubmissionFile([
            'workflow_submission_id'=>$workflow_submission->id,
            'name'=>pathinfo($request->file('file')->getClientOriginalName(), PATHINFO_FILENAME),
            'mime_type'=>$request->file('file')->getClientMimeType(),
            'ext'=>strtolower(pathinfo($request->file('file')->getClientOriginalName(), PATHINFO_EXTENSION)),
        ]);
        $file->user_id_created = Auth::user()->id;
        $file->save();

        // If Image, Resize
        if (in_array($file->ext,['png','jpg','jpeg','gif','webp'])) {
            $image = new ImageResize($request->file('file')->getRealPath());
            $image->resizeToLongSide(1024);
            if(!Storage::exists($file->file_dir())) { Storage::makeDirectory($file->file_dir());}
            $image->save($file->root_dir().'/'.$file->file_dir().'/'.$file->id.'.'.$file->ext);
        } else {
            $path = Storage::putFileAs(
                $file->file_dir(), $request->file('file'), $file->id.'.'.$file->ext
            );
        }
        // Encrypt File If Required
        $instance = WorkflowInstance::where('id',$workflow_submission->workflow_instance_id)->select('configuration')->first();
        if (isset($instance->configuration->encrypted) && ($instance->configuration->encrypted === true)) {
            $encrypted_file = encrypt(Storage::get($file->file_dir().'/'.$file->id.'.'.$file->ext));
            Storage::put($file->file_dir().'/'.$file->id.'.'.$file->ext.'.encrypted', $encrypted_file);
            Storage::delete($file->file_dir().'/'.$file->id.'.'.$file->ext);
        }
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
        Storage::delete($file->file_dir().'/'.$file->id.'.'.$file->ext);
        Storage::delete($file->file_dir().'/'.$file->id.'.'.$file->ext.'.encrypted');
        $file->user_id_deleted = Auth::user()->id;
        $file->save();
        if ($file->delete()) {
            return $file;
        }
    }
}
