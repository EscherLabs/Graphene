<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        return User::all()->where('site_id',1); // Get current Site info from??
    }

    public function show(User $user)
    {
        return $user;
    }

    public function create(Request $request)
    {
        $this->validate($request,['name'=>['required'],'email'=>['required']]);
        $user = new User($request->all());
        $user->site_id = 1; // Get current Site info from??
        $user->save();
        return $user;
    }

    public function update(Request $request, User $user)
    {
        $user->update($request->all());
        return $user;
    }

    public function destroy(User $user)
    {
        if ($user->delete()) {
            return 1;
        }
    }
}
