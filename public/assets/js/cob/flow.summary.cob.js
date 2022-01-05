Cobler.types.WorkflowSummary = function (container) {
  function get() { return { widgetType: 'WorkflowSummary', ...item }; }
  var item = { guid: generateUUID() }

  return {
    container: container,
    fields: [],
    render: () => gform.renderString(workflow_report.workflow_summary_container, get()),
    edit: defaultCobEditor.call(this, container),
    toJSON: get,
    get: get,
    redraw: function (newItem) {
      if (typeof newItem !== 'undefined') {
        this.set(newItem)
        let { submission } = newItem;
        if (submission) {
          let index = _.findIndex(item.all, _.pick(submission, 'id'));
          if (index >= 0) {
            item.all[index] = submission;
          } else {
            item.all.unshift(submission);
          }
        }
      }
      item.all = _.filter(item.all, submission => {
        return !submission.deleted_at;
      })
      this.ractive.set(item);
    },
    set: newItem => {
      $.extend(item, newItem);
      item.submission = $g.formatDates(item.submission);
    },
    initialize: function (el) {
      // workflowsummary = this;
      this.ractive = new Ractive({ el: this.container.elementOf(this), template: workflow_report.workflow_summary, data: this.get(), partials: {} });

      $(this.container.elementOf(this)).on('click', '.error-field, .required-field a', e => {
        gform.instances.workflow.find(e.currentTarget.dataset).focus()
        gform.instances.workflow.find(e.currentTarget.dataset).el.scrollIntoView({ block: "end", inline: "nearest", behavior: "smooth" })
        // setTimeout(()=>window.scrollBy(0, 140),0)
      })

      $('.action-bar').on('click', '[data-action]', e => {
        $g.emit('workflow_action', e.currentTarget.dataset);
      })
      debugger;
      $(this.container.elementOf(this)).on('click', '[data-id]', e => {
        $g.emit('workflow_select', _.find(this.get().all, { id: parseInt(e.currentTarget.dataset.id) }));
      })

      $g.on('workflow_summary', e => {
        this.redraw(e.data);
      })
      $g.emit('workflow_status')
    }
  }
}

