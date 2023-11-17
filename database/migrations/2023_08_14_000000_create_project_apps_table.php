<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectAppsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_apps', function (Blueprint $table) {

            $table->id();
            $table->foreignId('project_id')->cascadeOnDelete();            
            $table->foreignId('app_id')->cascadeOnDelete();        
            $table->unique(['project_id','app_id'],'project_app_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('project_apps');
    }
}
