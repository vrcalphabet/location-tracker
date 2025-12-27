<?php
namespace App\Utils;

class Response
{
  public static function code(int $code): void
  {
    http_response_code($code);
    exit();
  }

  public static function json(bool $success, array $value = []): void
  {
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, ...$value], JSON_UNESCAPED_UNICODE);
    exit();
  }
}
