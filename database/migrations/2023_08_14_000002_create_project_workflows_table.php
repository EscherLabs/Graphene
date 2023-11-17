<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectWorkflowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_workflows', function (Blueprint $table) {

            $table->id();
            $table->foreignId('project_id')->cascadeOnDelete();            
            $table->foreignId('workflow_id')->cascadeOnDelete();        
            $table->unique(['project_id','workflow_id'],'project_workflow_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('project_workflows');
    }
}
