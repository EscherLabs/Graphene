<?php

namespace App\Libraries;

use Illuminate\Cache\Lock;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Contracts\Cache\Lock as LockContract;

class MySQLLock extends Lock implements LockContract
{
    /**
     * The Redis factory implementation.
     *
     * @var \Illuminate\Redis\Connections\Connection
     */
    protected $mysql;

    /**
     * Create a new lock instance.
     *
     * @param  \Illuminate\Redis\Connections\Connection  $mysql
     * @param  string  $name
     * @param  int  $seconds
     * @return void
     */
    public function __construct($mysql, $name, $seconds)
    {
        parent::__construct($name, $seconds);
        $this->mysql = $mysql;
    }

    /**
     * Attempt to acquire the lock.
     *
     * @return bool
     */
    public function acquire($seconds=0)
    {
        if ($this->seconds > 0) {
            throw new \Exception('MySQLCache Does Not Support Timed Locks!');
        }
        $resp = $this->mysql->select('select GET_LOCK("'.$this->name.'", '.$seconds.') as success;');
        if (is_array($resp) && count($resp) >= 0 && isset($resp[0]->success) && $resp[0]->success == 1) {
            return true;
        }
        return false;
    }
    
    public function blockFor($seconds,$callback=null)
    {
        if ($this->acquire($seconds)) {
            if (!is_null($callback)) {
                $callback();
            }
            return true;
        } else {
            throw new LockTimeoutException("Unable to attain lock in ".$seconds." seconds");
        }
    }

    public function block($callback = null, $whatever = null)
    {
        return $this->blockFor(-1,$callback); // Callback is actually first argument
    }

    /**
     * Release the lock.
     *
     * @return void
     */
    public function release()
    {
        $resp = $this->mysql->select('select RELEASE_LOCK("'.$this->name.'") as success;');
    }
}
