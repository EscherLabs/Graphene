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
        // $payload = $this->getDefaultPayload($data);

        // if (! $this->exists) {
        //     $this->read($sessionId);
        // }

        // if ($this->exists) {
        //     $this->performUpdate($sessionId, $payload);
        // } else {
        //     $this->performInsert($sessionId, $payload);
        // }

        return $this->exists = true;
    }
}
