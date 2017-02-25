<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $site = new \App\Site;
        $site->domain = '127.0.0.1';
        $site->name = 'LocalDev';
        $site->theme->css = '.navbar-inverse .navbar-brand, .navbar-inverse .navbar-brand:hover, .navbar-inverse .navbar-brand:focus {background-color:blue;}';
        $site->save();

        $group = new \App\Group;
        $group->site_id = $site->id;
        $group->name = 'My Group';
        $group->slug = 'my_group';
        $group->save();

        $user1 = new \App\User;
        $user1->first_name = 'Tim';
        $user1->last_name = 'Cortesi';
        $user1->email = 'tcortesi@gmail.com';
        $user1->password = '$2y$10$56dR5caUtFNoRV/Kl96t8uIYKhL6Dh4.87wRnWO7uwO90k.Uw82g6';
        $user1->site_admin = 1;
        $user1->developer = 1;
        $user1->save();
        $group->add_member($user1);
        $group->add_admin($user1);
        $site->add_member($user1,1,1);

        $user2 = new \App\User;
        $user2->first_name = 'Adam';
        $user2->last_name = 'Smallcomb';
        $user2->email = 'atsmallcomb@gmail.com';
        $user2->password = '$2y$10$56dR5caUtFNoRV/Kl96t8uIYKhL6Dh4.87wRnWO7uwO90k.Uw82g6';
        $user2->site_admin = 1;
        $user2->developer = 1;
        $user2->save();
        $group->add_member($user2);
        $group->add_admin($user2);
        $site->add_member($user2,1,1);

        $app = new \App\App;
        $app->name = 'My App';
        $app->site_id = $site->id;
        
        $app->code = [
            "css" => "",
            "form"=>json_decode('{"fields":[{"label":"Test","name":"test"}]}'),
            "scripts" => [
            [
                "name" => "main",
                "content" => "
                this.data.counter = 1;\n
                this.data.echo = {};\n
                this.callback = function() {\n
                    this.app.on('hello',function(){\n
                        console.log('stuff');\n
                    })\n
                    this.app.click('.btn-info', function() {\n
                        this.app.refresh();\n
                    })\n
                    this.app.click('.btn-danger', function() {\n
                        this.data.counter++;\n
                        this.app.update();\n
                    })\n
                    this.app.click('.btn-warning',function() {\n
                        this.app.get('whoami',{},function(response){\n
                            this.data.whoami = response;\n
                            this.app.update();\n
                        })\n
                    })\n
                    this.app.click('.post-echo',function() {\n
                        this.app.post('echo',{'result':this.".'$'."el.find('#post-echo-input').val()},function(response){\n
                            this.data.echo.POST = response.POST;\n
                            this.app.update();\n
                        })\n
                    })\n
                    this.app.click('.get-echo',function() {\n
                        this.app.get('echo',{'result':this.".'$'."el.find('#get-echo-input').val()},function(response){\n
                            this.app.update({echo:{GET:response.GET}});\n
                        })\n
                    })\n
                    this.app.click('.updateDirect', function(){\n
                        this.data.counter = 100;//.set({counter:100});\n
                        this.app.redraw();\n
                        \n
                    })\n
                }
                ",
            ],
            ],
            "sources" => [
                ["name" => "whoami"],
                ["name" => "echo"],
            ],
            "templates" => [
            [
                "name" => "main",
                "content" => "
                <div class='btn btn-info'>Refresh Button!</div>\n
                <div>{{options.mytext}}</div>\n
                <div class='btn btn-danger'>Redraw Increment Counter</div>\n
                <div><strong>Counter:</strong> {{counter}}</div>\n
                <div class='btn btn-warning'>Who Am I?</div>\n
                <div><strong>Who Am I?</strong> {{whoami.user}}</div>\n
                <div>\n
                    <input id='post-echo-input' type='text' />\n
                    <div class='btn btn-success post-echo'>POST Echo</div>\n
                </div>\n
                <div>\n
                    <strong>POST Response:</strong> {{echo.POST.result}}\n
                </div>\n
                <div>\n
                    <input id='get-echo-input' type='text' />\n
                    <div class='btn btn-success get-echo'>GET Echo</div>\n
                </div>\n
                <div>\n
                <strong>GET Response:</strong> {{echo.GET.result}}\n
                </div>\n
                <div>{{>Test}}</div>\n
                 <div class='btn btn-success updateDirect'>=100</div>\n

                ",
            ],[
                "name" => "Test",
                "content" => "
                {{options.test}}
                ",
            ]
            ],
        ];
        $app->save();

        $app->add_developer($user1,true);
        $app->add_developer($user2,true);

        $endpoint = new \App\Endpoint;
        $endpoint->name = 'My Endpoint';
        $endpoint->type = 'http_basic_auth';
        $endpoint->config = [
            'username'=>'info','password'=>'info','url'=>'https://mercury.binghamton.edu'
        ];
        $endpoint->site_id = $site->id;
        $endpoint->group_id = $group->id;
        $endpoint->save();

        $app_instance = new \App\AppInstance;
        $app_instance->name = 'My App Instance';
        $app_instance->slug = 'my_app_instance';
        $app_instance->app_id = $app->id;
        $app_instance->group_id = $group->id;
        $app_instance->configuration = ["test"=>"hello_world"];
        $app_instance->resources = [
            ['name'=>'echo','endpoint'=>1,'modifier'=>'none','cache'=>false,'fetch'=>true,'path'=>'/info/echo/'],
            ['name'=>'whoami','endpoint'=>1,'modifier'=>'none','cache'=>false,'fetch'=>true,'path'=>'/info/whoami/'],
        ];
        $app_instance->public = 0;
        $app_instance->save();

    }
}
