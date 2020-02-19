<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CompileTemplates extends Command
{
    protected $config = [
        'src' => "resources/assets/mustache",
        'target' => "public/assets/js/templates",
        'includes' => [
            ['dir'=>'widget','name'=>'widget2.js','obj'=>'templates'],
            ['dir'=>'admin','name'=>'admin2.js','obj'=>'templates'],
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
                $minified = preg_replace_callback ('/(`)(.*?)(`)/s',function($matches) {
                    return "'".str_replace("'","\'",$matches[2])."'";
                }, $raw);
                $minified = preg_replace('!\s+!',' ', $minified);
                $js[$fileinfo['filename']] = $minified;
            }
        }
        // Build Partials Object
        $partials_arr = [];
        foreach($mustache as $filename => $template) {
            $partials_arr[] = '"'.$filename.'":'.$obj_name.'["'.$filename.'"].template';
        }
        // Build Minified File
        $minified_file = '';
        if (count($mustache)>0) {
            $minified_file .= '// Compiled Mustache'."\n";
            $minified_file .= "var ".$obj_name.'_render=function(data={},t=null){return gform.m(this.template,_.extend(data,'.$obj_name.'_partials))}'."\n";
            $minified_file .= "if (!!!".$obj_name.") var ".$obj_name."={}\n";
            foreach($mustache as $filename => $template) {
                $minified_file .= $obj_name.'["'.$filename.'"]={render:'.$obj_name.'_render,template:'.$template."};\n";
            }
            $minified_file .= "var ".$obj_name."_partials={".implode(',',$partials_arr)."}\n";
        }
        if (count($js)>0) {
            $minified_file .= '// Minified JS'."\n";
            foreach($js as $filename => $template) {
                $minified_file .= $template."\n";
            }
        }
        return $minified_file;
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
