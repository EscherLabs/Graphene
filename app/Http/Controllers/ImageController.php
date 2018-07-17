<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use Storage;
use App\Image;
use App\User;
use App\Group;

class ImageController extends Controller
{
    private $img_dir = '';

    public function __construct()
    {
        $this->img_dir = config('filesystems.disks.local.root').'/images';
    }
    
    public function get(Image $image) {
        session_write_close();
        // response()->header('Cache-Control', 'no-cache, must-revalidate');
        $headers = [
            "Cache-Control"=>"max-age=86400",
            "Pragma"=>"cache",
            "Content-Disposition"=>'inline; filename="'.$image->name.'.'.$image->ext.'"'
        ];
        $img_path = $this->img_dir.'/'.$image->id.'.'.$image->ext;
        if (file_exists($img_path)) {
            return response()->file($img_path, $headers);
        } else {
            abort(404);
        }
    }
    public function list_all_images(Request $request) {
        if (Auth::user()->site_admin) {
            $images = Image::whereHas('group', function($q){
                $q->where('site_id','=',config('app.site')->id);
            })->orderBy('group_id','name')->get();        
        } else {
            $images = Image::whereHas('group', function($q){
                $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->content_admin_groups);
            })->orderBy('group_id','name')->get();
        }
        return $images;
    }

    public function create(Request $request)
    {
        $image = new Image([
            'group_id'=>$request->group_id,
            'name'=>pathinfo($request->file('image_filename')->getClientOriginalName(), PATHINFO_FILENAME),
            'mime_type'=>$request->file('image_filename')->getClientMimeType(),
            'ext'=>pathinfo($request->file('image_filename')->getClientOriginalName(), PATHINFO_EXTENSION),
        ]);
        $image->save();

        $path = Storage::putFileAs(
            'images/', $request->file('image_filename'), $image->id.'.'.$image->ext
        );
        return $image;
    }

    public function update(Request $request, Image $image)
    {
        $data = $request->all();
        $image->update($data);
        return $image;
    }

    public function destroy(Image $image)
    {
        Storage::delete($this->img_dir.'/'.$image->id.'.'.$image->ext);
        if ($image->delete()) {
            return 1;
        }
    }
}
