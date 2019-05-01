<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkflowActivityLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workflow_activity_log', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('workflow_id')->unsigned()->index();
            $table->integer('workflow_submission_id')->unsigned()->index();
            $table->integer('user_id')->unsigned()->index()->nullable()->default(null);
            $table->json('start_state')->nullable();
            $table->json('action')->nullable();
            $table->json('end_state')->nullable();
            $table->timestamps();
            $table->foreign('workflow_id')->references('id')->on('workflows');
            $table->foreign('workflow_submission_id')->references('id')->on('workflow_submissions');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('workflow_activity_log');
    }
}
