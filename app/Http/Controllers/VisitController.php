<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Visit;

class VisitController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }
    
    public function log_visit(Request $request)
    {
        $visit = new Visit($request->all());
        $visit->user_id = Auth::user()->id;
        $visit->save();
        return $visit;
    }
}
