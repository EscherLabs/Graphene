<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppDevelopersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('app_developers', function (Blueprint $table) {
            $table->integer('user_id')->unsigned()->index();
            $table->integer('app_id')->unsigned()->index();
            $table->string('status')->default(0);
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');;
            $table->foreign('app_id')->references('id')->on('apps')->onDelete('cascade');;
            $table->unique(['user_id','app_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('app_developers');
    }
}
