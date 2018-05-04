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
        // $this->middleware('auth');
    }
    
    public function list_all_tags(Request $request) {
        if (Auth::user()->site_admin) {
            $tags = Tag::whereHas('group', function($q){
                $q->where('site_id','=',config('app.site')->id);
            })->orderBy('group_id','name')->get();
        } else {
            $tags = Tag::whereHas('group', function($q){
                $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->apps_admin_groups);
            })->orderBy('group_id','name')->get();
        }
        return $tags;
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
