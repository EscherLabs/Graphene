<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNewEnumToWorkflowSubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("ALTER TABLE workflow_submissions MODIFY `status` ENUM('open','closed','new') NOT NULL DEFAULT 'new';");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("ALTER TABLE workflow_submissions MODIFY `status` ENUM('open','closed') NOT NULL DEFAULT 'open';");
    }
}
