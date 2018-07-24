<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Group;
use App\App;
use App\User;
use App\AppVersion;
use App\AppDevelopers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use \Carbon\Carbon;

class AppController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }

    public function list_all_apps(Request $request) {
        if (Auth::user()->site_developer || Auth::user()->site_admin) {
            $apps = App::with('user')->where('site_id',config('app.site')->id)->orderBy('name')->get();
        } else {
            $apps = App::with('user')->where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_apps)->orderBy('name')->get();
        }
        return $apps;
    }
    public function list_user_apps(Request $request) {
        return App::where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_apps)->orderBy('name')->get();
    }
    public function list_user_group_apps(Request $request, $group_id) {
        return App::whereHas('app_instances', function($query) use ($group_id) {
            $query->where('group_id','=',$group_id);
        })->orWhereIn('id',Auth::user()->developer_apps)->orderBy('name')->get();
    }

    public function show(App $app) {
        // return $app;
        return AppVersion::where('app_id','=',$app->id)->orderBy('created_at', 'desc')->first();
    }

    public function create(Request $request) {
        $this->validate($request,['name'=>['required']]);
        $app = new App($request->all());
        $app->site_id = Auth::user()->site->id;
        $app->save();
        $app->add_developer(Auth::user(),true);
        $app_version = new AppVersion($request->all());
        $app_version->app_id = $app->id;
        $app_version->save();
        return $app;
    }

    public function code(Request $request, App $app) { 
        $app_version = AppVersion::where('app_id','=',$app->id)->orderBy('created_at', 'desc')->first();
        $post_data = Input::all();
        if(!isset($post_data['updated_at']) && !isset($post_data['force']) ){
            abort(403, $app_version);
        }

        $first = Carbon::parse($post_data['updated_at']);
        $second = Carbon::parse($app_version->updated_at);

        if($app_version->stable){
            $app_version = new AppVersion();
            $app_version->app_id = $app->id;
        }else if(!($first->gte($second) || isset($post_data['force']))){
            abort(409, $app_version);
        }

        $app_version->code = $request->code;
        $app_version->user_id = Auth::user()->id;
        $app_version->save();
        return $app_version;
    }
    public function publish(Request $request, App $app) { 
        $app_version = AppVersion::where('app_id','=',$app->id)->orderBy('created_at', 'desc')->where('stable','=',0)->first();
        if($app_version) {
            $app_version->summary = $request->summary;
            $app_version->description = $request->description;
            $app_version->stable = true;
            $app_version->user_id = Auth::user()->id;
            $app_version->save();
            return $app_version;
        }else{
            abort(409, 'No changes have been made since last published.<br><br> To publish please save changes.');
        }
    }
    public function search(Request $request, $type=null) {
        if (is_null($type)) {
            $code_query = 'code';
        } else {
            $code_query = 'code->'.$type;
        }
        $apps_with_versions = App::select('id','name','description','tags')
            ->with('versions')
            ->whereHas('versions', function($query) use ($request,$code_query) {
                $query->where($code_query,'like','%'.$request->q.'%');
            })->orderBy('name','asc')->get();

        $search_response = [];
        foreach($apps_with_versions as $apps_index => $app_with_versions) {
            $search_response[$app_with_versions->id] = [
                'id'=>$app_with_versions->id,
                'name'=>$app_with_versions->name,
                'description'=>$app_with_versions->description,
                'tags'=>$app_with_versions->tags,
            ];
            $found = false;
            foreach($app_with_versions->versions as $version_index => $version) {
                $search_response[$app_with_versions->id]['versions'][$version->id] = [
                    'id' => $version->id,
                    'summary' => $version->summary,
                    'description' => $version->description,
                    'user' => $version->user_id,
                ];
                if (is_null($type) || $type=='scripts') { // Find Matches in Scripts
                    foreach($version->code->scripts as $script_index => $script) {
                        $script_lines = explode("\n",$script->content);
                        foreach($script_lines as $line_number => $script_line) {
                            if (stristr($script_line, $request->q) && strlen($script_line)<1000) {
                                $found = true;
                                $search_response[$app_with_versions->id]['versions'][$version->id]['scripts'][] = [
                                    'filename' => $script->name,
                                    'line' => $line_number,
                                    'text' => trim($script_line),
                                ];
                            }
                        }
                    }
                }
                if (is_null($type) || $type=='css') { // Find Matches in CSS
                    $css_lines = explode("\n",$version->code->css);
                    foreach($css_lines as $line_number => $css_line) {
                        if (stristr($css_line, $request->q) && strlen($css_line)<1000) {
                            $found = true;
                            $search_response[$app_with_versions->id]['versions'][$version->id]['css'][] = [
                                'line' => $line_number,
                                'text' => trim($css_line),
                            ];
                        }
                    }
                }

            }
            if ($found === true) {
                $search_response[$app_with_versions->id]['versions'] = array_values($search_response[$app_with_versions->id]['versions']);
            } else {
                unset($search_response[$app_with_versions->id]);
            }
        }
        $search_response = array_values($search_response);
        return $search_response;
    }
    public function versions(Request $request, App $app) { 
        $app_versions = AppVersion::select('id','summary','created_at','user_id')
            ->with('user')->where('app_id','=',$app->id)->where('stable','=',1)
            ->orderBy('created_at', 'desc')->get();
        foreach($app_versions as $i => $app_version) {
            $last_name = ($app_version->toArray()['user']['last_name'] != '')?'('.$app_version->toArray()['user']['last_name'].')':'';
            $app_versions[$i]->label = $app_version->created_at->format('Y-m-d').' - '.$app_version->summary.' '.$last_name;
        }
        return $app_versions;
    }

    public function version(Request $request, App $app, AppVersion $version) { 

        return $version;
    }
    public function update(Request $request, App $app) {  
        $app->update($request->all());
        $app->save();
        return $app;
    }

    public function destroy(App $app) {
        if ($app->delete()) {
            return 1;
        }
    }
    public function admin(App $app) {
        return view('adminApp', ['app'=>AppVersion::with('app')->where('app_id','=',$app->id)->orderBy('created_at', 'desc')->first()]);
    }
    public function list_developers(App $app)
    {
        return User::select('id','unique_id','first_name','last_name','email')->whereHas('app_developers', function($query) use ($app) {
          $query->where('app_id','=',$app->id);
        })->whereHas('site_members', function($query) use ($app) {
            $query->where('site_id','=',config('app.site')->id);
        })->get();
    }
    public function list_all_developers()
    {
        return User::select('id','unique_id','first_name','last_name','email')
            ->has('app_developers')
            ->orWhereHas('site_members', function($query) {
                $query->where('site_developer','=',true);
            })
            ->whereHas('site_members', function($query) {
                $query->where('site_id','=',config('app.site')->id);
            })
            ->get();
    }
    public function add_developer(App $app, User $user, Request $request)
    {
        if ($request->has('status')) {
            return $app->add_developer($user,$request->status);
        } else {
            return $app->add_developer($user);
        }
    }
    public function remove_developer(App $app, User $user)
    {
        return $app->remove_developer($user);
    }

}
