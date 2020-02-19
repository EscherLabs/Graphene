<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CompileTemplates extends Command
{
    protected $config = [
        'src' => "resources/assets/mustache",
        'target' => "public/assets/js/templates",
        'includes' => [
            ['dir'=>'widget','name'=>'widget.js','obj'=>'widget_templates'],
            ['dir'=>'admin','name'=>'admin2.js','obj'=>'admin_templates'],
            ['dir'=>'workflow','name'=>'workflow2.js','obj'=>'workflow_report'],
        ]
    ];
    protected $signature = 'compile:templates';
    protected $description = 'Runs all javascript minification of templates';

    public function __construct()
    {
        parent::__construct();
    }

    private function build_string($path,$obj_name) {
        $mustache = $js = [];
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
                $minified = preg_replace_callback ('/(`)(.*)(`)/s',function($matches) {
                    return "'".str_replace("'","\'",$matches[2])."'";
                }, $raw);
                $minified = preg_replace('!\s+!',' ', $minified);
                $js[$fileinfo['filename']] = $minified;
            }
        }
        $minified_file = "var ".$obj_name." = {}\n";
        $gform_stencils = "// Map to gform stencils\n";
        foreach($mustache as $filename => $template) {
            $minified_file .= $obj_name.'["'.$filename.'"] = '.$template.";\n";
            $gform_stencils .= 'gform.stencils["'.$filename.'"] = '.$obj_name.'["'.$filename.'"];'."\n";
        }
        foreach($js as $filename => $template) {
            $minified_file .= $template."\n";
        }
        return $minified_file."\n".$gform_stencils;
    }

    public function handle()
    {
        $src_path = base_path($this->config['src']);
        $target_path = base_path($this->config['target']);
        $this->line("<fg=green>Compiling Templates ...</>");
        foreach($this->config['includes'] as $include) {
            $output_js = $this->build_string($src_path.'/'.$include['dir'],$include['obj']);
            $this->line("Writing: ".$target_path.'/'.$include['name']);
            file_put_contents($target_path.'/'.$include['name'],$output_js);
        }
        $this->line("<fg=green>Complete!</>");
    }
}
