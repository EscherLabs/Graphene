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
        $site->domain = 'www.example.com';
        $site->save();

        $group = new \App\Group;
        $group->site_id = $site->id;
        $group->name = 'My Group';
        $group->slug = 'my_group';
        $group->save();

        $user1 = new \App\User;
        $user1->site_id = $site->id;
        $user1->name = 'Tim Cortesi';
        $user1->email = 'tcortesi@gmail.com';
        $user1->save();
        $group->add_member($user1);
        $group->add_admin($user1);

        $user2 = new \App\User;
        $user2->site_id = $site->id;
        $user2->name = 'Adam Smallcomb';
        $user2->email = 'atsmallcomb@gmail.com';
        $user2->save();
        $group->add_member($user2);
        $group->add_admin($user2);

        $app = new \App\App;
        $app->name = 'My App';
        $app->site_id = $site->id;
        $app->save();

        $endpoint = new \App\Endpoint;
        $endpoint->name = 'My Endpoint';
        $endpoint->type = 'http_basic_auth';
        $endpoint->credentials = json_encode([
            'username'=>'info','password'=>'info','url'=>'https://mercury.binghamton.edu/info/echo/'
        ]);
        $endpoint->site_id = $site->id;
        $endpoint->group_id = $group->id;
        $endpoint->save();

        $app_instance = new \App\AppInstance;
        $app_instance->name = 'My App Instance';
        $app_instance->slug = 'my_app_instance';
        $app_instance->app_id = $app->id;
        $app_instance->group_id = $group->id;
        $app_instance->configuration = '{"test":"hello_world"}';
        $app_instance->resources = '[{"name": "myroute","endpoint": "1","modifier": "none","cache": false,"fetch": true,"path": "?data={{configuration.test}}&myrequest={{request.abc}}"}]';
        $app_instance->public = 0;
        $app_instance->save();

    }
}
