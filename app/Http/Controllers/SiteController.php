<?php

namespace App\Http\Controllers;

use App\Site;
use Illuminate\Http\Request;

class SiteController extends Controller
{
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
