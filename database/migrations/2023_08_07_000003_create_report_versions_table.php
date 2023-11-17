<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReportVersionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('report_versions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('report_id')->unsigned()->index();
            $table->boolean('published')->default(false);
            $table->json('config')->nullable();

            $table->string('summary')->default('');
            $table->string('description')->default('');
            $table->integer('user_id')->unsigned()->index()->nullable()->default(null);
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('report_id')->references('id')->on('reports')->onDelete('cascade');
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
        Schema::dropIfExists('report_versions');
    }
}
