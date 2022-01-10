workflow_report.summary = `<dl class="dl-horizontal">
<dt>Status</dt><dd style="text-transform: capitalize;">{{status}}</dd>
<dt>State</dt><dd>{{state}}</dd>
<dt>Original Submission</dt> <dd>{{original.updated_at.date}} @ {{original.updated_at.time}}</dd>
<dt>Last Action</dt> <dd>{{latest.updated_at.date}} @ {{latest.updated_at.time}}</dd>
<dt>Assignee</dt><dd>{{assignment.group.name}}{{^assignment.group.name}}{{assignment.user.first_name}} {{assignment.user.last_name}}{{/assignment.group.name}} ({{assignment.type}})</dd>
<dt>Submission ID</dt> <dd>{{original.workflow_submission_id}}</dd>
</dl>`;