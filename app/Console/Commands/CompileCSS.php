<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use MatthiasMullie\Minify;
use Illuminate\Support\Str;

class CompileCSS extends Command
{
    protected $config = [];
    protected $signature = 'compile:css';
    protected $description = 'Runs all CSS minification';

    public function __construct() {
        parent::__construct();
        $this->config = config('includes.css');
    }

    public function handle() {
        $this->line("<fg=green>Minifiying CSS ...</>");
        $this->line("<head> tags");
        $minifier = new Minify\CSS();
        foreach($this->config['src']['head'] as $css) {
            $minifier->add(public_path($css['file']));            
        }
        $minifier->minify(public_path($this->config['min']['head']));
        
        $this->line("<body> tags");
        $minifier = new Minify\CSS();
        foreach($this->config['src']['body'] as $css) {
            $minifier->add(public_path($css['file']));            
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
