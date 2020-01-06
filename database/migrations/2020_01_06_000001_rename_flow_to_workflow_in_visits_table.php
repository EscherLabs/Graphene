<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameFlowToWorkflowInVisitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("ALTER TABLE visits MODIFY resource_type ENUM('page','app','flow','workflow','link') NOT NULL DEFAULT 'page';");
        DB::statement("UPDATE visits SET resource_type = 'workflow' WHERE resource_type = 'flow';");
        DB::statement("ALTER TABLE visits MODIFY resource_type ENUM('page','app','workflow','link') NOT NULL DEFAULT 'page';");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("ALTER TABLE visits MODIFY resource_type ENUM('page','app','flow','workflow','link') NOT NULL DEFAULT 'page';");
        DB::statement("UPDATE visits SET resource_type = 'flow' WHERE resource_type = 'workflow';");
        DB::statement("ALTER TABLE visits MODIFY resource_type ENUM('page','app','flow','link') NOT NULL DEFAULT 'page';");
    }
}
