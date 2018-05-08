<?php 

namespace App\Libraries;
use App\Libraries\CASAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;

class CustomAuth {

  public function __construct()
  {
    if (config('app.site')->auth == 'CAS') {        
      $this->cas = new CASAuth();
    }
  }

    public function authenticate() {
      if (config('app.site')->auth == 'CAS') {        
            if(!Auth::user()){           
                $this->cas->handle();

                if(Auth::user()){
                    return redirect()->back();
                }
            }
       } else {
        return redirect('/login?redirect='.URL::full());
      }
    }
}