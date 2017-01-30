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
            $endpoints[$key]->config = json_decode($endpoint->config);
        }
        return $endpoints;
    }

    // Don't Allow Show Endpoint for security reasons
    // public function show(Endpoint $endpoint)
    // {
    //     $endpoint->config = json_decode($endpoint->config);
    //     return $endpoint;
    // }

    public function create(Request $request)
    {
        $this->validate($request,['name'=>['required'],'type'=>['required']]);
        $endpoint = new Endpoint($request->all());
        $endpoint->site_id = 1; // Get current Site info from??
        $endpoint->group_id = $request->get('group_id');
        $config = $endpoint->config;
        if ($endpoint->type == 'http_basic_auth' || $endpoint->type == 'http_no_auth') {
            $endpoint->config = json_encode($config);
            $endpoint->save();
            $endpoint->config = $config;
        } else if ($endpoint->type == 'google_sheets') {
            $endpoint->config = json_encode($config);
            $endpoint->save();
            $googleClient = new \PulkitJalan\Google\Client(config('google'));
            $client = $googleClient->getClient();
            $client->setState(base64_encode(json_encode(['endpoint_id'=>$endpoint->id])));
            $authUrl = $client->createAuthUrl();
            $config['google_redirect'] = $authUrl;
            $endpoint->config = json_encode($config);
            $endpoint->save();
            $endpoint->config = $config;
        }
        return $endpoint;
    }

    public function update(Request $request, Endpoint $endpoint)
    {
        $newData = $request->all();
        if ($request->has('config')) {
            $newConfig = array_merge(json_decode($endpoint->config,true),$request->config);
            $newData['config'] = json_encode($newConfig);
        }
        $endpoint->update($newData);
        $endpoint->config = json_decode($endpoint->config);
        return $endpoint;
    }

    public function destroy(Endpoint $endpoint)
    {
        if ($endpoint->delete()) {
            return 1;
        }
    }

    public function google_callback(Request $request) {
        $state = json_decode(base64_decode($request->state),true);
        $endpoint = Endpoint::find($state['endpoint_id']);
        $config = json_decode($endpoint->config,true);
        $googleClient = new \PulkitJalan\Google\Client(config('google'));
        $client = $googleClient->getClient();
        $config['accessToken'] = $client->fetchAccessTokenWithAuthCode($request->code);
        $config['google_redirect'] = 'Successfully Configured';
        $endpoint->config = json_encode($config);
        $endpoint->save();
    }
}
