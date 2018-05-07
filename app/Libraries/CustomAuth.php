<?php 

namespace App\Libraries;
use App\Libraries\CASAuth;

class CustomAuth {

    public function authenticate() {
      if (config('app.site')->auth == 'CAS') {        
        $cas = new CASAuth();
        $cas->handle();
      }
    }
}