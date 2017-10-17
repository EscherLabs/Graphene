<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Site;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        if (config('app.master_site')==request()->server('SERVER_NAME')) {
            return Site::all();
        } else {
            return [config('app.site')];
        }
    }

    public function admin(Site $site) {
        return view('admin', ['resource'=>'site','id'=>$site->id]);
       }
   

    public function show(Site $site)
    {
        return $site;
    }

    public function create(Request $request)
    {
        $this->validate($request,['domain'=>['required']]);
        $site = new Site($request->all());
        $site->save();

        return $site;
    }

    public function update(Request $request, Site $site)
    {
        $site->update($request->all());
        return $site;
    }

    public function destroy(Site $site)
    {
        if ($site->delete()) {
            return 1;
        }
    }

    public function list_members(Site $site)
    {
        return $site->list_members();
    }
    public function add_member(Site $site, User $user, Request $request)
    {
        return $site->add_member($user,$request->site_admin, $request->developer);
    }
    public function remove_member(Site $site, User $user)
    {
        return $site->remove_member($user);
    }

}
