workflow_report.workflow_summary_container = `
<div></div>`;
workflow_report.workflow_summary = `
{{#if current.status == 'saved'}}
<div style="margin-bottom:15px"><a href="./{{title}}"><button type="button" class="btn btn-success">New {{title}}</button></a></div>
{{/if}}
<div class="panel panel-default current-panel">
  <div class="panel-heading" style="position:relative">
    <h3 class="panel-title">Current Workflow</h3>
  </div>
  <div class="panel-body">
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
      <hr>
      <dt>Last Updated</dt>
      <dd>{{updated_at.date}} @ {{{updated_at.time}}}</dd>
      {{/updated_at}}
      </dl>
    {{/current}}            
    <div class="workflow-required">
      {{#required.length}}<hr class="thin"><h5>Required information</h5>{{/required.length}}<div>{{#required}}<a data-id="{{id}}" style="margin-right:10px" class="missing-field label label-{{^satisfied}}info{{/satisfied}}{{#satisfied}}default{{/satisfied}}">{{label}}{{#satisfied}} <i class="fa fa-check"></i>{{/satisfied}}</a>{{/required}}</div>
    </div>
    <div class="workflow-errors">
    {{#errors.length}}<hr class="thin"><h5>Errors</h5><div class="list-group#337ab7 workflow-errors">{{#errors}}<a class="list-group-item text-info error-field" data-id="{{id}}" style="cursor:pointer" >{{label}}<ul>
    {{#errors}}<li class="text-danger" >{{{.}}}</li>{{/errors}}
    </ul></a>{{/errors}}</div>{{/errors.length}}
    </div>    
  </div>
</div>
<div class="panel panel-default saved-panel">
  <div class="panel-heading" style="position:relative">
    <h3 class="panel-title">Saved Workflows</h3>
  </div>
  {{#all.length}}
    <div class="list-group">
  {{#all}}
    <a href="#" onclick="event.preventDefault();" class="list-group-item {{status}} inProgress" data-id="{{id}}">{{title}}<br><small class="text-muted">{{comment}}</small></a>
  {{/all}}
  </div>
  {{/all.length}}
</div>`;