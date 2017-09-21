<?php 

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Site;

class AlternateAuthentication
{

    protected $auth;
    protected $cas;

    public function __construct(Guard $auth)
    {
        $this->auth = $auth;

        // Build CAS Configuration from Site Configuration
        if (config('app.site')->auth == 'CAS') {
            $cas_config = [];
            foreach(config('app.site')->auth_config as $key => $value) {
                $cas_config['cas.'.$key] = $value;
            }
            config($cas_config);
            $this->cas = app('cas');
        }
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
        // Only run if we're not already authenticated
        if (!Auth::check()) {
            // Check to see if CAS is enabled for this domain
            if (config('app.site')->auth == 'CAS') {
                if( $this->cas->isAuthenticated() )
                {
                    if (config('cas.cas_enable_saml')) {
                        $user_exists = true;
                        $user_attributes = $this->cas->getAttributes();
                        $user = User::where('unique_id', '=', 
                            $user_attributes[config('cas.cas_saml_map')->unique_id])->first();
                        // If User doesn't exist, create a new user
                        if ($user === null) {
                            $user_exists = false;
                            $user = new User();
                            $user->unique_id = $user_attributes[config('cas.cas_saml_map')->unique_id];
                        }
                        // Update user params with attributes from CAS
                        $user->first_name = $user_attributes[config('cas.cas_saml_map')->first_name];
                        $user->last_name = $user_attributes[config('cas.cas_saml_map')->last_name];
                        $user->email = $user_attributes[config('cas.cas_saml_map')->email];
                        $user->params = $user_attributes;
                        $user->save();

                        // Add the new user as a member of the current site
                        if (!$user_exists) {
                            config('app.site')->add_member($user,false,false);
                        }
                        
                        Auth::login($user, true);
                    } else {
                        $user = User::where('unique_id', '=', cas()->user())->first();
                        if ($user === null) {
                            return response('Error: This account does not exist', 401);
                        } else {
                            Auth::login($user, true);
                        }
                    }
                } else {
                    if ($request->ajax() || $request->wantsJson()) {
                        return response('Unauthorized.', 401);
                    }
                    $this->cas->authenticate();
                }
            }
        }     
        return $next($request);
    }
}
