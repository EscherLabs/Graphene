<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use MatthiasMullie\Minify;
use Illuminate\Support\Str;

class Compile extends Command
{
    protected $config = [];
    protected $signature = 'compile';
    protected $description = 'Compile Everything';

    public function __construct() {
        parent::__construct();
    }

    public function handle() {
        $this->call('compile:templates');
        $this->line("");
        $this->call('compile:javascript');
        $this->line("");
        $this->call('compile:css');
    }
}
