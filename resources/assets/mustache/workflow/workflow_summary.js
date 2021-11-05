workflow_report.workflow_summary_container = `
<div></div>`;
workflow_report.workflow_summary = `
<div style="margin-bottom:15px"><a href="./{{title}}"><button type="button" class="btn btn-success">New {{title}}</button></a></div>
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
      {{#required.length}}<hr class="thin"><h5>Required information</h5>{{/required.length}}<div>{{#required}}<a data-id="{{id}}" class="missing-field label label-{{^satisfied}}info{{/satisfied}}{{#satisfied}}default{{/satisfied}}">{{label}} <i class="fa fa-check"></i></a>{{/required}}</div>
    </div>
    <div class="workflow-errors">
    {{#errors.length}}<hr class="thin"><h5>Errors</h5><div class="list-group#337ab7 workflow-errors">{{#errors}}<a class="list-group-item text-info error-field" data-id="{{id}}" style="cursor:pointer;padding: 5px 5px 0;" >{{label}}<ul>
    {{#errors}}<li class="text-danger" >{{{.}}}</li>{{/errors}}
    </ul></a>{{/errors}}</div>{{/errors.length}}
    </div>    
  </div>
</div>
<div class="panel panel-default saved-panel">
  <div class="panel-heading" style="position:relative">
    <h3 class="panel-title">Saved Workflows <span class="badge pull-right">{{all.length -1}}</span></h3>
  </div>
  {{#if all.length > 1}}
    <div class="list-group" style="max-height: 295px;overflow: scroll;">
    {{#all}}
      {{#if current.id !== id}}
      <a href="#" onclick="event.preventDefault();" class="list-group-item {{status}} inProgress {{#if current.id == id}}list-group-item-info{{/if}}" data-id="{{id}}">{{title}}<br><small class="text-muted">{{comment}}</small></a>
      {{/if}}
    {{/all}}
  </div>
  {{/if}}
</div>`;