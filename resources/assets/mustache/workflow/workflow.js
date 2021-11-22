workflow_report.workflow = `
<div class="btn-group pull-right slice-actions parent-hover">
	{{#enable_min}}<span class="btn btn-default btn-sm min-item fa fa-toggle" data-event="min" title="Minimize"></span>{{/enable_min}}
</div>
{{#container}}
<div class="row">
  <div class="col-md-12">
    <div class="panel panel-default" id="{{guid}}">
      <div class="panel-body">

        <div class="header">{{>header}}</div>
        {{#isContinue}}
        <div class="alert alert-info alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <b>Continuing with workflow that was previously started. <br><br>Click <a href="#" data-action="restart">here</a> to discard this data and start over.</b>
            <hr>
            <small class="pull-right">Last updated {{submission.updated_at.fromNow}}</small>
            {{#submission}}
            <dl class="dl-horizontal" style="margin-bottom: 0;">
            <dt>Title</dt><dd>{{title}}</dd>
            <dt>Comment</dt><dd>{{comment}}</dd>
            </dl>
            {{/submission}}
        </div>
        {{/isContinue}}
        <div>
          <!-- Nav tabs -->
          {{#allowFiles}}
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#form" aria-controls="form" role="tab" data-toggle="tab">Form</a></li>
            <li role="presentation"><a href="#files" aria-controls="files" role="tab" data-toggle="tab">Attachments</a></li>
          </ul>
          {{/allowFiles}}
        
          <!-- Tab panes -->
          <div class="tab-content" style="padding-top:15px">
            <div role="tabpanel" class="tab-pane active" id="form">
              <div class="g_{{guid}}">
                <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
              </div>
            </div>
            {{#allowFiles}}
            <div role="tabpanel" class="tab-pane" id="files">
              <div class="f_{{guid}}"></div>
            </div>
            {{/allowFiles}}
          </div>
        </div>
        {{#allowFiles}}
        <div class="dropzone" id="uploader_{{guid}}"><center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
        </div>
        {{/allowFiles}}
      </div>
    </div>
  </div>
</div>
{{/container}}
{{^container}}
<div class="collapsible "id="{{guid}}">


<div class="header"></div>
  <div>
    <!-- Nav tabs -->
    {{#allowFiles}}
    <ul class="nav nav-tabs" role="tablist">
      <li role="presentation" class="active"><a href="#form" aria-controls="form" role="tab" data-toggle="tab">Form</a></li>
      <li role="presentation"><a href="#files" aria-controls="files" role="tab" data-toggle="tab">Attachments</a></li>
    </ul>
    {{/allowFiles}}
  
    <!-- Tab panes -->
    <div class="tab-content" style="padding-top:15px">
      <div role="tabpanel" class="tab-pane active" id="form">
        <div class="g_{{guid}}">
          <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
        </div>
      </div>
      {{#allowFiles}}
      <div role="tabpanel" class="tab-pane" id="files">
        <div class="f_{{guid}}"></div>
      </div>
      {{/allowFiles}}
    </div>
  </div>
  {{#allowFiles}}
  <div class="dropzone" id="uploader_{{guid}}"><center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center></div>
  {{/allowFiles}}
</div>
{{/container}}`;
      