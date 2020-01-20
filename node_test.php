<?php

include_once('app/Libraries/JSExecHelper.php');

use App\Libraries\JSExecHelper;

$jsexec = new JSExecHelper();
$logic_result = $jsexec->run('console.log(data.a);return data.a;',["a"=>["my"=>"pizza"]]);
echo json_encode($logic_result);