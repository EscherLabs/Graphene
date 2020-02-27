<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use MatthiasMullie\Minify;

class EnvSet extends Command
{
    protected $signature = 'env:set {name} {value}';
    protected $description = 'Modifies the .env file';

    public function __construct() {
        parent::__construct();
    }

    public function handle() {
        $envKey = $this->argument('name');
        $envValue = $this->argument('value');
        $envFile = base_path('.env');
        $str = @file_get_contents($envFile);
        if ($str === false) { $str = ''; }
        $str .= "\r\n";
        $keyPosition = strpos($str, "$envKey=");
        $endOfLinePosition = strpos($str, "\n", $keyPosition);
        $oldLine = substr($str, $keyPosition, $endOfLinePosition - $keyPosition);
        if (is_bool($keyPosition) && $keyPosition === false) {
            $this->line("<fg=green>".$envKey." Does Not Exist.  Adding ".$envKey." to .env file...</>");
            $this->line($envKey."=".$envValue);
            $str .= "$envKey=$envValue";
            $str .= "\r\n";
        } else {
            $this->line("<fg=green>Updating Value for ".$envKey." in .env file...</>");
            $this->line($envKey."=".$envValue);
            $str = str_replace($oldLine, "$envKey=$envValue", $str);
        }            
        $str = substr($str, 0, -1);
        if (!file_put_contents($envFile, $str)) {
            return false;
        }
        app()->loadEnvironmentFrom($envFile);  
        $this->line("<fg=green>Complete!</>");  
        return true;
    }
}
