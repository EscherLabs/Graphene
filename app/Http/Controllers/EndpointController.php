<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Endpoint;
use App\Group;
use Illuminate\Http\Request;

class EndpointController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }
    
    public function list_all_endpoints(Request $request) {
        if (Auth::user()->site_admin) {
            $endpoints = Endpoint::select('id','group_id','name','type')->whereHas('group', function($q){
                $q->where('site_id','=',config('app.site')->id);
            })->with('group')->orderBy('group_id','desc')->orderBy('name','desc')->get();
        } else {
            $endpoints = Endpoint::select('id','group_id','name','type')->whereHas('group', function($q){
                $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->apps_admin_groups);
            })->with('group')->orderBy('group_id','desc')->orderBy('name','desc')->get();
        }
        return $endpoints;
    }

    public function create(Request $request)
    {
        $this->validate($request,['name'=>['required'],'type'=>['required']]);
        $endpoint = new Endpoint($request->all());
        $endpoint->site_id = Auth::user()->site->id; 
        $endpoint->group_id = $request->get('group_id');
        if ($endpoint->type == 'http_basic_auth' || $endpoint->type == 'http_no_auth') {
            $endpoint->save();
        } 
        // else if ($endpoint->type == 'google_sheets') {
        //     $endpoint->save();
        //     $googleClient = new \PulkitJalan\Google\Client(config('google'));
        //     $client = $googleClient->getClient();
        //     $client->setState(base64_encode(json_encode(['endpoint_id'=>$endpoint->id])));
        //     $client->setAccessType('offline'); // required to get refresh access token!
        //     $client->setPrompt('consent'); // required to get refresh access token!
        //     $authUrl = $client->createAuthUrl();
        //     $endpoint->config->google_redirect = $authUrl;
        //     $endpoint->save();
        // }
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

    // public function google_callback(Request $request) {
    //     $state = json_decode(base64_decode($request->state),true);
    //     $endpoint = Endpoint::find($state['endpoint_id']);
    //     $googleClient = new \PulkitJalan\Google\Client(config('google'));
    //     $client = $googleClient->getClient();
    //     $endpoint->config->secret = $client->fetchAccessTokenWithAuthCode($request->code);
    //     $endpoint->config->google_redirect = 'Successfully Configured';
    //     $endpoint->save();
    // }
}
