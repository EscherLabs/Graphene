<?php

namespace App\Extensions;
use App\Session;
use Illuminate\Session\DatabaseSessionHandler;

class NoSaveDatabaseSessionHandler extends DatabaseSessionHandler
{
    /**
     * {@inheritdoc}
     */
    public function write($sessionId, $data)
    {
        return $this->exists = true;
    }
}
