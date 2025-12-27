<?php
namespace App\Services;

use App\Utils\File;

class PhoneData
{
  private string $dataPath;

  public function __construct()
  {
    $this->dataPath = __ROOT__ . '/data/phone_data';
  }

  public function save(array $data): bool
  {
    $string_data = json_encode($data);
    if ($string_data === false) {
      return false;
    }

    $result = File::safeWrite($this->dataPath, $string_data);
    return $result !== false;
  }

  public function load(): array|false
  {
    if (!file_exists($this->dataPath)) {
      return false;
    }

    $json_data = file_get_contents($this->dataPath);
    if ($json_data === false) {
      return false;
    }

    $string_data = json_decode($json_data, true);
    if ($string_data === null) {
      return false;
    }

    return $string_data;
  }
}
