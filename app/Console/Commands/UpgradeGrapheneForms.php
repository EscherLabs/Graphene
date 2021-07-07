<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpgradeGrapheneForms extends Command
{
    protected $config = [
        'repo' => "EscherLabs/GrapheneForms",
        'branch' => 'master',
        'target' => "public/assets/js/gform",
        'files' => [
            ['path'=>'/src/js/gform.js'],
            ['path'=>'/src/js/types.js'],
            ['path'=>'/src/js/conditions.js'],
            ['path'=>'/src/js/validate.js'],
            ['path'=>'/src/js/themes/bootstrap.js'],
            ['path'=>'/src/js/types/smallcombo.js'],
            ['path'=>'/src/js/types/summernote.js'],
        ]
    ];
    protected $signature = 'upgrade:gform';
    protected $description = 'Pulls down the latest gform files from https://github.com/EscherLabs/GrapheneForms';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $target_path = base_path($this->config['target']);
        $this->line("<fg=green>Fetching Files From Git ...</>");
        foreach($this->config['files'] as $file) {
            $file_contents = file_get_contents(
                'https://raw.githubusercontent.com/'.$this->config['repo'].'/'.
                $this->config['branch'].'/'.$file['path'].'?cb='.time()
            );
            $this->line("Writing: ".$target_path.'/'.basename($file['path']));
            file_put_contents($target_path.'/'.basename($file['path']),$file_contents);
        }
        $this->line("<fg=green>Complete!</>");
    }
}
