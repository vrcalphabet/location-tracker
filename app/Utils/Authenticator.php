<?php
namespace App\Utils;

class Authenticator
{
  public static function verify_get(string $token): bool
  {
    $verified = hash('sha256', $token) === $_ENV['GET_TOKEN'];
    return $verified;
  }

  public static function verify_post(string $token): bool
  {
    $verified = hash('sha256', $token) === $_ENV['POST_TOKEN'];
    return $verified;
  }
}
