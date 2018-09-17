<?

namespace App\Http\Middleware;

use Closure;

class ForceHTTPS {

    public function handle($request, Closure $next)
    {
            if (!$request->secure() && config('app.force_https')) {
                return redirect()->secure($request->getRequestUri());
            }

            return $next($request); 
    }
}