workflow_report.prompt_summary = `<dl class="dl-horizontal">
  {{#title}}<dt>Title</dt><dd>{{{title}}}</dd>{{/title}}
  {{#saved}}<dt>Comment</dt>
  <dd>{{{comment}}}{{^comment}} - {{/comment}}</dd>
  {{/saved}}
  <dt>Started</dt>
  <dd>{{created_at.date}} @ {{{created_at.time}}}</dd>
  <dt>Last Updated</dt>
  <dd>{{updated_at.date}} @ {{{updated_at.time}}}</dd>
</dl>`;