<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Site;
use App\SiteMember;
use Illuminate\Http\Request;
use Leafo\ScssPhp\Compiler;

class SiteController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }
    
    public function index()
    {
        return Site::whereHas('members', function($q){
            $q->where('user_id','=',Auth::user()->id)->where('site_admin','=',1);
        })->get();
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
        $site_config = $request->all();
        if($request->has('templates') && $request->get('templates') == 'false'){
            $site_config['templates'] = ['partials'=>[]];
        }

        // $scss = new Compiler();
        // return $scss->compile( $site_config['theme']['css']);


        $site->update($site_config);
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

    public function list_admins(Site $site)
    {
        return $site->list_admins();
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
