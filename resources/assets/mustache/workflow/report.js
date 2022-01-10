workflow_report.report = `<div>
    <span class="label pull-right label-success{{#data.closed}} label-danger{{/data.closed}}">{{data.end_state}}</span>
    Submitted {{workflow.created_at.fromNow}} by <h4>{{owner.first_name}} {{owner.last_name}}</h4><hr>
    <div class="row">
      <div class="col-md-6">
      {{>summary}}
      </div>
      <div class="col-md-6">
      {{>actions}}
      </div>
    </div>
  </div>
  <div class="panel">
    <div class="panel-body">
      {{>preview}}
    </div>
  </div>
      {{#workflow.instance.version.code.form.files}}
      <div>
        <a class="pull-right btn btn-primary {{^hasFiles }}disabled{{/hasFiles}}" href="/api/workflowsubmissions/{{original.workflow_submission_id}}/files/zip"><i class="fa fa-download"></i> Download All</a>
        <h3>
            Attachments
        </h3><hr/>
        {{>files}}
      </div>
      {{#current_state.uploads}}
      <div class="dropzone" id="uploader_{{original.workflow_submission_id}}"><center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center></div>
      {{/current_state.uploads}}
      {{/workflow.instance.version.code.form.files}}`;