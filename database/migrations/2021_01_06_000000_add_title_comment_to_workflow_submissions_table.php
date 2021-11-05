<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTitleCommentToWorkflowSubmissionsTable extends Migration
{

    public function up()
    {
        Schema::table('workflow_submissions', function (Blueprint $table) {
            $table->string('title')->nullable()->default(null)->after('data');;
            $table->text('comment')->nullable()->default(null)->after('data');
        });
        DB::statement("ALTER TABLE workflow_submissions MODIFY `status` ENUM('open','closed','new') NOT NULL DEFAULT 'new';");

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('workflow_submissions', function (Blueprint $table) {
            $table->dropColumn('comment');
            $table->dropColumn('title');
        });
        DB::statement("ALTER TABLE workflow_submissions MODIFY `status` ENUM('open','closed','new') NOT NULL DEFAULT 'new';");

    }
}
