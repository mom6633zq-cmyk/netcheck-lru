<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

$raw = file_get_contents('php://input');
respond(['receivedBytes' => strlen($raw)]);
