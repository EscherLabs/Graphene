<?php

namespace App\Http\Controllers;
use App\UserPreference;
use App\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }
    

    public function update($app, Request $request) {
        $user_pref = UserPreference::where(['user_id'=>Auth::user()->id, 'app_instance_id'=>$app]);
        if(is_null($user_pref)){
            $user_pref = UserPreference::create(['user_id'=>Auth::user()->id, 'app_instance_id'=>$app, 'preferences'=>json_encode($request->get('preferences'))]);

        }else{
            $user_pref = UserPreference::update(['user_id'=>Auth::user()->id, 'app_instance_id'=>$app, 'preferences'=>json_encode($request->get('preferences'))]);

        }
        return $user_pref;
    }

}
