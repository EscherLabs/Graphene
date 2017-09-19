<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppVersionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('app_versions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('app_id')->unsigned()->index();
            $table->string('summary');
            $table->boolean('stable')->default(false);
            $table->json('code')->nullable();
            $table->timestamps();
            $table->foreign('app_id')->references('id')->on('apps')->onDelete('cascade');
        });    
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('app_versions');
    }
}
