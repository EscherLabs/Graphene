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
        // return Endpoint::all();
        $endpoints = Endpoint::all(); 
        foreach($endpoints as $key => $endpoint) {
            $endpoints[$key]->credentials = json_decode($endpoint->credentials);
        }
        return $endpoints;
    }

    // Don't Allow Show Endpoint for security reasons
    // public function show(Endpoint $endpoint)
    // {
    //     $endpoint->credentials = json_decode($endpoint->credentials);
    //     return $endpoint;
    // }

    public function create(Request $request)
    {
        $this->validate($request,['name'=>['required'],'type'=>['required']]);
        $endpoint = new Endpoint($request->all());
        $endpoint->site_id = 1; // Get current Site info from??
        $endpoint->group_id = $request->get('group_id');
        $endpoint->credentials = json_encode($endpoint->credentials);
        $endpoint->save();
        $endpoint->credentials = json_decode($endpoint->credentials);

        return $endpoint;
    }

    public function update(Request $request, Endpoint $endpoint)
    {
        $newData = $request->all();
        if(isset($newData['credentials'])){
            $newData['credentials'] = json_encode($newData['credentials']);
        }
        $endpoint->update($newData);
        $endpoint->credentials = json_decode($endpoint->credentials);
        return $endpoint;
    }

    public function destroy(Endpoint $endpoint)
    {
        if ($endpoint->delete()) {
            return 1;
        }
    }
}
