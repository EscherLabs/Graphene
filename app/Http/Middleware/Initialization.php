<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Closure;
use App\Site;
use App\Group;
use App\Page;
use Illuminate\Http\Response;

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
        $current_site = null;
        try{
            $current_site = Site::select('id','domain','name','auth','auth_config','proxyserver_config')->where('domain','=',$request->server('SERVER_NAME'))->first();
        }
        catch(\Illuminate\Database\QueryException $e) {
            /* attempt to to seed database */
            \Artisan::call('migrate', array('--force' => true));
        }
        /* Site does not exist */
        if (is_null($current_site)) {
            if(!count(Site::get())){
                /* site data has been passed in for creation */
                if(!empty($request->domain)&& !empty($request->name)){
                    $site = new Site($request->all());
                    $site->save();

                    $group = new Group(array('name'=>'default','slug'=>'default'));
                    $group->site_id = $site->id;
                    $group->save();

                    $page = new Page(array('name'=>'default','slug'=>'default','group_id'=>$group->id));
                    $page->save();

                    return new Response(array('site'=>$request->domain));
                }
                /* present form for creating initial site */
                return new Response(view('setup'));
            }
            /* site does not exist in db - how to handle this? */
        }

        config(['app.site' => $current_site]);
        return $next($request);
    }
}
