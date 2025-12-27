<?php
namespace App\Utils;

use Exception;

class File
{
  public static function safeWrite(string $path, string $content): bool
  {
    $tmpFile = tempnam(dirname($path), 'tmp_');

    if ($tmpFile === false) {
      return false;
    }

    try {
      if (file_put_contents($tmpFile, $content) === false) {
        return false;
      }

      if (!rename($tmpFile, $path)) {
        return false;
      }

      return true;
    } catch (Exception $e) {
      if (file_exists($tmpFile)) {
        unlink($tmpFile);
      }

      return false;
    }
  }
}
