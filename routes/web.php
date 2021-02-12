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

Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');


/***** User Content *****/
Route::get('/','UserDashboardController@index');
Route::get('/css','UserDashboardController@css')->middleware('no.save.session');
Route::get('/app/{group}/{slug}', 'AppInstanceController@run');
Route::get('/app/{group}','PageController@redirect')->middleware('no.save.session');
Route::get('/link/{link}/{extra?}','LinkController@redirect')->where('extra','(.*)')->middleware('no.save.session');

Route::get('/setup',function(){
  return redirect('/');
});

Route::get('/ar/{renderer}/{group}/{slug}', 'AppInstanceController@render');
Route::get('/page/{group}/{slug}', 'PageController@run');
Route::get('/page/{group}','PageController@redirect')->middleware('no.save.session');
Route::get('/community/{group}/{slug?}', 'PageController@run'); /* Compatibility with old portal */
Route::get('/r/{renderer}/{group}/{slug?}', 'PageController@render');
Route::get('/login', 'Auth\LoginController@showLoginForm')->name('login');
Route::get('/image/{image}','ImageController@get')->middleware('no.save.session');

Route::group(['middleware' => ['custom.auth']], function () {
  Route::get('/heartbeat','UserDashboardController@heartbeat');
});

Route::group(['middleware' => ['custom.auth'],'prefix' => 'admin'], function () {
  Route::get('/', 'AdminController@dashboard');

  Route::get('/{resource?}', 'AdminController@index');
  Route::get('/apps/{app}', 'AppController@admin')->middleware('can:get,app');

  Route::get('/groups/{group}/', 'AdminController@summary')->middleware('can:list_components,group');

  Route::get('/groups/{group}/admins', 'AdminController@admins')->middleware('can:list_components,group');
  Route::get('/groups/{group}/members', 'AdminController@members')->middleware('can:list_components,group');
  Route::get('/groups/{group}/composites', 'AdminController@composites')->middleware('can:list_components,group');
  Route::get('/groups/{group}/tags', 'AdminController@tags')->middleware('can:list_components,group');
  Route::get('/groups/{group}/images', 'AdminController@images')->middleware('can:list_components,group');
  Route::get('/groups/{group}/links', 'AdminController@links')->middleware('can:list_components,group');
  Route::get('/groups/{group}/pages', 'AdminController@pages')->middleware('can:list_components,group');
  Route::get('/groups/{group}/appinstances', 'AdminController@appinstances')->middleware('can:list_components,group');
  Route::get('/groups/{group}/endpoints', 'AdminController@endpoints')->middleware('can:list_components,group');

  Route::get('/apps/{app}/developers', 'AdminController@appdevelopers')->middleware('can:list_developers,app');
  Route::get('/appinstances/{app_instance}', 'AppInstanceController@admin')->middleware('can:get,app_instance');

  Route::get('/sites/{site}', 'SiteController@admin')->middleware('can:get,site');
});

