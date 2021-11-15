
workflow_report.header = `
    <span class="label label-default pull-right" id="flow-status"></span>
    <h3 class="flow-title">{{workflow.workflow.name}}</h3>
    <h5 class="submission-title">{{submission.title}}</h5>
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
    `;