<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\ProductController;

//CEP
Route::group(['prefix' => 'webservice'], function() {
    Route::post('cep', [App\Http\Controllers\webservice\WebserviceController::class, 'cep']);
});

Route::post('login', [ApiController::class, 'authenticate']);
//GITHUB
Route::post('login/github/url', [ApiController::class, 'githubUrl']);
Route::post('login/github', [ApiController::class, 'githubLogin']);

//Register
Route::post('register', [ApiController::class, 'register']);

Route::group(['middleware' => ['jwt.verify']], function() {
    Route::get('logout', [ApiController::class, 'logout']);
    Route::get('get_user', [ApiController::class, 'get_user']);
    Route::put('edit_user', [ApiController::class, 'edit_user']);
    Route::delete('delete_user', [ApiController::class, 'delete_user']);
});

