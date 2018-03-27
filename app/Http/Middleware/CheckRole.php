<?php

namespace App\Http\Middleware;

use Closure;

class CheckRole
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle($request, Closure $next, $role)
    {
        switch ($role) {
            case 'site_admin':
                if (! $request->user()->site_admin !== true) {
                    abort(403, 'Unauthorized action.');
                }
                break;
            case 'developer':
                if (! $request->user()->developer !== true) {
                    abort(403, 'Unauthorized action.');
                }
                break;
            case 'group_admin':
                if (count($request->user()->content_admin_groups)+count($request->user()->apps_admin_groups) === 0) {
                    abort(403, 'Unauthorized action.');
                }
                break;
            default:
                throw new Exception('Invalid Role');
        }
        
        return $next($request);
    }

}