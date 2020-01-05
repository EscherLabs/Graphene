<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Gumlet\ImageResize;

use Storage;
use App\Image;
use App\User;
use App\Group;

class ImageController extends Controller
{
    private $root_dir = '';
    private $img_dir = '';
    private $img_dir_DEPRECATED = '';

    public function __construct() {
        $this->root_dir = config('filesystems.disks.local.root');
        $this->img_dir = 'sites/'.config('app.site')->id.'/images';
        $this->img_dir_DEPRECATED = 'images';
    }
    
    public function get(Image $image) {
        // Check to see if the user can view this image
        if (!$image->public) {
            if (!Auth::check() || !Auth::user()->can('get', $image)) {
                return response('Permission Denied',403);
            }
        }
        $max_age = 2592000; // Cache Images for 30 days
        $headers = [
            "Cache-Control"=>"max-age=".$max_age,
            "Pragma"=>"cache",
            "Content-Disposition"=>'inline; filename="'.$image->name.'.'.$image->ext.'"'
        ];
        $img_path = $this->root_dir.'/'.$this->img_dir.'/'.$image->id.'.'.$image->ext;
        $img_path_DEPRECATED = $this->root_dir.'/'.$this->img_dir_DEPRECATED.'/'.$image->id.'.'.$image->ext;
        if (file_exists($img_path) && is_file($img_path)) {
            return response()->file($img_path, $headers);
        } // HANDLE OLD IMAGE PATHS (Not Multi-Site Compatible)
        else if (file_exists($img_path_DEPRECATED) && is_file($img_path_DEPRECATED)) {
            Storage::move(
                $this->img_dir_DEPRECATED.'/'.$image->id.'.'.$image->ext, 
                $this->img_dir.'/'.$image->id.'.'.$image->ext
            );
            return response()->file($img_path, $headers);
        } else {
            return response('Image Not Found', 404);
        }
    }
    public function list_all_images(Request $request) {
        if (Auth::user()->site_admin) {
            $images = Image::whereHas('group', function($q){
                $q->where('site_id','=',config('app.site')->id);
            })->orderBy('group_id','desc')->orderBy('name','desc')->get();        
        } else {
            $images = Image::whereHas('group', function($q){
                $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->content_admin_groups);
            })->orderBy('group_id','desc')->orderBy('name','desc')->get();        
        }
        return $images;
    }

    public function create(Request $request)
    {
        $request->validate(['image_filename' => 'required|max:10240']);
        $image = new Image([
            'group_id'=>$request->group_id,
            'name'=>pathinfo($request->file('image_filename')->getClientOriginalName(), PATHINFO_FILENAME),
            'mime_type'=>$request->file('image_filename')->getClientMimeType(),
            'ext'=>strtolower(pathinfo($request->file('image_filename')->getClientOriginalName(), PATHINFO_EXTENSION)),
        ]);
        $image->public = (isset($request->public) && ($request->public===true || $request->public==="true"));
        $image->save();

        // If Supported Image Type, Resize -- Disabled for now
        if (in_array($image->ext,[/*'png','jpg','jpeg','gif','webp'*/])) {
            $img = new ImageResize($request->file('image_filename')->getRealPath());
            $img->resizeToLongSide(1024);
            if(!Storage::exists($this->img_dir)) { Storage::makeDirectory($this->img_dir);}
            $img->save($this->root_dir.'/'.$this->img_dir.'/'.$image->id.'.'.$image->ext);
        } else {
            $path = Storage::putFileAs(
                $this->img_dir, $request->file('image_filename'), $image->id.'.'.$image->ext
            );
        }
        return $image;
    }

    public function update(Request $request, Image $image)
    {
        $data = $request->all();
        $data['public'] = (isset($request->public) && ($request->public===true || $request->public==="true"));
        $image->update($data);
        return $image;
    }

    public function destroy(Image $image)
    {
        $img = $this->img_dir.'/'.$image->id.'.'.$image->ext;
        Storage::delete($this->img_dir.'/'.$image->id.'.'.$image->ext);
        if ($image->delete()) {
            return 1;
        }
    }
}
