<?php 

namespace App\Libraries;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Site;
use App\Libraries\HTTPHelper;
use Illuminate\Support\Facades\Log;

class CASAuth
{

    protected $auth;
    protected $cas;

    public function __construct()
    {

        // Build CAS Configuration from Site Configuration
        $cas_config = [];
        foreach(config('app.site')->auth_config as $key => $value) {
            $cas_config['cas.'.$key] = $value;
        }
        config($cas_config);
        $this->cas = app('cas');
    }

    private function map_user_attributes(&$user,$user_attributes) {
        $m = new \Mustache_Engine;
        // Map Default Parameters
        foreach(config('cas.cas_data_map')->default as $attribute_name => $attribute_value) {
            $new_attribute_value = $m->render($attribute_value, $user_attributes);
            // If the user attribute had something before, but doesn't now -- ignore it.
            if ($user->$attribute_name !== '' && $user->$attribute_name !== null && $new_attribute_value === '') {
                continue;
            }
            // Never update unique_id if unique_id is already set
            if ($attribute_name === 'unique_id' && isset($user->unique_id)) {
                continue;
            }
            $user->$attribute_name = $new_attribute_value;
            // Allow null emails but not empty string email
            if ($attribute_name === 'email' && $new_attribute_value === '') {
                $user->email = null;
            }
        }
        // Map Additional Parameters
        $attributes = [];
        if (isset(config('cas.cas_data_map')->additional)) {
            foreach(config('cas.cas_data_map')->additional as $attribute_name => $attribute_value) {
                $value = $m->render($attribute_value, $user_attributes);
                if ($value != '') { /* Only Update Non-Empty Attributes */
                    $attributes[$attribute_name] = $value;
                }
            }
        }
        /* Merge with existing attributes */
        $attributes = array_merge((array)$user->params,$attributes);
        $user->params = (Object)$attributes;
    }

    private function fetch_external_user_attributes($user_attributes) {
        if (config('cas.external_user_lookup')->enabled === true || config('cas.external_user_lookup')->enabled === "true") {
            $m = new \Mustache_Engine;                            
            $url = $m->render(config('cas.external_user_lookup')->url, $user_attributes);
            $username = null; $password = null;
            if (isset(config('cas.external_user_lookup')->username) && config('cas.external_user_lookup')->username !== '') {
                $username = config('cas.external_user_lookup')->username;
            }
            if (isset(config('cas.external_user_lookup')->password) && config('cas.external_user_lookup')->password !== '') {
                $password = config('cas.external_user_lookup')->password;
            }

            $httpHelper = new HTTPHelper();
            $response = $httpHelper->http_fetch(
                $url,config('cas.external_user_lookup')->verb,
                $user_attributes,
                $username,
                $password);
            if (isset($response['code']) && $response['code'] == 200 && is_array($response['content'])) {  
                return $response['content'];
            } else {
                Log::error('SSO Auth Unable to fetch External Attributes from '.$url,$user_attributes);
                return [];
            }
        } else {
            return [];
        }
    }

    private function handle_saml() {
        $m = new \Mustache_Engine;                                    
        $user_exists = true;
        $saml_attributes = $this->cas->getAttributes();
        $external_attributes = $this->fetch_external_user_attributes($saml_attributes);
        $user_attributes = array_merge($external_attributes,$saml_attributes);
        $user = User::where('unique_id', '=', 
            $m->render(config('cas.cas_data_map')->default->unique_id, $user_attributes))->first();
        if ($user === null) {
            $user_exists = false;
            $user = new User();
        }
        $this->map_user_attributes($user,$user_attributes);
        if (!isset($user->unique_id) || $user->unique_id === '' || $user->unique_id === null) {
            abort(401,'Unable to Authenticate User.  (unique_id cannot be determined)');
        }
        $user->save();
        if (!$user_exists) {
            config('app.site')->add_member($user,false,false);
        }
        Auth::login($user, true);
    }

    private function handle_generic() {
        $m = new \Mustache_Engine;                                    
        $user_exists = true;
        $default_attributes = ['id'=>cas()->user(),'username'=>cas()->user()];
        $external_attributes = $this->fetch_external_user_attributes($default_attributes);
        $user_attributes = array_merge($external_attributes,$default_attributes);
        $user = User::where('unique_id', '=', 
            $m->render(config('cas.cas_data_map')->default->unique_id, $user_attributes))->first();
        if ($user === null) {
            $user_exists = false;
            $user = new User();
        }
        $this->map_user_attributes($user,$user_attributes);
        if (!isset($user->unique_id) || $user->unique_id === '' || $user->unique_id === null) {
            abort(401,'Unable to Authenticate User.  (unique_id cannot be determined)');
        }
        $user->save();
        if (!$user_exists) {
            config('app.site')->add_member($user,false,false);
        }
        Auth::login($user, true);
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($skip = false)
    {
        // Only run if we're not already authenticated
        if (!Auth::check()) {
            $cas_msg = '';
            try {
                ob_start(); // Suppress CAS Error Messages
                $is_authenticated = $this->cas->isAuthenticated();
                ob_end_clean();
                if( $is_authenticated )
                {
                    $m = new \Mustache_Engine;                    
                    if (config('cas.cas_enable_saml') === true || config('cas.cas_enable_saml') === "true") {
                        $this->handle_saml();
                    } else {
                        $this->handle_generic();
                    }
                } else { 
                    if(!$skip){    
                        ob_start(); // Suppress CAS Error Messages
                        $this->cas->authenticate();
                        ob_end_clean();
                    }
                }
            } catch (\Throwable $e) {
                $cas_errors = ob_get_contents();
                if ($cas_errors) {
                    ob_end_clean();
                }
                abort(401,$e->getMessage().$cas_errors);
            }
        }
        return true;
    }
}
