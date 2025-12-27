<?php

use App\Services\PhoneData;
use App\Utils\Authenticator;
use App\Utils\Response;
use App\Utils\Validator;

$rules = [
  'token' => 'required|string|min:32|max:1024',
  'timestamp' => 'required|integer|min:1000000000|max:9999999999',
  'silent_mode' => 'required|boolean',
  'battery' => 'required|integer|min:0|max:100',
  'battery_saver_mode' => 'required|boolean',
  'location.lat' => 'required|numeric|min:-90|max:90',
  'location.lon' => 'required|numeric|min:-180|max:180',
  'location.uncertainty' => 'required|numeric|min:0|max:99999',
];

$errors = Validator::validate($_POST, $rules);
if ($errors !== true) {
  Response::json(false, ['error' => 'Validation failed', 'details' => $errors]);
}

if (!Authenticator::verify_post($_POST['token'])) {
  Response::json(false, ['error' => 'Invalid token']);
}

$phone_data = [
  'timestamp' => (int) $_POST['timestamp'],
  'silent_mode' => (bool) (int) $_POST['silent_mode'],
  'battery' => (int) $_POST['battery'],
  'battery_saver_mode' => (bool) (int) $_POST['battery_saver_mode'],
  'location' => [
    'lat' => (float) $_POST['location']['lat'],
    'lon' => (float) $_POST['location']['lon'],
    'uncertainty' => (float) $_POST['location']['uncertainty'],
  ],
];

$result = (new PhoneData())->save($phone_data);

if ($result === false) {
  Response::json(false, ['error' => 'Server error']);
}

Response::json($result);
