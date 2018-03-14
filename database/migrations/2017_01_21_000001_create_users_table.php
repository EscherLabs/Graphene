<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('unique_id')->nullable()->unique()->default(null);
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable()->unique()->default(null);
            $table->string('password')->nullable();
            $table->json('params')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->index('unique_id');
            $table->index('first_name');
            $table->index('last_name');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
    }
}
