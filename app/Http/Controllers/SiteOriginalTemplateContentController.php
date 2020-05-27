<?php

namespace App\Http\Controllers;

use App\Site;
use Illuminate\Support\Facades\File;

class SiteOriginalTemplateContentController extends Controller
{
    public function show(Site $site, $originalTemplateName) {
        return collect(File::files(resource_path('views/mustache/partials')))->transform(function ($file) {
            return [
                'name' => File::name($file->getPathname()),
                'content' => File::get($file->getPathname())
            ];
        })->where('name', $originalTemplateName)->pluck('content')->first();
    }
}
