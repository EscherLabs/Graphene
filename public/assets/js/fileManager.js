var fileManager = function (selector, options) {
  this.$el = $(selector);
  options.hasextra = typeof options.extra == "function";
  options.u_id = gform.getUID();
  options.filter = "filter" in options ? !!options.filter : true;
  options.label = options.label || "Section";
  options.files = _.map(options.items, function (item) {
    // item.key =
    //   options.u_id +
    //   item.name.toLowerCase().replace(/ /g, "_").split(".").join("_");
    return _.extend(
      {
        key:
          options.u_id +
          item.name.toLowerCase().replace(/ /g, "_").split(".").join("_"),
      },
      item
    );
  });
  options.fields = _.map(options.files, function (item) {
    return { target: "#" + item.key, name: item.key };
  });
  options.actions = [];
  options.clear = false;
  options.data = {};
  _.each(options.files, function (item) {
    if (typeof item.content == "object") {
      item.content = JSON.stringify(item.content);
    }
    options.data[item.key] = item.content;
  });
  options.default = {
    label: false,
    type: "ace",
    mode: options.mode || "ace/mode/handlebars",
    inlinemode: options.inlinemode,
  };
  this.options = $.extend(true, { editable: true }, options);
  // this.options.files = _.extend([], this.options.files);
  this.active = this.options.files[0].key;
  $(selector).html(templates.pages.render(this.options, templates));
  this.gform = new gform(this.options, selector);

  this.render = function () {
    $(selector + " .list-group")
      .empty()
      .html(templates.pages_listgroupitem.render(this.options));
    $('[href="#' + this.active + '"]').click();
  };
  this.sorter = new Sortable(
    document.querySelector(selector + " .list-group"),
    { draggable: ".sortable" }
  );

  $(
    selector +
      " .actions .pages_delete," +
      selector +
      " .actions .pages_edit," +
      selector +
      " .actions .pages_new," +
      selector +
      " .pages_extra"
  ).on(
    "click",
    function (e) {
      var currentItem = _.findWhere(this.options.files, { key: this.active });
      if (
        $(e.currentTarget).hasClass("pages_delete") &&
        !currentItem.disabled
      ) {
        currentItem.removed = true;
        this.render();
      } else {
        if (
          $(e.currentTarget).hasClass("pages_edit") &&
          !currentItem.disabled
        ) {
          new gform({
            name: "page_name",
            legend: "Edit " + options.label,
            data: { name: currentItem.name },
            fields: [
              {
                label: "Name",
                required: true,
                validate: [
                  {
                    type: "custom",
                    test: function (files, e) {
                      return _.includes(files, e.value)
                        ? "Name already used - please choose a unique name"
                        : false;
                    }.bind(
                      null,
                      _.map(_.reject(this.options.files, currentItem), "name")
                    ),
                  },
                ],
              },
            ],
          })
            .on(
              "save",
              function (e) {
                if (!e.form.validate()) return;

                _.findWhere(this.options.files, { key: this.active }).name =
                  e.form.get().name;
                this.render();
                e.form.dispatch("close");
              }.bind(this)
            )
            .on("cancel", function (e) {
              e.form.dispatch("close");
            })
            .modal();
        } else {
          if ($(e.currentTarget).hasClass("pages_new")) {
            new gform({
              name: "page_name",
              legend: "New " + options.label,
              fields: [
                {
                  label: "Name",
                  required: true,
                  validate: [
                    {
                      type: "custom",
                      test: function (files, e) {
                        debugger;
                        return _.includes(files, e.value)
                          ? "Name already used - please choose a unique name"
                          : false;
                      }.bind(null, _.map(this.options.files, "name")),
                    },
                  ],
                },
              ],
            })
              .on(
                "save",
                function (e) {
                  debugger;
                  if (!e.form.validate()) return;
                  this.add(e.form.get().name, "");
                  e.form.dispatch("close");
                }.bind(this)
              )
              .on("cancel", function (e) {
                e.form.dispatch("close");
              })
              .modal();
          } else {
            if ($(e.currentTarget).hasClass("pages_extra")) {
              this.options.extra.call(this, currentItem);
            } else {
              if (currentItem.disabled) {
                toastr.error(
                  "This action is disabled for this item",
                  "Disabled"
                );
              }
            }
          }
        }
      }
    }.bind(this)
  );

  $(selector).on(
    "click",
    ".list-group-item.tab",
    function (e) {
      $(e.currentTarget)
        .parent()
        .find(".list-group-item")
        .removeClass("active");
      $(e.currentTarget).addClass("active");
      this.active = $(e.currentTarget).attr("aria-controls");
      $(e.currentTarget)
        .parent()
        .parent()
        .find("button.dropdown-toggle")
        .prop(
          "disabled",
          (
            _.findWhere(this.options.files, { key: this.active }) ||
            this.options.files[0]
          ).disabled || false
        );
      if (typeof this.gform.find(this.active) !== "undefined") {
        this.gform.find(this.active).editor.clearSelection(); //.instances[0]
        gform.types["ace"].focus.call(this.gform.find(this.active));
      }
    }.bind(this)
  );
  $(selector).find(".list-group-item.tab").first().click();
  this.getCurrent = function () {
    return _.findWhere(this.options.files, { key: this.active });
  };
  this.add = function (name, value) {
    var key =
      this.options.u_id +
      name.toLowerCase().replace(/ /g, "_").split(".").join("_");
    this.options.files.push({ name: name, key: key, content: "" });
    this.$el
      .find(".tab-content")
      .append(
        templates.pages_tabpanel.render({ name: name, key: key, content: "" })
      );
    if (typeof this.gform.find(key) == "undefined") {
      // this.gform.fields.push(gform.createField.call(this.gform, this.gform, {}, null ,null, $.extend({name:key,target:'#'+key},this.gform.options.default)))
      this.gform.add({ name: key, target: "#" + key });
    } else {
      var updateItem = _.findWhere(this.options.files, { name: name });

      updateItem.removed = false;
    }
    this.render();
    this.gform.find(key).set(value);
  };
  this.response = {
    toJSON: function () {
      var data = this.gform.toJSON();
      var order = _.map(
        $(selector + " .list-group").children(),
        function (item) {
          return $(item).attr("name");
        }
      );

      // var temp = _.map(order, item => {
      //   var cachedItem = _.findWhere(this.options.files, { key: item });

      //   if (typeof cachedItem !== "undefined" && !cachedItem.removed) {
      //     return {
      //       name: _.findWhere(this.options.files, { key: item }).name,
      //       content: data[item],
      //     };
      //   } else {
      //     return false;
      //   }
      // });

      // return _.filter(temp, function (item) {
      //   return item;
      // });
      return _.reduce(
        order,
        (items, item) => {
          var cachedItem = _.findWhere(this.options.files, { key: item });

          if (typeof cachedItem !== "undefined" && !cachedItem.removed) {
            items.push(
              _.extend(_.omit(cachedItem, "key"), {
                name: _.findWhere(this.options.files, { key: item }).name,
                content: data[item],
              })
            );
          }
          return items;
        },
        []
      );
    }.bind(this),
    getCurrent: this.getCurrent.bind(this),
    update: function (key, value) {
      if (this.gform.find(key).get() !== value) {
        this.gform.find(key).set(value);
      }
    }.bind(this),
    remove: function (name) {
      var updateItem = _.findWhere(this.options.files, { name: name });
      this.options.files.splice(_.indexOf(this.options.files, updateItem), 1);
      // updateItem.removed = true;
      this.render();
    }.bind(this),
    add: this.add.bind(this),
    errors: function () {
      // var errors = 0;
      var errors = [];
      _.each(
        this.options.files,
        function (item) {
          var items = _.where(
            this.gform.find(item.key).editor.session.getAnnotations(),
            { type: "error" }
          );
          for (var i in items) {
            items[i].name = item.name;
          }
          errors = errors.concat(items);

          var content = item.name;

          if (items.length) {
            content =
              '<span class="badge badge-danger">' +
              items.length +
              "</span> " +
              item.name;
          }
          if (item.disabled) {
            content = '<i class="fa fa-ban"></i> ' + content;
          }
          this.$el
            .find('.list-group-item.tab[name="' + item.key + '"]')
            .html(content);
        }.bind(this)
      );

      return errors;
    }.bind(this),
  };
  Object.defineProperty(this.response, "isDirty", {
    get: () => {
      return !_.isEqual(this.options.items, this.response.toJSON());
    },
    set: status => {
      if (!status && status !== this.response.isDirty) {
        _.each(this.response.toJSON(), (item, key) => {
          this.options.items[key].name = item.name;
          this.options.items[key].content = item.content;
        });
      }
    },
  });
  Object.defineProperty(this.response, "items", {
    get: () => this.options.items,
    set: items => {
      if (!_.isEqual(this.options.items, items)) {
        this.options.items = items;
      }
    },
  });
  return this.response;
};
