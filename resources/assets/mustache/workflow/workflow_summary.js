workflow_report.workflow_summary_container = `
<div></div>`;
workflow_report.workflow_summary = `
{{#workflow.configuration}}
{{#allow_multiple_new}}
<div class="btn-group action-bar">
  <button type="button" class="btn btn-success" data-action="save">Save for later</button>
  <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu">
  <li><a href="#" data-action="new" type="button">New</a></li>
  <li><a href="#" data-action="validate" type="button">Validate</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#" data-action="discard" type="button" class="text-danger">Discard</a></li>
  </ul>
</div>
<hr>
{{/allow_multiple_new}}
{{#instructions}}
<div class="callout callout-warning">{{instructions}}</div>
{{/instructions}}
{{/workflow.configuration}}
{{#workflow.configuration.display_required_list}}
{{#required.length}}
<div class="panel panel-{{#satisfied.false}}info{{/satisfied.false}}{{^satisfied.false}}success{{/satisfied.false}} current-panel">
  <div class="panel-heading" style="position:relative">
    <h3 class="panel-title">Required Fields</h3>
  </div>
  <div class="panel-body workflow-required">
      <div>{{#required}}<span class="required-field {{^satisfied}}missing{{/satisfied}}"><a data-id="{{id}}" class="label label-{{^satisfied}}info{{/satisfied}}{{#satisfied}}default{{/satisfied}}">{{label}}</a>{{/required}}</div>
  </div>
</div>
{{/required.length}}
{{/workflow.configuration.display_required_list}}

{{#workflow.configuration.display_error_list}}
{{#errors.length}} 
<div class="panel panel-danger current-panel">
  <div class="panel-heading" style="position:relative">
    <h3 class="panel-title">Errors</h3>
  </div>
  <div class="list-group workflow-errors">
  {{#errors}}<a class="list-group-item text-info error-field" data-id="{{id}}" style="cursor:pointer;padding: 5px 5px 0;overflow: hidden;" >
    <b>{{label}}</b>
    <ul>
      {{#errors}}<li class="text-danger" >{{{.}}}</li>{{/errors}}
    </ul>
  </a>
  {{/errors}} 
  </div>
</div>
{{/errors.length}} 
{{/workflow.configuration.display_error_list}}

{{#workflow.configuration.allow_multiple_new}}
{{#if all.length > 1 }}
<div class="panel panel-default saved-panel">
  <div class="panel-heading" style="position:relative">
    <h3 class="panel-title">Unsubmitted</h3>
  </div>
    <div class="list-group" id="submissions" style="max-height: 295px;overflow: scroll;">
    <div class="list-group-item" style="padding:0">
      <div class="input-group" style="margin: 0 -1px;">
          <span class="input-group-addon" style="border-radius: 0;"><i class="fa fa-filter"></i></span>    
          <label for="filter" class="sr-only">Filter</label>
          <input type="text" class="form-control filter" data-selector="#submissions.list-group" name="filter" placeholder="Filter...">
          <span class="input-group-addon" style="border-radius: 0;"><span class="badge">{{all.length}}</span></span>    
      </div>
    </div>
    {{#all}}
      <a href="#" onclick="event.preventDefault();" class="filterable list-group-item {{status}} inProgress {{#if submission.id == id}}list-group-item-info{{/if}}" data-id="{{id}}">{{title}}<br><small class="text-muted">{{comment}}</small></a>
    {{/all}}
  </div>
</div>
{{/if}}
{{/workflow.configuration.allow_multiple_new}}`;