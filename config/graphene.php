<?php

return [
    'environments' => [
        'dev' => ['debug'=>true, 'compile'=>false,'version'=>null,'list'=>false],
        'test' => ['debug'=>true, 'compile'=>true,'version'=>0,'list'=>false],
        'stage' => ['compile'=>true,'list'=>false],
        'prod' => ['compile'=>true]
    ],
];
