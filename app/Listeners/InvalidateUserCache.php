<?php

namespace App\Listeners;

use App\Events\UpdateUser;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\User;

class InvalidateUserCache
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  UpdateUser  $event
     * @return void
     */
    public function handle(UpdateUser $event)
    {
        $user = User::where('id','=',$event->user_id)->first();
        $user->invalidate_cache = true;
        $user->save();
    }
}
