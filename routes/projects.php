<?php

use App\App;



$commonRoutes = function () {
  Route::get('/', 'ProjectController@view');
  Route::get('/reports/{report}', 'ReportController@view');
};

//project instance by slug (standard use)
Route::group(['middleware' => ['custom.auth'],'prefix' => '/project/{pi:slug}'], $commonRoutes);


//project instance by id (permanant links)
Route::group(['middleware' => ['custom.auth'],'prefix' => '/projects/{pi}'], $commonRoutes );

Route::group(['middleware' => ['custom.auth'],'prefix' => '/projects'], function () {
  Route::get('/', 'ProjectController@admin')->middleware('can:get,projects');
});

Route::group(['middleware' => ['custom.auth'],'prefix' => 'admin/projects'], function () {
  Route::get('/', function(){
    return view('admin', ['resource'=>'projects', 'id'=>'']);
  });
  Route::get('/{project}/reports/{report?}','ProjectController@admin');
  Route::get('/{project}', 'ProjectController@admin');

});


Route::group(['middleware' => ['no.save.session'],'prefix' => 'api'], function () {
  Route::get('/projects','ProjectController@list_all_projects');
  Route::post('/projects','ProjectController@create');
  Route::get('/projects/{project}','ProjectController@read');
  Route::put('/projects/{project}','ProjectController@update');
  Route::delete('/projects/{project}','ProjectController@destroy');

  Route::group(['prefix' => 'projects/{project}'], function () {
    Route::get('/reports','ReportController@list_all_reports');
    Route::post('/reports','ReportController@create');
    Route::get('/reports/{report}','ReportController@read');
    Route::put('/reports/{report}','ReportController@update');
    Route::delete('/reports/{report}','ReportController@destroy');
  });

});
