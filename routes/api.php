<?php

use Illuminate\Http\Request;

/* Note: All Routes in this file are automatically prepended with /api */

/* Manage Users */
Route::get('/users','UserController@index')->middleware('http.basic.auth');
Route::get('/users/{user}','UserController@show')->middleware('http.basic.auth');
Route::post('/users','UserController@create')->middleware('http.basic.auth');
Route::put('/users/{user}','UserController@update')->middleware('http.basic.auth');
Route::delete('/users/{user}','UserController@destroy')->middleware('http.basic.auth');
Route::get('/users/{user}/info','UserController@info')->middleware('http.basic.auth');
Route::put('/users/{user}/info','UserController@updateinfo')->middleware('http.basic.auth');

/* Manage Groups */
Route::get('/groups','GroupController@list_all_groups')->middleware('http.basic.auth');
Route::get('/groups/user','GroupController@list_user_groups')->middleware('http.basic.auth');
Route::get('/groups/{group}/summary','GroupController@summary')->middleware('http.basic.auth');
Route::get('/groups/{group}','GroupController@show')->middleware('http.basic.auth');
Route::post('/groups','GroupController@create')->middleware('http.basic.auth');
Route::put('/groups/{group}','GroupController@update')->middleware('http.basic.auth');
Route::delete('/groups/{group}','GroupController@destroy')->middleware('http.basic.auth');
Route::get('/groups/{group}/members','GroupController@list_members')->middleware('http.basic.auth');
Route::post('/groups/{group}/members/{user}','GroupController@add_member')->middleware('http.basic.auth');
Route::delete('/groups/{group}/members/{user}','GroupController@remove_member')->middleware('http.basic.auth');
Route::get('/groups/{group}/admins','GroupController@list_admins')->middleware('http.basic.auth');
Route::post('/groups/{group}/admins/{user}','GroupController@add_admin')->middleware('http.basic.auth');
Route::delete('/groups/{group}/admins/{user}','GroupController@remove_admin')->middleware('http.basic.auth');
Route::get('/groups/{group}/composites','GroupController@list_composites')->middleware('http.basic.auth');
Route::post('/groups/{group}/composites/{composite_group}','GroupController@add_composite')->middleware('http.basic.auth');
Route::delete('/groups/{group}/composites/{composite_group}','GroupController@remove_composite')->middleware('http.basic.auth');
