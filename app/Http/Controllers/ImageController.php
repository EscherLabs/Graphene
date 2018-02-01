<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Image;
use App\User;
use App\Group;

class ImageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        return Image::whereHas('group', function($q){
            $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->admin_groups);
        })->get();
    }

    public function create(Request $request)
    {
        $image = new Image($request->all());
        $image->save();
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
        if ($image->delete()) {
            return 1;
        }
    }
}
