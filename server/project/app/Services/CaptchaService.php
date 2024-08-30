<?php

namespace App\Services;

use App\Exceptions\InvariantException;
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
      throw new InvariantException("missing captcha", 429);
    }

    // token-answer
    $arr = explode('-', $captchaString);
    if (count($arr) !== 2) {
      throw new InvariantException("captcha token mismatch", 429);
    }

    $token = $arr[0];
    $answer = $arr[1];

    $dec = openssl_decrypt($token, 'AES-128-ECB', $this->secret);
    if (!$dec) {
      throw new InvariantException("captcha token mismatch", 429);
    }

    // a.b.expires
    $data = explode('.', $dec);
    if (count($data) !== 3) {
      throw new InvariantException("captcha token mismatch", 429);
    }

    if (time() > $data[2]) {
      throw new InvariantException("captcha expired", 429);
    }

    if ($answer != $data[0] + $data[1]) {
      throw new InvariantException("wrong captcha answer", 429);
    }
  }

  public function retrieveCaptcha(Request $request)
  {
    return $request->get($this->fieldName, $request->header($this->headerName));
  }
}
