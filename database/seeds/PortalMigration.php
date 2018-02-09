<?php

use Illuminate\Database\Seeder;

class PortalMigration extends Seeder
{
    /**
     *
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {
            $site_id = 1;
            $user_ids = [1,2];
            $group_memberships = ['Students','Staff','ITS Blog Admins'];
            $key = env('APP_KEY_PORTAL');

            $groups_db = DB::connection('mysql-portal')->table('groups')->get();
            $groups_index = [];
            foreach($groups_db as $index => $group_db) {
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
            }

            $tags_db = DB::connection('mysql-portal')->table('group_keys')->get();
            $tags_index = [];
            foreach($tags_db as $index => $tag_db) {
                if (isset($groups_index[$tag_db->group_id])) {
                    $tag = new \App\Tag;
                    $tag->group_id = $groups_index[$tag_db->group_id]->id;
                    $tag->name = $tag_db->name;
                    $tag->value = $tag_db->value;
                    $tag->save();
                    $tags_index[$tag_db->id] = $tag;
                }
            }

            $group_composites_db = DB::connection('mysql-portal')->table('group_composites')->get();
            foreach($group_composites_db as $index => $group_composite_db) {
                try {
                    if (isset($groups_index[$group_composite_db->group_id])) { // Make sure the group actually exists
                        $group_composite = new \App\GroupComposite;
                        $group_composite->composite_group_id = $groups_index[$group_composite_db->composite_id]->id;
                        $group_composite->group_id = $groups_index[$group_composite_db->group_id]->id;
                        $group_composite->save();
                    }
                } catch (Exception $e) {
                    echo 'Caught exception: ',  $e->getMessage(), "\n";
                    echo "The exception was created on line: " . $e->getLine(). "\n";
                }
            }

            $endpoints_db = DB::connection('mysql-portal')->table('endpoints')->get();
            $endpoints_index = [];
            foreach($endpoints_db as $index => $endpoint_db) {
                try {
                    $endpoint = new \App\Endpoint;
                    $endpoint->site_id = $site_id;
                    $endpoint->name = $endpoint_db->name;

                    if ($endpoint_db->password === '') {
                        $password = '';
                    } else {
                        // Decrypt Existing Password
                        $payload = json_decode(base64_decode($endpoint_db->password), true);
                        $value = base64_decode($payload['value']);
                        $iv = base64_decode($payload['iv']);
                        $password = unserialize(mcrypt_decrypt(MCRYPT_RIJNDAEL_128,$key,$value,MCRYPT_MODE_CBC,$iv));
                    }

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
                    echo "The exception was created on line: " . $e->getLine(). "\n";
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
                    $app_db->sources = str_replace('user.pods','user.params.pods',$app_db->sources);
                    $app_db->script = str_replace('user.pods','user.params.pods',$app_db->script);
                    $app_db->template = str_replace('user.pods','user.params.pods',$app_db->template);
                    $app_db->sources = str_replace('tags.','user.tags.',$app_db->sources);
                    $app_db->script = str_replace('tags.','user.tags.',$app_db->script);
                    $app_db->template = str_replace('tags.','user.tags.',$app_db->template);  
                    
                    $app_db->script = str_replace('_.findWhere','_.find',$app_db->script);
                    $app_db->script = str_replace('_.filter','_.where',$app_db->script);
                    $app_db->script = str_replace('_.pluck','_.map',$app_db->script);

                    $app_sources_db = json_decode($app_db->sources,true);
                    $app_sources = [];
                    if (is_array($app_sources_db)) {
                        foreach($app_sources_db as $index => $app_source_db) {
                            if (isset($app_source_db['name'])){
                                $app_sources[$index]['name'] = $app_source_db['name'];
                            }
                            if (isset($app_source_db['modifier'])){
                                $app_sources[$index]['modifier'] = $app_source_db['modifier'];
                            }
                            if (isset($app_source_db['cache'])){
                                $app_sources[$index]['cache'] = $app_source_db['cache'];
                            }
                            if (isset($app_source_db['fetch'])){
                                $app_sources[$index]['fetch'] = $app_source_db['fetch'];
                            }
                            if (isset($app_source_db['path'])){
                                $app_sources[$index]['path'] = $app_source_db['path'];
                            }
                        }
                    }
                    $app->save();
                    $apps_index[$app_db->id] = $app;
                    $apps_index_db[$app_db->id] = $app_db;

                    $app_version = new \App\AppVersion;
                    $app_version->stable = 1;
                    $app_version->app_id = $app->id;
                    $app_version->summary = 'Initial Version';
                    $app_version->description = 'This is the initial version which was migrated from myBinghamton';
                    $app_version->code = [
                        'css'=>$app_db->css,
                        'scripts'=>json_decode($app_db->script),
                        'resources'=>array_values($app_sources),
                        'templates'=>json_decode($app_db->template),
                        'forms'=>[
                            ["name"=>"Options", "content"=>json_encode(['fields'=>$app_db->options])],
                            ["name"=>"User Options", "content"=>json_encode(['fields'=>$app_db->user_options])]
                        ]
                    ];
                    $app_version->save();

                    $app_versions_index[$app->id] = $app_version;

                    foreach($user_ids as $user_id) {
                        $app_developer = new \App\AppDeveloper;
                        $app_developer->app_id = $app->id;
                        $app_developer->user_id = $user_id;
                        $app_developer->status = 1;
                        $app_developer->save();
                    }

                } catch (Exception $e) {
                    echo 'Caught exception: ',  $e->getMessage(), "\n";
                    echo "The exception was created on line: " . $e->getLine(). "\n";
                }
            }

            $pages_db = DB::connection('mysql-portal')->table('community_pages')->get();
            $pages_index = [];

            // Handle App Instances
            $page_widgets_index = [];
            foreach($pages_db as $index => $page_db) {
                if (isset($groups_index[$page_db->group_id])) { // Make sure the group actually exists
                    $page = new \App\Page;
                    $page->name = $page_db->name;
                    $page->slug = $page_db->slug;
                    $page->public = $page_db->public;
                    $page->unlisted = $page_db->unlist;
                    $page->order = $page_db->order;
                    $page->device = $page_db->device;
                    $page->mobile_order = [];
                    $page->group_id = $groups_index[$page_db->group_id]->id;
                    $page_content_array = ['layout'=>(string)$page_db->layout,'sections'=>[]];

                    $page_dev_db = json_decode($page_db->content,false);
                    foreach($page_dev_db as $page_column_num => $page_column_db) {
                        $page_content_array['sections'][$page_column_num] = [];
                        foreach($page_column_db as $page_widget_db) {
                            if ($page_widget_db->widgetType=='LinkCollection') {
                                // Add links to specified composite groups
                                if (isset($page_widget_db->group) && isset($page_widget_db->group->ids) && count($page_widget_db->group->ids)>0 && $page_widget_db->group->ids[0] != '') {
                                    foreach($page_widget_db->group->ids as $link_widget_group_id) {
                                        foreach($page_widget_db->links as $index => $link_db) {
                                            if (isset($link_db->link)) {
                                                $link = new \App\Link;
                                                $link->link = $link_db->link;
                                                $link->title = $link_db->title;
                                                $link->image = $link_db->image;
                                                $link->color = $link_db->color;
                                                if (stristr($link_db->icon,'fa ')) {
                                                    $link->icon = $link_db->icon;
                                                }
                                                $link->group_id = $groups_index[$link_widget_group_id]->id;
                                                $link->save();
                                            }
                                        }
                                    }
                                // Add links to current group
                                } else {
                                    foreach($page_widget_db->links as $index => $link_db) {
                                        if (isset($link_db->link)) {
                                            $link = new \App\Link;
                                            $link->link = $link_db->link;
                                            $link->title = $link_db->title;
                                            $link->image = $link_db->image;
                                            $link->color = $link_db->color;
                                            if (stristr($link_db->icon,'fa ')) {
                                                $link->icon = $link_db->icon;
                                            }
                                        $link->group_id = $page->group_id;
                                            $link->save();
                                        }
                                    }
                                }
                                $last_widget = end($page_content_array['sections'][$page_column_num]);
                                if (!is_array($last_widget) || (is_array($last_widget) && $last_widget['widgetType']!='Links')) {
                                    $page_content_array['sections'][$page_column_num][] = [
                                        'widgetType' => 'Links',
                                        'title' => 'Useful Links',
                                        'container' => true,
                                    ];
                                }
                            } if ($page_widget_db->widgetType=='Html' || $page_widget_db->widgetType=='Content') {
                                if (isset($page_widget_db->text)) {
                                    $text = $page_widget_db->text;
                                } else if (isset($page_widget_db->html)) {
                                    $text = $page_widget_db->html;
                                } else {
                                    $text = '';
                                }
                                $page_content_array['sections'][$page_column_num][] = [
                                    'widgetType' => 'Content',
                                    'title' => isset($page_widget_db->title)?$page_widget_db->title:false,
                                    'text' => $text,
                                    'enable_min' => isset($page_widget_db->enable_min)?$page_widget_db->enable_min:false,
                                    'container' => isset($page_widget_db->container)?$page_widget_db->container:true,
                                ];
                            } if ($page_widget_db->widgetType=='Slider') {
                                $page_content_array['sections'][$page_column_num][] = [
                                    'widgetType' => 'Image',
                                    'images' => $page_widget_db->images,
                                    'title' => isset($page_widget_db->title)?$page_widget_db->title:'Slideshow',
                                    'enable_min' => isset($page_widget_db->enable_min)?$page_widget_db->enable_min:false,
                                    'container' => isset($page_widget_db->container)?$page_widget_db->container:false,
                                ];
                            } if ($page_widget_db->widgetType=='Image') {
                                $page_content_array['sections'][$page_column_num][] = [
                                    'widgetType' => 'Image',
                                    'images' => ['image'=>$page_widget_db->image,'text'=>$page_widget_db->text],
                                    'title' => isset($page_widget_db->title)?$page_widget_db->title:false,
                                    'enable_min' => isset($page_widget_db->enable_min)?$page_widget_db->enable_min:false,
                                    'container' => isset($page_widget_db->container)?$page_widget_db->container:false,
                                ];
                            } if ($page_widget_db->widgetType=='Microapp') {
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
                                            if (isset($option['name']) && $app_instance_option_name == $option['name']) {
                                                $app_instance_options[$app_instance_option_name] = $app_instance_option_val;
                                            }
                                        }
                                        foreach($apps_index_db[$page_widget_db->microapp]->user_options as $user_option) {
                                            if (isset($user_option['name']) && $app_instance_option_name == $user_option['name']) {
                                                $app_instance_user_options[$app_instance_option_name] = $app_instance_option_val;
                                            }
                                        }
                                    }

                                    if (isset($apps_index[$page_widget_db->microapp])) { // Make sure the app actually exists
                                        $app_instance = new \App\AppInstance;
                                        $app_instance->name = $apps_index[$page_widget_db->microapp]->name.' - Page: '.$page_db->name;
                                        $app_instance->slug = preg_replace("/(\W)+/","",strtolower($apps_index[$page_widget_db->microapp]->name));
                                        $app_instance->group_id = $groups_index[$page_db->group_id]->id;
                                        $app_instance->app_id = $apps_index[$page_widget_db->microapp]->id;
                                        $app_instance->public = $apps_index_db[$page_widget_db->microapp]->public;
                                        $app_instance->app_version_id = $app_versions_index[$apps_index[$page_widget_db->microapp]->id]->id;
                                        $app_instance->options = $app_instance_options;
                                        $app_instance->user_options_default = $app_instance_user_options;
                                        $app_instance->unlisted = 1;
                                        $app_instance->device = 0;
                                        if ($apps_index_db[$page_widget_db->microapp]->sources === '') {
                                            $resources = [];
                                        } else {
                                            $resources = json_decode($apps_index_db[$page_widget_db->microapp]->sources);
                                        }
                                        $new_resources = [];
                                        foreach($resources as $index => $resource) {
                                            // Make sure the name isn't empty and the resource actually exists (hasn't been deleted)
                                            if ($resource->name != '' && (isset($endpoints_index[$resource->endpoint]) || $resource->endpoint == 'External')) {
                                                if ($resource->endpoint != 'External') {
                                                    $new_resources[] = ['name'=>$resource->name,'endpoint'=>$endpoints_index[$resource->endpoint]->id];
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
                                                        echo 'A Caught exception: ',  $e->getMessage(), "\n";
                                                        echo "The exception was created on line: " . $e->getLine(). "\n";
                                                    }
                                                    $new_resources[] = ['name'=>$resource->name,'endpoint'=>$endpoint->id];
                                                }
                                            }
                                        }
                                        $app_instance->resources = $new_resources;
                                        $app_instance->save();
                                        $page_widgets_index[$page_widget_db->guid] = $page_widget_db;
                                    }

                                } catch (Exception $e) {
                                    echo 'B Caught exception: ',  $e->getMessage(), "\n";
                                    echo "The exception was created on line: " . $e->getLine(). "\n";
                                    dd($page_widget_db->microapp);
                                }

                                $page_content_array['sections'][$page_column_num][] = [
                                    'widgetType' => 'uApp',
                                    'app_id' => $app_instance->id,
                                    'title' => isset($page_widget_db->title)?$page_widget_db->title:false,
                                    'enable_min' => isset($page_widget_db->enable_min)?$page_widget_db->enable_min:false,
                                    'container' => isset($page_widget_db->container)?$page_widget_db->container:true,
                                ];
                            }
                        }
                    }
                    $page->content = $page_content_array;
                    $page->save();
                    $pages_index[$page_db->id] = $page;
                }
            }

        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
            echo "The exception was created on line: " . $e->getLine(). "\n";
        }

    }

}
