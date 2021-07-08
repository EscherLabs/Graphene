// Minified JS
workflow_report = {}; 
workflow_report.actions = '{{#is.actionable}}<div class="hidden-print"><legend>Available Actions</legend><div>{{#actions}}<span class="btn btn-{{type}}{{^type}}default{{/type}}" style="margin:2px 5px 2px 0" data-id="{{id}}" data-event="{{name}}">{{label}}</span>{{/actions}}</div><br></div>{{/is.actionable}}';
workflow_report.assignments = ' <ul class="nav nav-tabs" role="tablist"> <li role="presentation" class="active"><a href="#workflows" aria-controls="workflows" role="tab" data-toggle="tab">My Workflows</a></li> <li role="presentation"><a href="#assignments" aria-controls="assignments" role="tab" data-toggle="tab">My Assignments</a></li> </ul> <div class="tab-content"> <div role="tabpanel" class="tab-pane active" id="workflows"> <h5>These are all of the workflows you have ever submitted</h5><div id="mygrid"></div> </div> <div role="tabpanel" class="tab-pane" id="assignments"> <h5>These are all of the workflows which require your action</h5><div id="assignmentgrid"></div> </div> </div>';
workflow_report.attachments = '<div class="list-group"> {{#files}} <a style="height:60px;padding-left:70px" href="{{path}}" target="_blank" class="list-group-item {{#deleted_at}}list-group-item-danger{{/deleted_at}}"> <div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}background-image: url(\'{{path}}\');background-size: contain;background-repeat: no-repeat;background-position: center;{{/icon}}position:absolute;top:5px;left:5px"> {{{icon}}} </div>{{name}} <div style="margin-top:5px" class="text-muted">{{mime_type}}<span class="pull-right">{{date}}</span></div> {{^deleted_at}} <div style="position: absolute;right: 10px;top: 5px;" class="btn-group parent-hover"> <span data-id="{{id}}" data-action="edit" class="edit-item btn btn-default fa fa-pencil" data-title="Edit"></span> <span data-id="{{id}}" data-action="delete" class="remove-item btn btn-danger fa fa-trash-o" data-title="Delete"></span> </div> {{/deleted_at}} </a> {{/files}} {{^files}} No files yet...click below or drop some files there to begin. {{/files}} </div>';
workflow_report.container = '<div class="row"> <div class="list col-md-4 hidden-xs hidden-sm " style=""> <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center> </div> <div class="col-md-8 col-md-offset-4 report" style="top:-20px"> </div> </div> <style> .list-group-item.active{ background-color:#606971; border-color: #606971 !important; } .list-group-item.active .text-muted{ color:#a5a5a5 } .list-group-item.filterable:hover{ background-color:#f0f0f0; cursor:pointer } .list-group-item.active:hover{ background-color:#606971 } hr{ margin:10px 0 } </style>';
workflow_report.file = '<a {{^deleted_at}}href="{{path}}/download"{{/deleted_at}} style="height:60px;padding-left:70px" target="_blank" data-id="{{id}}" class="filterable list-group-item file"> <div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}{{^deleted_at}}background-image: url(\'{{path}}\');background-size: contain;background-repeat: no-repeat;background-position: center;{{/deleted_at}}{{/icon}}position:absolute;top:5px;left:5px"> {{{icon}}} </div>{{name}} <div style="margin-top:5px" class="text-muted">{{mime_type}}<span class="pull-right">{{date}}</span></div> {{^deleted_at}} {{#current_state.uploads}} <div style="position: absolute;right: 10px;top: 5px;" class="btn-group parent-hover"> <span data-id="{{id}}" data-action="edit" class="edit-item btn btn-default fa fa-pencil" data-title="Edit"></span> <span data-id="{{id}}" data-action="delete" class="remove-item btn btn-danger fa fa-trash-o" data-title="Delete"></span> </div> {{/current_state.uploads}} {{/deleted_at}} </a>';
workflow_report.file_summary = '{{#history}} {{#selected}} {{>file}} <div><h5> <span class="text-muted">Attached by {{created_by.first_name}} {{created_by.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{created_at.date}} @ {{created_at.time}}" data-placement="top">({{created_at.fromNow}})</span></h5></div> {{#deleted_at}}<div><h5><span class="text-muted">Deleted by {{deleted_by.first_name}} {{deleted_by.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div>{{/deleted_at}} {{^deleted_at}}{{{preview}}}{{/deleted_at}} {{/selected}} {{/history}}';
 workflow_report.files = '<ul class="list-group workflow-files" style="margin:10px 0 0"> {{#history}} {{#file}} {{^deleted_at}}{{>file}}{{/deleted_at}} {{/file}} {{/history}} </ul>';
