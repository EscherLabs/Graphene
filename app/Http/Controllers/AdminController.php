<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index($resource = null) {
     return view('admin', ['resource'=>$resource]);
    }
}
