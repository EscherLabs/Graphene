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
        return Site::all();
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

        // After creating the site, copy the existing user as an admin of that site
        $user = Auth::user();
        $user->id = null;
        $user->site_id = $site->id;
        $user->site_admin = true;
        $user->save();
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
}
