<?php

namespace App\Http\Controllers;

use App\AppInstance;
use Illuminate\Http\Request;

class AppInstanceController extends Controller
{
        public function index()
    {
        return AppInstance::all()->where('site_id',1); // Get current Site info from??
    }

    public function show(AppInstance $app_instance)
    {
        return $app_instance->with('app')->get()->first();
    }

    public function create(Request $request)
    {
        $this->validate($request,['name'=>['required']]);
        $app_instance = new AppInstance($request->all());
        $app_instance->site_id = 1; // Get current Site info from??
        $app_instance->save();
        return $app_instance;
    }

    public function update(Request $request, AppInstance $app_instance)
    {
        $app_instance->update($request->all());
        return $app;
    }

    public function destroy(AppInstance $app_instance)
    {
        if ($app_instance->delete()) {
            return 1;
        }
    }

}
