workflow_report.file_summary = `{{#history}}
{{#selected}}
    {{>file}}
    <div><h5> <span class="text-muted">Attached by {{actor.first_name}} {{actor.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{created_at.date}} @ {{created_at.time}}" data-placement="top">({{created_at.fromNow}})</span></h5></div>
    
    {{#deleted_at}}<div><h5><span class="text-muted">Deleted by {{deleted_by.first_name}} {{deleted_by.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div>{{/deleted_at}}
    {{^deleted_at}}{{{preview}}}{{/deleted_at}}
{{/selected}}
{{/history}}`;