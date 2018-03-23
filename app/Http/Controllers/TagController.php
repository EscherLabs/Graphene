<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Tag;
use App\User;
use App\Group;

class TagController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        return Tag::whereHas('group', function($q){
            $q->where('site_id','=',config('app.site')->id)->whereIn('id', Auth::user()->admin_groups);
        })->get();
    }

    public function create(Request $request)
    {
        $tag = new Tag($request->all());
        $tag->save();
        return $tag;
    }

    public function update(Request $request, Tag $tag)
    {
        $data = $request->all();
        $tag->update($data);
        return $tag;
    }

    public function destroy(Tag $tag)
    {
        if ($tag->delete()) {
            return 1;
        }
    }
}
