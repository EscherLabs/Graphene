<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppInstancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('app_instances', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('app_id')->unsigned()->index();
            $table->integer('group_id')->unsigned()->index();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable()->default(null);
            $table->integer('public');
            $table->json('configuration')->nullable();
            $table->json('resources')->nullable();
            $table->timestamps();
            $table->foreign('app_id')->references('id')->on('apps');
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
        Schema::drop('app_instances');
    }
}
