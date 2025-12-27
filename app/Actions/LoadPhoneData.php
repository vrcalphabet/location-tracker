<?php
use App\Services\PhoneData;
use App\Utils\Authenticator;
use App\Utils\Response;
use App\Utils\Validator;

$rules = [
  'token' => 'required|string|min:32|max:1024',
];

$errors = Validator::validate($_GET, $rules);
if ($errors !== true) {
  Response::json(false, ['error' => 'Validation failed', 'details' => $errors]);
}

if (!Authenticator::verify_get($_GET['token'])) {
  Response::json(false, ['error' => 'Invalid token']);
}

$phone_data = (new PhoneData())->load();

if ($phone_data === false) {
  Response::json(false, ['error' => 'Server error']);
}

Response::json(true, ['data' => $phone_data]);
