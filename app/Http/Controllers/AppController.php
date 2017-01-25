<?php

namespace App\Http\Controllers;

use App\App;
use Illuminate\Http\Request;

class AppController extends Controller
{

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
}
