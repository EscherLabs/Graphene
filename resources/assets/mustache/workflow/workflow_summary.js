workflow_report.workflow_summary_container = `
<div></div>`;
workflow_report.workflow_summary = `
<div class="panel panel-default current-panel">
        <div class="panel-heading" style="position:relative">
          <h3 class="panel-title">Current Workflow</h3>
        </div>
        <div class="collapsible panel-body">
            {{#current}}
        <div><b>{{{title}}}</b></div>
        <small class="text-muted">{{{comment}}}</small>
        <hr class="thin">
        <dl class="">
        {{#created_at}}
        <dt>Started</dt>
        <dd>{{created_at.date}} @ {{{created_at.time}}}</dd>
        {{/created_at}}

        {{#updated_at}}
        <dt>Last Updated</dt>
        <dd>{{updated_at.date}} @ {{{updated_at.time}}}</dd>
        {{/updated_at}}
        </dl>
            {{/current}}            
            <div class="workflow-required">
            {{#required.length}}<hr class="thin"><h5>Required information</h5>{{/required.length}}<div>{{#required}}<div><span data-id="{{id}}" class="missing-field label label-primary">{{label}}</span></div>{{/required}}</div>
            </div>
            <div class="workflow-errors">
            {{#errors.length}}<hr class="thin"><h5>Errors</h5><div class="workflow-errors">{{#errors}}<li class="text-info error-field" data-id="{{id}}" >{{label}}<ul>
            {{#errors}}<li class="text-danger" >{{{.}}}</li>{{/errors}}

            </ul></li>{{/errors}}</div>{{/errors.length}}
            </div>
            
        </div>
</div>
<div class="panel panel-default saved-panel">
        <div class="panel-heading" style="position:relative">
          <h3 class="panel-title">Saved Workflows</h3>
        </div>
        <div class="collapsible panel-body">
            {{#all.length}}
            <ul class="list-group">

            {{#all}}
            <div class="list-group-item {{status}} inProgress" data-id="{{id}}">{{title}}<br><small class="text-muted">{{comment}}</small></div>
            {{/all}}
            </ul>
            {{/all.length}}
        </div>
</div>`;