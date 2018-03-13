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
            $table->enum('resource_type',['page', 'app_instance'])->default('page');
            $table->integer('resource_id')->nullable()->default(null);
            $table->integer('width')->unsigned('');
            $table->timestamp('created_at')->useCurrent();
            $table->index('user_id');
            $table->index('resource_type');
            $table->index('resource_id');
            $table->index('created_at');
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
