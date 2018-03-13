<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVisitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->increments('id');			
			$table->integer('user_id')->unsigned();
            $table->string('path', 250)->default('');
            $table->string('resource_type',20)->default('page');
            $table->integer('resource_id')->nullable()->default(null);
			$table->string('referrer', 250)->default('');
            $table->integer('width')->unsigned('');
            $table->timestamp('created_at')->useCurrent();
            $table->index('created_at');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('visits');
    }
}