workflow_report.history = '<ul class="list-group workflow-history" style="margin:10px 0 0"> <div class="filterable submission list-group-item" target="_blank" data-current=true data-id="{{latest.id}}"> <div>{{owner.first_name}} {{owner.last_name}} (Originator) <span class="label pull-right label-success{{#latest.closed}} label-danger{{/latest.closed}}">{{latest.end_state}}</span> </div> <hr> <div><h5 style="text-align:right"><span data-toggle="tooltip" title="{{latest.updated_at.date}} @ {{latest.updated_at.time}}" data-placement="top">({{latest.updated_at.fromNow}})</span></h5></div> </div> <div class="list-group-item bg-info" style="color: white;background: #aaa;"><h4>History</h4></div> {{#history}} {{#log}} <div class="filterable list-group-item submission" target="_blank" data-id="{{id}}" ><div><h5>{{action}} <span class="text-muted">by {{actor.first_name}} {{actor.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div> <span class="label label-default">{{previous.state}}</span> <i class="fa fa-long-arrow-right text-muted"></i> <span class="label label-success{{#closed}} label-danger{{/closed}}">{{state}}</span> <span style="display:none" class="pull-right text-muted">{{updated_at.date}} @ {{updated_at.time}} </span> {{#comment}}<h5>Comment:</h5><p>{{comment}}</p>{{/comment}}{{#signature}}<img style="width: 100%;border: solid 1px #aaa;padding: 2px;margin: 10px 0;" src="{{signature}}" alt="(Empty)"/>{{/signature}}</div> {{/log}} {{#file}} <div style="height:60px;padding-left:70px" target="_blank" data-id="{{id}}" class="filterable list-group-item file {{#deleted_at}}list-group-item-danger{{/deleted_at}}"> <div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}{{^deleted_at}}background-image: url(\'{{path}}\');background-size: contain;background-repeat: no-repeat;background-position: center;{{/deleted_at}}{{/icon}}position:absolute;top:5px;left:5px"> {{{icon}}} </div> <div><h5><div style="position: relative;top: -5px;">{{name}}</div> <span class="text-muted">{{^deleted_at}}Attached{{/deleted_at}}{{#deleted_at}}Deleted {{/deleted_at}} by {{actor.first_name}} {{actor.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div> </div> {{/file}} {{/history}} </ul>';
workflow_report.links = ' <label for="link_filter" class="sr-only">Filter</label><input id="link_filter" type="text" class="form-control filter" data-selector=".available_workflow" name="filter" placeholder="Filter..."> <ul class="list-group available_workflow" style="margin:10px 0 0"> {{#data}}{{^unlisted}}<a class="filterable list-group-item" target="_blank" href="/workflow/{{group_id}}/{{slug}}">{{name}}</a>{{/unlisted}}{{/data}} </ul>';
workflow_report.report = '<div> <span class="label pull-right label-success{{#data.closed}} label-danger{{/data.closed}}">{{data.end_state}}</span> Submitted {{workflow.created_at.fromNow}} by <h4>{{owner.first_name}} {{owner.last_name}}</h4><hr> <div class="row"> <div class="col-md-6"> {{>summary}} </div> <div class="col-md-6"> {{>actions}} </div> </div> </div> <div class="panel"> <div class="panel-body"> {{>preview}} </div> </div> {{#workflow.instance.version.code.form.files}} <div> <a class="pull-right btn btn-primary {{^hasFiles }}disabled{{/hasFiles}}" href="/api/workflowsubmissions/{{original.workflow_submission_id}}/files/zip"><i class="fa fa-download"></i> Download All</a> <h3> Attachments </h3><hr/> {{>files}} </div> {{#current_state.uploads}} <div class="dropzone" id="myId"><center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center></div> {{/current_state.uploads}} {{/workflow.instance.version.code.form.files}}';
workflow_report.status = ' <div class="btn-group pull-right slice-actions parent-hover"> {{#enable_min}}<span class="btn btn-default btn-sm min-item fa fa-toggle" data-event="min" title="Minimize"></span>{{/enable_min}} </div> {{#container}} <div class="panel panel-default"> <div class="panel-heading{{^titlebar}} hide{{/titlebar}}" style="position:relative"> <h3 class="panel-title">{{title}}{{^title}}{{{widgetType}}}{{/title}}</h3> </div> <div class="collapsible panel-body"> <h3 class="flow-title"></h3> <div class="g_{{guid}}"> <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center> </div> </div> </div> {{/container}} {{^container}} <div class="collapsible"> </div> {{/container}}';
workflow_report.summary = '<dl class="dl-horizontal"> <dt>Status</dt><dd style="text-transform: capitalize;">{{status}}</dd> <dt>State</dt><dd>{{state}}</dd> <dt>Original Submission</dt> <dd>{{original.created_at.date}} @ {{original.created_at.time}}</dd> <dt>Last Action</dt> <dd>{{latest.updated_at.date}} @ {{latest.updated_at.time}}</dd> <dt>Assignee</dt><dd>{{assignment.group.name}}{{^assignment.group.name}}{{assignment.user.first_name}} {{assignment.user.last_name}}{{/assignment.group.name}} ({{assignment.type}})</dd> <dt>Submission ID</dt> <dd>{{original.workflow_submission_id}}</dd> </dl>';
workflow_report.view = '<div class="panel panel-default"> <div class="panel-heading" style="position:relative"> <h3 class="panel-title">{{options.workflow_instance.name}}</h3> </div> <div class="panel-body" style="padding-right: 50px;padding-left: 35px;"> <div class="view_container" style="padding-right: 50px;padding-left: 35px;"></div> </div> </div>';
workflow_report.workflow = ' <div class="btn-group pull-right slice-actions parent-hover"> {{#enable_min}}<span class="btn btn-default btn-sm min-item fa fa-toggle" data-event="min" title="Minimize"></span>{{/enable_min}} </div> {{#container}} <div class="panel panel-default"> <div class="panel-heading{{^titlebar}} hide{{/titlebar}}" style="position:relative"> <h3 class="panel-title">{{title}}{{^title}}{{{widgetType}}}{{/title}}</h3> </div> <div class="collapsible panel-body"> <h3 class="flow-title"></h3> <div> <!-- Nav tabs --> {{#allowFiles}} <ul class="nav nav-tabs" role="tablist"> <li role="presentation" class="active"><a href="#form" aria-controls="form" role="tab" data-toggle="tab">Form</a></li> <li role="presentation"><a href="#files" aria-controls="files" role="tab" data-toggle="tab">Attachments</a></li> </ul> {{/allowFiles}} <!-- Tab panes --> <div class="tab-content" style="padding-top:15px"> <div role="tabpanel" class="tab-pane active" id="form"> <div class="g_{{guid}}"> <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center> </div> </div> {{#allowFiles}} <div role="tabpanel" class="tab-pane" id="files"> <div class="f_{{guid}}"></div> </div> {{/allowFiles}} </div> </div> {{#allowFiles}} </div> <div class="dropzone" id="myId"><center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center> </div> {{/allowFiles}} </div> {{/container}} {{^container}} <div class="collapsible"> <h3 class="flow-title"></h3> <div class="g_{{guid}}"></div> </div> {{/container}} ';
workflow_report.workflows = ' <div class="btn-group pull-right slice-actions parent-hover"> {{#enable_min}}<span class="btn btn-default btn-sm min-item fa fa-toggle" data-event="min" title="Minimize"></span>{{/enable_min}} </div> {{#container}} <div class="panel panel-default"> <div class="panel-heading{{^titlebar}} hide{{/titlebar}}" style="position:relative"> <h3 class="panel-title">{{title}}{{^title}}{{{widgetType}}}{{/title}}</h3> </div> <div class="collapsible panel-body"> <h3 class="flow-title"></h3> <div class="g_{{guid}}"> <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center> </div> </div> </div> {{/container}} {{^container}} <div class="collapsible"> </div> {{/container}}';
