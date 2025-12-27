<?php
require_once '../../../app/bootstrap.php';

use App\Utils\Response;
use App\Utils\Validator;
use App\Utils\Authenticator;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  Response::code(405);
}

$rules = [
  'token' => 'required|string|min:32|max:1024',
  'lat' => 'required|numeric|min:-90|max:90',
  'lon' => 'required|numeric|min:-180|max:180',
];

$errors = Validator::validate($_GET, $rules);
if ($errors !== true) {
  Response::json(false, ['error' => 'Validation failed', 'details' => $errors]);
}

if (!Authenticator::verify_get($_GET['token'])) {
  Response::json(false, ['error' => 'Invalid token']);
}

$client = new Client(['base_uri' => 'https://map.yahooapis.jp/']);
$target_url = '/geoapi/V1/reverseGeoCoder';

try {
  $response = $client->request('GET', $target_url, [
    'query' => [
      'appid' => $_ENV['YAHOO_APPID'],
      'lat' => $_GET['lat'],
      'lon' => $_GET['lon'],
      'datum' => 'tky',
      'output' => 'json',
    ],
  ]);

  $body = $response->getBody()->getContents();
  $data = json_decode($body, true);

  $address = $data['Feature'][0]['Property']['Address'];

  if ($data['ResultInfo']['Total'] === 0 || $address === '') {
    Response::json(false, ['error' => 'Invalid location']);
  }

  Response::json(true, ['data' => ['address' => $address]]);
} catch (GuzzleException $e) {
  Response::json(false, ['error' => 'Server error']);
}
