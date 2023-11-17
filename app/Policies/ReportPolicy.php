<?php

namespace App\Policies;

use App\User;
use App\Report;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class ReportPolicy
{
    use HandlesAuthorization;

    public function view_in_admin(User $user)
    {
        if ($user->site_developer || $user->site_admin || $user->report_developer()) {
            return true;
        }
    }

    public function get_all(User $user)
    {
        if ($user->site_developer || $user->site_admin || $user->group_apps_admin() || $user->report_developer()) {
            return true;
        }
    }
    public function view(User $user)
    {
        if ($user->site_developer || $user->site_admin){// || $user->group_apps_admin() || $user->report_developer()) {
            return true;
        }
    }

    public function get(User $user, Report $report)
    {
        if ($user->site_developer || $user->site_admin || $user->report_developer($report->id)) {
            return true;
        }
    }

    public function get_versions(User $user, Report $report)
    {
        if ($user->site_developer || $user->site_admin || $user->group_apps_admin() || $user->report_developer()) {
            return true;
        }
    }


    public function create(User $user)
    {
        if ($user->site_developer || $user->site_admin) {
            return true;
        }
    }

    public function update(User $user, Report $report)
    {
        if ($user->report_developer($report->id)) {
            return true;
        }
    }

    public function delete(User $user, Report $report)
    {
        // TJC 7/25/18 -- Prevent Bulk Deleting of Apps Accidentally, Even if You're 
        // a Site Admin or Site Developer.  (MUST BE AN A DEVELOPER OF THAT APP)
        // Advised by Lauri Arnold / Robin Sassani
        if ($user->report_developer($report->id)) {
            return true;
        }
    }

    public function list_developers(User $user, Report $report)
    {
        if ($user->site_developer || $user->site_admin || $user->report_developer($report->id)) {
            return true;
        }
    }

    public function list_all_developers(User $user)
    {
        if ($user->site_developer || $user->site_admin || $user->report_developer()) {
            return true;
        }
    }

    public function add_developer(User $user, Report $report)
    {
        if ($user->site_developer || $user->site_admin || $user->report_developer($report->id)) {
            return true;
        }
    }

    public function remove_developer(User $user, Report $report)
    {
        if ($user->site_developer || $user->site_admin || $user->report_developer($report->id)) {
            return true;
        }
    }
}