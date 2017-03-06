<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\App;
use App\User;
use App\AppDevelopers;
use Illuminate\Http\Request;

class AppController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index() {
        $apps = App::where('site_id',Auth::user()->site->id)->get();
        return $apps;
    }

    public function show(App $app) {
        return $app;
    }

    public function create(Request $request) {
        $this->validate($request,['name'=>['required']]);
        $app = new App($request->all());
        $app->site_id = Auth::user()->site->id;
        $app->save();
        $app->add_developer(Auth::user(),true);
        return $app;
    }

    public function update(Request $request, App $app) {  
        $app->code = $request->code;
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
        return view('adminApp', ['app'=>$app]);
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
