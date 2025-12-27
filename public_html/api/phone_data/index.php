<?php
require_once '../../../app/bootstrap.php';

use App\Utils\Response;

switch ($_SERVER['REQUEST_METHOD']) {
  case 'GET':
    require_once __ROOT__ . '/app/Actions/LoadPhoneData.php';
  case 'POST':
    require_once __ROOT__ . '/app/Actions/SavePhoneData.php';
  default:
    Response::code(405);
}
