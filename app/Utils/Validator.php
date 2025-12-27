<?php
namespace App\Utils;

use Illuminate\Container\Container;
use Illuminate\Translation\ArrayLoader;
use Illuminate\Translation\Translator;
use Illuminate\Validation\Factory;

class Validator
{
  public static function validate(array $request, array $rules): array|true
  {
    $translator = new Translator(new ArrayLoader(), 'ja');
    $validationFactory = new Factory($translator, new Container());

    $validator = $validationFactory->make($request, $rules);

    if ($validator->fails()) {
      return $validator->errors()->toArray();
    }

    return true;
  }
}
