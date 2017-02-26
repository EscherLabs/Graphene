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
        $apps = App::all()->where('site_id',Auth::user()->site->id);
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
        return $app;
    }

    public function update(Request $request, App $app) {   
        //dd($request->all());
        $app->update($request->all());
        return $app;
    }

    public function destroy(App $app) {
        if ($app->delete()) {
            return 1;
        }
    }
    public function admin(App $app) {
        return view('adminAppnew', ['app'=>$app]);
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
