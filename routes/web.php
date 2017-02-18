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

Auth::routes();
//Route::get('/home', 'HomeController@index');

// Route::get('/','HomeController@index');
// Route::get('/dashboard','HomeController@dashboard');
Route::get('/','UserDashboardController@index');
Route::post('/api/dashboard','UserDashboardController@update');
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');
Route::post('/api/preferences/{appInstance}','UserPreferenceController@update');

Route::get('/admin/{resource?}', 'AdminController@index');
Route::get('/admin/apps/{app}', 'AppController@admin');
Route::get('/admin/groups/{group}/admins', 'AdminController@admins');
Route::get('/admin/groups/{group}/members', 'AdminController@members');
Route::get('/admin/apps/{app}/developers', 'AdminController@developers');

Route::get('/app/{slug}', 'AppInstanceController@run');

/***** APPS *****/
// List all apps
Route::get('/api/apps','AppController@index')->middleware('can:get_all,App\App');
// Lookup specific app by app_id
Route::get('/api/apps/{app}','AppController@show')->middleware('can:get,app');
// Create a new app
Route::post('/api/apps','AppController@create')->middleware('can:create,App\App');
// Update an existing app by app_id
Route::put('/api/apps/{app}','AppController@update')->middleware('can:update,app');
// Delete an existing app by app_id
Route::delete('/api/apps/{app}','AppController@destroy')->middleware('can:delete,app');

// List all developers of a specified app by app_id
Route::get('/api/apps/{app}/developers','AppController@list_developers')->middleware('can:list_developers,app');
// Make an existing user a developers of an existing app by app_id, user_id
Route::post('/api/apps/{app}/developers/{user}','AppController@add_developer')->middleware('can:add_developer,app');
// Remove an existing developer from an existing app by app_id, user_id
Route::delete('/api/apps/{app}/developers/{user}','AppController@remove_developer')->middleware('can:remove_developer,app');

/***** APP INSTANCES *****/
// List all apps instances
Route::get('/api/appinstances','AppInstanceController@index')->middleware('can:get_all,App\AppInstance');
// Lookup specific app instance by app_instance_id
Route::get('/api/appinstances/{app_instance}','AppInstanceController@show')->middleware('can:get,app_instance');
// Create a new app instance
Route::post('/api/appinstances','AppInstanceController@create')->middleware('can:create,App\AppInstance');
// Update an existing app instance by app_instance_id
Route::put('/api/appinstances/{app_instance}','AppInstanceController@update')->middleware('can:update,app_instance');
// Delete an existing app instance by app_instance_id
Route::delete('/api/appinstances/{app_instance}','AppInstanceController@destroy')->middleware('can:delete,app_instance');

// Fetch App User Preferences for current user by app_instance_id
Route::get('/api/apps/instances/{app_instance}/user_prefs','AppInstanceController@get_preferences')->middleware('can:get_preferences,app_instance');
// Save App User Preferences for current user by app_instance_id
Route::post('/api/apps/instances/{app_instance}/user_prefs','AppInstanceController@save_preferences')->middleware('can:update_preferences,app_instance');
// Call App Instance Route for current user by app_instance_id, route name
Route::post('/api/apps/instances/{app_instance}/route/{route}','AppInstanceController@call_route')->middleware('can:get_route,app_instance,route');

// Get App Instance External Resource Data by endpoint_id (POST or GET)
Route::get('/api/app_data/{app_instance}/{endpoint}','AppInstanceController@get_data')->middleware('can:get_data,app_instance');
Route::post('/api/app_data/{app_instance}/{endpoint}','AppInstanceController@get_data')->middleware('can:get_data,app_instance');
// Get all App Data by app_instance
// TJC -- THIS MIDDLEWARE IS BROKEN.. NO IDEA WHY??
Route::get('/api/fetch/{app_instance}','AppInstanceController@fetch');//->middleware('can:fetch,app_instance');

/***** ENDPOINTS *****/
// List all endpoints
Route::get('/api/endpoints','EndpointController@index')->middleware('can:get_all,App\Endpoint');
// Create a new endpoint for group group_id
Route::post('/api/endpoints','EndpointController@create')->middleware('can:create,App\Endpoint');
// Update an existing endpoint by endpoint_id
Route::put('/api/endpoints/{endpoint}','EndpointController@update')->middleware('can:update,endpoint');
// Delete an existing endpoint by endpoint_id
Route::delete('/api/endpoints/{endpoint}','EndpointController@destroy')->middleware('can:delete,endpoint');
// Perform Google Callback for Endpoint
Route::get('/api/endpoints/google_callback','EndpointController@google_callback');

/***** SITES *****/
// List all sites
Route::get('/api/sites','SiteController@index')->middleware('can:get_all,App\Site');
// Lookup specific site by site_id
Route::get('/api/sites/{site}','SiteController@show')->middleware('can:get,site');
// Create a new site
Route::post('/api/sites','SiteController@create')->middleware('can:create,App\Endpoint');
// Update an existing site by site_id
Route::put('/api/sites/{site}','SiteController@update')->middleware('can:update,site');
// Delete an existing site by site_id
Route::delete('/api/sites/{site}','SiteController@destroy')->middleware('can:delete,site');

/***** USERS *****/
// List all users
Route::get('/api/users','UserController@index')->middleware('can:get_all,App\User');
// Lookup specific user by user_id
Route::get('/api/users/{user}','UserController@show')->middleware('can:get,user');
// Create a new user
Route::post('/api/users','UserController@create')->middleware('can:create,App\User');
// Update an existing user by user_id
Route::put('/api/users/{user}','UserController@update')->middleware('can:update,user');
// Delete an existing user by user_id
Route::delete('/api/users/{user}','UserController@destroy')->middleware('can:delete,user');

/***** GROUPS *****/
// List all groups
Route::get('/api/groups','GroupController@index')->middleware('can:get_all,App\Group');
// Lookup specific group by group_id
Route::get('/api/groups/{group}','GroupController@show')->middleware('can:get,group');
// Create a new group
Route::post('/api/groups','GroupController@create')->middleware('can:create,group');
// Update an existing group by group_id
Route::put('/api/groups/{group}','GroupController@update')->middleware('can:update,group');
// Delete an existing group by group_id
Route::delete('/api/groups/{group}','GroupController@destroy')->middleware('can:delete,group');

// List all members of a specified group by group_id
Route::get('/api/groups/{group}/members','GroupController@list_members')->middleware('can:list_members,group');
// Make an existing user a member of an existing group by group_id, user_id
Route::post('/api/groups/{group}/members/{user}','GroupController@add_member')->middleware('can:add_member,group');
// Remove an existing member from an existing group by group_id, user_id
Route::delete('/api/groups/{group}/members/{user}','GroupController@remove_member')->middleware('can:remove_member,group');

// List all admins of a specified group by group_id
Route::get('/api/groups/{group}/admins','GroupController@list_admins')->middleware('can:list_admins,group');
// Make an existing user an admin of an existing group by group_id, user_id
Route::post('/api/groups/{group}/admins/{user}','GroupController@add_admin')->middleware('can:add_admin,group');
// Remove an existing member from an existing group by group_id, user_id
Route::delete('/api/groups/{group}/admins/{user}','GroupController@remove_admin')->middleware('can:remove_admin,group');




