<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEndpointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('endpoints', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('site_id')->unsigned()->index();
            $table->integer('group_id')->unsigned()->index();
            $table->string('name');
            $table->string('type');
            $table->json('config')->nullable();
            $table->timestamps();
            $table->foreign('site_id')->references('id')->on('sites');
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
        Schema::drop('endpoints');
    }
}
