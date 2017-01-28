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

Route::get('/','HomeController@index');
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');

Route::get('/admin/{resource?}', 'AdminController@index');
Route::get('/admin/apps/{app}', 'AppController@admin');
Route::get('/admin/groups/{group}/admins', 'AdminController@admins');
Route::get('/admin/groups/{group}/members', 'AdminController@members');
Route::get('/admin/apps/{app}/developers', 'AdminController@developers');

Route::get('/app/{slug}', 'AppInstanceController@run');

// Get app instance data
Route::get('/api/app_data/{app_instance}/{endpoint}','AppInstanceController@get_data');
Route::post('/api/app_data/{app_instance}/{endpoint}','AppInstanceController@get_data');

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
Route::get('/api/appinstances','AppInstanceController@index');
// Lookup specific app instance by app_instance_id
Route::get('/api/appinstances/{app_instance}','AppInstanceController@show');
// Create a new app instance
Route::post('/api/appinstances','AppInstanceController@create');
// Update an existing app instance by app_instance_id
Route::put('/api/appinstances/{app_instance}','AppInstanceController@update');
// Delete an existing app instance by app_instance_id
Route::delete('/api/appinstances/{app_instance}','AppInstanceController@destroy');

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
Route::post('/api/endpoints','EndpointController@create');
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



// List all developers of a specified app by app_id
Route::get('/api/apps/{app}/developers','AppController@list_developers');
// Make an existing user an developers of an existing app by app_id, user_id
Route::post('/api/apps/{app}/developers/{user}','AppController@add_developer');
// Remove an existing developer from an existing app by app_id, user_id
Route::delete('/api/apps/{app}/developers/{user}','AppController@remove_developer');


