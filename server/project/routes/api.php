<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\CaptchaController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('json-response')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');

    Route::as('auth.')->group(function () {
        Route::post('/register', [AuthController::class, 'register'])->middleware('captcha')->name('register');
        Route::post('/login', [AuthController::class, 'login'])->middleware('captcha')->name('login');
        Route::get('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');
    });

    Route::as('captcha.')->group(function () {
        Route::get('/captcha', [CaptchaController::class, 'generate'])->name('generate');
        Route::post('/captcha', [CaptchaController::class, 'verify'])->name('verify');
    });

    Route::resource('banners', BannerController::class)
        ->only(["index", "show", "store", "update", "destroy"])
        ->middleware(['auth:sanctum', 'role:admin']);

    Route::resource('blogs', BlogController::class)
        ->only(["index", "show", "store", "update", "destroy"])
        ->middleware(['auth:sanctum', 'role:admin']);

    Route::resource('portfolios', PortfolioController::class)
        ->only(["index", "show", "store", "update", "destroy"])
        ->middleware(['auth:sanctum', 'role:admin']);

    Route::resource('users', UserController::class)
        ->only(["index", "show", "store", "update", "destroy"])
        ->middleware(['auth:sanctum', 'role:admin']);
});