Route::group(['middleware' => ['no.save.session'],'prefix' => 'api'], function () {
    Route::post('/usersetup', 'UserController@init');

    /***** Dashboard  *****/
    Route::post('/dashboard','UserDashboardController@update');

    /***** APPS *****/
    // List all apps
    Route::get('/apps','AppController@list_all_apps')->middleware('can:get_all,App\App');
    Route::get('/apps/user','AppController@list_user_apps')->middleware('can:get_all,App\App');
    Route::get('/apps/group/{group_id}','AppController@list_user_group_apps')->middleware('can:get_all,App\App');

    Route::get('/apps/developers','AppController@list_all_developers')->middleware('can:list_all_developers,App\App');
    Route::match(['get','post'],'/apps/search/{type?}','AppController@search')->middleware('can:get_all,App\App');

    // Lookup specific app by app_id
    Route::get('/apps/{app}','AppController@show')->middleware('can:get,app');
    // Create a new app
    Route::post('/apps','AppController@create')->middleware('can:create,App\App');
    // Update an existing app by app_id
    Route::put('/apps/{app}','AppController@update')->middleware('can:update,app');
    Route::put('/apps/{app}/code','AppController@code')->middleware('can:update,app');
    Route::put('/apps/{app}/publish','AppController@publish')->middleware('can:update,app');

    Route::get('/apps/{app}/versions','AppController@versions')->middleware('can:get_versions,app');
    Route::get('/apps/{app}/versions/{version}','AppController@version')->middleware('can:get_versions,app');

    // Delete an existing app by app_id
    Route::delete('/apps/{app}','AppController@destroy')->middleware('can:delete,app');

    // List all developers of a specified app by app_id
    Route::get('/apps/{app}/developers','AppController@list_developers')->middleware('can:list_developers,app');
    // Make an existing user a developers of an existing app by app_id, user_id
    Route::post('/apps/{app}/developers/{user}','AppController@add_developer')->middleware('can:add_developer,app');
    // Remove an existing developer from an existing app by app_id, user_id
    Route::delete('/apps/{app}/developers/{user}','AppController@remove_developer')->middleware('can:remove_developer,app');

    /***** APP INSTANCES *****/
    // List all apps instances
    Route::get('/appinstances','AppInstanceController@list_all_app_instances')->middleware('can:get_all,App\AppInstance');
    // Lookup specific app instance by app_instance_id
    Route::get('/appinstances/{app_instance}','AppInstanceController@show')->middleware('can:get,app_instance');
    // Create a new app instance
    Route::post('/appinstances','AppInstanceController@create')->middleware('can:create,App\AppInstance');
    // Update an existing app instance by app_instance_id
    Route::put('/appinstances/{app_instance}','AppInstanceController@update')->middleware('can:update,app_instance');
    Route::get('/appinstances/{app_instance}/pages','AppInstanceController@pages')->middleware('can:update,app_instance');
    // Delete an existing app instance by app_instance_id
    Route::delete('/appinstances/{app_instance}','AppInstanceController@destroy')->middleware('can:delete,app_instance');

    // Save App User Options for current user by app_instance_id (Policy Enforced in Controller!)
    Route::post('/apps/instances/{app_instance}/user_options','AppInstanceController@save_user_options')->middleware('can:modify_user_options,app_instance');

    // Get App Instance External Resource Data by endpoint_id (POST or GET)
    Route::get('/fetch/{app_instance}/{endpoint}','AppInstanceController@get_data'); // Check Permissions in Controller
    Route::post('/fetch/{app_instance}/{endpoint}','AppInstanceController@get_data'); // Check Permissions in Controller
    // Get all App Data by app_instance
    Route::post('/fetch/{app_instance}','AppInstanceController@fetch'); // Check Permissions in Controller
    Route::get('/fetch/{app_instance}','AppInstanceController@fetch'); // Check Permissions in Controller
    
    /***** ENDPOINTS *****/
    // List all endpoints
    Route::get('/endpoints','EndpointController@list_all_endpoints')->middleware('can:get_all,App\Endpoint');
    // Create a new endpoint for group group_id
    Route::post('/endpoints','EndpointController@create')->middleware('can:create,App\Endpoint');
    // Update an existing endpoint by endpoint_id
    Route::put('/endpoints/{endpoint}','EndpointController@update')->middleware('can:update,endpoint');
    // Delete an existing endpoint by endpoint_id
    Route::delete('/endpoints/{endpoint}','EndpointController@destroy')->middleware('can:delete,endpoint');
    // Perform Google Callback for Endpoint
    Route::get('/endpoints/google_callback','EndpointController@google_callback');

    /***** Links *****/
    // List all links
    Route::get('/links','LinkController@list_all_links')->middleware('can:get_all,App\Link');
    // List all links for the current user
    Route::get('/user_links/{group_id?}','LinkController@user_index');
    // Create a new link for group group_id
    Route::post('/links','LinkController@create')->middleware('can:create,App\Link');
    // Update an existing link by link_id
    Route::put('/links/{link}','LinkController@update')->middleware('can:update,link');
    // Delete an existing link by link_id
    Route::delete('/links/{link}','LinkController@destroy')->middleware('can:delete,link');

    /***** Tags *****/
    // List all tags
    Route::get('/tags','TagController@list_all_tags')->middleware('can:get_all,App\Tag');
    // Create a new tag for group group_id
    Route::post('/tags','TagController@create')->middleware('can:create,App\Tag');
    // Update an existing tag by tag_id
    Route::put('/tags/{tag}','TagController@update')->middleware('can:update,tag');
    // Delete an existing tag by tag_id
    Route::delete('/tags/{tag}','TagController@destroy')->middleware('can:delete,tag');

    /***** Images *****/
    // List all images
    Route::get('/images','ImageController@list_all_images')->middleware('can:get_all,App\Image');
    // Create a new image for group group_id
    Route::post('/images','ImageController@create')->middleware('can:create,App\Image');
    // Update an existing image by image_id
    Route::put('/images/{image}','ImageController@update')->middleware('can:update,image');
    // Delete an existing image by image_id
    Route::delete('/images/{image}','ImageController@destroy')->middleware('can:delete,image');

    /***** SITES *****/
    // List all sites
    Route::get('/sites','SiteController@index')->middleware('can:get_all,App\Site');
    // Lookup specific site by site_id
    Route::get('/sites/{site}','SiteController@show')->middleware('can:get,site');
    // Create a new site
    Route::post('/sites','SiteController@create')->middleware('can:create,App\Site');
    Route::post('/sites/init','SiteController@init');
    // Update an existing site by site_id
    Route::put('/sites/{site}','SiteController@update')->middleware('can:update,site');
    // Delete an existing site by site_id
    Route::delete('/sites/{site}','SiteController@destroy')->middleware('can:delete,site');

    Route::get('/sites/{site}/admins', 'SiteController@list_admins')->middleware('can:get,site');
    
    /***** API Users *****/
    Route::get('/api_users','APIUserController@list_all_api_users')->middleware('can:get_all,App\APIUser');
    Route::get('/api_users/{api_user}','APIUserController@show')->middleware('can:get,api_user');
    Route::post('/api_users','APIUserController@create')->middleware('can:create,App\APIUser');
    Route::put('/api_users/{api_user}','APIUserController@update')->middleware('can:update,api_user');
    Route::delete('/api_users/{api_user}','APIUserController@destroy')->middleware('can:delete,api_user');

    /***** USERS *****/
    // List all users
    Route::get('/users','UserController@index')->middleware('can:get_all,App\User');
    // Search all users
    Route::get('/users/search/{search_string?}','UserController@search')->middleware('can:get_all,App\User');
    // Lookup specific user by user_id
    Route::get('/users/{user}','UserController@show')->middleware('can:get,user');
    // Create a new user
    Route::post('/users','UserController@create')->middleware('can:create,App\User');
    Route::put('/users/{user}','UserController@update')->middleware('can:update,user');
    // Delete an existing user by user_id
    Route::delete('/users/{user}','UserController@destroy')->middleware('can:delete,user');
    // Impersonate a user
    Route::get('/users/{user}/impersonate','UserController@impersonate')->middleware('can:impersonate,user');


    // Lookup specific user by user_id
    Route::get('/users/{user}/info','UserController@info')->middleware('can:get,user');
    // Update an existing user by user_id
    Route::put('/users/{user}/info','UserController@updateinfo')->middleware('can:update,user');

    /***** Pages *****/
    // List all pages
    Route::get('/pages','PageController@list_all_pages')->middleware('can:get_all,App\Page');
    // Lookup specific page by page id
    Route::get('/pages/{page}','PageController@show')->middleware('can:get,page');
    // Create a new page
    Route::post('/pages','PageController@create')->middleware('can:create,App\Page');
    // Update an existing page by page id
    Route::put('/pages/{page}','PageController@update')->middleware('can:update,page');
    // Delete an existing page by page id
    Route::delete('/pages/{page}','PageController@destroy')->middleware('can:delete,page');

    /***** GROUPS *****/
    // List all groups
    Route::get('/groups','GroupController@list_all_groups')->middleware('can:get_all,App\Group');
    Route::get('/groups/user','GroupController@list_user_groups')->middleware('can:get_all,App\Group');
    // Lookup specific group by group_id
    Route::get('/groups/{group}/summary','GroupController@summary')->middleware('can:get,group');
    Route::get('/groups/{group}','GroupController@show')->middleware('can:get,group');

    // Create a new group
    Route::post('/groups','GroupController@create')->middleware('can:create,App\Group');
    //ATS check permissions
    Route::post('/groups/order','GroupController@order')->middleware('can:create,App\Group');
    // Update an existing group by group_id
    Route::put('/groups/{group}','GroupController@update')->middleware('can:update,group');
    // Delete an existing group by group_id
    Route::delete('/groups/{group}','GroupController@destroy')->middleware('can:delete,group');

    // List all members of a specified group by group_id
    Route::get('/groups/{group}/members','GroupController@list_members')->middleware('can:list_components,group');
    // Make an existing user a member of an existing group by group_id, user_id
    Route::post('/groups/{group}/members/{user}','GroupController@add_member')->middleware('can:add_member,group');
    // Remove an existing member from an existing group by group_id, user_id
    Route::delete('/groups/{group}/members/{user}','GroupController@remove_member')->middleware('can:remove_member,group');

    // List all admins of a specified group by group_id
    Route::get('/groups/{group}/admins','GroupController@list_admins')->middleware('can:list_components,group');
    // Make an existing user an admin of an existing group by group_id, user_id
    Route::post('/groups/{group}/admins/{user}','GroupController@add_admin')->middleware('can:add_admin,group');
    // Remove an existing member from an existing group by group_id, user_id
    Route::delete('/groups/{group}/admins/{user}','GroupController@remove_admin')->middleware('can:remove_admin,group');

    // List all composites of a specified group by group_id
    Route::get('/groups/{group}/composites','GroupController@list_composites')->middleware('can:list_components,group');
    Route::post('/groups/{group}/composites/{composite_group}','GroupController@add_composite')->middleware('can:add_composite,group,composite_group');
    Route::delete('/groups/{group}/composites/{composite_group}','GroupController@remove_composite')->middleware('can:remove_composite,group,composite_group');

    // Get Images for a specified group by group_id
    Route::get('/groups/{group}/images','GroupController@list_images')->middleware('can:list_components,group');
    // Get Links for a specified group by group_id
    Route::get('/groups/{group}/links','GroupController@list_links')->middleware('can:list_components,group');
    // Get Pages for a specified group by group_id
    Route::get('/groups/{group}/pages','GroupController@list_pages')->middleware('can:list_components,group');
    // Update the order of pages in a group
    Route::post('/pages/order/{group}','GroupController@pages_order')->middleware('can:update,group');
    // Get App Instances for a specified group by group_id
    Route::get('/groups/{group}/appinstances','GroupController@list_appinstances')->middleware('can:list_components,group');
    // Update the order of appinstances in a group
    Route::post('/appinstances/order/{group}','GroupController@appinstances_order')->middleware('can:update,group');

    // Get Endpoints for a specified group by group_id
    Route::get('/groups/{group}/endpoints','GroupController@list_endpoints')->middleware('can:list_components,group');
    // Get Tags for a specified group by group_id
    Route::get('/groups/{group}/tags','GroupController@list_tags')->middleware('can:list_components,group');

    /***** Visits *****/
    // Log a visit
    Route::post('/visit/log_visit','VisitController@log_visit');

    Route::get('/ellucianmobile/config','EllucianMobileController@config');

    Route::get('/proxy/{slug}/{route}/{object_id?}/{action?}/{selection?}','APIServerController@fetch')->middleware('can:create,App\App');;  
    Route::post('/proxy/{slug}/{route}/{object_id?}/{action?/{selection?}','APIServerController@fetch')->middleware('can:create,App\App');; 
    Route::put('/proxy/{slug}/{route}/{object_id?}/{action?}/{selection?}','APIServerController@fetch')->middleware('can:create,App\App');; 
    Route::delete('/proxy/{slug}/{route}/{object_id?}/{action?}/{selection?}','APIServerController@fetch')->middleware('can:create,App\App');; 
  });

Route::get('/ellucianmobile/login','EllucianMobileController@login');
Route::get('/ellucianmobile/checkauth','EllucianMobileController@check_auth');
Route::get('/ellucianmobile/redirect/{base_64_redirect}','EllucianMobileController@redirect');
Route::get('/ellucianmobile/userinfo','EllucianMobileController@userinfo');
Route::get('/ellucianmobile/config','EllucianMobileController@config');
Route::get('/ellucianmobile/version','EllucianMobileController@version');

Route::group(['middleware' => ['custom.auth'],'prefix' => 'admin/apiserver'], function () {
  Route::get('/{slug}/apis/{api_id}', 'APIServerController@api')->middleware('can:create,App\App');
  Route::get('/{slug}/api_docs/{api_instance_id}', 'APIServerController@api_docs')->middleware('can:create,App\App');
  Route::get('/{slug}/{resource?}/{resource_id?}', 'APIServerController@index')->middleware('can:create,App\App');    
});
  