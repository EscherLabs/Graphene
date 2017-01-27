<?php

namespace App\Http\Controllers;

use App\Endpoint;
use App\Group;
use Illuminate\Http\Request;

class EndpointController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        return Endpoint::all();
        // $endpoints = Endpoint::select('')->get('id,name'); 
        // foreach($endpoints as $key => $endpoint) {
        //     $endpoints[$key]->credentials = json_decode($app->credentials);
        // }
        // return $endpoints;
    }

    // Don't Allow Show Endpoint for security reasons
    // public function show(Endpoint $endpoint)
    // {
    //     $endpoint->credentials = json_decode($endpoint->credentials);
    //     return $endpoint;
    // }

    public function create(Request $request, Group $group)
    {
        $this->validate($request,['name'=>['required'],'type'=>['required']]);
        $endpoint = new Endpoint($request->all());
        $endpoint->site_id = 1; // Get current Site info from??
        $endpoint->group_id = $group->id;
        $endpoint->save();
        return $endpoint;
    }

    public function update(Request $request, Endpoint $endpoint)
    {
        $endpoint->update($request->all());
        return $endpoint;
    }

    public function destroy(Endpoint $endpoint)
    {
        if ($endpoint->delete()) {
            return 1;
        }
    }
}
