<?php 

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Site;
use App\Libraries\CustomAuth;

class CustomAuthentication
{

    protected $auth;
    protected $cas;

    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
        $this->customAuth = new CustomAuth();
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!Auth::user()){           
            $return = $this->customAuth->authenticate();
            if(isset($return)){
                return $return;
            }
        }   
        return $next($request);
    }
}
