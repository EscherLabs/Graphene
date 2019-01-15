<?php 

namespace App\Libraries;
use App\Libraries\CASAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\User;

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

        if(!$skip && !$request->is('login*')){
          return redirect('/login?redirect='.urlencode(URL::full()));
        }else{
            if(!$request->is('api/usersetup*')){
              // return new Response();
              if(!count(User::get())){
              return new Response(view('setup',array('mode'=>'user')));

              }
            }
        }
      }
    }
}