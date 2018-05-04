<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Closure;
use App\User;
use App\Site;
use App\App;
use App\AppDeveloper;
use App\GroupMember;
use App\SiteMember;
use App\GroupAdmin;
use App\Group;
use App\GroupComposite;
use App\Tag;

class HTTPBasicAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $logged_in = false;
        if ($request->header('PHP_AUTH_USER', null) && $request->header('PHP_AUTH_PW', null)) {
            $username = $request->header('PHP_AUTH_USER');
            $password = $request->header('PHP_AUTH_PW');
            if ($username === 'api' && $password === 'api') {
                $logged_in = true;
            }
        }
    
        if ($logged_in === false) {
            $headers = ['WWW-Authenticate' => 'Basic'];
            return response()->make('Invalid credentials.', 401, $headers);
        } else {
            return $next($request);
        }    
    }
}
