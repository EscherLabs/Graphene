<?php

namespace App\Providers;

use App\Libraries\NoSaveDatabaseSessionHandler;
use App\Libraries\SAML2Auth;
// use App\Libraries\MySQLStore;
use Illuminate\Cache\DatabaseStore;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\DB;
use Aacotroneo\Saml2\Events\Saml2LoginEvent;
use Illuminate\Support\Facades\Auth;

use Config;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
     public function boot(ConnectionInterface $connection)
     {
        Session::extend('nosave_database', function($app) use ($connection) {
            $table   = Config::get('session.table');
            $minutes = Config::get('session.lifetime');
            return new NoSaveDatabaseSessionHandler($connection, $table, $minutes);
        });    
        
        // Cache::extend('mysql', function ($app) {
        //     return Cache::repository(new MySQLStore(DB::connection(),'cache',''));
        // });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Remove Commented Code to Log SQL To Log File:
        // tail -f storage/logs/laravel.log

        // Event::listen('Illuminate\Database\Events\QueryExecuted', function ($query) {
        //     Log::debug($query->sql);
        // });

        Event::listen('Aacotroneo\Saml2\Events\Saml2LoginEvent', function (Saml2LoginEvent $event) {
            $messageId = $event->getSaml2Auth()->getLastMessageId();
            // your own code preventing reuse of a $messageId to stop replay attacks
            $user = $event->getSaml2User();
            $saml_attributes = ['id'=>$user->getUserId()];
            foreach($user->getAttributesWithFriendlyName() as $attribute_name => $attribute_value) {
                if (isset($attribute_value[0])) {
                    $saml_attributes[$attribute_name] = $attribute_value[0];
                }
            }
            $mySAML2Auth = new SAML2Auth();
            return $mySAML2Auth->handle($saml_attributes);
        });
    }
}
