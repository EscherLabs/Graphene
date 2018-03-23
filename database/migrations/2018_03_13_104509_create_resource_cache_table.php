<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateResourceCacheTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resource_cache', function (Blueprint $table) {
            $table->integer('app_instance_id')->unsigned()->index();
            $table->string('url');
            $table->mediumText('content');
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['app_instance_id','url']);
            $table->index('url');
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
        Schema::dropIfExists('resource_cache');
    }
}
