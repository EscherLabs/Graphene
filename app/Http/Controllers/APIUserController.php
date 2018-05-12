<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\APIUser;
use Illuminate\Support\Facades\Auth;

class APIUserController extends Controller
{
    public function __construct() {}

    public function list_all_api_users(Request $request) {
        $api_users = APIUser::select('id','app_name','app_secret','config')
            ->where('site_id','=',Auth::user()->site->id)->get();
        return $api_users;
    }
    
    public function show(APIUser $api_user) {
        return $api_user;
    }

    public function create(Request $request)
    {
        $api_user = new APIUser($request->all());
        $api_user->app_secret = $request->app_secret;
        $api_user->site_id = Auth::user()->site->id; 
        $api_user->save();
        return $api_user;
    }

    public function update(Request $request, APIUser $api_user)
    {
        $api_user->update($request->all());
        $api_user->app_secret = $request->app_secret;
        return $api_user;
    }

    public function destroy(APIUser $api_user)
    {
        if ($api_user->delete()) {
            return 1;
        }
    }
    
}
