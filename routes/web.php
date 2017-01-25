<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use App\App;

Route::get('/', function () {
    return view('main');
});
Route::get('/admin/{resource?}', function ($resource = null) {
    return view('admin', ['resource'=>$resource]);
});
Route::get('/admin/apps/{app}', function (App $app) {
    $app->code = json_decode($app->code);
    return view('adminApp', ['app'=>$app]);
});
Route::get('/admin/groups/{group}/members/', function ($group) {
    return view('admin', ['resource'=>'groups/'.$group.'/members']);
});

Route::get('/app/{slug}', function ($slug) {
    $myApp = \App\AppInstance::with('app')->with(['user_preferences'=>function($query){
        $query->where('user_id','=',1);
    }])->where('slug', '=', $slug)->first();
    return view('app', $myApp);
});

/***** APPS *****/
// List all apps
Route::get('/api/apps','AppController@index');
// Lookup specific app by app_id
Route::get('/api/apps/{app}','AppController@show');
// Create a new app
Route::post('/api/apps','AppController@create');
// Update an existing app by app_id
Route::put('/api/apps/{app}','AppController@update');
// Delete an existing app by app_id
Route::delete('/api/apps/{app}','AppController@destroy');

/***** APP INSTANCES *****/
// List all apps instances
Route::get('/api/apps/instances','AppInstanceController@index');
// Lookup specific app instance by app_instance_id
Route::get('/api/apps/instances/{app_instance}','AppInstanceController@show');
// Create a new app instance
Route::post('/api/apps/instances','AppInstanceController@create');
// Update an existing app instance by app_instance_id
Route::put('/api/apps/instances/{app_instance}','AppInstanceController@update');
// Delete an existing app instance by app_instance_id
Route::delete('/api/apps/instances/{app_instance}','AppInstanceController@destroy');

// Fetch App User Preferences for current user by app_instance_id
Route::get('/api/apps/instances/{app_instance}/user_prefs','AppInstanceController@get_preferences');
// Save App User Preferences for current user by app_instance_id
Route::post('/api/apps/instances/{app_instance}/user_prefs','AppInstanceController@save_preferences');
// Call App Instance Route for current user by app_instance_id, route name
Route::post('/api/apps/instances/{app_instance}/route/{route}','AppInstanceController@call_route');

/***** ENDPOINTS *****/
// List all endpoints
Route::get('/api/endpoints','EndpointController@index');
// Create a new endpoint for group group_id
Route::post('/api/endpoints/{group}','EndpointController@create');
// Update an existing endpoint by endpoint_id
Route::put('/api/endpoints/{endpoint}','EndpointController@update');
// Delete an existing endpoint by endpoint_id
Route::delete('/api/endpoints/{endpoint}','EndpointController@destroy');

/***** SITES *****/
// List all sites
Route::get('/api/sites','SiteController@index');
// Lookup specific site by site_id
Route::get('/api/sites/{site}','SiteController@show');
// Create a new site
Route::post('/api/sites','SiteController@create');
// Update an existing site by site_id
Route::put('/api/sites/{site}','SiteController@update');
// Delete an existing site by site_id
Route::delete('/api/sites/{site}','SiteController@destroy');

/***** USERS *****/
// List all users
Route::get('/api/users','UserController@index');
// Lookup specific user by user_id
Route::get('/api/users/{user}','UserController@show');
// Create a new user
Route::post('/api/users','UserController@create');
// Update an existing user by user_id
Route::put('/api/users/{user}','UserController@update');
// Delete an existing user by user_id
Route::delete('/api/users/{user}','UserController@destroy');

/***** GROUPS *****/
// List all groups
Route::get('/api/groups','GroupController@index');
// Lookup specific group by group_id
Route::get('/api/groups/{group}','GroupController@show');
// Create a new group
Route::post('/api/groups','GroupController@create');
// Update an existing group by group_id
Route::put('/api/groups/{group}','GroupController@update');
// Delete an existing group by group_id

Route::delete('/api/groups/{group}','GroupController@destroy');
// List all members of a specified group by group_id
Route::get('/api/groups/{group}/members','GroupController@list_members');
// Make an existing user a member of an existing group by group_id, user_id
Route::post('/api/groups/{group}/members/{user}','GroupController@add_member');
// Remove an existing member from an existing group by group_id, user_id
Route::delete('/api/groups/{group}/members/{user}','GroupController@remove_member');

// List all admins of a specified group by group_id
Route::get('/api/groups/{group}/admins','GroupController@list_admins');
// Make an existing user an admin of an existing group by group_id, user_id
Route::post('/api/groups/{group}/admins/{user}','GroupController@add_admin');
// Remove an existing member from an existing group by group_id, user_id
Route::delete('/api/groups/{group}/admins/{user}','GroupController@remove_admin');
