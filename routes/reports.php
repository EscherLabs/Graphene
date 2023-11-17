<?php

use App\App;

Route::group(['middleware' => ['custom.auth'],'prefix' => '/reports'], function () {
  Route::get('/reports', function(){
    return "yua";
  });
  Route::get('/', 'ReportController@admin')->middleware('can:get,reports');
});

Route::group(['middleware' => ['custom.auth'],'prefix' => 'admin/reports'], function () {
  Route::get('/', function(){
    return view('admin', ['resource'=>'reports', 'id'=>'']);
  });
  Route::get('/{report}', 'ReportController@admin');
});

Route::group(['middleware' => ['no.save.session'],'prefix' => 'api/'], function () {
  Route::get('/reports','ReportController@list_all_reports');
  Route::post('/reports','ReportController@create');
  Route::get('/reports/{report}','ReportController@read');
  Route::put('/reports/{report}','ReportController@update');
  Route::delete('/reports/{report}','ReportController@destroy');
});

Route::group(['middleware' => ['public.api.auth','no.save.session'],'prefix' => 'api'], function () {

  Route::get('/workflowinstances/{workflow_instance}/paged_submissions','ReportController@paginate_workflow_submissions');//->middleware('can:update,workflow_instance');
  Route::get('/workflowinstances/{workflow_instance}/fields','ReportController@getFieldList');//->middleware('can:update,workflow_instance');
  
});