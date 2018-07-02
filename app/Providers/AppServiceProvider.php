<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
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
    }
}
