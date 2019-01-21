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
            try{
                \Artisan::call('migrate', array('--force' => true));
            }
            catch(\Illuminate\Database\QueryException $e) {

                if(!$request->is('setup')){
                    return redirect('/setup');
                }else{
                    /* present form for creating initial site */
                    return new Response(view('setup',array('mode'=>'db')));
                }
            }
        }
        /* Site does not exist */
        if (is_null($current_site)) {
            if(!count(Site::get())){
                /* site data has been passed in for creation */
                if(!empty($request->domain)&& !empty($request->name)){
                    $site = new Site($request->all());
                    $site->templates = array("partials"=>[]);
                    $site->save();

                    $group = new Group(array('name'=>'Default','slug'=>'default'));
                    $group->site_id = $site->id;
                    $group->save();

                    $page = new Page(array('name'=>'Welcome','slug'=>'welcome','group_id'=>$group->id,
                    'content'=>json_decode('{"sections": [[], [{"guid": "d2ad8c55-408c-4b4d-ad82-af5c90904061", "text": "Lets get started! <br><br>Click the `Edit` button to begin configuring this page.", "group": {"ids": [""]}, "limit": false, "title": "Welcome to Graphene!", "device": "widget", "editor": "contenteditable", "titlebar": true, "collapsed": false, "container": true, "enable_min": false, "widgetType": "Content"}], []]}')
                
                ));
                    $page->save();

                    return new Response(array('site'=>$request->domain));
                }
                if(!$request->is('setup')){
                    return redirect('/setup');
                }else{
                    /* present form for creating initial site */
                    return new Response(view('setup',array('mode'=>'site')));
                }
            }
            /* site does not exist in db - how to handle this? */
            $alt_site = Site::select('domain')->first();
            return response("Site at Domain: ".$request->server('SERVER_NAME')." cannot be resolved.  <br>Do you mean ".$alt_site->domain."?", 404)
                ->header('Content-Type', 'text/html');
        }

        config(['app.site' => $current_site]);
        return $next($request);
    }
}
