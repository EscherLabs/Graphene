<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkflowVersionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workflow_versions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('workflow_id')->unsigned()->index();
            $table->string('summary')->default('');
            $table->string('description')->default('');
            $table->boolean('stable')->default(false);
            $table->json('code')->nullable();
            $table->integer('user_id')->unsigned()->index()->nullable()->default(null);
            $table->timestamps();
            $table->foreign('workflow_id')->references('id')->on('workflows')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('workflow_versions');
    }
}
