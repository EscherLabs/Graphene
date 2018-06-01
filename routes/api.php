<?php

use Illuminate\Http\Request;

/* Note: All Routes in this file are automatically prepended with /api */
Route::group(['middleware' => ['public.api.auth'], 'prefix' => 'public'], function () {

    /* Manage Users */
    // Route::get('/users','UserController@index');
    // Route::get('/users/{user}','UserController@show');
    // Route::post('/users','UserController@create');
    // Route::put('/users/{user}','UserController@update');
    // Route::delete('/users/{user}','UserController@destroy');
    // Route::get('/users/{user}/info','UserController@info');
    // Route::put('/users/{user}/info','UserController@updateinfo');

    /* Manage Groups */
    Route::get('/groups','GroupController@list_all_groups');
    Route::get('/groups/sync/{slug}','GroupController@sync');
    Route::post('/groups/populate','GroupController@populate');

    // Route::get('/groups/user','GroupController@list_user_groups');
    // Route::get('/groups/{group}/summary','GroupController@summary');
    // Route::get('/groups/{group}','GroupController@show');
    // Route::post('/groups','GroupController@create');
    // Route::put('/groups/{group}','GroupController@update');
    // Route::delete('/groups/{group}','GroupController@destroy');
    Route::get('/groups/{group}/members','GroupController@list_members');
    // Route::post('/groups/{group}/members/{user}','GroupController@add_member');
    // Route::delete('/groups/{group}/members/{user}','GroupController@remove_member');
    // Route::get('/groups/{group}/admins','GroupController@list_admins');
    // Route::post('/groups/{group}/admins/{user}','GroupController@add_admin');
    // Route::delete('/groups/{group}/admins/{user}','GroupController@remove_admin');
    // Route::get('/groups/{group}/composites','GroupController@list_composites');
    // Route::post('/groups/{group}/composites/{composite_group}','GroupController@add_composite');
    // Route::delete('/groups/{group}/composites/{composite_group}','GroupController@remove_composite');
});
