<?php

namespace App\Http\Controllers;

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
        $apps = App::all();
        foreach($apps as $key => $app) {
            $apps[$key]->code = json_decode($app->code);
        }
        return $apps;
    }

    public function show(App $app) {
        $app->code = json_decode($app->code);
        return $app;
    }

    public function create(Request $request) {
        $this->validate($request,['name'=>['required']]);
        $app = new App($request->all());
        $app->site_id = 1; // Get current Site info from??
        $app->save();
        return $app;
    }

    public function update(Request $request, App $app) {   
        $app->code = json_encode($request->get('code'));
        $app->update($request->all());
        $app->code = json_decode($app->code);
        return $app;
    }

    public function destroy(App $app) {
        if ($app->delete()) {
            return 1;
        }
    }
    public function admin(App $app) {
        $app->code = json_decode($app->code);
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
