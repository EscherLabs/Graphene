//methods => evalmethods ?? this could be a problem if methods['name'] are called directly

Cobler.types.Workflow = function (container) {
  function get() {
    return { widgetType: "Workflow", ...item };
  }
  function set(newItem) {
    $.extend(item, newItem);
    ({ submission, guid, user, resources, workflow: instance } = item);
    // instance = item.workflow;
    ({ flow, form, methods } = instance.version.code);
    flowState = _.find(flow, { name: instance.configuration.initial }) ||
      flow[0] || { actions: [] };
    formData._flowstate = flowState.name;
    formData.user = user;
    formData.data.actor = user;
    rootPath = "/api/workflowsubmissions/" + instance.id;

    $g.emit("workflow_summary", { submission: submission });

    gform.prototype.options.rootpath =
      "/workflows/fetch/" + instance.id + "/{{path}}/";
    if (submission) {
      gform.prototype.options.rootpath =
        "/workflows/fetch/" + instance.id + "/{{path}}/" + submission.id;
      gform.collections.update(
        "files",
        _.map(submission.files || [], $g.formatFile)
      );
      submission = $g.formatDates(submission);
      formData._state = submission.data;
      let oldId = formData.id;
      formData.id = submission.id;
      formData.data.instance = instance;
      if (typeof formData.id !== "undefined" && oldId !== submission.id) {
        if (typeof ractive !== "undefined") loadForm();
      }
    }
    if (typeof ractive !== "undefined") ractive.set(item);
  }

  create = () => {
    message.status = "create";
    workflowForm.destroy();
    item.isContinue = false;
    sync({});
  };

  discard = forceNew => {
    $.ajax({
      url: "/api/workflowsubmissions/" + submission.id,
      type: "delete",
      success: e => {
        submission.deleted_at = true;
        $g.emit("workflow_summary", { submission: submission });
        item.all = _.filter(item.all, item => {
          return item.id !== submission.id;
        });
        if (!forceNew && item.all.length) {
          $g.emit("workflow_select", item.all[0]);
        } else {
          create();
        }
      },
    });
  };

  //  action: required
  //  signature: used if required
  function submitFlow(additionalInfo) {
    let formState = workflowForm.find("_state");
    gform.types.fieldset.edit.call(formState, false);
    formState.el.style.opacity = 0.7;
    $(".gform-footer").hide();
    $.ajax({
      url: rootPath + "/submit",
      dataType: "json",
      contentType: "application/json",
      type: "POST",
      data: JSON.stringify(
        (() => {
          return {
            ...workflowForm.get(),
            ...additionalInfo,
            _state: JSON.stringify(formState.get()),
          };
        })()
      ),
      success: response => {
        document.location = "/workflows/report/" + response.id;
      },
      error: () => {
        workflowForm.find("_state").el.style.opacity = 1;
        gform.types.fieldset.edit.call(workflowForm.find("_state"), true);
        $(".gform-footer").show();
        $g.alert({
          content:
            "An error occured submitting this form. Please try again later",
          title: "ERROR",
          status: "error",
        });
      },
    });
  }

  function updateRequiredFields(form) {
    let required = _.uniq(
      _.compact(
        _.map(
          form
            .find({ name: "_state" })
            .items.filter({ active: true, required: true }),
          e => {
            return { ..._.pick(e, "label", "id"), satisfied: e.satisfied() };
          }
        )
      )
    );
    $g.emit("workflow_summary", {
      required: required,
      satisfied: _.countBy(required, "satisfied"),
    });
  }

  function processAction(e) {
    var action = _.find(flowState.actions, { name: e.field.name });
    if (action.validate !== false && !workflowForm.validate(true)) {
      if (
        action.invalid_submission !== true ||
        !confirm(
          gform.renderString(
            "This form has the following errors:\r\n\r\n{{#errors}}{{.}}\r\n{{/errors}}\r\nWould you like to submit anyway?",
            { errors: _.values(e.form.errors) }
          )
        )
      ) {
        toastr.clear();
        $g.alert({
          content: "Form invalid, please check for errors!",
          title: "ERROR",
          status: "error",
        });
        message.status = "error";
        e.form.find("_state").filter({ active: true, valid: false });

        //        gform..items.filter.call(e.form.find({name:"_state"}),{active:true,valid:false},{stopOnFail:false})[0].focus();

        return;
      }
    }

    if (action.signature) {
      signature = new gform({
        legend: "Signature Required",
        actions: [
          { type: "cancel", label: '<i class="fa fa-times"></i> Clear' },
          { type: "save" },
        ],
      })
        .on("cancel", e => {
          e.form.set({ signature: null });
          e.form.clearValidation();
        })
        .on("save", e => {
          if (e.form.validate()) {
            e.form.trigger("close");
            submitFlow({
              action: action.name,
              signature: e.form.get("signature"),
            });
          }
        })
        .on("input", e => {
          if (e.form.el.classList.contains("in")) e.form.validate();
        })
        .modal();
      signature.add({
        type: "signaturePad",
        required: true,
        label: "Signature",
        hideLabel: true,
        help: action.signature_text || "Please Sign Above",
        name: "signature",
      });
    } else {
      submitFlow({ action: action.name });
    }
  }

  var update = (file, response) => {
    var files = (submission.files =
      submission.files || gform.collections.get("files"));

    if (typeof response !== "undefined") {
      var exists = _.find(files, { id: response.id });
      if (typeof exists !== "undefined") {
        _.merge(exists, response);
      } else {
        files = files || [];
        files.push(response);
      }
    }
    if (files !== "waiting") {
      gform.collections.update("files", _.map(files, $g.formatFile));
    }

    //update selected field if exists
    var field = workflowForm.find({ shown: true, type: "files" });
    if (field) {
      field.set(response.name);
      field.renderMenu();
      $(
        '[href="' + _.find(field.options, { id: response.id }).path + '"]'
      ).click();
    }
  };

  function saveFlow(data, callback, onError) {
    $g.setData(
      rootPath + "/save",
      { data: { ...data, _state: data["_state"] } },
      callback,
      onError
    );
  }

  var sync = newFormData => {
    if (message.status || !submission || typeof submission.id == "undefined") {
      $g.waiting = "Waiting...";
      saveFlow(
        newFormData || workflowForm.get(),
        response => {
          message.status = "success";
          // initialFormState = response.data;
          lastSynced = response.data;
          response.files = gform.collections.get("files");
          set({ submission: response });
          if (!workflowForm.valid) workflowForm.validate();
        },
        e => {
          message.status = "error";
          $g.alert({
            content:
              "An error occured durring autosave - please try refreshing before proceeding or you may lose your work",
            title: "ERROR",
            status: "error",
          });
        }
      );
    }
  };

  var loadForm = () => {
    if (typeof ractive !== "undefined") ractive.set(item);

    let resourceList = _.map(instance.version.code.resources, "name");

    let app = {
      getResource: (resource, data, callback) => {
        if (resourceList.indexOf(resource) > -1) {
          if (typeof callback !== "function") {
            callback = data => {
              gform.instances.workflow.collections.update(resource, data);
            };
          }
          gform.ajax({
            path: gform.instances.workflow.getPath({ path: resource }),
            data: data || {},
            success: callback,
            error: e => {
              console.log(e);
            },
          });
        }
      },
    };
    // ractive.set(item);
    evalMethods = [];
    _.each(methods, (item, index) => {
      eval(
        'evalMethods["' +
          item.name +
          '"] = evalMethods["method_' +
          index +
          '"] = function(data,app,e){' +
          item.content +
          '\n return "";}.bind(formData,formData.data,app)'
      );
    });
    var formSetup = {
      id: item.guid,
      data: formData,
      name: "workflow",
      methods: evalMethods,
      events: form.events || {},
      actions: [
        {
          type: "cancel",
          action: "canceled",
          label: "<i class='fa fa-times'></i> Clear",
        },
        {
          type: "hidden",
          name: "_flowstate",
        },
        {
          type: "hidden",
          name: "id",
          parse: [{ type: "not_matches", value: "" }],
        },
      ],
      fields: [
        {
          name: "_state",
          label: false,
          type: "fieldset",
          fields: form.fields,
        },
      ],
    };

    formSetup.actions = formSetup.actions.concat(
      _.filter(flowState.actions, action => {
        if (typeof assignment == "undefined") return true;
        let { type, id } = action.assignment;

        if (
          type == "user" &&
          gform.m(id, formData.data) == formData.data.actor.id.toString()
        )
          return true;
        if (
          type == "group" &&
          formData.data.actor.groups.indexOf(
            parseInt(gform.m(id, formData.data))
          ) >= 0
        )
          return true;

        return false;
      })
    );
    formSetup.data._state = {
      ...formSetup.data._state,
      ...(form.resource in formData.data.resources
        ? formData.data.resources[form.resource]
        : form.resource in evalMethods
        ? evalMethods[form.resource](formData)
        : {}),
    };

    if (submission != null) {
      gform.collections.update(
        "files",
        _.map(submission.files || [], $g.formatFile)
      );
    } else {
      gform.collections.update("files", []);
    }

    workflowForm = new gform(formSetup, ".g_" + guid)
      .on("validation", e => {
        let status = { errors: [] };
        if (!e.form.valid) {
          var invalid_fields = e.form
            .find({ name: "_state" })
            .items.filter({ active: true, valid: false });
          status.errors = _.compact(
            _.map(invalid_fields, e => {
              return {
                label: e.label,
                id: e.id,
                errors: e.errors.split("<br>"),
              };
            })
          );
        }
        $g.emit("workflow_summary", status);
      })

      .on("save", processAction)
      .on("canceled", e => {
        set({ submission: { ...initialFormState, id: submission.id } });
        loadForm();
      })
      .on("input", e => {
        if ("field" in e && !e.field.valid) {
          gform.validateItem.call(null, true, e.field);
        }
      })
      .on(
        "input canceled reset",
        _.throttle(e => {
          if (_.isEqual(lastSynced, e.form.get("_state"))) return;
          message.status = "saving";
          _saveDelay = setTimeout(sync, 1500);
          updateRequiredFields(e.form);
        }, 500)
      )
      .on(
        "options",
        _.debounce(e => {
          updateRequiredFields(e.form);
        })
      );

    // gform.collections.on('change',(obj)=>{
    //   let target = workflowForm.items.find(obj.collection);
    //   if(target){
    //     target.set(obj.manager.get(obj.collection))
    //     target.trigger(['change', 'input'])
    //   }
    // })

    workflowForm.trigger("input");
    updateRequiredFields(workflowForm);

    if (
      typeof fileLoader == "undefined" &&
      submission &&
      form.files &&
      flowState.uploads
    ) {
      if ($("#uploader_" + item.guid).length) {
        $("#uploader_" + item.guid).html("");
        fileLoader = new Dropzone("#uploader_" + item.guid, {
          dictDefaultMessage: "Drop files here to upload attachments",
          timeout: 60000,
          url: "/api/workflowsubmissions/" + submission.id + "/files",
          init: function () {
            this.on("processing", file => {
              this.options.url =
                "/api/workflowsubmissions/" + submission.id + "/files";
            });
            this.on("success", update);
          },
        });
      }
      update();
    } else {
    }
    $(".f_" + guid).off("click");
    $(".f_" + guid).on("click", "[data-id]", e => {
      e.stopPropagation();
      e.preventDefault();
      if (e.currentTarget.dataset.action == "delete") {
        $.ajax({
          url:
            "/api/workflowsubmissions/" +
            submission.id +
            "/files/" +
            e.currentTarget.dataset.id,
          type: "delete",
          success: update.bind(null, {}),
          error: () => {},
        });
      } else if (e.currentTarget.dataset.action == "edit") {
        new gform({
          legend: "Edit file name",
          data: _.find(submission.files, {
            id: parseInt(e.currentTarget.dataset.id),
          }),
          fields: [
            { name: "name", label: false },
            { name: "id", type: "hidden" },
          ],
        })
          .on("cancel", e => {
            e.form.destroy();
          })
          .on("save", e => {
            $.ajax({
              url:
                "/api/workflowsubmissions/" +
                submission.id +
                "/files/" +
                e.form.get("id"),
              dataType: "json",
              contentType: "application/json",
              type: "PUT",
              data: JSON.stringify(e.form.get()),
              success: update.bind(null, {}),
              error: () => {},
            });
            e.form.trigger("close");
          })
          .modal();
      }
    });

    if (!submission) {
      sync();
    }
  };

  var addComment = () => {
    new gform({
      data: submission,
      legend: "Comment for this submission",
      name: "submission_comment",
      modal: { header_class: "bg-success" },
      fields: [
        {
          label: false,
          name: "comment",
          type: "textarea",
          placeholder: "example: Waiting for John Doe to send me his ID",
          help: '<span class="text-muted">HINT: <i>Use this comment to differentiate this submission from others you may have, or to remember what you are waiting on to continue.</i></span>',
        },
      ],
      actions: [
        { type: "cancel", modifiers: "btn btn-danger pull-left" },
        {
          type: "save",
          label: "Save and start new",
          action: "save_create",
          modifiers: "btn btn-warning",
        },
        { type: "save" },
      ],
    })
      .modal()
      .on("save_create save", e => {
        if (!e.form.validate()) return;
        $g.waiting = "Updating Comment...";
        e.form.trigger("close");
        $.ajax({
          url: "/api/workflowsubmissions/" + instance.id + "/save",
          dataType: "json",
          contentType: "application/json",
          type: "POST",
          data: JSON.stringify({ ...submission, ...e.form.get() }),
          success: submission => {
            set({ submission: submission });
            e.form.trigger("close");
            if (e.event == "save") {
              message.status = "success";
            } else {
              if (fileLoader) fileLoader.removeAllFiles();
              create();
            }
          },
        });
      })
      .on("save cancel", e => {
        e.form.dispatch("close");
        e.form.destroy();
      });
  };

  var item = { guid: generateUUID() };

  var fields = {
    Title: {},
    "Workflow ID": {
      type: "select",
      options: "/api/groups/" + group_id + "/workflowinstances",
      format: { label: "{{name}}", value: "{{id}}" },
    },
  };

  var panelEL,
    ractive,
    submission,
    rootPath,
    guid,
    user,
    resources,
    initialFormState = {},
    lastSynced,
    flowState,
    workflowForm,
    fileLoader,
    flow,
    form,
    methods,
    instance = { configuration: {} },
    evalMethods = [],
    formData = {
      user: user,
      data: {
        actor: user,
        form: {},
        owner: null,
        history: [],
      },
    };

  var message = (() => {
    let _saveDelay;
    let _message = "";

    let _obj = {
      clear: () => {
        message.status = "";
      },
    };

    Object.defineProperty(_obj, "value", {
      get: () => {
        return _message;
      },
      enumerable: false,
    });
    Object.defineProperty(_obj, "status", {
      get: () => $g.waiting,
      set: e => {
        let el = $("#flow-status");
        el.removeClass("label-success").removeClass("label-danger");
        clearTimeout(_saveDelay);
        $g.waiting = false;
        gform.removeClass(panelEL, "error");
        gform.removeClass(panelEL, "success");

        switch (e) {
          case "saving":
            _message = "Auto Saving...";
            $g.waiting = _message;
            break;
          case "create":
            _message = "Creating New...";
            $g.waiting = _message;
            break;
          case "loading":
            _message = "Loading...";
            $g.waiting = _message;
            break;
          case "error":
            _message = "Error Saving";
            el.addClass("label-danger");
            gform.addClass(panelEL, "error");
            break;
          case "success":
            _message = "All Changes Saved";
            el.addClass("label-success");
            gform.addClass(panelEL, "success");
            break;
          default:
            _message = "";
        }

        $("#flow-status").html(_message);
        gform.toggleClass(panelEL, "animate-border", !!$g.waiting);
      },
      enumerable: false,
    });
    return _obj;
  })();

  return {
    container: container,
    fields: fields,
    edit: defaultCobEditor.call(this, container),
    toJSON: get,
    get: get,
    set: set,
    render: () => {
      ractive = new Ractive({
        el: gform.create("<div></div>"),
        template: workflow_report.workflow,
        data: {
          ...item,
          workflow_admin: group_admin,
          allowFiles: form.files && flowState.uploads,
        },
        partials: workflow_report,
      });
      return ractive.el;
    },
    load: function () {
      formData.data.datamap = _.reduce(
        instance.configuration.map,
        (datamap, item) => {
          datamap[item.name] = item.value;
          return datamap;
        },
        {}
      );
      formData.data.resources = _.reduce(
        resources,
        (resources, item, name) => {
          gform.collections.add(name, _.isArray(item) ? item : []);
          resources[name] = item;
          return resources;
        },
        {}
      );
      let resourceList = _.map(instance.version.code.resources, "name");

      let app = {
        getResource: (resource, data, callback) => {
          if (resourceList.indexOf(resource) > -1) {
            if (typeof callback !== "function") {
              callback = data => {
                gform.instances.workflow.collections.update(resource, data);
              };
            }
            gform.ajax({
              path: gform.instances.workflow.getPath({ path: resource }),
              data: data || {},
              success: callback,
              error: e => {
                console.log(e);
              },
            });
          }
        },
      };
      evalMethods = [];
      let tformData = { ...formData, _state: form.data || {} };

      _.each(methods, (item, index) => {
        eval(
          'evalMethods["' +
            item.name +
            '"] = evalMethods["method_' +
            index +
            '"] = function(data,app,e){' +
            item.content +
            '\n return "";}.bind(tformData,tformData.data,app)'
        );
      });

      initialFormState;
      let tempForm = new gform({
        fields: form.fields,
        private: true,
        data:
          form.resource in formData.data.resources
            ? formData.data.resources[form.resource]
            : form.resource in evalMethods
            ? evalMethods[form.resource](tformData)
            : {},
      });
      initialFormState = tempForm.get();
      tempForm.destroy();

      lastSynced = submission ? submission.data : {};

      set({
        isContinue:
          submission !== null &&
          submission.updated_at !== submission.created_at &&
          !_.isEqual(lastSynced, initialFormState),
      });
      if (item.isContinue)
        $g.alert(
          {
            content: "Continuing from data last updated {{updated_at.fromNow}}",
            status: "success",
          },
          submission
        );

      loadForm();
      $g.emit("loaded");
    },

    initialize: function (el) {
      // ractive = new Ractive({el: this.container.elementOf(this).querySelector('.header'), template: workflow_report.header, data:  {}, partials: {}});

      panelEL = this.container.elementOf(this).querySelector(".panel");

      $(panelEL).on("click", "[data-action]", e => {
        $g.emit("workflow_action", e.currentTarget.dataset);
      });

      gform.collections.add("files", []);
      gform.collections.on("files", e => {
        $(".f_" + guid).html(
          gform.renderString(workflow_report.attachments, submission)
        );
      });
      window.addEventListener("beforeunload", e => {
        if (message.status) {
          var confirmationMessage = "Changes you made May not be saved";
          (e || window.event).returnValue = confirmationMessage; //Gecko + IE
          return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        }
      });

      if (typeof instance.id == "undefined") {
        return false;
      }
      this.fields["Workflow ID"].enabled = false;
      if (this.container.owner.options.disabled && get().enable_min) {
        set({ collapsed: (Lockr.get(guid) || get()).collapsed });
        $(el).find(".widget").toggleClass("cob-collapsed", get().collapsed);
      }
      if (typeof instance !== "undefined") {
        this.load();
      } else {
        $.ajax({
          url: "/api/workflowinstances/" + instance.id,
          type: "GET",
          success: function (instance) {
            set({ workflow: instance });
            this.load();
          }.bind(this),
          error: () => {},
        });
      }

      $g.on("workflow_select", e => {
        toastr.clear();
        if (e.data.id == submission.id) return;
        $g.emit("workflow_summary", {
          required: [],
          satisfied: [],
          errors: [],
        });

        if (fileLoader) fileLoader.removeAllFiles();
        gform.collections.update("files", []);
        message.status = "loading";
        workflowForm.destroy();
        $g.getData(
          "/api/workflowsubmissions/" + e.data.id + "/context",
          context => {
            message.status = "success";
            lastSynced = context.submission.data;
            set({
              ...context,
              isContinue:
                context.submission !== null &&
                context.submission.updated_at !==
                  context.submission.created_at &&
                !_.isEqual(lastSynced, initialFormState),
            });
            if (item.isContinue)
              $g.alert(
                {
                  content:
                    "Continuing from data last updated {{updated_at.fromNow}}",
                  status: "success",
                },
                submission
              );
          }
        );
      });
      $g.on("workflow_action", e => {
        _.each(e.data.action.split(" "), action => {
          switch (action) {
            case "restart":
              $g.confirm(
                "Are you sure you want to discard the current data?",
                () => discard(true)
              );
              break;
            case "new":
              create();
              break;
            case "validate":
              workflowForm.validate(true);
              break;
            case "save":
              addComment();
              break;
            case "discard":
              $g.confirm(
                "Are you sure you want to discard the current data?",
                () => discard(false)
              );
              break;
          }
        });
      });

      $g.on("workflow_status", e => {
        updateRequiredFields(workflowForm);
      });
    },
  };
};
