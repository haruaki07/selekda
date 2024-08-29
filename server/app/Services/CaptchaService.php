<?php

namespace App\Services;

use Illuminate\Http\Request;

class CaptchaService
{
  public function __construct(
    protected $secret = null,
    protected $expirationTime = 300,
    protected $headerName = "x_captcha",
    protected $fieldName = "_captcha"
  ) {
    $this->$secret = $secret ?? env('CAPTCHA_SECRET', env('APP_KEY'));
  }

  public function generate()
  {
    $a = random_int(0, 20);
    $b = random_int(0, 20);

    $data = "$a.$b." . time() + $this->expirationTime;
    $token = openssl_encrypt($data, 'AES-128-ECB', $this->secret);

    return [
      "token" => $token,
      "challenge" => "$a + $b"
    ];
  }

  public function verify($captchaString)
  {
    if (!$captchaString) {
      abort(429, "missing captcha");
    }

    // token-answer
    $arr = explode('-', $captchaString);
    if (count($arr) !== 2) {
      abort(429, "captcha token mismatch");
    }

    $token = $arr[0];
    $answer = $arr[1];

    $dec = openssl_decrypt($token, 'AES-128-ECB', $this->secret);
    if (!$dec) {
      abort(429, "captcha token mismatch");
    }

    // a.b.expires
    $data = explode('.', $dec);
    if (count($data) !== 3) {
      abort(429, "captcha token mismatch");
    }

    if (time() > $data[2]) {
      abort(429, "captcha expired");
    }

    if ($answer != $data[0] + $data[1]) {
      abort(429, "wrong captcha answer");
    }
  }

  public function retrieveCaptcha(Request $request)
  {
    return $request->get($this->fieldName, $request->header($this->headerName));
  }
}
