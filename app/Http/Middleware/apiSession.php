<?php

namespace App\Http\Middleware;

use Closure;

class ApiSession
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        config(['session.driver' =>'nosave_database']);
        return $next($request);
    }
}