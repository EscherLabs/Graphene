<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddInternalToAssignmentType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("ALTER TABLE workflow_submissions MODIFY assignment_type ENUM('user','group','internal') DEFAULT NULL;");
        DB::statement("ALTER TABLE workflow_activity_log MODIFY assignment_type ENUM('user','group','internal') DEFAULT NULL;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("ALTER TABLE workflow_submissions MODIFY assignment_type ENUM('user','group') DEFAULT NULL;");
        DB::statement("ALTER TABLE workflow_activity_log MODIFY assignment_type ENUM('user','group') DEFAULT NULL;");
    }
}
