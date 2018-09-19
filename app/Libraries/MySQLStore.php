<?php

namespace App\Libraries;

use Closure;
use Exception;
use \Illuminate\Contracts\Cache\Store;
use \Illuminate\Support\InteractsWithTime;
use \Illuminate\Database\ConnectionInterface;
use \Illuminate\Cache\DatabaseStore;

class MySQLStore extends DatabaseStore
{
    public function lock($name, $seconds = 0)
    {
        return new MySQLLock($this->connection(), $this->prefix.$name, $seconds);
    }

    public function connection()
    {
        return $this->connection;
    }

}
