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

Route::get('/', function () {
    return view('welcome');
});

/* BEGIN App API Routes */
Route::get('/api/apps','AppController@index');
Route::get('/api/apps/{app}','AppController@show');
Route::post('/api/apps','AppController@create');
Route::put('/api/apps/{app}','AppController@update');
Route::delete('/api/apps/{app}','AppController@destroy');
/* END App API Routes */

/* BEGIN Site API Routes */
Route::get('/api/sites','SiteController@index');
Route::get('/api/sites/{site}','SiteController@show');
Route::post('/api/sites','SiteController@create');
Route::put('/api/sites/{site}','SiteController@update');
Route::delete('/api/sites/{site}','SiteController@destroy');
/* END Site API Routes */

/* BEGIN User API Routes */
Route::get('/api/users','UserController@index');
Route::get('/api/users/{user}','UserController@show');
Route::post('/api/users','UserController@create');
Route::put('/api/users/{user}','UserController@update');
Route::delete('/api/users/{user}','UserController@destroy');
/* END User API Routes */

/* BEGIN Group API Routes */
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
/* END Group API Routes */