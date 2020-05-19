<?php

return [
    'css' => [
        'min' => [
            'head' => '/assets/compiled/css/graphenecore.head.min.css',
            'body' => '/assets/compiled/css/graphenecore.body.min.css',
        ],
        'src' => [
            'head' => [
                ['file'=>'/assets/css/bootstrap.min.css'],
                ['file'=>'/assets/css/font-awesome.min.css'],
                ['file'=>'/assets/css/toastr.min.css'],
                // Include Nivo Slider Manually (Doesn't Minify Well)
                // ['file'=>'/assets/css/nivo-slider.min.css'],
                ['file'=>'/assets/css/colorpicker.min.css'],
                ['file'=>'/assets/css/summernote.min.css'],
                ['file'=>'/assets/js/vendor/dropzone/dropzone.min.css'],
            ],
            'body' => [],
        ],
    ],
    'javascript' => [
        'min' => [
            'head' => '/assets/compiled/js/graphenecore.head.min.js',
            'body' => '/assets/compiled/js/graphenecore.body.min.js',
        ],
        'src' => [
            'head' => [],
            'body' => [
                ['file'=>'/assets/js/grapheneAppEngine.js'],
                ['file'=>'/assets/js/vendor/moment.js'],
                ['file'=>'/assets/js/vendor/math.min.js'],
                ['file'=>'/assets/js/vendor/popper.min.js'],
                ['file'=>'/assets/js/vendor/jquery.min.js'],
                ['file'=>'/assets/js/vendor/colorpicker.min.js'],
                ['file'=>'/assets/js/vendor/bootstrap.min.js'],
                ['file'=>'/assets/js/vendor/hogan.min.js'],
                ['file'=>'/assets/js/vendor/summernote.min.js'],
                ['file'=>'/assets/js/vendor/berry.full.js'],
                ['file'=>'/assets/js/vendor/moment_datepicker.js'],
                ['file'=>'/assets/js/vendor/bootstrap.full.berry.js'],
                ['file'=>'/assets/js/vendor/berrytables.full.js'],
                ['file'=>'/assets/js/vendor/bootstrap.cobler.js'],
                ['file'=>'/assets/js/vendor/lodash.min.js'],
                ['file'=>'/assets/js/lodash.shim.js'],
                ['file'=>'/assets/js/vendor/gform_bootstrap.min.js'],
                ['file'=>'/assets/js/vendor/GrapheneDataGrid.min.js'],
                ['file'=>'/assets/js/vendor/ractive.min.js'],
                ['file'=>'/assets/js/vendor/lockr.min.js'],
                ['file'=>'/assets/js/vendor/toastr.min.js'],
                // Include ACE Manually (Doesn't Minify Well)
                // ['file'=>'/assets/js/vendor/ace/ace.js','attributes'=>[['name'=>'charset','value'=>'utf-8']]],
                // Include Nivo Slider Manually (Doesn't Minify Well)
                // ['file'=>'/assets/js/vendor/jquery.nivo.slider.min.js','attributes'=>[['name'=>'charset','value'=>'utf-8']]],
                ['file'=>'/assets/js/vendor/sortable.js'],
                ['file'=>'/assets/js/cob/cob.js'],
                ['file'=>'/assets/js/cob/content.cob.js'],
                ['file'=>'/assets/js/cob/image.cob.js'],
                ['file'=>'/assets/js/cob/uapp.cob.js'],
                ['file'=>'/assets/js/cob/flow.cob.js'],
                ['file'=>'/assets/js/templates/workflow.js'],
                ['file'=>'/assets/js/cob/flow.report.cob.js'],
                ['file'=>'/assets/js/cob/links.cob.js'],
                ['file'=>'/assets/js/templates/widget.js'],
                ['file'=>'/assets/js/lib.js'],
                ['file'=>'/assets/js/vendor/dropzone/dropzone.min.js'],
                ['file'=>'/assets/js/resources/creators.js'],
            ],
        ],
    ],
];