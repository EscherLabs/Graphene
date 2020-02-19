<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Compile extends Command
{
    protected $admin_file_name = 'admin2.js';
    protected $admin_obj_name = 'admin_templates';
    protected $workflow_file_name = 'workflow2.js';
    protected $workflow_obj_name = 'workflow_report';

    protected $signature = 'compile';
    protected $description = 'Runs all javascript minification and any other compiliation commands';

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


        $this->line("<fg=green>Building...</>");
        $src_path = base_path("resources/assets/mustache");
        $target_path = base_path("public/assets/js/templates");
        $adminjs = $this->build_string($src_path.'/admin',$this->admin_obj_name);
        $workflowjs = $this->build_string($src_path.'/workflow',$this->workflow_obj_name);
        $this->line("Writing: ".$target_path.'/'.$this->admin_file_name);
        file_put_contents($target_path.'/'.$this->admin_file_name,$adminjs);
        $this->line("Writing: ".$target_path.'/'.$this->workflow_file_name);
        file_put_contents($target_path.'/'.$this->workflow_file_name,$workflowjs);
        $this->line("<fg=green>Complete!</>");
    }
}
