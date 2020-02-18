<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Compile extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'compile';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Runs all javascript minification and any other compiliation commands';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        echo "Building...\n";
        $path = "resources/assets/mustache/admin";
        $mustache = [];
        $js = [];
        $mustache_files = scandir($path);
        foreach($mustache_files as $index => $filename) {
            if ($filename[0]==='.') {
                unset($mustache_files[$index]);
                continue;
            }
            $fileinfo = pathinfo($path."/".$filename);
            if ($fileinfo['extension'] === 'mustache') {
                $raw = file_get_contents($path."/".$filename);
                $minified = str_replace("'","\'",preg_replace('!\s+!',' ', $raw));
                $mustache[$fileinfo['filename']] = "'".$minified."'";
            } else if ($fileinfo['extension'] === 'js') {
                $raw = file_get_contents($path."/".$filename);
                $minified = preg_replace('!\s+!',' ', $raw);
                $js[$fileinfo['filename']] = $minified;
            }
        }

        $minified_file = "var admin_templates = {}\n";
        foreach($mustache as $filename => $template) {
            $minified_file .= 'admin_templates["'.$filename.'"] = '.$template.";\n\n";
        }
        foreach($js as $filename => $template) {
            $minified_file .= $template."\n\n";
        }
        echo $minified_file;
    }
}
