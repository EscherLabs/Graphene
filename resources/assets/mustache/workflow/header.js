
workflow_report.header = `
    <span class="label label-default pull-right" id="flow-status"></span>
    <h3 class="flow-title">{{workflow.workflow.name}}</h3>
    {{#submission.title}}{{#if submission.title !== workflow.workflow.name}}<h5 class="submission-title">{{submission.title}}</h5>{{/if submission.title !== workflow.workflow.name}}{{/submission.title}}
    `;