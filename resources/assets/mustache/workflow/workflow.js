workflow_report.workflow = `
      <div class="btn-group pull-right slice-actions parent-hover">
	    {{#enable_min}}<span class="btn btn-default btn-sm min-item fa fa-toggle" data-event="min" title="Minimize"></span>{{/enable_min}}
      </div>
      {{#container}}
      <div class="row">
      <div class="col-md-12">
      <div class="panel panel-default">
        <div class="panel-heading{{^titlebar}} hide{{/titlebar}}" style="position:relative">
          <h3 class="panel-title">{{title}}{{^title}}{{{widgetType}}}{{/title}}</h3>
        </div>
        <div class="collapsible panel-body">
        <h3 class="flow-title"></h3>
        <h4 class="submission-title"></h4>
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
        </div>
        <div class="dropzone" id="myId"><center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
        </div>
        {{/allowFiles}}
      </div>


</div>

      {{/container}}
      {{^container}}

        <div class="collapsible">
        <h3 class="flow-title"></h3>
        <div class="g_{{guid}}"></div>
        </div>
      {{/container}}

      `;
      