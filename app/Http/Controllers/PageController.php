<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except('show');
    }
    
    public function index()
    {
        $pages = Page::whereHas('group', function($q){
            $q->where('site_id','=',config('app.site')->id);
        })->get();
        return $pages;
    }

    public function show(Page $page)
    {
        if (!$page->public) {
            $this->authorize('get_data', $page);
        } 
        return $page;
    }

    public function create(Request $request)
    {
        $page = new Page($request->all());
        $page->save();
        return $page;
    }

    public function update(Request $request, Page $page)
    {
        $page->update($request->all());
        return $page;
    }

    public function destroy(Page $page)
    {
        if ($page->delete()) {
            return 1;
        }
    }

    public function run($slug, Request $request) {
        if (Auth::check()) { /* User is Authenticated */
            // Code goes here
            //$myPage = Page!
        } else { /* User is not Authenticated */
            // More different code goes here
            //$myPage = Page!
        }

        if($myPage != null) {
            // Other code goes here
            return view('page', ['apps'=>[],'name'=>$myPage->name, 'data'=>$myPage->content]);
        }
        abort(404,'App not found');
    }
}
