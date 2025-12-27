<?php
define('__ROOT__', realpath(__DIR__ . '/../'));
require_once __ROOT__ . '/vendor/autoload.php';

// ini_set('display_errors', 1);
// error_reporting(E_ALL);

$dotenv = Dotenv\Dotenv::createImmutable(__ROOT__);
$dotenv->load();
