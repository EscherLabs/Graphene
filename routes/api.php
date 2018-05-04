<?php

use Illuminate\Http\Request;

/* Note: All Routes in this file are automatically prepended with /api */

Route::get('/hello_world', function () {
    return "hello world";
})->middleware('http.basic.auth');