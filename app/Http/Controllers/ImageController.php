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
    private $img_dir = 'images';

    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function get(Image $image) {
        return Storage::download(
            $this->img_dir.'/'.$image->id.'.'.$image->ext,
            $image->name.'.'.$image->ext,
            ["Cache-Control"=>"max-age=2592000","Pragma"=>"cache"]
        );
    }
    
    public function index()
    {
        return Image::whereHas('group', function($q){
            $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->admin_groups);
        })->get();
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
            $this->img_dir, $request->file('image_filename'), $image->id.'.'.$image->ext
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
