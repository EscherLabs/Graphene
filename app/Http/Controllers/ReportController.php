<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use \Carbon\Carbon;

class ReportController extends Controller
{
    public function __construct() {
    }

    private function activity($request) {
        $months_ago = 1;
        if ($request->has('months_ago')) {
            $months_ago = $request->get('months_ago');
        }
        $results = DB::select("
            select users.first_name, users.last_name, users.unique_id, users.email, visits.resource_type as `type`,  
            ifnull(ifnull(ifnull(ifnull(null,links.resource_id),apps.resource_id),workflows.resource_id),pages.resource_id) as id, 
            ifnull(ifnull(ifnull(ifnull(null,links.name),apps.name),workflows.name),pages.name) as name, 
            ifnull(ifnull(ifnull(ifnull(null,links.group_name),apps.group_name),workflows.group_name),pages.group_name) as `group`,
            LOWER(ifnull(ifnull(ifnull(ifnull(null,links.url),apps.url),workflows.url),pages.url)) as url,
            max(visits.created_at) as last_access 
            from users
            left join group_members on users.id = group_members.user_id
            left join groups on groups.id = group_members.group_id
            left join visits on visits.user_id = users.id
            left join (
                select pages.id as resource_id, pages.name as name, groups.name as group_name, concat('/page/',groups.slug,'/',pages.slug) as url
                from pages left join groups on pages.group_id = groups.id
            ) as pages on visits.resource_id = pages.resource_id and visits.resource_type = 'page'
            left join (
                select workflow_instances.id as resource_id, workflow_instances.name as name, groups.name as group_name, concat('/workflow/',groups.slug,'/',workflow_instances.slug) as url
                from workflow_instances left join groups on workflow_instances.group_id = groups.id
            ) as workflows on visits.resource_id = workflows.resource_id and visits.resource_type = 'workflow'
            left join (
                select app_instances.id as resource_id, app_instances.name as name, groups.name as group_name, concat('/app/',groups.slug,'/',app_instances.slug) as url
                from app_instances left join groups on app_instances.group_id = groups.id
            ) as apps on visits.resource_id = apps.resource_id and visits.resource_type = 'app'
            left join (
                select links.id as resource_id, links.title as name, groups.name as group_name, link as url
                from links left join groups on links.group_id = groups.id
            ) as links on visits.resource_id = links.resource_id and visits.resource_type = 'link'
            where visits.created_at > DATE_SUB(NOW(), INTERVAL ".$months_ago." MONTH)
            and users.unique_id is not null
            and users.unique_id != ''
            group by users.unique_id, users.first_name, users.last_name, users.email, visits.resource_type, visits.resource_id
            order by users.unique_id, visits.resource_type, visits.resource_id
        ");
        return $results;
    }

    private function last_access($request, $group_slug) {
        $months_ago = 1;
        if ($request->has('months_ago')) {
            $months_ago = $request->get('months_ago');
        }
        $results = DB::table('users')
            ->select('users.unique_id','users.first_name','users.last_name','users.email',DB::raw('MAX(visits.created_at) as last_access'))
            ->leftJoin('group_members', 'users.id', '=', 'group_members.user_id')
            ->leftJoin('groups', 'groups.id', '=', 'group_members.group_id')
            ->leftJoin('visits', 'visits.user_id', '=', 'users.id')
            ->where('groups.slug','=',$group_slug)
            ->where('visits.created_at','>',DB::raw('DATE_SUB(NOW(), INTERVAL '.$months_ago.' MONTH)'))
            ->whereNotNull('users.unique_id')
            ->where('users.unique_id','!=','')
            ->groupBy('users.unique_id','users.first_name','users.last_name','users.email')
            ->get();
        return $results;
    }

    private function csvify($data) {
        $csv_string = '';
        if (count($data)>0) {
            $csv_string .= '"'.implode('","',array_keys((array)$data[0])).'"'."\n";
            foreach($data as $row) {
                $csv_string .= '"'.implode('","',array_values((array)$row)).'"'."\n";
            }
        }
        return $csv_string;
    }

    public function run(Request $request, $name, $param1=null) {
        $filename = $name.'_'.date('Y-m-d');
        if ($name === 'last_access') {
            if (is_null($param1)) {
                return response('You must specify a group slug (example: "DEFAULT")',422);
            }
            $filename = $name.'_'.$param1.'_'.date('Y-m-d');
            $data = $this->last_access($request, $param1);
        } else if ($name === 'activity') {
            $filename = $name.'_'.date('Y-m-d');
            $data = $this->activity($request);    
        } else {
            return response('Report "'.$name.'" does not exists.',404);
        }
        if ($request->has('format') && $request->get('format')==='csv') {
            return response($this->csvify($data))
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition','attachment; filename="'.strtoupper($filename).'.csv"');
        } else {
            return $data;
        }
    }

}