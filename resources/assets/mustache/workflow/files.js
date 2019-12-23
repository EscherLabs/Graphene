  workflow_report.files = `<ul class="list-group workflow-files" style="margin:10px 0 0">
{{#history}}
  {{#file}}
  {{^deleted_at}}{{>file}}{{/deleted_at}}
  {{/file}}
{{/history}}
</ul>`;