workflow_report.attachments = `<div class="list-group">
        {{#files}}
        <a style="height:60px;padding-left:70px" href="{{path}}" target="_blank" class="list-group-item {{#deleted_at}}list-group-item-danger{{/deleted_at}}">
        <div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}background-image: url('{{path}}');background-size: contain;background-repeat: no-repeat;background-position: center;{{/icon}}position:absolute;top:5px;left:5px">
        {{{icon}}}
        </div>{{name}}
        <div style="margin-top:5px" class="text-muted">{{mime_type}}<span class="pull-right">{{date}}</span></div>
          {{^deleted_at}}
          <div style="position: absolute;right: 10px;top: 5px;" class="btn-group parent-hover">
            <span data-id="{{id}}" data-action="edit" class="edit-item btn btn-default fa fa-pencil" data-title="Edit"></span>
            <span data-id="{{id}}" data-action="delete" class="remove-item btn btn-danger fa fa-trash-o" data-title="Delete"></span>
          </div>
          {{/deleted_at}}
        </a>
        {{/files}}
        {{^files}}
          No files yet...click below or drop some files there to begin.
        {{/files}}
        </div>`;