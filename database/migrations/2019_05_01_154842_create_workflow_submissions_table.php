<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkflowSubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workflow_submissions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('workflow_id')->unsigned()->index();
            $table->integer('workflow_version_id')->unsigned()->index();
            $table->integer('workflow_instance_id')->unsigned()->index();
            $table->json('workflow_instance_configuration')->nullable();
            $table->integer('user_id')->unsigned()->index()->nullable()->default(null);
            $table->enum('assignment_type',['user', 'group'])->nullable()->default(null);
            $table->integer('assignment_id')->unsigned()->index()->nullable()->default(null);
            $table->string('state')->nullable()->default(null);
            $table->json('data')->nullable();
            $table->enum('status',['open', 'closed'])->default('open');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('workflow_id')->references('id')->on('workflows');
            $table->foreign('workflow_version_id')->references('id')->on('workflow_versions');
            $table->foreign('workflow_instance_id')->references('id')->on('workflow_instances');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('workflow_submissions');
    }
}
