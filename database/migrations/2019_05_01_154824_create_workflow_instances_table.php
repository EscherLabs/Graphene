<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkflowInstancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workflow_instances', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('workflow_id')->unsigned()->index();
            $table->integer('group_id')->unsigned()->index();
            $table->integer('workflow_version_id')->unsigned()->nullable()->default(null);
            $table->string('name');
            $table->string('slug');
            $table->string('icon')->nullable()->default(null);
            $table->integer('order')->unsigned()->default(2147483647);
            $table->tinyInteger('device')->unsigned()->nullable();
            $table->boolean('unlisted')->default(false);
            $table->boolean('public')->default(false);
            $table->json('groups')->nullable();
            $table->json('configuration')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('workflow_id')->references('id')->on('workflows');
            $table->foreign('group_id')->references('id')->on('groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('workflow_instances');
    }
}
