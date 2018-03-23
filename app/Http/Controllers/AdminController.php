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
       return view('admin', ['resource'=>$resource,'id'=>'']);
    }    
    public function members(Group $group) {
       return view('admin', ['resource'=>'members','id'=>$group->id]);
    }
    public function admins(Group $group) {
       return view('admin', ['resource'=>'admins','id'=>$group->id]);
    }
    public function developers(App $app) {
       return view('admin', ['resource'=>'developers','id'=>$app->id]);
    }
    public function composites(Group $group) {
        return view('admin', ['resource'=>'composites','id'=>$group->id]);
    }
    public function tags(Group $group) {
        return view('admin', ['resource'=>'tags','id'=>$group->id]);
    }
    public function images(Group $group) {
       return view('admin', ['resource'=>'images','id'=>$group->id]);
    }

    
    public function pages(Group $group) {
        return view('admin', ['resource'=>'pages','id'=>$group->id]);
    }
    public function appinstances(Group $group) {
        return view('admin', ['resource'=>'appinstances','id'=>$group->id]);
    }
    public function endpoints(Group $group) {
        return view('admin', ['resource'=>'endpoints','id'=>$group->id]);
    }
    public function summary(Group $group) {
        return view('admin', ['resource'=>'group','id'=>$group->id]);
    }
}
