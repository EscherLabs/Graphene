<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOpenedAtToWorkflowSubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('workflow_submissions', function (Blueprint $table) {
            $table->timestamp('opened_at')->nullable()->default(null);
            $table->index('opened_at');
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
            $table->dropIndex('opened_at');
        });
    }
}
