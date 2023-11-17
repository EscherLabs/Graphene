<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('site_id')->unsigned()->index();
            // $table->integer('project_id')->unsigned()->index();
            $table->string('name');
            $table->string('description')->default('');
            $table->integer('user_id')->unsigned()->index()->nullable()->default(null);
            $table->timestamps();
            $table->softDeletes();
            // $table->foreign('project_id')->references('id')->on('projects');
            $table->foreign('site_id')->references('id')->on('sites');
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
        Schema::dropIfExists('reports');
    }
}
