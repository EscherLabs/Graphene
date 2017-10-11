<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pages', function (Blueprint $table) {
			$table->increments('id');
            $table->integer('group_id')->unsigned()->index();
            $table->string('name');
            $table->string('slug');
            $table->string('icon')->nullable()->default(null);
			$table->json('content')->nullable();
            $table->integer('order')->unsigned()->default(2147483647);
            $table->tinyInteger('device')->unsigned()->nullable();
			$table->json('mobile_order')->nullable();
            $table->boolean('unlisted')->default(false);
			$table->boolean('public')->default(false);
			$table->timestamps();
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
        Schema::dropIfExists('pages');
    }
}
