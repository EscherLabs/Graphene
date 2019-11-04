workflow_report.file = `<a {{^deleted_at}}href="{{path}}/download"{{/deleted_at}} style="height:60px;padding-left:70px" target="_blank" data-id="{{id}}" class="filterable list-group-item file">
<div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}{{^deleted_at}}background-image: url('{{path}}');background-size: contain;background-repeat: no-repeat;background-position: center;{{/deleted_at}}{{/icon}}position:absolute;top:5px;left:5px">
{{{icon}}}
</div>{{name}}
<div style="margin-top:5px" class="text-muted">{{mime_type}}<span class="pull-right">{{date}}</span></div>
{{^deleted_at}}
{{#current_state.uploads}}
<div style="position: absolute;right: 10px;top: 5px;" class="btn-group parent-hover">
  <span data-id="{{id}}" data-action="edit" class="edit-item btn btn-default fa fa-pencil" data-title="Edit"></span>
  <span data-id="{{id}}" data-action="delete" class="remove-item btn btn-danger fa fa-trash-o" data-title="Delete"></span>
</div>
{{/current_state.uploads}}
{{/deleted_at}}
</a>`;