<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Closure;
use App\Site;

class Initialization
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
        $current_site = Site::select('id','domain','name','auth','auth_config')->where('domain','=',$request->server('SERVER_NAME'))->first();

        /* Site does not exist */
        if (is_null($current_site)) {
            abort(500, 'The Current Site Does Not Exist');
        }

        config(['app.site' => $current_site]);

        return $next($request);
    }
}
