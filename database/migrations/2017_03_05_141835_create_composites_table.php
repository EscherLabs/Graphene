<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompositesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('group_composites', function (Blueprint $table) {
            $table->integer('group_id')->unsigned()->index();
            $table->integer('composite_group_id')->unsigned()->index();
            $table->timestamps();
            $table->foreign('group_id')->references('id')->on('groups');
            $table->foreign('composite_group_id')->references('id')->on('groups');
            $table->unique(['group_id','composite_group_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('group_composites');
    }
}
