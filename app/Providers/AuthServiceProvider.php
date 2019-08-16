<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
        'App\App' => 'App\Policies\AppPolicy',
        'App\AppInstance' => 'App\Policies\AppInstancePolicy',
        'App\Workflow' => 'App\Policies\WorkflowPolicy',
        'App\WorkflowInstance' => 'App\Policies\WorkflowInstancePolicy',
        'App\WorkflowSubmission' => 'App\Policies\WorkflowSubmissionPolicy',
        'App\Endpoint' => 'App\Policies\EndpointPolicy',
        'App\Link' => 'App\Policies\LinkPolicy',
        'App\User' => 'App\Policies\UserPolicy',
        'App\Group' => 'App\Policies\GroupPolicy',
        'App\Site' => 'App\Policies\SitePolicy',
        'App\Page' => 'App\Policies\PagePolicy',
        'App\Image' => 'App\Policies\ImagePolicy',
        'App\Tag' => 'App\Policies\TagPolicy',
        'App\APIUser' => 'App\Policies\APIUserPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
    }
}
