<?php

namespace App\Http\Controllers;

use App\Endpoint;
use Illuminate\Http\Request;

class EndpointController extends Controller
{
    public function index()
    {
        $endpoints = Endpoint::all()->where('site_id',1); // Get current Site info from??
        foreach($endpoints as $key => $endpoint) {
            $endpoints[$key]->credentials = json_decode($app->credentials);
        }
        return $endpoints;
    }

    public function show(Endpoint $endpoint)
    {
        $endpoint->credentials = json_decode($endpoint->credentials);
        return $endpoint;
    }

    public function create(Request $request)
    {
        $this->validate($request,['name'=>['required'],'type'=>['required']]);
        $endpoint = new Endpoint($request->all());
        $endpoint->site_id = 1; // Get current Site info from??
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
