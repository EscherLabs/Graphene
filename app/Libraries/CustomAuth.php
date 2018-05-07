<?php 

namespace App\Libraries;
use App\Libraries\CASAuth;

class CustomAuth {

  public function __construct()
  {
    if (config('app.site')->auth == 'CAS') {        
      $this->cas = new CASAuth();
    }
  }

    public function authenticate() {
      if (config('app.site')->auth == 'CAS') {        
        $this->cas->handle();
      }
    }
}