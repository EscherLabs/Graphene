<?php 

namespace App\Libraries;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Site;
use App\Libraries\HTTPHelper;
use Aacotroneo\Saml2\Events\Saml2LoginEvent;

class SAML2Auth
{
    protected $auth;
    protected $cas;

    public function __construct()
    {
        // Build SAML2 Configuration from Site Configuration
        $saml2_config = [];
        foreach(config('app.site')->auth_config as $key => $value) {
            $saml2_config['saml2_settings.'.$key] = $value;
        }
        config($saml2_config);
    }

    private function map_user_attributes(&$user,$user_attributes) {
        $m = new \Mustache_Engine;
        // Map Default Parameters
        foreach(config('saml2_settings.cas_data_map')->default as $attribute_name => $attribute_value) {
            $user->$attribute_name = $m->render($attribute_value, $user_attributes);

            // Allow null emails but not empty string email
            if ($attribute_name === 'email' && $user->email === '') {
                $user->email = null;
            }
        }
        // Map Additional Parameters
        $attributes = [];
        if (isset(config('saml2_settings.cas_data_map')->additional)) {
            foreach(config('saml2_settings.cas_data_map')->additional as $attribute_name => $attribute_value) {
                $value = $m->render($attribute_value, $user_attributes);
                if ($value != '') { /* Only Update Non-Empty Attributes */
                    $attributes[$attribute_name] = $value;
                }
            }
        }
        /* Merge with existing attributes */
        $attributes = array_merge((array)$user->params,$attributes);
        $user->params = $attributes;
    }

    private function fetch_external_user_attributes($user_attributes) {
        if (config('saml2_settings.external_user_lookup')->enabled === true || config('saml2_settings.external_user_lookup')->enabled === "true") {
            $m = new \Mustache_Engine;                            
            $url = $m->render(config('saml2_settings.external_user_lookup')->url, $user_attributes);
            $username = null; $password = null;
            if (isset(config('saml2_settings.external_user_lookup')->username) && config('saml2_settings.external_user_lookup')->username !== '') {
                $username = config('saml2_settings.external_user_lookup')->username;
            }
            if (isset(config('saml2_settings.external_user_lookup')->password) && config('saml2_settings.external_user_lookup')->password !== '') {
                $password = config('saml2_settings.external_user_lookup')->password;
            }

            $httpHelper = new HTTPHelper();
            $response = $httpHelper->http_fetch(
                $url,config('saml2_settings.external_user_lookup')->verb,
                $user_attributes,
                $username,
                $password);
            return $response['content'];
        } else {
            return [];
        }
    }

    public function handle($saml_attributes) {
        $m = new \Mustache_Engine;                                    
        $user_exists = true;
        $external_attributes = $this->fetch_external_user_attributes($saml_attributes);
        $user_attributes = array_merge($external_attributes,$saml_attributes);
        $user = User::where('unique_id', '=', 
            $m->render(config('saml2_settings.cas_data_map')->default->unique_id, $user_attributes))->first();
        if ($user === null) {
            $user_exists = false;
            $user = new User();
        }
        $this->map_user_attributes($user,$user_attributes);
        $user->save();
        if (!$user_exists) {
            config('app.site')->add_member($user,false,false);
        }
        Auth::login($user, true);
    }

    public function authenticate($skip = false) {
        if (!Auth::check() && !$skip){  
            return \Aacotroneo\Saml2\Facades\Saml2Auth::login();
        }
    }
}
