<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
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
        return User::all()->where('site_id',Auth::user()->site->id);
    }

    public function show(User $user)
    {
        return $user;
    }

    public function create(Request $request)
    {
        $this->validate($request,['first_name'=>['required'],'last_name'=>['required'],'email'=>['required']]);
        $user = new User($request->all());
        $user->site_id = Auth::user()->site->id;
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
