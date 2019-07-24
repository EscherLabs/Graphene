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
            $table->integer('workflow_instance_id')->unsigned()->index();
            $table->integer('workflow_submission_id')->unsigned()->index();
            $table->integer('user_id')->unsigned()->index()->nullable()->default(null);
            $table->string('start_state')->nullable()->default(null);
            $table->string('action')->nullable()->default(null);
            $table->string('end_state')->nullable()->default(null);
            $table->json('data')->nullable();
            $table->enum('status',['open', 'closed'])->default('open');
            $table->timestamps();
            $table->foreign('workflow_instance_id')->references('id')->on('workflow_instances');
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
