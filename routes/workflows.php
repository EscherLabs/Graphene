<?php

use App\App;

Route::get('/workflow/{group}/{slug}', 'WorkflowInstanceController@run');
Route::get('/workflow/{group}','PageController@redirect')->middleware('no.save.session');

Route::get('/workflows','WorkflowController@summary');
Route::get('/workflows/report/{workflow_submission}', 'WorkflowSubmissionController@report');

Route::group(['middleware' => ['custom.auth'],'prefix' => 'admin'], function () {
    Route::get('/workflows/{workflow}', 'WorkflowController@admin')->middleware('can:get,workflow');
    Route::get('/groups/{group}/workflowinstances', 'AdminController@workflowinstances')->middleware('can:list_components,group');
    Route::get('/workflows/{workflow}/developers', 'AdminController@workflowdevelopers')->middleware('can:list_developers,workflow');
    Route::get('/workflowinstances/{workflow_instance}/report', 'WorkflowInstanceController@report');  
    Route::get('/workflowinstances/{workflow_instance}', 'WorkflowInstanceController@admin')->middleware('can:get,workflow_instance');
});
  
Route::group(['middleware' => ['no.save.session'],'prefix' => 'api'], function () {
    /***** WORKFLOWS *****/
    Route::post('/workflowsubmissions/{workflow_instance}','WorkflowSubmissionController@create');//->middleware('can:create_submission,workflow_instance');
    Route::get('/workflowsubmissions/user','WorkflowSubmissionController@list_user_workflow_submissions');
    Route::get('/workflowsubmissions/user/assignments','WorkflowSubmissionController@list_workflow_submission_assignments');
    Route::get('/workflowsubmissions/{workflow_submission}/log','WorkflowSubmissionController@workflow_submission_log');//->middleware('can:view,workflow_submission');
    Route::get('/workflowsubmissions/{workflow_submission}','WorkflowSubmissionController@status');//->middleware('can:view,workflow_submission');
    Route::put('/workflowsubmissions/{workflow_submission}','WorkflowSubmissionController@action');
    Route::delete('/workflowsubmissions/{workflow_submission}','WorkflowSubmissionController@destroy');

    // List all workflows
    Route::get('/workflows','WorkflowController@list_all_workflows')->middleware('can:get_all,App\Workflow');
    Route::get('/workflows/user','WorkflowController@list_user_workflows')->middleware('can:get_all,App\Workflow');
    Route::get('/workflows/group/{group_id}','WorkflowController@list_user_group_workflows')->middleware('can:get_all,App\Workflow');

    Route::get('/workflows/developers','WorkflowController@list_all_developers')->middleware('can:list_all_developers,App\Workflow');

    // Lookup specific workflow by workflow_id
    Route::get('/workflows/{workflow}','WorkflowController@show')->middleware('can:get,workflow');
    // Create a new workflow
    Route::post('/workflows','WorkflowController@create')->middleware('can:create,App\Workflow');
    // Update an existing workflow by workflow_id
    Route::put('/workflows/{workflow}','WorkflowController@update')->middleware('can:update,workflow');
    Route::put('/workflows/{workflow}/code','WorkflowController@code')->middleware('can:update,workflow');
    Route::put('/workflows/{workflow}/publish','WorkflowController@publish')->middleware('can:update,workflow');

    Route::get('/workflows/{workflow}/versions','WorkflowController@versions')->middleware('can:get_versions,workflow');
    Route::get('/workflows/{workflow}/versions/{version}','WorkflowController@version')->middleware('can:get_versions,workflow');

    // Delete an existing workflow by workflow_id
    Route::delete('/workflows/{workflow}','WorkflowController@destroy')->middleware('can:delete,workflow');

    // List all developers of a specified workflow by workflow_id
    Route::get('/workflows/{workflow}/developers','WorkflowController@list_developers')->middleware('can:list_developers,workflow');
    // Make an existing user a developers of an existing workflow by workflow_id, user_id
    Route::post('/workflows/{workflow}/developers/{user}','WorkflowController@add_developer')->middleware('can:add_developer,workflow');
    // Remove an existing developer from an existing workflow by workflow_id, user_id
    Route::delete('/workflows/{workflow}/developers/{user}','WorkflowController@remove_developer')->middleware('can:remove_developer,workflow');

    /***** WORKFLOW INSTANCES *****/
    // List all workflows instances
    Route::get('/workflowinstances','WorkflowInstanceController@list_all_workflow_instances')->middleware('can:get_all,App\WorkflowInstance');
    Route::get('/workflowinstances/user','WorkflowInstanceController@list_user_workflow_instances')->middleware('can:get_all,App\WorkflowInstance');

    // Lookup specific workflow instance by workflow_instance_id
    Route::get('/workflowinstances/{workflow_instance}','WorkflowInstanceController@show');
    Route::get('/workflowinstances/{workflow_instance}/csv','WorkflowInstanceController@getcsv');
    // Create a new workflow instance
    Route::post('/workflowinstances','WorkflowInstanceController@create')->middleware('can:create,App\WorkflowInstance');
    // Update an existing workflow instance by workflow_instance_id
    Route::put('/workflowinstances/{workflow_instance}','WorkflowInstanceController@update')->middleware('can:update,workflow_instance');
    Route::get('/workflowinstances/{workflow_instance}/pages','WorkflowInstanceController@pages')->middleware('can:update,workflow_instance');
    Route::get('/workflowinstances/{workflow_instance}/submissions','WorkflowSubmissionController@list_instance_workflow_submissions');
    // Delete an existing workflow instance by workflow_instance_id
    Route::delete('/workflowinstances/{workflow_instance}','WorkflowInstanceController@destroy')->middleware('can:delete,workflow_instance');

    // Get Workflow Instances for a specified group by group_id
    Route::get('/groups/{group}/workflowinstances','GroupController@list_workflowinstances')->middleware('can:list_components,group');
    // Update the order of workflowinstances in a group
    Route::post('/workflowinstances/order/{group}','GroupController@workflowinstances_order')->middleware('can:update,group');
});