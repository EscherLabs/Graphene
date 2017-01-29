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
        $credentials = $endpoint->credentials;
        if ($endpoint->type == 'http_basic_auth' || $endpoint->type == 'http_no_auth') {
            $endpoint->credentials = json_encode($credentials);
            $endpoint->save();
            $endpoint->credentials = $credentials;
        } else if ($endpoint->type == 'google_sheets') {
            $endpoint->credentials = json_encode($credentials);
            $endpoint->save();
            $googleClient = new \PulkitJalan\Google\Client(config('google'));
            $client = $googleClient->getClient();
            $client->setState(base64_encode(json_encode(['endpoint_id'=>$endpoint->id])));
            $authUrl = $client->createAuthUrl();
            $credentials['google_redirect'] = $authUrl;
            $endpoint->credentials = json_encode($credentials);
            $endpoint->save();
            $endpoint->credentials = $credentials;
        }
        return $endpoint;
    }

    public function update(Request $request, Endpoint $endpoint)
    {
        $newData = $request->all();
        if ($request->has('credentials')) {
            $newCredentials = array_merge($request->credentials,json_decode($endpoint->credentials,true));
            $newData->credentials = $newCredentials;
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

    public function google_callback(Request $request) {
        $state = json_decode(base64_decode($request->state),true);
        $endpoint = Endpoint::find($state['endpoint_id']);
        $credentials = json_decode($endpoint->credentials,true);
        $googleClient = new \PulkitJalan\Google\Client(config('google'));
        $client = $googleClient->getClient();
        $credentials['accessToken'] = $client->fetchAccessTokenWithAuthCode($request->code);
        $credentials['google_redirect'] = 'Successfully Configured';
        $endpoint->credentials = json_encode($credentials);
        $endpoint->save();
    }
}
