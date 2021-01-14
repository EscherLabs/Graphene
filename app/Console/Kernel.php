<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        \App\Console\Commands\Compile::class,
        \App\Console\Commands\CompileTemplates::class,
        \App\Console\Commands\CompileJavaScript::class,
        \App\Console\Commands\CompileCSS::class,
        \App\Console\Commands\EnvSet::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        //Calls workflow_automated_inactivity function for inactivity based actions
        $schedule->call('App\Http\Controllers\WorkflowSubmissionActionController@workflow_automated_inactivity')
            ->name('scheduled_inactivity_action')
            ->dailyAt(config('app.scheduled_inactivity'))
            ->timezone('America/New_York')
            ->onOneServer();

        // $schedule->command('inspire')
        //          ->hourly();
    }

    /**
     * Register the Closure based commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
    }
}
