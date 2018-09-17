<?php

return [
  'user' => env('AUTH_USER', isset($_SERVER['AUTH_USER'])?$_SERVER['AUTH_USER']:'graphene_proxyserver'),
  'password' => env('AUTH_PASSWORD', isset($_SERVER['AUTH_PASSWORD'])?$_SERVER['AUTH_PASSWORD']:'graphene_proxyserver'),
  'server' => env('API_SERVER', isset($_SERVER['API_SERVER'])?$_SERVER['API_SERVER']:''),
];
