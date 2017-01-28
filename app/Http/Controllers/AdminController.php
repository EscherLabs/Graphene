<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Group;
use App\App;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index($resource = null) {
     return view('admin', ['resource'=>$resource]);
    }    
    public function members(Group $group) {
     return view('admin', ['resource'=>'members']);
    }
    public function admins(Group $group) {
     return view('admin', ['resource'=>'admins']);
    }
    public function developers(App $app) {
     return view('admin', ['resource'=>'developers']);
    }
}
