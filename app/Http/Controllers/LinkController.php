<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Link;
use App\User;
use App\Group;

class LinkController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        return Link::whereHas('group', function($q){
            $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->admin_groups);
        })->orderBy('title')->get();
    }

    public function user_index()
    {
        return Link::whereIn('group_id',Auth::user()->groups)->orderBy('title')->get();
    }

    public function create(Request $request)
    {
        $link = new Link($request->all());
        $link->save();
        return $link;
    }

    public function update(Request $request, Link $link)
    {
        $data = $request->all();
        $link->update($data);
        return $link;
    }

    public function destroy(Link $link)
    {
        if ($link->delete()) {
            return 1;
        }
    }
}
