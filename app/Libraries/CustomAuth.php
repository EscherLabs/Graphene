<?php 

namespace App\Libraries;
use App\Libraries\CASAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Request;

class CustomAuth {

  public function __construct()
  {
    if (config('app.site')->auth == 'CAS') {        
      $this->cas = new CASAuth();
    }
  }

    public function authenticate(Request $request, $skip = false) {
      if (config('app.site')->auth == 'CAS') {        
            if(!Auth::user()){           
                $this->cas->handle($skip && !$request->is('login*'));

                if(Auth::user()){
                    return redirect()->back();
                }
            }
       } else {
        if(!$request->is('login*')){
          return redirect('/login?redirect='.urlencode(URL::full()));
        }
      }
    }
}