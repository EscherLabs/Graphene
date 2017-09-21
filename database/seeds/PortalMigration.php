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
        $microapps = DB::connection('mysql-portal')->table('microapps')->get();
        dd($microapps);
    }
}
