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
            $table->string('slug')->unique();
			$table->json('content')->nullable();
			$table->json('mobile_order')->nullable();
            $table->boolean('unlist')->default(false);
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
