<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexesToWorkflowSubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('workflow_submissions', function (Blueprint $table) {
            $table->index('created_at');
            $table->index('updated_at');
            $table->index('assignment_type');
            $table->index('state');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('workflow_submissions', function (Blueprint $table) {
            $table->dropIndex('created_at');
            $table->dropIndex('updated_at');
            $table->dropIndex('assignment_type');
            $table->dropIndex('state');
            $table->dropIndex('status');
        });
    }
}
