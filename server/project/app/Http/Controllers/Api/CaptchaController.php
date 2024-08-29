<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CaptchaService;
use Illuminate\Http\Request;

class CaptchaController extends Controller
{
    public function __construct(protected CaptchaService $captchaService) {}

    public function generate(Request $req)
    {
        $captcha = $this->captchaService->generate();

        $data = $captcha;

        return response()->json(compact('data'));
    }

    public function verify(Request $request)
    {
        $captchaString = $this->captchaService->retrieveCaptcha($request);
        $this->captchaService->verify($captchaString);

        return response()->json(["message" => "success"]);
    }
}
