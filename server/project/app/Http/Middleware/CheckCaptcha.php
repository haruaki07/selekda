<?php

namespace App\Http\Middleware;

use App\Services\CaptchaService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCaptcha
{
    public function __construct(protected CaptchaService $captchaService) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $captchaString = $this->captchaService->retrieveCaptcha($request);
        $this->captchaService->verify($captchaString);

        return $next($request);
    }
}
