<?php

use Illuminate\Database\Seeder;

class PortalMigration extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $site_id = 1;
        $user_ids = [1,2];
        $group_memberships = ['Campus Life','Academic Services'];
        $key = env('APP_KEY_PORTAL');

        $groups_db = DB::connection('mysql-portal')->table('groups')->get();
        $groups_index = [];
        foreach($groups_db as $index => $group_db) {
            try {
                $group = new \App\Group;
                $group->site_id = $site_id;
                $group->name = $group_db->name;
                $group->slug = $group_db->slug;
                $group->order = $group_db->order;
                $group->unlisted = !($group_db->community_flag);
                $group->save();
                $groups_index[$group_db->id] = $group;

                if (in_array($group->name,$group_memberships)) {
                    foreach($user_ids as $user_id) {
                        $current_user = \App\User::find($user_id);
                        $group->add_admin($current_user, 1);
                        $group->add_member($current_user, 1);
                    }
                }
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
            }
        }

        $group_composites_db = DB::connection('mysql-portal')->table('group_composites')->get();
        foreach($group_composites_db as $index => $group_composite_db) {
            try {
                $group_composite = new \App\GroupComposite;
                $group_composite->composite_group_id = $groups_index[$group_composite_db->group_id]->id;
                $group_composite->group_id = $groups_index[$group_composite_db->composite_id]->id;
                $group_composite->save();
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
            }
        }

        $endpoints_db = DB::connection('mysql-portal')->table('endpoints')->get();
        $endpoints_index = [];
        foreach($endpoints_db as $index => $endpoint_db) {
            try {
                $endpoint = new \App\Endpoint;
                $endpoint->site_id = $site_id;
                $endpoint->name = $endpoint_db->name;

                // Decrypt Existing Password
                $payload = json_decode(base64_decode($endpoint_db->password), true);
                $value = base64_decode($payload['value']);
                $iv = base64_decode($payload['iv']);
                $password = unserialize(mcrypt_decrypt(MCRYPT_RIJNDAEL_128,$key,$value,MCRYPT_MODE_CBC,$iv));

                $endpoint->config = [
                    'url'=>$endpoint_db->target,
                    'username'=>$endpoint_db->username,
                    'secret'=>$password,
                ];
                $endpoint->type = 'http_basic_auth';
                $endpoint->group_id = $groups_index[$endpoint_db->group_id]->id;
                $endpoint->save();
                $endpoints_index[$endpoint_db->id] = $endpoint;
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
            }
        }

        $apps_db = DB::connection('mysql-portal')->table('microapps')->get();
        $apps_index = [];
        $apps_index_db = [];
        foreach($apps_db as $index => $app_db) {
            try {
                $app = new \App\App;
                $app->name = $app_db->name;
                $app->site_id = $site_id;
                $app_options_db = json_decode($app_db->options,true);
                $app_db->options = [];
                $app_db->user_options = [];
                $user_form_fields_to_replace = [];
                if (isset($app_options_db['fields'])) {
                    foreach($app_options_db['fields'] as $app_option_db) {
                        if (isset($app_option_db['userEdit']) && $app_option_db['userEdit']==true) {
                            $app_db->user_options[] = $app_option_db;
                            $user_form_fields_to_replace[] = $app_option_db['name'];
                        } else {
                            $app_db->options[] = $app_option_db;
                        }
                    }
                }
                // dd($app_db);
                foreach($user_form_fields_to_replace as $user_form_field_to_replace) {
                    $app_db->sources = str_replace('options.'.$user_form_field_to_replace,'user.options.'.$user_form_field_to_replace,$app_db->sources);
                    $app_db->script = str_replace('options.'.$user_form_field_to_replace,'user.options.'.$user_form_field_to_replace,$app_db->script);
                    $app_db->template = str_replace('options.'.$user_form_field_to_replace,'user.options.'.$user_form_field_to_replace,$app_db->template);                     
                }
                $app_db->sources = str_replace('user.bnum','user.params.bnum',$app_db->sources);
                $app_db->script = str_replace('user.bnum','user.params.bnum',$app_db->script);
                $app_db->template = str_replace('user.bnum','user.params.bnum',$app_db->template);  
                $app_db->sources = str_replace('user.pidm','user.params.pidm',$app_db->sources);
                $app_db->script = str_replace('user.pidm','user.params.pidm',$app_db->script);
                $app_db->template = str_replace('user.pidm','user.params.pidm',$app_db->template);                   

                $app_sources_db = json_decode($app_db->sources,true);
                $app_sources = [];
                if (is_array($app_sources_db)) {
                    foreach($app_sources_db as $app_source_db) {
                        if (isset($app_source_db['name'])){
                            $app_sources[] = ["name"=>$app_source_db['name']];
                        }
                    }
                }
                $app->code = [
                    'css'=>$app_db->css,
                    'scripts'=>json_decode($app_db->script),
                    'sources'=>$app_sources,
                    'templates'=>json_decode($app_db->template),
                    'forms'=>[
                        ["name"=>"Options", "content"=>json_encode(['fields'=>$app_db->options])],
                        ["name"=>"User Options", "content"=>json_encode(['fields'=>$app_db->user_options])]
                    ]
                ];
                $app->save();
                $apps_index[$app_db->id] = $app;
                $apps_index_db[$app_db->id] = $app_db;

                foreach($user_ids as $user_id) {
                    $app_developer = new \App\AppDeveloper;
                    $app_developer->app_id = $app->id;
                    $app_developer->user_id = $user_id;
                    $app_developer->status = 1;
                    $app_developer->save();
                }

            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
            }
        }

        $pages_db = DB::connection('mysql-portal')->table('community_pages')->get();
        $pages_index = [];
        // foreach($pages_db as $index => $page_db) {
        //     try {
        //         $page = new \App\Page;
        //         $page->name = $page_db->name;
        //         $page->slug = $page_db->slug;
        //         $page->public = $page_db->public;
        //         $page->unlisted = $page_db->unlist;
        //         $page->order = $page_db->order;
        //         $page->device = $page_db->device;
        //         $page->content = json_decode($page_db->content);
        //         $page->mobile_order = json_decode($page_db->mobile_order);
        //         $page->group_id = $groups_index[$page_db->group_id]->id;
        //         $page->save();
        //         $pages_index[$page_db->id] = $page;
        //     } catch (Exception $e) {
        //         echo 'Caught exception: ',  $e->getMessage(), "\n";
        //     }
        // }

        // Handle App Instances
        $page_widgets_index = [];
        foreach($pages_db as $index => $page_db) {
            $page = new \App\Page;
            $page->name = $page_db->name;
            $page->slug = $page_db->slug;
            $page->public = $page_db->public;
            $page->unlisted = $page_db->unlist;
            $page->order = $page_db->order;
            $page->device = $page_db->device;
            $page->mobile_order = [];
            $page->group_id = $groups_index[$page_db->group_id]->id;
            $page_content_array = ['sections'=>[]];

            $page_dev_db = json_decode($page_db->content,false);
            foreach($page_dev_db as $page_column_num => $page_column_db) {
                $page_content_array['sections'][$page_column_num] = [];
                foreach($page_column_db as $page_widget_db) {
                    if ($page_widget_db->widgetType=='Microapp') {
                        try {
                            $known_config = [
                                'user_edit'=>0, 'widgetType'=>0,'guid'=>0,'microapp'=>0,'title'=>0,
                                'container'=>0,'custom_options'=>0,'group'=>0,'device'=>0,
                                'enable_min'=>0,'limit'=>0,
                            ];
                            $app_instance_all_options = array_diff_key((array)$page_widget_db,$known_config);
                            $app_instance_options = [];
                            $app_instance_user_options = [];
                            foreach($app_instance_all_options as $app_instance_option_name => $app_instance_option_val) {
                                foreach($apps_index_db[$page_widget_db->microapp]->options as $option) {
                                    if ($app_instance_option_name == $option['name']) {
                                        $app_instance_options[$app_instance_option_name] = $app_instance_option_val;
                                    }
                                }
                                foreach($apps_index_db[$page_widget_db->microapp]->user_options as $user_option) {
                                    // dd($user_option);
                                    if ($app_instance_option_name == $user_option['name']) {
                                        $app_instance_user_options[$app_instance_option_name] = $app_instance_option_val;
                                    }
                                }
                            }

                            $app_instance = new \App\AppInstance;
                            $app_instance->name = $apps_index[$page_widget_db->microapp]->name.' - Page: '.$page_db->name;
                            $app_instance->slug = preg_replace("/(\W)+/","",strtolower($apps_index[$page_widget_db->microapp]->name));
                            $app_instance->group_id = $groups_index[$page_db->group_id]->id;
                            $app_instance->app_id = $apps_index[$page_widget_db->microapp]->id;
                            $app_instance->public = $apps_index_db[$page_widget_db->microapp]->public;
                            $app_instance->options = $app_instance_options;
                            $app_instance->user_options_default = $app_instance_user_options;
                            $app_instance->app_version_id = 1;
                            $resources = json_decode($apps_index_db[$page_widget_db->microapp]->sources);
                            foreach($resources as $index => $resource) {
                                if ($resource->endpoint != 'External') {
                                    $resources[$index]->endpoint = $endpoints_index[$resource->endpoint]->id;
                                } else {
                                    try {
                                        $endpoint = \App\Endpoint::where('group_id','=',$groups_index[$page_db->group_id]->id)->
                                            where('config->url','=','')->first();
                                        if ($endpoint === null) {
                                            $endpoint = new \App\Endpoint;
                                            $endpoint->site_id = $site_id;
                                            $endpoint->name = $apps_index[$page_widget_db->microapp]->name.' Endpoint';
                                            $endpoint->config = ['url'=>''];
                                            $endpoint->type = 'http_no_auth';
                                            $endpoint->group_id = $groups_index[$page_db->group_id]->id;
                                            $endpoint->save();
                                            $endpoints_index[$endpoint_db->id] = $endpoint;
                                        }
                                    } catch (Exception $e) {
                                        echo 'Caught exception: ',  $e->getMessage(), "\n";
                                    }
                                    $resources[$index]->endpoint = $endpoint->id;
                                }
                            }
                            $app_instance->resources = $resources;
                            $app_instance->save();
                            $page_widgets_index[$page_widget_db->guid] = $page_widget_db;


                        } catch (Exception $e) {
                            echo 'Caught exception: ',  $e->getMessage(), "\n";
                            // dd((array)$page_widget_db);
                        }
// dd($page);
                        $page_content_array['sections'][$page_column_num][] = [
                            'widgetType' => 'uApp',
                            'app_id' => $app_instance->id,
                            'title' => $page_widget_db->title,
                        ];
                    }
                }
            }
            $page->content = $page_content_array;
            $page->save();
            $pages_index[$page_db->id] = $page;
        }
    }
}
