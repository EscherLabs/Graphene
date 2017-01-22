<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserPreferencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->integer('user_id')->unsigned()->index();
            $table->integer('app_instance_id')->unsigned()->index();
            $table->json('preferences')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');;
            $table->foreign('app_instance_id')->references('id')->on('app_instances')->onDelete('cascade');;
            $table->unique(['user_id','app_instance_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('user_preferences');
    }
}
