workflow_report.prompt = `You are currently in the middle of this workflow. Would you like to continue with your current data?<hr>{{#submission}}
          {{>prompt_summary}}
          {{/submission}}`;