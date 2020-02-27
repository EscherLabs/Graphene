<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use MatthiasMullie\Minify;
use Illuminate\Support\Str;

class CompileJavaScript extends Command
{
    protected $config = [];
    protected $signature = 'compile:javascript';
    protected $description = 'Runs all javascript minification';

    public function __construct() {
        parent::__construct();
        $this->config = config('includes.javascript');
    }

    public function handle() {
        $this->line("<fg=green>Minifiying JavaScript ...</>");
        $this->line("<head> tags");
        $minifier = new Minify\JS();
        foreach($this->config['src']['head'] as $js) {
            $minifier->add(public_path($js['file']));            
        }
        $minifier->minify(public_path($this->config['min']['head']));
        
        $this->line("<body> tags");
        $minifier = new Minify\JS();
        foreach($this->config['src']['body'] as $js) {
            $minifier->add(public_path($js['file']));            
        }
        $minifier->minify(public_path($this->config['min']['body']));
        $minifier->gzip(public_path($this->config['min']['body'].'.gz'));
        $this->line("<fg=green>Complete!</>");

        $this->line("<fg=yellow>Incrementing Cache Bust ID ...</>");
        $this->call('env:set', [
            'name' => 'CACHE_BUST_ID', 'value' => Str::random()
        ]);
    }
}
