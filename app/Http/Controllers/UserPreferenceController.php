<?php

namespace App\Http\Controllers;
use App\UserPreference;
use App\AppInstance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }
    
    public function update(AppInstance $appInstance, Request $request)
    {
        return $appInstance->set_preference(Auth::user() , $request->get('preferences'));
    }
}
