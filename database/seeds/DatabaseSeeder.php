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
        $site->domain = 'graphenedev.local';
        $site->name = 'LocalDev';
        $site->theme = ['css' => '','icon'=>'file'];
        $site->templates = ['main'=>(object)[],'partials'=>(object)[
            'footer'=>'Custom Footer: Developed by Escher Labs, Inc'
        ]];
        $site->auth = 'CAS';
        $site->auth_config = [
            'cas_hostname'        => 'securetest.binghamton.edu',
            'cas_real_hosts'      => 'securetest.binghamton.edu',
            'cas_port'            => 443,
            'cas_uri'             => '/cas',
            'cas_login_url'       => '',
            'cas_logout_url'      => '',
            'cas_enable_saml'     => true,
            'cas_data_map'        => [
                "default"=> [
                    "email"=> "{{mail}}", 
                    "last_name"=> "{{lastname}}", 
                    "unique_id"=> "{{UDC_IDENTIFIER}}", 
                    "first_name"=> "{{firstname}}",
                ],
                "additional"=> [
                    "bnum"=> "{{UDC_IDENTIFIER}}",
                    "pidm"=> "{{pidm}}", 
                    "pods"=> "{{cn}}"
                ]
            ],
            "external_user_lookup" => [
                "url" => "https://www.escherlabs.com/pidm.php", 
                "verb" => "GET", 
                "enabled" => true
            ]
        ];

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
        $user1->password = '$2y$10$/7lJmdRUSwPT5O4FWZk6X.yUPs08KG78DeRh7g9PCzDefD71.JLCS';
        $user1->unique_id = 'B00505893';
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
        $user2->unique_id = 'B00573562';
        $user2->site_admin = 1;
        $user2->developer = 1;
        $user2->save();
        $group->add_member($user2);
        $group->add_admin($user2);
        $site->add_member($user2,1,1);

        $app = new \App\App;
        $app->name = 'My App';
        $app->site_id = $site->id;
        $app->save();

        $app_version = new \App\AppVersion;
        $app_version->app_id = $app->id;
        $app_version->summary = 'Initial Version';
        $app_version->stable = true;
        $app_version->code = [
            "css" => "",
            "forms"=>[
                ["name"=>"Options","content"=>"{\"fields\":[{\"label\": \"admin_option\"}]}"],
                ["name"=>"User Options","content"=>"{\"fields\":[{\"label\": \"user_option\"}]}"]
            ],
            "scripts" => [
            [
                "name" => "main",
                "content" => "
                this.data.counter = 1;
                this.data.echo = {};
                this.callback = function() {
                    this.app.on('hello',function(){
                        console.log('stuff');
                    })
                    this.app.click('.btn-info', function() {
                        this.app.refresh();
                    })
                    this.app.click('.btn-danger', function() {
                        this.data.counter++;
                        this.app.update();
                    })
                    this.app.click('.btn-warning',function() {
                        this.app.get('whoami',{},function(response){
                            this.data.whoami = response;
                            this.app.update();
                        })
                    })
                    this.app.click('.post-echo',function() {
                        this.app.post('echo',{'result':this.".'$'."el.find('#post-echo-input').val()},function(response){
                            this.data.echo.POST = response.POST;
                            this.app.update();
                        })
                    })
                    this.app.click('.get-echo',function() {
                        this.app.get('echo',{'result':this.".'$'."el.find('#get-echo-input').val()},function(response){
                            this.app.update({echo:{GET:response.GET}});
                        })
                    })
                    this.app.click('.updateDirect', function(){
                        this.data.counter = 100;//.set({counter:100});
                        this.app.redraw();
                        
                    })
                }
                ",
            ],
            ],
            "resources" => [
                ['name'=>'echo','modifier'=>'none','cache'=>false,'fetch'=>true,'path'=>'/info/echo/'],
                ['name'=>'whoami','modifier'=>'none','cache'=>false,'fetch'=>true,'path'=>'/info/whoami/']
            ],
            "templates" => [
            [
                "name" => "main",
                "content" => "
                <div>Admin Option: {{options.admin_option}}</div>
                <div>User Option: {{user.options.user_option}}</div>
                <div class='btn btn-info'>Refresh Button!</div>
                <div>{{options.mytext}}</div>
                <div class='btn btn-danger'>Redraw Increment Counter</div>
                <div><strong>Counter:</strong> {{counter}}</div>
                <div class='btn btn-warning'>Who Am I?</div>
                <div><strong>Who Am I?</strong> {{whoami.user}}</div>
                <div>
                    <input id='post-echo-input' type='text' />
                    <div class='btn btn-success post-echo'>POST Echo</div>
                </div>
                <div>
                    <strong>POST Response:</strong> {{echo.POST.result}}
                </div>
                <div>
                    <input id='get-echo-input' type='text' />
                    <div class='btn btn-success get-echo'>GET Echo</div>
                </div>
                <div>
                <strong>GET Response:</strong> {{echo.GET.result}}
                </div>
                <div>{{>Test}}</div>
                 <div class='btn btn-success updateDirect'>=100</div>

                ",
            ],[
                "name" => "Test",
                "content" => "
                {{options.test}}
                ",
            ]
            ],
        ];
        $app_version->save();

        // Save code in app, even though this should be in the version
        // Will be deprecated in next version
        // $app->code = $app_version->code;
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
        $app_instance->app_version_id = $app_version->id;
        $app_instance->name = 'My App Instance';
        $app_instance->slug = 'my_app_instance';
        $app_instance->app_id = $app->id;
        $app_instance->group_id = $group->id;
        $app_instance->options = ["admin_option"=>"this is ny admin default option"];
        $app_instance->user_options_default = ["user_option"=>"this is my user default option"];        
        $app_instance->resources = [
            ['name'=>'echo','endpoint'=>1],
            ['name'=>'whoami','endpoint'=>1],
        ];
        $app_instance->public = 0;
        $app_instance->save();

    }
}
