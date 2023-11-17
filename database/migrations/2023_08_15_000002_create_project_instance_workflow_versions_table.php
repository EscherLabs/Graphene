<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectInstanceWorkflowVersionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_instance_workflow_versions', function (Blueprint $table) {

            $table->id();
            $table->foreignId('project_instance_id')->cascadeOnDelete();            
            $table->foreignId('workflow_version_id')->cascadeOnDelete();        
            $table->unique(['project_instance_id','workflow_version_id'],'instance_version_unique');
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
