<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\App;
use App\User;
use App\AppVersion;
use App\AppDevelopers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class AppController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request) {
        if (Input::has('limit') || !Auth::user()->site_admin) {
            return App::where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_apps)->get();
        } else {
            return App::where('site_id',config('app.site')->id)->get();
        }
    }

    public function show(App $app) {
        // return $app;
        return AppVersion::where('app_id','=',$app->id)->orderBy('created_at', 'desc')->first();
    }

    public function create(Request $request) {
        $this->validate($request,['name'=>['required']]);
        $app = new App($request->all());
        $app->site_id = Auth::user()->site->id;
        $app->save();
        $app->add_developer(Auth::user(),true);
        $app_version = new AppVersion($request->all());
        $app_version->app_id = $app->id;
        return $app;
    }

    public function code(Request $request, App $app) { 
        $app_version = AppVersion::where('app_id','=',$app->id)->orderBy('created_at', 'desc')->first();
        if($app_version->stable){
            $app_version = new AppVersion();
            $app_version->app_id = $app->id;
        }
        $app_version->code = $request->code;
        $app_version->save();
        return $app_version;
    }
    public function version(Request $request, App $app) { 
        $app_version = AppVersion::where('app_id','=',$app->id)->orderBy('created_at', 'desc')->first();
        $app_version->summary = $request->summary;
        $app_version->description = $request->description;
        $app_version->stable = true;
        $app_version->save();
        return $app_version;
    }
    public function update(Request $request, App $app) {  
        // $app->code = $request->code;
        $app->name = $request->name;
        $app->save();
        return $app;
    }

    public function destroy(App $app) {
        if ($app->delete()) {
            return 1;
        }
    }
    public function admin(App $app) {
                // return ;

        return view('adminApp', ['app'=>AppVersion::where('app_id','=',$app->id)->orderBy('created_at', 'desc')->first()]);
    }
    public function list_members(Group $group)
    {
        return $group->list_members();
    }

    public function list_developers(App $app)
    {
        return $app->list_developers();
    }
    public function add_developer(App $app, User $user, Request $request)
    {
        if ($request->has('status')) {
            return $app->add_developer($user,$request->status);
        } else {
            return $app->add_developer($user);
        }
    }
    public function remove_developer(App $app, User $user)
    {
        return $app->remove_developer($user);
    }

}
