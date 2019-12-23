workflow_report.history = `<ul class="list-group workflow-history" style="margin:10px 0 0">
<div class="filterable submission list-group-item" target="_blank" data-current=true data-id="{{latest.id}}">
<div>{{owner.first_name}} {{owner.last_name}} (Originator)
<span class="label pull-right label-success{{#latest.closed}} label-danger{{/latest.closed}}">{{latest.end_state}}</span>
</div>
<hr>
<div><h5 style="text-align:right"><span data-toggle="tooltip" title="{{latest.updated_at.date}} @ {{latest.updated_at.time}}" data-placement="top">({{latest.updated_at.fromNow}})</span></h5></div>
</div>
<div class="list-group-item bg-info" style="color: white;background: #aaa;"><h4>History</h4></div>
{{#history}}
  {{#log}}
    <div class="filterable list-group-item submission" target="_blank" data-id="{{id}}" ><div><h5>{{action}} <span class="text-muted">by {{actor.first_name}} {{actor.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div>
    <span class="label label-default">{{previous.state}}</span> <i class="fa fa-long-arrow-right text-muted"></i> <span class="label label-success{{#closed}} label-danger{{/closed}}">{{state}}</span>
    <span style="display:none" class="pull-right text-muted">{{updated_at.date}} @ {{updated_at.time}} </span>
    {{#comment}}<h5>Comment:</h5><p>{{comment}}</p>{{/comment}}</div>
  {{/log}}
  {{#file}}
    <div style="height:60px;padding-left:70px" target="_blank" data-id="{{id}}" class="filterable list-group-item file {{#deleted_at}}list-group-item-danger{{/deleted_at}}">
    <div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}{{^deleted_at}}background-image: url('{{path}}');background-size: contain;background-repeat: no-repeat;background-position: center;{{/deleted_at}}{{/icon}}position:absolute;top:5px;left:5px">
    {{{icon}}}
    </div>
    <div><h5><div style="position: relative;top: -5px;">{{name}}</div> <span class="text-muted">{{^deleted_at}}Attached{{/deleted_at}}{{#deleted_at}}Deleted {{/deleted_at}} by {{actor.first_name}} {{actor.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div>    </div>
  {{/file}}
{{/history}}
</ul>`;