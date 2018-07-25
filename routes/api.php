<?php

use Illuminate\Http\Request;

/* Note: All Routes in this file are automatically prepended with /api */
Route::group(['middleware' => ['public.api.auth', 'no.save.session'], 'prefix' => 'public'], function () {

    /* Manage Groups */
    Route::get('/groups','GroupController@list_all_groups');
    Route::get('/groups','GroupController@list_all_groups');
    Route::post('/groups/update/{slug}','GroupController@update_group_by_slug');
    Route::get('/groups/members/{slug?}', 'GroupController@members_by_slug');
    Route::post('/groups/members/{slug?}', 'GroupController@add_members_by_slug');
    Route::delete('/groups/members/{slug?}', 'GroupController@remove_members_by_slug');
    Route::get('/groups/{group}/members','GroupController@list_members');

    Route::match(['get','post'],'/apps/search/{type?}','AppController@search');

});
