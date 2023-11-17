modal = (options, data) => {
  if (typeof options == "string") {
    options = { content: options };
  }
  var hClass = "";
  switch (options.status) {
    case "error":
      hClass = "bg-danger";
      break;
    case "success":
    case "primary":
    case "info":
    case "warning":
      hClass = "bg-" + options.status;
      break;
  }
  let mm = new gform({
    modal: { header_class: hClass },
    ...options,
    data: { ...data, ...options.data },
    fields: [
      {
        type: "output",
        name: "modal",
        label: false,
        format: {},
        value: $g.render(options.content, _.extend({}, options.partials, data)),
      },
      ...(options.fields || []),
    ],
    actions: !!options.footer
      ? []
      : options.actions || [
          {
            type: "cancel",
            label: '<i class="fa fa-times"></i> Close',
            modifiers: "btn btn-default pull-right",
          },
        ],
  })
    .modal()
    .on("cancel", e => {
      e.form.dispatch("close");
      e.form.destroy();
    });
  mm.ref = mm; //$(mm.el);
  return mm;
};

$g = (function (options) {
  //new gform.eventBus({owner:"graphene",item:'data',handlers:{}}, this),
  function eventHub() {
    let handlers = {};
    let on = (event, handler, data) => {
      let guid = false;
      if (typeof event !== "undefined") {
        var events = event.split(" ");
        guid = api.uuid;
        events.forEach(event => {
          handlers[event] = handlers[event] || [];
          if (typeof handler !== "function")
            throw "Event handler must be a function";

          handlers[event].push({ handler: handler, id: guid, data: data });
        });
      }
      return guid;
    };

    let off = (event, id) => {
      handlers[event].splice(
        handlers[event].findIndex(elem => elem.id == id),
        1
      );
    };

    let emit = (e, data) => {
      let a = {};
      let pd = true;
      let propagate = true;
      a.preventDefault = () => {
        pd = true;
      };
      a.stopPropagation = () => {
        propagate = false;
      };

      // let events = [];
      if (typeof e == "string") {
        e = e.split(" ");
      }
      if (typeof e !== "object" || !Array.isArray(e))
        throw "Event must be a string or array";
      // events = events.concat(e)

      e.forEach(event => {
        a.event = event;
        a.data = data;
        let f = handler => {
          if (typeof handler.handler == "function") {
            handler.handler(a);
          }
          return propagate;
        };
        if (event in handlers) handlers[event].every(f);
        if ("*" in handlers) handlers["*"].every(f);
      });
      return a;
    };
    return {
      emit: emit,
      on: on,
      off: off,
    };
  }
  let globalevents = new eventHub();
  let actionBuffer = [];

  let api = {
    worker: new Worker("/assets/js/grapheneWorker.js"),
    // elapsedSeconds:0,
    // timer:setInterval(function() {
    //  $g.emit('cron',++$g.elapsedSeconds);
    // }, 1000),
    isSet: e => e !== "undefined",
    setData: (urls, options, callback, onError, onComplete) => {
      if (typeof urls == "string") urls = [urls];

      Promise.all(
        _.map(urls, (url, index, list) => {
          return new Promise((resolve, reject) => {
            $.ajax({
              url: url,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify(options.data),
              type: "POST",
              success: data => {
                resolve(data);
              },
              error: data => {
                reject(data);
              },
            });
          });
        })
      )
        .then(data => {
          if (typeof callback !== "undefined") {
            callback.apply(null, data);
          }
        })
        .catch(onError || (() => {}))
        .finally(onComplete || (() => {}));
    },
    getData: (urls, callback, onError, onComplete) => {
      if (typeof urls == "string") urls = [urls];
      Promise.all(
        _.map(urls, url => {
          return new Promise((resolve, reject) => {
            gform.ajax({
              path: url,
              success: function (data) {
                resolve(data);
              },
              error: function (data) {
                reject(data);
              },
            });
          });
        })
      )
        .then(data => {
          let ss = callback.toString().split("=>")[0].split("(");
          (ss.length > 1 ? ss[1] : ss[0])
            .split(")")[0]
            .split(",")
            .forEach((item, index) => {
              if (data.length > index)
                $g.collections.add(item.trim(), data[index]);
            });

          callback.apply(null, data);
        })
        .catch(onError || (() => {}))
        .finally(onComplete || (() => {}));
    },
    form: gform,
    forms: gform.instances,
    render: gform.m,
    alert: function (options, data) {
      let {
        status = "info",
        content = "",
        title = "",
      } = typeof options == "string" ? { content: options } : options;
      toastr[status](gform.m(content, data || {}), title);
    },
    emit: globalevents.emit,
    on: globalevents.on,
    off: globalevents.off,
    schedule: (method, interval) => {
      return api.on("schedule", e => {
        if (!(e.data.ticks % (interval || 1))) method.call(null, e);
      });
    },
    intervalTask: (actions, opts) => {
      let options = _.extend({ period: 1000 }, opts);
      actionBuffer = actionBuffer.concat(actions || []);
      if (timer == null) {
        timer = setInterval(function () {
          if (actionBuffer.length) {
            if (typeof actionBuffer[0] == "function") {
              actionBuffer.shift().call(this);
            } else {
              actionBuffer.shift();
            }
          }
          if (!actionBuffer.length) {
            clearInterval(timer);
            timer = null;
          }
        }, options.period);
      }
      return timer;
    },
    modal: modal,
    confirm: (message, action) => {
      $g.modal({
        title: "Confirm",
        content: message,
        actions: [
          {
            type: "save",
            label: '<i class="fa fa-check"></i> Ok',
            modifiers: "btn btn-primary pull-right",
          },
          {
            type: "cancel",
            label: '<i class="fa fa-times"></i> Cancel',
            modifiers: "btn btn-default pull-right",
          },
        ],
      }).on("save", e => {
        e.form.destroy();
        action(e);
      });
    },
    // getID:generateUUID,
    collections: gform.collections,
    apps: {},
    engines: {},
    formatDates: function (data) {
      if (data == null) return {};
      return _.reduce(
        ["created_at", "updated_at", "deleted_at", "opened_at"],
        (data, date) => {
          if (typeof data[date] == "string") {
            let formated_date = moment(data[date]);
            data[date] = {
              original: data[date],
              time: formated_date.format("h:mma"),
              date: formated_date.format("MM/DD/YY"),
              fromNow: formated_date.fromNow(),
            };
          }
          return data;
        },
        data
      );
      // if (typeof data.created_at == 'string') {
      //   var cat = moment(data.created_at);
      //   data.created_at = {
      //     original: data.created_at,
      //     time: cat.format('h:mma'),
      //     date: cat.format('MM/DD/YY'),
      //     fromNow: cat.fromNow()
      //   }

      //   data.date = data.created_at.original;
      // }
      // if (typeof data.updated_at == 'string') {

      //   var uat = moment(data.updated_at);
      //   data.updated_at = {
      //     original: data.updated_at,
      //     time: uat.format('h:mma'),
      //     date: uat.format('MM/DD/YY'),
      //     fromNow: uat.fromNow()
      //   }
      // }
      // return data;
    },
    formatFile: file => {
      switch (file.mime_type) {
        case "image/jpeg":
        case "image/png":
        case "image/jpg":
        case "image/gif":
          break;
        default:
          file.icon =
            '<i class="fa ' +
            (mime_icons[file.mime_type] ||
              mime_icons[file.mime_type.split("/")[0]] ||
              mime_icons[file.ext] ||
              "fa-file-o") +
            ' fa-3x" style="padding-top: 4px;"></i>';
      }
      file.date = moment(file.deleted_at || file.created_at).format(
        "MM/DD/YY h:mm a"
      );
      return file;
    },
  };
  if (typeof GrapheneDataGrid !== "undefined") {
    api.grid = GrapheneDataGrid;
  }
  pathSelect = function (object, path, target) {
    if (typeof path == "string") {
      return _.property(path)(object);
    }
    if (typeof path == "object") {
      return Object.keys(path).reduce((result, key) => {
        result[key] = _.selectPath(object, path[key]);
        return result;
      }, target || {});
    }

    // return _.propertyOf(object)(path)
    // I believe both of the above are equivilent

    //   //trying lodash native method
    if (typeof object == "undefined") return undefined;
    var obj = object;
    if (typeof object.toJSON == "function") {
      obj = object.toJSON();
    } else {
      obj = _.extend({}, obj);
    }
    return _.reduce(
      _.toPath(path),
      (i, map) => {
        if (typeof i == "object" && i !== null) {
          return i[map];
        } else {
          return undefined;
        }
      },
      obj
    );
  };
  api.selectPath = pathSelect;
  patch = function (object, patch, options = {}) {
    const { key = "path", value: _target = "value" } = options;
    if (!_.isArray(patch)) {
      patch = [patch];
    }
    return _.reduce(
      patch,
      function (original, task) {
        var stack = task[key];
        if (typeof stack !== "string" || original == null) {
          return original;
        }
        // var stack = stack.split('...')

        // stack.splice(stack.length-1,1,...stack[stack.length-1].split('[]'))

        // var stack = _.toPath(stack);
        if (stack[0] == "/") {
          stack = stack.substring(1);
        }
        var stack = stack.split("/");
        var object = original;
        while (stack.length > 1) {
          var target = stack.shift();

          if (typeof object[target] !== "object") {
            if (isFinite(stack[0])) {
              // stack[0] = parseInt(stack[0]);
              if (!_.isArray(object[target])) {
                if (task.op == "delete") return original;
                object[target] = [];
              }
            } else {
              if (task.op == "delete") return original;

              object[target] = {};
            }
          }
          if (object[target] != null) {
            object = object[target];
          }
        }
        var target = stack.shift();
        if (task.op == "delete") {
          if (_.isArray(object)) {
            object.splice(target, 1);
          } else {
            delete object[target];
            object = _.compact(object);
          }
        } else {
          let value = task[_target];

          if (target && typeof value !== "undefined")
            object[target] =
              typeof value == "object" && value !== null && target in value
                ? value[target]
                : value;
        }

        return original;
      },
      object || {}
    );
  };

  let assign = ({ source, search, result, target, transform = null }) => {
    let newValue = pathSelect(source, search);

    if (transform) {
      newValue = transform(newValue);
    }

    patch(result, [
      { op: "delete", path: search },
      {
        op: "add",
        path: target,
        value: newValue,
      },
    ]);
  };
  let processArray = (
    subSource,
    indeces,
    chunks,
    depth,
    result,
    index,
    target,
    transform
  ) => {
    let collection = _j.pathSelect(subSource, chunks[depth]);

    depth++;
    _.each(collection, (item, index) => {
      if (indeces.length > depth) {
        //result =
        processArray(
          item,
          indeces,
          chunks,
          depth,
          result,
          index,
          target,
          transform
        );
      } else {
        let renderData = { ...item };
        renderData[indeces[depth - 1]] = index;
        assign({
          source: item,
          search: chunks[depth], //_j.render(chunks[depth - 1], renderData),
          result,
          target: _j.render(target, renderData),
          transform,
        });
      }
    });

    // return result;
  };
  api.etl = (source, destination, map) => {
    let result = destination || JSON.parse(JSON.stringify(source));
    _.each(map, ({ source: search, target, transform, conditions }) => {
      //find selections in source to reuse in target

      //convert /options/{{i}}/post -> /options/(?<i>[0-9a-zA-Z])/post regex
      // and then use that in followup to render target
      let finder = /{?{{[a-zA-Z]+}}?}+/g;
      let indeces = _.map(
        search.match(finder),
        item => item.match(/[a-zA-Z]+/g)[0]
      );
      let chunks = search.split(finder);

      if (indeces !== null && indeces.length) {
        let indecesIndex = 0;
        let loop = indeces[indecesIndex];

        // _.each(indeces, (loop, indecesIndex) => {
        // console.log(_j.pathSelect(source, chunks[indecesIndex]));

        // console.log(indecesIndex);
        let parts = search.split(loop);
        let loopOn = parts.shift();

        _.each(pathSelect(source, loopOn), (loopItem, index) => {
          console.log(indecesIndex + ":" + index);

          let renderData = { ...loopItem };
          renderData[loop.match(/[a-zA-Z]+/g)[0]] = index;
          assign({
            source: loopItem,
            search: _j.render(parts[0], renderData),
            result,
            target: _j.render(target, renderData),
            transform,
          });
        });
        // });
      } else {
        assign({ source, search, result, target, transform });
      }
    });
    return result;
  };

  api.worker.onmessage = message => {
    api.emit("schedule", {
      timeStamp: message.timeStamp,
      ticks: message.data.ticks,
    });
  };
  Object.defineProperty(api, "widgets", {
    get: function () {
      return _.reduce(
        cb.collections,
        function (list, item) {
          return list.concat(item.getItems());
          // return list;
        },
        []
      );
      // return cb.collections[0].getItems()[0]
    },
    enumerable: true,
  });
  Object.defineProperty(api, "uuid", {
    get: () => generateUUID(),
    enumerable: true,
  });
  Object.defineProperty(api, "waiting", {
    get: () => !!this.isWaiting,
    set: value => {
      if (value) {
        if (!this.el) {
          this.el = document.createElement("div");
          this.el.setAttribute("class", "hide_wait");
          this.el.setAttribute("id", "waiting");
          document.body.append(this.el);
        }
        this.el.innerHTML =
          '<i class="fa fa-circle-o-notch fa-spin"></i> <span>' +
          value +
          "</span>";
        this.el.setAttribute("class", "");
      } else {
        if (this.el) this.el.setAttribute("class", "hide_wait");
      }
      this.isWaiting = value;
    },
    enumerable: true,
  });

  Object.defineProperty(api, "message", {
    set: message => {
      if (typeof message == "string") message = { message: message };
      let packet = { ...message, ...(options.broadcast || {}), id: api.uuid };
      window.localStorage.setItem("_gb", JSON.stringify(packet));
      $g.emit("broadcast", packet);
    },
    enumerable: true,
  });

  window.addEventListener("storage", event => {
    if (event.storageArea != localStorage) return;
    if (event.key === "_gb") {
      if (event.newValue !== "") {
        let source = event.url.split(event.srcElement.location.origin)[1];
        // let oldVal = JSON.parse(event.oldValue);
        let newVal = JSON.parse(event.newValue);

        $g.emit("broadcast", {
          ...newVal,
          source: event.url.split(event.srcElement.location.origin)[1],
        });
      }
    }
  });

  Object.defineProperty(api, "about", {
    get: () => {
      return {
        version: "1.1.0.1",
        subSystems: [
          { type: "Workflow", version: "0.0.1.0" },
          { type: "microApp", version: "0.0.1.0" },
          { type: "forms", version: gform.VERSION, name: "gform" },
          {
            type: "grids",
            version: GrapheneDataGrid.version,
            name: "gformDataGrid",
          },
        ],
      };
    },
    enumerable: true,
  });

  return api;
})({ broadcast: { app: "custom" } });

$g.on("load", e => {
  if (
    window.localStorage.getItem("_gb") !== null &&
    window.localStorage.getItem("_gb") !== ""
  ) {
    $g.emit("broadcast", JSON.parse(window.localStorage.getItem("_gb")));
    $g.message = "";
  }
});

$g.on("broadcast", e => {
  if ("action" in e.data) {
    switch (e.data.action) {
      case "toggle":
        debug[e.data.toggle] = !debug[e.data.toggle];
        $g.message = "";
        break;
    }
  }
});

$g.on("loaded debug", e => {
  var temp = document.querySelector("#debugtools");
  if (temp) document.body.removeChild(temp);
  if (
    !debug.state ||
    typeof resource_type == "undefined" ||
    ["app", "workflow"].indexOf(resource_type) < 0 ||
    typeof cb == "undefined"
  )
    return;
  switch (resource_type) {
    case "app":
      obj = {
        resources: _.reduce(
          debug.app.config.resources,
          (result, resource) => {
            result.push({
              results: debug.app.data[resource.name],
              ...resource,
            });
            return result;
          },
          []
        ),
      };

    case "workflow":
      obj = {};
      break;
  }
  document.body.append(
    gform.create(
      gform.renderString(
        `
  <div id="debugtools" style="position:fixed;bottom:0;right:0;width: 400px;margin-bottom: 0;" class="panel panel-default">
  <div class="panel-heading" role="tab" id="headingTools">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTools" aria-expanded="false" aria-controls="collapseTools">
  Tools
      </a>
    </h4>
  </div>
  <div id="collapseTools" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTools">
    <div class="panel-body">
    {{#resources}}
    <h4>{{name}}</h4>
    <span class="muted">{{path}}</span>
    <div>Count:{{results.length}}</div>
    {{/resources}}
    </div>
  </div>
  </div>`,
        obj
      )
    )
  );

  // debugger;
  // if(e.data.clear) document.querySelector('#target').innerHTML = '';
  // if(e.data.message.length){
  //   console.log(gform.create(`<div>message: ${e.data.message}</div>`))
  //   // document.querySelector('#target').appendChild(_j.create(`<div>message: ${e.data.message}</div>`))
  // }
});

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-bottom-right",
  // "preventDuplicates": true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.6.3
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2017, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["jquery"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    factory(require("jquery"));
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  $.timeago = function (timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowPast: true,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      autoDispose: true,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        inPast: "any moment now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: [],
      },
    },

    inWords: function (distanceMillis) {
      if (!this.settings.allowPast && !this.settings.allowFuture) {
        throw "timeago allowPast and allowFuture settings can not both be set to false.";
      }

      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      if (!this.settings.allowPast && distanceMillis >= 0) {
        return this.settings.strings.inPast;
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction)
          ? stringOrFunction(number, distanceMillis)
          : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words =
        (seconds < 45 && substitute($l.seconds, Math.round(seconds))) ||
        (seconds < 90 && substitute($l.minute, 1)) ||
        (minutes < 45 && substitute($l.minutes, Math.round(minutes))) ||
        (minutes < 90 && substitute($l.hour, 1)) ||
        (hours < 24 && substitute($l.hours, Math.round(hours))) ||
        (hours < 42 && substitute($l.day, 1)) ||
        (days < 30 && substitute($l.days, Math.round(days))) ||
        (days < 45 && substitute($l.month, 1)) ||
        (days < 365 && substitute($l.months, Math.round(days / 30))) ||
        (years < 1.5 && substitute($l.year, 1)) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) {
        separator = " ";
      }
      return $.trim([prefix, words, suffix].join(separator));
    },

    parse: function (iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/, ""); // remove milliseconds
      s = s.replace(/-/, "/").replace(/-/, "/");
      s = s.replace(/T/, " ").replace(/Z/, " UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
      s = s.replace(/([\+\-]\d\d)$/, " $100"); // +09 -> +0900
      return new Date(s);
    },
    datetime: function (elem) {
      var iso8601 = $t.isTime(elem)
        ? $(elem).attr("datetime")
        : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function (elem) {
      return $(elem).get(0).tagName.toLowerCase() === "time";
    },
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function () {
      functions.dispose.call(this);
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function (timestamp) {
      var date = timestamp instanceof Date ? timestamp : $t.parse(timestamp);
      $(this).data("timeago", { datetime: date });
      if ($t.settings.localeTitle) {
        $(this).attr("title", date.toLocaleString());
      }
      refresh.apply(this);
    },
    updateFromDOM: function () {
      $(this).data("timeago", {
        datetime: $t.parse(
          $t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title")
        ),
      });
      refresh.apply(this);
    },
    dispose: function () {
      if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
      }
    },
  };

  $.fn.timeago = function (action, options) {
    var fn = action ? functions[action] : functions.init;
    if (!fn) {
      throw new Error("Unknown function name '" + action + "' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function () {
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    var $s = $t.settings;

    //check if it's still visible
    if ($s.autoDispose && !$.contains(document.documentElement, this)) {
      //stop if it has been removed
      $(this).timeago("dispose");
      return this;
    }

    var data = prepareData(this);

    if (!isNaN(data.datetime)) {
      if ($s.cutoff === 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      } else {
        if ($(this).attr("title").length > 0) {
          $(this).text($(this).attr("title"));
        }
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr(
          "title",
          element.data("timeago").datetime.toLocaleString()
        );
      } else if (
        text.length > 0 &&
        !($t.isTime(element) && element.attr("title"))
      ) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return new Date().getTime() - date.getTime();
  }

  // fix for IE6
  document.createElement("abbr");
  document.createElement("time");
});

function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}
function render(template, data) {
  if (typeof templates[template] === "undefined" && $("#" + template).length) {
    templates[template] = {
      render: templates_render,
      template: $("#" + template).html(),
    };
  }
  if (typeof templates[template] !== "undefined") {
    return templates[template].render(data, templates);
  } else {
    return gform.m(template, _.extend({}, data || {}, templates_partials));
  }
}

function processFilter(options) {
  options = options || {};
  var currentTarget = options.currentTarget || this.currentTarget;
  var collection;
  if (this.selector) {
    collection = $(this.selector).find(".filterable");
  } else {
    collection = $(".filterable");
  }
  collection.each(function () {
    if (
      _.score(
        $(this).text().replace(/\s+/g, " ").toLowerCase(),
        $(currentTarget).val().toLowerCase()
      ) > ($(currentTarget).data("score") || 0.4)
    ) {
      $(this).removeClass("nodisplay");
    } else {
      $(this).addClass("nodisplay");
    }
  });
}

filterTimer = null;
$("body").on("keyup", "[name=filter]", function (event) {
  this.currentTarget = event.currentTarget;
  this.selector = $(this).data("selector");
  if (!$(this).hasClass("delay")) {
    processFilter.call(this);
  } else {
    clearTimeout(filterTimer);
    filterTimer = setTimeout($.proxy(processFilter, this), 300);
  }
});

if (typeof templates !== "undefined")
  templates.listing = Hogan.compile(
    '<ol class="list-group">{{#widgets}}<li data-guid="{{guid}}" class="list-group-item"><div class="handle"></div>{{widgetType}} - {{title}}</li>{{/widgets}}</ol>'
  );

gform.validations.is_https = value =>
  value.startsWith("https://")
    ? false
    : 'Basic Auth Routes must start with "https://"';

var mime_icons = {
  // Media
  image: "fa-file-image-o",
  audio: "fa-file-audio-o",
  video: "fa-file-video-o",
  // Documents
  "application/pdf": "fa-file-pdf-o",
  "application/msword": "fa-file-word-o",
  "application/vnd.ms-word": "fa-file-word-o",
  "application/vnd.oasis.opendocument.text": "fa-file-word-o",
  "application/vnd.openxmlformats-officedocument.wordprocessingml":
    "fa-file-word-o",
  "application/vnd.ms-excel": "fa-file-excel-o",
  "application/vnd.openxmlformats-officedocument.spreadsheetml":
    "fa-file-excel-o",
  "application/vnd.oasis.opendocument.spreadsheet": "fa-file-excel-o",
  "application/vnd.ms-powerpoint": "fa-file-powerpoint-o",
  "application/vnd.openxmlformats-officedocument.presentationml":
    "fa-file-powerpoint-o",
  "application/vnd.oasis.opendocument.presentation": "fa-file-powerpoint-o",
  "text/plain": "fa-file-text-o",
  "text/html": "fa-file-code-o",
  "application/json": "fa-file-code-o",
  // Archives
  "application/gzip": "fa-file-archive-o",
  "application/zip": "fa-file-archive-o",
};

debug = {};
Object.defineProperty(debug, "about", {
  get: function () {
    console.log(
      "%c Workflow:\t%c" +
        mappedData.workflow.name +
        " %c(ID: " +
        mappedData.workflow.instance.workflow_id +
        ")",
      "color: #d85e16",
      "color: #aaa",
      "color: #aaa"
    );
    console.log(
      "%c Instance:\t%c" +
        mappedData.workflow.instance.name +
        " %c(ID: " +
        mappedData.workflow.instance.id +
        ")",
      "color: #d85e16",
      "color: #aaa",
      "color: #aaa"
    );
    console.log(
      "%c Version:\t%c" +
        (mappedData.workflow.instance.version_id || "Latest") +
        " %c(Using ID: " +
        mappedData.workflow.instance.version.id +
        ")  %cUpdated  %c" +
        mappedData.workflow.instance.updated_at,
      "color: #d85e16",
      "color: #aaa",
      "color: #aaa",
      "color: #d85e16",
      "color: #aaa"
    );
  },
  configurable: false,
});
Object.defineProperty(debug, "summary", {
  get: function () {
    console.log(
      "%c Status:\t\t%c" + mappedData.status,
      "color: #d85e16",
      "color: #aaa"
    );
    console.log(
      "%c State:\t\t\t%c" + mappedData.state,
      "color: #d85e16",
      "color: #aaa"
    );

    if (typeof gform.instances.display !== "undefined") {
      console.log(
        "%c _flowstate:\t%c" + gform.instances.display.get("_flowstate"),
        "color: #d85e16",
        "color: #aaa"
      );
      console.log("%c Current Form Data:", "color: #0088FF");
      console.log(gform.instances.display.get("_state"));
    }
    console.log("%c Template Data:", "color: #0088FF");
    console.log(mappedData);
  },
  configurable: false,
});
Object.defineProperty(debug, "form", {
  get: function () {
    if (typeof gform.instances.display !== "undefined") {
      return gform.instances.display;
    }
  },
  configurable: false,
});
Object.defineProperty(debug, "data", {
  get: function () {
    return mappedData;
  },
  configurable: false,
});
Object.defineProperty(debug, "history", {
  get: function () {
    console.table(
      _.map(mappedData.history, function (item) {
        // item = _.omit(item,'is','log','file','data','date');
        item.owner = item.user.first_name + " " + item.user.last_name;
        item.created_at = item.created_at.date + " " + item.created_at.time;
        item.updated_at = item.updated_at.date + " " + item.updated_at.time;
        if (item.assignemnt.type == "group") {
          item.assignemnt = "Group:" + item.assignemnt.id;
        } else {
          item.assignemnt = "User:" + item.assignemnt.id;
        }
        item.actor = item.actor.first_name + " " + item.actor.last_name;
        item.previous = item.state + "(" + item.status + ")";

        // item.user = item.user.first_name+' '+item.user.last_name;
        return _.omit(item, "is", "log", "file", "data", "date", "user");
      })
    );
  },
  configurable: false,
});
Object.defineProperty(window, "help", {
  get: function () {
    console.log(
      "%c debug.about\t%c - info about the workflow configuration",
      "color: #0088FF",
      "color: #aaa"
    );
    console.log(
      "%c debug.summary\t%c - summary",
      "color: #0088FF",
      "color: #aaa"
    );
    console.log(
      "%c debug.form\t\t%c - reference to the displayed form",
      "color: #0088FF",
      "color: #aaa"
    );
    console.log(
      "%c debug.data\t\t%c - template data",
      "color: #0088FF",
      "color: #aaa"
    );
    console.log(
      "%c debug.history\t%c - template data",
      "color: #0088FF",
      "color: #aaa"
    );
  },
  configurable: false,
});

Object.defineProperty(debug, "instance", {
  get: function () {
    return cb.collections[0].getItems()[0];
  },
  configurable: false,
});
Object.defineProperty(debug, "app", {
  get: function () {
    return cb.collections[0].getItems()[0].appEngine;
  },
  configurable: false,
});
Object.defineProperty(debug, "workflow", {
  get: function () {
    return cb.collections[0].getItems()[0];
  },
  configurable: false,
});

Object.defineProperty(debug, "state", {
  get: () => {
    return window.localStorage.getItem("debug") == "true";
  },
  set: value => {
    value += "";
    if (window.localStorage.getItem("debug") !== value) {
      window.localStorage.setItem("debug", value);
      $g.emit("debug", { state: value == "true" });
    }
  },
  configurable: false,
});
if (debug.state) {
  // && typeof resource_type !== 'undefined' && resource_type == 'app'){
  window.addEventListener("error", function (event) {
    $g.alert({ content: event.message, title: "ERROR", status: "error" });
  });
}

gform.types["textarea"] = _.extend({}, gform.types["textarea"], {
  focus: function (timeout) {
    //   .focus();
    window.setTimeout(
      function () {
        if (
          this.el.querySelector('textarea[name="' + this.name + '"]') !==
            null &&
          typeof this.el.querySelector('textarea[name="' + this.name + '"]')
            .focus == "function"
        ) {
          this.el.querySelector('textarea[name="' + this.name + '"]').focus();
          var temp = this.value;
          this.set("");
          this.set(temp);
        }
      }.bind(this),
      timeout || 0
    );

    //   this.el.querySelector('[name="'+this.name+'"]').select();
  },
});
gform.stencils.ace = `
<div class="row clearfix form-group" name="{{name}}">
	{{>_label}}
	{{#label}}
	{{#inline}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
	{{^inline}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
	{{/label}}
		<div class="formcontrol"><div placeholder="{{placeholder}}" style="min-height: 250px;outline:none;border:solid 1px #cbd5dd;{{^unstyled}}background:#fff;padding:10px{{/unstyled}}" id="{{id}}container"></div></div>
	</div>
</div>`;
gform.types["ace"] = _.extend({}, gform.types["input"], {
  create: function () {
    var tempEl = document.createElement("span");
    tempEl.setAttribute("id", this.id);
    if (this.owner.options.clear) {
      tempEl.setAttribute("class", "" + gform.columnClasses[this.columns]);
    }
    tempEl.innerHTML = this.render();
    return tempEl;
  },
  // render:function(){
  //   return gform.render('textarea',this)
  // },
  initialize: function () {
    //   this.iel = this.el.querySelector('input[name="' + this.name + '"]')
    //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
    this.onchangeEvent = function (input) {
      //   this.input = input;
      // this.value = this.get();
      if (this.el.querySelector(".count") != null) {
        var text = this.value.length;
        if (this.limit) {
          text += "/" + this.limit;
        }
        this.el.querySelector(".count").innerHTML = text;
      }
      //   this.update({value:this.get()},true);
      //   gform.types[this.type].focus.call(this)
      this.owner.trigger(
        ["change:" + this.name, "change", "input:" + this.name, "input"],
        this,
        { input: this.value }
      );

      //   this.owner.pub('change:'+this.name, this,{input:this.value});
      //   this.owner.pub('change', this,{input:this.value});
      //   this.owner.pub('input:'+this.name, this,{input:this.value});
      //   this.owner.pub('input', this,{input:this.value});
    }.bind(this);
    this.input = this.input || false;
    // this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

    // this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
    this.editor = ace.edit(this.el.querySelector("#" + this.id + "container"));
    this.editor.setTheme(this.item.theme || "ace/theme/chrome");
    this.editor.getSession().setMode({
      path:
        this.owner.options.default.mode ||
        this.item.mode ||
        "ace/mode/handlebars",
      inline: this.owner.options.default.inlinemode || this.item.inlinemode,
    });
    this.editor.session.setValue(this.value || "");
    this.editor.on("change", this.onchangeEvent.bind(null, false));
  },
  // update: function(item, silent) {
  //   if(typeof item !== 'undefined' && (
  //       typeof item.options !== undefined ||
  //       typeof item.max !== undefined ||
  //       typeof item.action !== undefined
  //       )
  //       && typeof this.mapOptions !== 'undefined'){
  //       delete this.mapOptions;
  //       this.item = _.defaults({},item,this.item);

  //       // this.item.options = _.assign([],this.item.options,item.options);
  //       this.options = _.extend([],this.item.options);
  //       this.max = this.item.max;
  //       this.min = this.item.min;
  //       this.path = this.item.path;
  //       this.action = this.item.action;
  //   }
  //   // else if(typeof this.mapOptions !== 'undefined'){
  //   // }
  //   if(typeof item === 'object') {
  //       _.extend(item,this);
  //   }
  //   this.label = gform.renderString((item||{}).label||this.item.label, this);

  //   // var oldDiv = document.getElementById(this.id);
  //   // var oldDiv = this.owner.el.querySelector('#'+this.id);
  //   var oldDiv = this.el;
  //   this.destroy();
  //   this.el = gform.types[this.type].create.call(this);
  //   oldDiv.parentNode.replaceChild(this.el,oldDiv);
  //   gform.types[this.type].initialize.call(this);

  //   if(!silent) {
  //       this.owner.pub(['change:'+this.name,'change'], this);
  //   }
  //   if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}

  // },
  set: function (value) {
    this.editor.session.setValue(value);
  },
  get: function () {
    return typeof this.editor == "undefined"
      ? this.value
      : this.editor.getValue();
  },
  focus: function () {
    this.editor.focus();
  },
});

gform.types["smallcombo"] = gform.types["combobox"];
gform.types["user"] = _.extend({}, gform.types["combobox"], {
  toString: function (name, display) {
    if (!display) {
      if (typeof this.combo !== "undefined") {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          (this.combo.innerText || "(empty)") +
          "</dd><hr>"
        );
      } else {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          (this.get() || "(empty)") +
          "</dd><hr>"
        );
      }
    } else {
      if (typeof this.options !== "undefined" && this.options.length) {
        return _.find(this.options, { unique_id: this.value }) || this.value;
      } else {
        return this.value;
      }
    }
  },
  defaults: {
    strict: true,
    search: "/api/users/search/{{search}}{{value}}",
    format: {
      title:
        "{{{label}}}{{^label}}User{{/label}}<span class='text-success pull-right'>{{value}}</span>",
      label: "{{first_name}}{{#last_name}} {{last_name}}{{/last_name}}",
      value: "{{unique_id}}",
      display:
        "{{first_name}} {{last_name}}<div style='color:#aaa'>{{email}}</div>",
    },
  },
});
gform.types["user_id"] = _.extend({}, gform.types["combobox"], {
  toString: function (name, display) {
    if (!display) {
      if (typeof this.combo !== "undefined") {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          (this.combo.innerText || "(empty)") +
          "</dd><hr>"
        );
      } else {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          (this.get() || "(empty)") +
          "</dd><hr>"
        );
      }
    } else {
      if (typeof this.options !== "undefined" && this.options.length) {
        return _.find(this.options, { id: this.value }) || this.value;
      } else {
        return this.value;
      }
    }
  },
  defaults: {
    strict: true,
    search: "/api/users/search/{{search}}{{value}}",
    format: {
      title:
        '{{{label}}}{{^label}}User{{/label}}<span class="text-success pull-right">{{value}}</span>',
      label: "{{first_name}}{{#last_name}} {{last_name}}{{/last_name}}",
      value: function (item) {
        return item.id;
      },
      display:
        '{{first_name}} {{last_name}}<div style="color:#aaa">{{email}}</div>',
    },
    template:
      "{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}",
  },
});
gform.types["user_email"] = _.extend({}, gform.types["user"], {
  toString: function (name, display) {
    if (!display) {
      if (typeof this.combo !== "undefined") {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          (this.combo.value || "(empty)") +
          "</dd><hr>"
        );
      } else {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          (this.get() || "(empty)") +
          "</dd><hr>"
        );
      }
    } else {
      if (typeof this.options !== "undefined" && this.options.length) {
        return _.find(this.options, { unique_id: this.value }) || this.value;
      } else {
        return this.value;
      }
    }
  },
  defaults: {
    strict: true,
    search: "/api/users/search/{{search}}{{value}}",
    format: {
      title:
        '{{{label}}}{{^label}}User{{/label}}<span class="text-success pull-right">{{value}}</span>',
      label: "{{first_name}}{{#last_name}} {{last_name}}{{/last_name}}",
      value: "{{email}}",
      display:
        '{{first_name}} {{last_name}}<div style="color:#aaa">{{email}}</div>',
    },
  },
});
gform.types["group"] = _.extend({}, gform.types["combobox"], {
  toString: function (name, display) {
    if (!display) {
      if (typeof this.combo !== "undefined") {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          (this.combo.innerText || "(empty)") +
          "</dd><hr>"
        );
      } else {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          (this.get() || "(empty)") +
          "</dd><hr>"
        );
      }
    } else {
      if (typeof this.options !== "undefined" && this.options.length) {
        return _.find(this.options, { id: parseInt(this.value) }) || this.value;
      } else {
        return this.value;
      }
    }
  },
  defaults: {
    template: "{{display.group_id}}",
    options: "/api/groups?members=20",
    format: {
      title:
        '{{{label}}}{{^label}}Group{{/label}} <span class="text-success pull-right">{{value}}</span>',
      label: "{{name}}",
      value: "{{id}}",
    },
  },
});
gform.types["files"] = _.extend({}, gform.types["combobox"], {
  toString: function (name, display) {
    if (!display) {
      if (typeof this.combo !== "undefined") {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          (this.combo.innerText || "(empty)") +
          "</dd><hr>"
        );
      } else {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          (this.get() || "(empty)") +
          "</dd><hr>"
        );
      }
    } else {
      return _.find(this.options, { id: parseInt(this.value) }) || {};
    }
  },
  defaults: {
    options: "files",
    strict: true,
    custom: {
      name: "addFile",
      display:
        '<div style="line-height:50px"><span class="label label-success">Upload New File</span> <span class="pull-right"><i class="fa fa-upload"></i></span></div>',
      action: function (e) {
        document.querySelector("#uploader_" + e.form.options.id).click();
      },
    },
    format: {
      title:
        '<i class="fa fa-paperclip"></i> {{{label}}}{{^label}}Attachement{{/label}}',
      label: "{{name}}",
      value: "{{id}}",
      display:
        '<div style="height:50px;padding-left:60px;position:relative" href="{{path}}" target="_blank"><div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}background-image: url({{path}});background-size: contain;background-repeat: no-repeat;background-position: center;{{/icon}}position:absolute;top:0px;left:5px">{{{icon}}}</div> {{name}} <span class="pull-right">{{date}}</span></div>',
    },
  },
});
gform.types["endpoint"] = {
  ...gform.types["combobox"],
  defaults: {
    label: true,
    options: [
      { id: "none", name: "None" },
      { type: "optgroup", options: "endpoints" },
    ],
    format: {
      label: "{{name}}",
      value: "{{id}}",
      display:
        '<dl class="dl-horizontal" style="margin-bottom:0"><dt>Name:</dt><dd>{{name}}</dd>{{#config}}<dt>URL:</dt><dd>{{url}}</dd><dt>User:</dt><dd>{{username}}</dd>{{/config}}{{^config}}<dt></dt><dd>No Endpoint will be used{{/config}}</dd></dl>',
    },
  },
  setLabel() {
    gform.toggleClass(this.labelEl, "required", this.required);
    this.label = this.owner.options.data.resources[this.parent.index].name;
    this.labelEl.innerHTML =
      this.owner.options.data.resources[this.parent.index].name + this.suffix;
  },
  render: function () {
    if (typeof this.mapOptions == "undefined") {
      this.mapOptions = new gform.mapOptions(
        this,
        this.value,
        0,
        this.owner.collections
      );
      this.mapOptions.on(
        "change",
        function () {
          this.options = this.mapOptions.getoptions();
          if (this.shown) {
            this.renderMenu();
          }
          if (typeof this.value !== "undefined") {
            gform.types[this.type].set.call(this, this.value);
          }
        }.bind(this)
      );
    }
    this.options = this.mapOptions.getoptions();
    this.internalValue = this.value || "";
    this.help =
      (
        $g.collections
          .get("endpoints")
          .find(endpoint => endpoint.id == this.value) || {
          config: { url: "" },
        }
      ).config.url +
      (
        this.owner.options.data.resources.find(
          resource =>
            resource.name ==
            this.owner.options.data.resources[this.parent.index].name
        ) || { path: "" }
      ).path;

    return gform.render("combobox", this);
  },
};

gform.stencils.signature = gform.stencils.signaturePad = `
<style>.signaturePad-canvas{border:solid 1px #bbb;} 
.has-error .signaturePad-canvas{border-color:red;}</style>
<div class="row clearfix form-group {{modifiers}} data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
    {{/label}}
    <canvas class="signaturePad-canvas" width="567" height="200"></canvas>
	<div class="">
		<div class="input-group" style="width:100%" contentEditable="false"> 
        </div>
        <center style="color:#888"> {{{help}}}{{^help}}Sign Above{{/help}}</center>
        <span class="font-xs text-danger" style="display:block;"></span>
		{{>_actions}}
	</div>
</div>`;
gform.types["signature"] = gform.types["signaturePad"] = _.extend(
  {},
  gform.types["input"] /*, gform.types['collection']*/,
  {
    // base:'input',
    set: function (value) {
      if (typeof value == "undefined" || value == null) {
        this.signaturePad.clear();
      } else {
        this.signaturePad.fromData(value);
      }
    },
    toString: function (name, report) {
      if (!report) {
        return (
          "<dt>" +
          this.label +
          '</dt> <dd><img src="' +
          this.signaturePad.toDataURL() +
          '" alt="(Empty)"/></dd><hr>'
        );
      } else {
        return this.signaturePad.toDataURL();
      }
    },
    get: function () {
      if (!("el" in this)) {
        return this.internalValue;
      }

      // return '<img src='+( this.signaturePad.toDataURL("image/svg+xml"))+' alt="(Empty)" style="border:solid 1px"/>'
      // return '<img src='+( this.signaturePad.toDataURL())+' alt="(Empty)"/>'
      return this.signaturePad.toDataURL();

      // return  this.signaturePad.toData();
    },
    resizeCanvas: function () {
      // This part causes the canvas to be cleared
      this.canvas.width = this.el.offsetWidth
        ? this.el.offsetWidth - 32
        : this.canvas.width;

      // This library does not listen for canvas changes, so after the canvas is automatically
      // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
      // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
      // that the state of this library is consistent with visual state of the canvas, you
      // have to clear it manually.
      this.signaturePad.clear();
    },
    initialize: function () {
      this.canvas = this.el.querySelector("canvas.signaturePad-canvas");

      this.signaturePad = new SignaturePad(this.canvas, {
        onEnd: function (e) {
          this.owner.trigger("input");
        }.bind(this),
        onBegin: function (e) {
          this.owner.trigger("change");
        }.bind(this),
      });
      window.onresize = gform.types["signaturePad"].resizeCanvas.bind(this);
      setTimeout(gform.types["signaturePad"].resizeCanvas.bind(this), 200);

      // this.owner.on('initialized', function(f) {
      //   gform.types['signaturePad'].resizeCanvas.call(f);
      // }.bind(null,this));
      gform.types[this.type].setLabel.call(this);
    },
    satisfied: function () {
      return !this.signaturePad.isEmpty();
    },
    focus: function () {},
  }
);

gform.stencils.base64_file = `
<style>
  .files .badge{position:absolute;right:10px;bottom:10px;overflow:hidden;text-overflow:ellipsis;max-width:50%}
  .files .badge:hover{max-width:fit-content}
  </style>
<div class="row clearfix form-group {{modifiers}}" data-type="{{type}}">
  {{>_label}}
  {{#label}}
  {{^horizontal}}<div class="col-md-12">{{/horizontal}}
  {{#horizontal}}<div class="col-md-8">{{/horizontal}}
  {{/label}}
  {{^label}}
  <div class="col-md-12">
  {{/label}}
    {{#pre}}<div class="input-group col-md-12"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
    {{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
      {{#multiple}}
      <small class="count text-muted pull-left" style="display:block;text-align:left;margin:5px">0/{{max}}</small>

      <div style="overflow:hidden;margin-bottom: 10px;"><div class="btn-group pull-right" role="group" aria-label="...">
        <button type="button" class="btn btn-danger gform-clear-all" {{^value}}disabled{{/value}}><i class="fa fa-times"></i> Clear</button>
      </div></div>
      {{/multiple}}
      <div class="dropzone dz-clickable" id="{{id}}"><div class="dz-message">Drop files here to upload</div>
      </div>

      <ul class="files list-group" style="border: none;margin: 0;padding: 0;min-height:0">
      </ul>
    {{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
    {{^post}}{{#pre}}</div>{{/pre}}{{/post}}

    {{>_addons}}
    {{>_actions}}
  </div>
</div>
`;
gform.stencils.base64_file_preview = `<li class="list-group-item ">
  <div><div class="btn-group pull-right hidden-print" role="group" aria-label="...">
        <button type="button" class="btn btn-danger gform-remove" title="Remove"><i class="fa fa-times"></i></button>
        <button type="button" class="btn btn-info gform-replace" title="Replace"><i class="fa fa-refresh"></i></button>
      </div></div>
      <span class="badge">{{name}}</span>
      <div style="background: #eee;text-align: center;line-height: 120px;border-radius: 20px;overflow: hidden;width: 120px;height: 120px;">{{#icon}}
      <i class="fa {{{icon}}} fa-3x" style="padding-top: 4px;"></i>
      {{/icon}}{{^icon}}<img data-dz-thumbnail /></div>\n {{/icon}} </div></li>`;
if (typeof Dropzone !== "undefined") Dropzone.autoDiscover = false;

gform.types.base64_file = _.extend(
  {},
  gform.types["input"],
  gform.types["collection"],
  {
    focus: function () {
      // var e = this.name;
      // this.multiple && (e += "[]"),
      // this.el.querySelector('[name="' + e + '"]').focus()
    },
    setup: function () {
      if (
        this.multiple &&
        typeof this.limit !== "undefinded" &&
        this.limit > 1
      ) {
        gform.types.base64_file.updateStatus.call(this, true);
      }

      this.labelEl = this.el.querySelector("label");
      gform.types[this.type].setLabel.call(this);
      this.infoEl = this.el.querySelector(".gform-info");
    },
    defaults: { format: { uri: "{{{name}}}", options: [] } },
    dataURItoBlob: function (dataURI) {
      "use strict";
      var byteString, mimestring;

      if (dataURI.split(",")[0].indexOf("base64") !== -1) {
        byteString = atob(dataURI.split(",")[1]);
      } else {
        byteString = decodeURI(dataURI.split(",")[1]);
      }

      mimestring = dataURI.split(",")[0].split(":")[1].split(";")[0];

      var content = new Array();
      for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i);
      }

      return new Blob([new Uint8Array(content)], { type: mimestring });
    },
    updateStatus: function (silent) {
      if (!silent) this.trigger("input", this);
      if (this.multiple)
        this.el.querySelector(".gform-clear-all").disabled =
          !this.Dropzone.files.length;

      if (this.Dropzone.files.length >= (this.multiple ? this.limit : 1)) {
        setTimeout(() => {
          this.Dropzone.disable();
        }, 50);
        gform.addClass(this.el.querySelector(".dropzone"), "hidden");
      } else {
        this.Dropzone.enable();
        gform.removeClass(this.el.querySelector(".dropzone"), "hidden");
      }
      if (this.el.querySelector(".count") != null) {
        var text = this.value.length;
        if (this.limit > 1) {
          text += "/" + this.limit;
        }
        this.el.querySelector(".count").innerHTML = text;
      }
    },
    set: function (value) {
      if (typeof value !== "object") return;
      isDataURLregex =
        /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
      if (this.multiple) {
        if (typeof value == "object" && !_.isArray(value)) {
          value = [value];
        }
        value = this.internalValue = value || [];
      } else {
        value = this.internalValue = value || {};
      }
      var _this = this;
      _.each(this.multiple ? value : [value], function (value) {
        if (!_.isEmpty(value)) {
          if (
            typeof value.dataURI == "string" &&
            !!value.dataURI.match(isDataURLregex)
          ) {
            var mockFile = gform.types.base64_file.dataURItoBlob(
              value.dataURI,
              value.name
            );
            // mockFile.contents = value.dataURI;
            mockFile.name = value.name;
            _this.Dropzone.addFile(mockFile);
          } else if (typeof value == "object") {
            var mockFile = value;
            mockFile.name = value.name || value.dataURI;
            _this.Dropzone.displayExistingFile(
              mockFile,
              gform.m(_this.format.uri, value)
            );
            _this.Dropzone.files.push(mockFile);
          }
        }
      });
    },
    destroy: function () {
      this.Dropzone.destroy();
    },
    get: function () {
      if (!("el" in this)) {
        return this.internalValue;
      }

      if (this.Dropzone.files.length) {
        var val = _.reduce(
          this.Dropzone.files,
          function (obj, file) {
            if (file instanceof Blob) {
              var temp = _.pick(file, "type", "name", "dataURI");
              temp.dataURI = temp.dataURI; //||file.contents;
              temp.name = temp.name || file.upload.uuid;
            } else {
              var temp = _.pick(file, "name", "type");
              temp.dataURI = file.dataURL;
            }
            obj.push(temp);
            return obj;
          },
          []
        );
        if (this.multiple) {
          this.internalValue = val || [];
        } else {
          this.internalValue = val[0] || this.value;
        }
      } else {
        this.internalValue = this.multiple ? [] : {};
      }
      return this.internalValue;
    },
    assignIcon: file => {
      if (typeof file.type !== "undefined") {
        switch (file.type) {
          case "image/jpeg":
          case "image/png":
          case "image/jpg":
          case "image/gif":
            if (typeof file.dataURI !== "undefined") {
              var memoryImg = document.createElement("img");
              memoryImg.src = file.dataURI;
              if (memoryImg.width < memoryImg.height) {
                file.width = 120;
                file.top =
                  ((120 / memoryImg.width) * memoryImg.height - 120) * -0.5;
              } else {
                file.height = 120;
                file.left =
                  ((120 / memoryImg.height) * memoryImg.width - 120) * -0.5;
              }
            }
            break;
          default:
            // var icon = ;
            file.icon =
              mime_icons[file.type] ||
              mime_icons[file.type.split("/")[0]] ||
              mime_icons[file.ext] ||
              "fa-file-o";
        }

        // if(file.ext == "pdf"){
        //   file.preview = '<iframe width="100%" height="'+($( document ).height()-$('.report').position().top-100)+'px" src="'+file.path+'"></iframe>';
        // }
      }
      return file;
    },
    toString: function (name, report) {
      this.internalValue = this.get();
      if (!report) {
        this.internalValue = this.multiple
          ? _.map(this.value, gform.types.base64_file.assignIcon)
          : gform.types.base64_file.assignIcon(this.value);
        return gform.renderString(
          this.limit > 1
            ? `
      <dt>{{label}}</dt> <dd style="min-height:30px">
      {{#value}}
      <hr>
      <a href="{{dataURI}}" download="{{name}}" class="btn btn-default pull-right">{{name}} <i class="fa fa-download text-primary txt-primary"></i></a>
      <!--span class="badge pull-right">{{name}}{{^name}}<span class="text-muted">(empty)</span>{{/name}}</span>-->
      {{#dataURI}}
      <div style="margin:15px 0;background: #eee;text-align: center;line-height: 120px;border-radius: 20px;overflow: hidden;width: 120px;height: 120px;">
        {{#icon}}<i class="fa {{{icon}}} fa-3x" style="padding-top: 4px;"></i>{{/icon}}
        {{^icon}}<img height="{{height}}" width="{{width}}" style="position:relative;top:{{top}}px;left:{{left}}px;" src="{{dataURI}}"/></div>{{/icon}}
      {{/dataURI}} 
      {{/value}}
      {{^value.length}}
      <span class="text-muted">(empty)</span>
      {{/value.length}}
      </dd><hr>`
            : `<dt>{{label}}</dt> <dd style="min-height:30px">
      {{#value.name}}
      {{#value}}
      <hr>
      {{#dataURI}}
      <a href="{{dataURI}}" download="{{name}}" class="btn btn-default pull-right">{{name}} <i class="fa fa-download text-primary txt-primary"></i></a>
      <!--span class="badge pull-right">{{name}}{{^name}}<span class="text-muted">(empty)</span>{{/name}}</span>-->
      <div style="margin:15px 0;background: #eee;text-align: center;line-height: 120px;border-radius: 20px;overflow: hidden;width: 120px;height: 120px;">
        {{#icon}}<i class="fa {{{icon}}} fa-3x" style="padding-top: 4px;"></i>{{/icon}}
        {{^icon}}<img height="{{height}}" width="{{width}}" style="position:relative;top:{{top}}px;left:{{left}}px;" src="{{dataURI}}"/></div>{{/icon}}
      {{/dataURI}} 
      {{/value}}
      {{/value.name}}
      {{^value.name}}
      <span class="text-muted">(empty)</span>
      {{/value.name}}
      </dd><hr>`,
          this
        );
      } else {
        // return gform.m('<dt>{{label}}</dt> <dd>{{#value}}<div>{{#dataURI}}<img height=75px src="{{dataURI}}"/>{{/dataURI}} {{name}}{{^name}}<span class="text-muted">(empty)</span>{{/name}}</div>{{/value}}</dd><hr>', this)

        return this.value;
      }
    },
    satisfied: function (value) {
      value = value || this.value;
      if (_.isArray(value)) {
        return !!value.length;
      }
      return (
        typeof value !== "undefined" &&
        value !== null &&
        value !== "" &&
        !(typeof value == "number" && isNaN(value)) &&
        !_.isEmpty(value)
      );
    },
    initialize: function () {
      this.el.querySelector("#" + this.id + ".dropzone .dz-message").innerHTML =
        this.item.format && this.item.format.message
          ? this.item.format.message
          : $g.render(
              "Drop files here to upload to {{label}}",
              _.pick(this, "label")
            );
      var onError = function (data) {
        this.trigger("change", this, data);
        this.trigger("error", this, data);
        this.trigger("input", this, data);
      }.bind(this);
      var onSuccess = function (data) {
        this.trigger("change", this, data);
        this.trigger("success", this, data);
        this.trigger("input", this, data);
      }.bind(this);
      this.Dropzone = new Dropzone(
        this.el.querySelector("#" + this.id + ".dropzone"),
        {
          addedfile: function (file) {
            var data = this.options.formelement.get();
            if (this.options.formelement.multiple) {
              data = data[this.files.indexOf(file)];
            } else {
            }

            data = _.extend(data, file);

            if (typeof data.type !== "undefined") {
              switch (data.type) {
                case "image/jpeg":
                case "image/png":
                case "image/jpg":
                case "image/gif":
                  // file.preview = '<div style="text-align:center;padding:10px;"><img style="max-width:100%" src="'+file.path+'"/></div>';
                  break;
                default:
                  // var icon = ;
                  data.icon =
                    mime_icons[data.type] ||
                    mime_icons[data.type.split("/")[0]] ||
                    mime_icons[data.ext] ||
                    "fa-file-o";
              }

              // if(file.ext == "pdf"){
              //   file.preview = '<iframe width="100%" height="'+($( document ).height()-$('.report').position().top-100)+'px" src="'+file.path+'"></iframe>';
              // }
            }
            file.previewElement = Dropzone.createElement(
              gform.render("base64_file_preview", data)
            );

            var _this = this;

            file.previewElement
              .querySelector(".gform-remove")
              .addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Remove the file preview.
                _this.removeFile(file);

                gform.types.base64_file.updateStatus.call(
                  _this.options.formelement
                );
              });

            file.previewElement
              .querySelector(".gform-replace")
              .addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Remove the file preview.

                _this.enable();

                _this.clickableElements[0].click();

                _this.options.formelement.replaceIndex =
                  _this.files.indexOf(file);
                _this.options.formelement.replaceFile = file;
                gform.types.base64_file.updateStatus.call(
                  _this.options.formelement,
                  true
                );
              });
            this.options.formelement.el
              .querySelector("ul.files")
              .append(file.previewElement);
          },
          formelement: this,
          queuecomplete: gform.types.base64_file.updateStatus.bind(this),
          accept: function (file, done) {
            if (this.options.formelement.replaceIndex !== null) {
              // if(typeof this.options.formelement.replaceFile !== 'undefined'){
              this.removeFile(this.options.formelement.replaceFile);
              clearReplace();
              // }
            }

            if (
              this.files.length >
              (this.options.formelement.multiple
                ? this.options.formelement.limit
                : 1)
            ) {
              this.removeFile(file);

              done("Max files reached");
            }
            // this._uploadData = function(){}
            this._sendIntercept(file)
              .then(result => {
                file.dataURI = result;
                if (typeof this.localSuccess === "function") {
                  this.localSuccess(file, done);
                } else {
                  done(); // empty done signals success
                }
              })
              .catch(result => {
                if (typeof this.localFailure === "function") {
                  file.dataURI = result;
                  this.localFailure(file, done);
                } else {
                  if (typeof this.localFailure === "string") {
                    done(this.localFailure);
                  } else {
                    done(`Failed to upload file ${file.name}`);
                    console.warn(file);
                  }
                }
              });
          },
          url: "#",
          timeout: 60000,
          uploadMultiple: false /*,maxFiles:(this.multiple?this.multiple.max:1)*/,
          init: function (field) {
            this.submitRequest = function (xhr, formData, files) {
              files = _.each(files, function (file) {
                files.status =
                  files.status == "uploading" ? "success" : file.status;
              });
              this._finished(files);
            };
            this._sendIntercept = function (file, options = {}) {
              return new Promise((resolve, reject) => {
                if (!options.readType) {
                  options.readType = _.reduce(
                    [
                      "text/*",
                      "application/xml",
                      "application/x-sh",
                      "application/x-script",
                      "image/svg+xml",
                    ],
                    function (result, type) {
                      const re = new RegExp(type);
                      return result || re.test(file.type);
                    },
                    false
                  )
                    ? "readAsText"
                    : "readAsDataURL";
                }
                let reader = new window.FileReader();

                reader.onload = () => {
                  resolve(reader.result);
                };
                reader.onerror = () => {
                  reject(reader.result);
                };

                // run the reader
                reader[options.readType](file);
              });
            };
            this.localSuccess = function (file, done) {
              onSuccess(file);
              done();
            };
            this.localFailure = function (file, done) {
              onError(file);
            };
          },
        }
      );

      this.replaceIndex = null;
      clearReplace = function () {
        this.replaceIndex = null;
        delete this.replaceFile;
      }.bind(this);
      this.Dropzone.hiddenFileInput.onclick = clearReplace;
      this.Dropzone.on("drop", clearReplace);

      this.el.addEventListener(
        "click",
        function (e) {
          if (e.target.classList.contains("disabled")) {
            return;
          }
          if (e.target.classList.contains("gform-clear-all")) {
            this.Dropzone.removeAllFiles();
            gform.types.base64_file.updateStatus.call(this);
          }
        }.bind(this)
      );
      gform.types.base64_file.set.call(this, this.value);
      gform.types.base64_file.setup.call(this);
    },
  }
);

gform.stencils.upload = `
<div class="row clearfix form-group {{modifiers}}" data-type="{{type}}">
  {{>_label}}
  {{#label}}
  {{^horizontal}}<div class="col-md-12">{{/horizontal}}
  {{#horizontal}}<div class="col-md-8">{{/horizontal}}
  {{/label}}
  {{^label}}
  <div class="col-md-12">
  {{/label}}
    {{#pre}}<div class="input-group col-md-12"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
    {{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
      <div class="dropzone" id="{{id}}">
      </div>
    {{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
    {{^post}}{{#pre}}</div>{{/pre}}{{/post}}

    {{>_addons}}
    {{>_actions}}
  </div>
</div>
`;
gform.types.upload = _.extend({}, gform.types["input"], {
  focus: function () {},
  defaults: { format: { uri: "{{{name}}}", options: [] } },

  set: function (value) {},
  get: function () {
    return this.value;
  },
  edit: function (state) {
    this.editable = state;
    this.el.querySelector('[id="' + this.id + '"].dropzone').disabled = !state;
  },
  toString: function (name, report) {
    if (!report) {
      return gform.m(
        '<dt>{{label}}</dt> <dd>{{#value.dataURI}}<img height=75px src="{{value.dataURI}}"/>{{/value.dataURI}} {{value.name}}{{^value.name}}<span class="text-muted">(empty)</span>{{/value.name}}</dd><hr>',
        this
      );
    } else {
      return this.value.dataURI;
    }
  },
  satisfied: function (value) {
    value = value || this.value;
    if (_.isArray(value)) {
      return !!value.length;
    }
    return (
      typeof value !== "undefined" &&
      value !== null &&
      value !== "" &&
      !(typeof value == "number" && isNaN(value)) &&
      !_.isEmpty(value)
    );
  },
  initialize: function () {
    this.Dropzone = new Dropzone(
      this.el.querySelector("#" + this.id + ".dropzone"),
      {
        url: this.item.path,
        method: "post",
        paramName: this.name,
        success: function (message, response) {
          this.trigger("uploaded", this, { response: response });
        }.bind(this),
      }
    );
  },
});
/*!
 * cleave.js - 1.6.0
 * https://github.com/nosir/cleave.js
 * Apache License Version 2.0
 *
 * Copyright (C) 2012-2020 Max Huang https://github.com/nosir/
 */
!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.Cleave = t())
    : (e.Cleave = t());
})(this, function () {
  return (function (e) {
    function t(i) {
      if (r[i]) return r[i].exports;
      var n = (r[i] = { exports: {}, id: i, loaded: !1 });
      return e[i].call(n.exports, n, n.exports, t), (n.loaded = !0), n.exports;
    }
    var r = {};
    return (t.m = e), (t.c = r), (t.p = ""), t(0);
  })([
    function (e, t, r) {
      (function (t) {
        "use strict";
        var i = function (e, t) {
          var r = this,
            n = !1;
          if (
            ("string" == typeof e
              ? ((r.element = document.querySelector(e)),
                (n = document.querySelectorAll(e).length > 1))
              : "undefined" != typeof e.length && e.length > 0
              ? ((r.element = e[0]), (n = e.length > 1))
              : (r.element = e),
            !r.element)
          )
            throw new Error("[cleave.js] Please check the element");
          if (n)
            try {
              console.warn(
                "[cleave.js] Multiple input fields matched, cleave.js will only take the first one."
              );
            } catch (a) {}
          (t.initValue = r.element.value),
            (r.properties = i.DefaultProperties.assign({}, t)),
            r.init();
        };
        (i.prototype = {
          init: function () {
            var e = this,
              t = e.properties;
            return t.numeral ||
              t.phone ||
              t.creditCard ||
              t.time ||
              t.date ||
              0 !== t.blocksLength ||
              t.prefix
              ? ((t.maxLength = i.Util.getMaxLength(t.blocks)),
                (e.isAndroid = i.Util.isAndroid()),
                (e.lastInputValue = ""),
                (e.isBackward = ""),
                (e.onChangeListener = e.onChange.bind(e)),
                (e.onKeyDownListener = e.onKeyDown.bind(e)),
                (e.onFocusListener = e.onFocus.bind(e)),
                (e.onCutListener = e.onCut.bind(e)),
                (e.onCopyListener = e.onCopy.bind(e)),
                e.initSwapHiddenInput(),
                e.element.addEventListener("input", e.onChangeListener),
                e.element.addEventListener("keydown", e.onKeyDownListener),
                e.element.addEventListener("focus", e.onFocusListener),
                e.element.addEventListener("cut", e.onCutListener),
                e.element.addEventListener("copy", e.onCopyListener),
                e.initPhoneFormatter(),
                e.initDateFormatter(),
                e.initTimeFormatter(),
                e.initNumeralFormatter(),
                void (
                  (t.initValue || (t.prefix && !t.noImmediatePrefix)) &&
                  e.onInput(t.initValue)
                ))
              : void e.onInput(t.initValue);
          },
          initSwapHiddenInput: function () {
            var e = this,
              t = e.properties;
            if (t.swapHiddenInput) {
              var r = e.element.cloneNode(!0);
              e.element.parentNode.insertBefore(r, e.element),
                (e.elementSwapHidden = e.element),
                (e.elementSwapHidden.type = "hidden"),
                (e.element = r),
                (e.element.id = "");
            }
          },
          initNumeralFormatter: function () {
            var e = this,
              t = e.properties;
            t.numeral &&
              (t.numeralFormatter = new i.NumeralFormatter(
                t.numeralDecimalMark,
                t.numeralIntegerScale,
                t.numeralDecimalScale,
                t.numeralThousandsGroupStyle,
                t.numeralPositiveOnly,
                t.stripLeadingZeroes,
                t.prefix,
                t.signBeforePrefix,
                t.tailPrefix,
                t.delimiter
              ));
          },
          initTimeFormatter: function () {
            var e = this,
              t = e.properties;
            t.time &&
              ((t.timeFormatter = new i.TimeFormatter(
                t.timePattern,
                t.timeFormat
              )),
              (t.blocks = t.timeFormatter.getBlocks()),
              (t.blocksLength = t.blocks.length),
              (t.maxLength = i.Util.getMaxLength(t.blocks)));
          },
          initDateFormatter: function () {
            var e = this,
              t = e.properties;
            t.date &&
              ((t.dateFormatter = new i.DateFormatter(
                t.datePattern,
                t.dateMin,
                t.dateMax
              )),
              (t.blocks = t.dateFormatter.getBlocks()),
              (t.blocksLength = t.blocks.length),
              (t.maxLength = i.Util.getMaxLength(t.blocks)));
          },
          initPhoneFormatter: function () {
            var e = this,
              t = e.properties;
            if (t.phone)
              try {
                t.phoneFormatter = new i.PhoneFormatter(
                  new t.root.Cleave.AsYouTypeFormatter(t.phoneRegionCode),
                  t.delimiter
                );
              } catch (r) {
                throw new Error(
                  "[cleave.js] Please include phone-type-formatter.{country}.js lib"
                );
              }
          },
          onKeyDown: function (e) {
            var t = this,
              r = e.which || e.keyCode;
            (t.lastInputValue = t.element.value), (t.isBackward = 8 === r);
          },
          onChange: function (e) {
            var t = this,
              r = t.properties,
              n = i.Util;
            t.isBackward =
              t.isBackward || "deleteContentBackward" === e.inputType;
            var a = n.getPostDelimiter(
              t.lastInputValue,
              r.delimiter,
              r.delimiters
            );
            t.isBackward && a
              ? (r.postDelimiterBackspace = a)
              : (r.postDelimiterBackspace = !1),
              this.onInput(this.element.value);
          },
          onFocus: function () {
            var e = this,
              t = e.properties;
            (e.lastInputValue = e.element.value),
              t.prefix &&
                t.noImmediatePrefix &&
                !e.element.value &&
                this.onInput(t.prefix),
              i.Util.fixPrefixCursor(
                e.element,
                t.prefix,
                t.delimiter,
                t.delimiters
              );
          },
          onCut: function (e) {
            i.Util.checkFullSelection(this.element.value) &&
              (this.copyClipboardData(e), this.onInput(""));
          },
          onCopy: function (e) {
            i.Util.checkFullSelection(this.element.value) &&
              this.copyClipboardData(e);
          },
          copyClipboardData: function (e) {
            var t = this,
              r = t.properties,
              n = i.Util,
              a = t.element.value,
              o = "";
            o = r.copyDelimiter
              ? a
              : n.stripDelimiters(a, r.delimiter, r.delimiters);
            try {
              e.clipboardData
                ? e.clipboardData.setData("Text", o)
                : window.clipboardData.setData("Text", o),
                e.preventDefault();
            } catch (l) {}
          },
          onInput: function (e) {
            var t = this,
              r = t.properties,
              n = i.Util,
              a = n.getPostDelimiter(e, r.delimiter, r.delimiters);
            return (
              r.numeral ||
                !r.postDelimiterBackspace ||
                a ||
                (e = n.headStr(e, e.length - r.postDelimiterBackspace.length)),
              r.phone
                ? (!r.prefix || (r.noImmediatePrefix && !e.length)
                    ? (r.result = r.phoneFormatter.format(e))
                    : (r.result =
                        r.prefix +
                        r.phoneFormatter.format(e).slice(r.prefix.length)),
                  void t.updateValueState())
                : r.numeral
                ? (r.prefix && r.noImmediatePrefix && 0 === e.length
                    ? (r.result = "")
                    : (r.result = r.numeralFormatter.format(e)),
                  void t.updateValueState())
                : (r.date && (e = r.dateFormatter.getValidatedDate(e)),
                  r.time && (e = r.timeFormatter.getValidatedTime(e)),
                  (e = n.stripDelimiters(e, r.delimiter, r.delimiters)),
                  (e = n.getPrefixStrippedValue(
                    e,
                    r.prefix,
                    r.prefixLength,
                    r.result,
                    r.delimiter,
                    r.delimiters,
                    r.noImmediatePrefix,
                    r.tailPrefix,
                    r.signBeforePrefix
                  )),
                  (e = r.numericOnly ? n.strip(e, /[^\d]/g) : e),
                  (e = r.uppercase ? e.toUpperCase() : e),
                  (e = r.lowercase ? e.toLowerCase() : e),
                  r.prefix &&
                  (r.tailPrefix ? (e += r.prefix) : (e = r.prefix + e),
                  0 === r.blocksLength)
                    ? ((r.result = e), void t.updateValueState())
                    : (r.creditCard && t.updateCreditCardPropsByValue(e),
                      (e = n.headStr(e, r.maxLength)),
                      (r.result = n.getFormattedValue(
                        e,
                        r.blocks,
                        r.blocksLength,
                        r.delimiter,
                        r.delimiters,
                        r.delimiterLazyShow
                      )),
                      void t.updateValueState()))
            );
          },
          updateCreditCardPropsByValue: function (e) {
            var t,
              r = this,
              n = r.properties,
              a = i.Util;
            a.headStr(n.result, 4) !== a.headStr(e, 4) &&
              ((t = i.CreditCardDetector.getInfo(e, n.creditCardStrictMode)),
              (n.blocks = t.blocks),
              (n.blocksLength = n.blocks.length),
              (n.maxLength = a.getMaxLength(n.blocks)),
              n.creditCardType !== t.type &&
                ((n.creditCardType = t.type),
                n.onCreditCardTypeChanged.call(r, n.creditCardType)));
          },
          updateValueState: function () {
            var e = this,
              t = i.Util,
              r = e.properties;
            if (e.element) {
              var n = e.element.selectionEnd,
                a = e.element.value,
                o = r.result;
              if (
                ((n = t.getNextCursorPosition(
                  n,
                  a,
                  o,
                  r.delimiter,
                  r.delimiters
                )),
                e.isAndroid)
              )
                return void window.setTimeout(function () {
                  (e.element.value = o),
                    t.setSelection(e.element, n, r.document, !1),
                    e.callOnValueChanged();
                }, 1);
              (e.element.value = o),
                r.swapHiddenInput &&
                  (e.elementSwapHidden.value = e.getRawValue()),
                t.setSelection(e.element, n, r.document, !1),
                e.callOnValueChanged();
            }
          },
          callOnValueChanged: function () {
            var e = this,
              t = e.properties;
            t.onValueChanged.call(e, {
              target: {
                name: e.element.name,
                value: t.result,
                rawValue: e.getRawValue(),
              },
            });
          },
          setPhoneRegionCode: function (e) {
            var t = this,
              r = t.properties;
            (r.phoneRegionCode = e), t.initPhoneFormatter(), t.onChange();
          },
          setRawValue: function (e) {
            var t = this,
              r = t.properties;
            (e = void 0 !== e && null !== e ? e.toString() : ""),
              r.numeral && (e = e.replace(".", r.numeralDecimalMark)),
              (r.postDelimiterBackspace = !1),
              (t.element.value = e),
              t.onInput(e);
          },
          getRawValue: function () {
            var e = this,
              t = e.properties,
              r = i.Util,
              n = e.element.value;
            return (
              t.rawValueTrimPrefix &&
                (n = r.getPrefixStrippedValue(
                  n,
                  t.prefix,
                  t.prefixLength,
                  t.result,
                  t.delimiter,
                  t.delimiters,
                  t.noImmediatePrefix,
                  t.tailPrefix,
                  t.signBeforePrefix
                )),
              (n = t.numeral
                ? t.numeralFormatter.getRawValue(n)
                : r.stripDelimiters(n, t.delimiter, t.delimiters))
            );
          },
          getISOFormatDate: function () {
            var e = this,
              t = e.properties;
            return t.date ? t.dateFormatter.getISOFormatDate() : "";
          },
          getISOFormatTime: function () {
            var e = this,
              t = e.properties;
            return t.time ? t.timeFormatter.getISOFormatTime() : "";
          },
          getFormattedValue: function () {
            return this.element.value;
          },
          destroy: function () {
            var e = this;
            e.element.removeEventListener("input", e.onChangeListener),
              e.element.removeEventListener("keydown", e.onKeyDownListener),
              e.element.removeEventListener("focus", e.onFocusListener),
              e.element.removeEventListener("cut", e.onCutListener),
              e.element.removeEventListener("copy", e.onCopyListener);
          },
          toString: function () {
            return "[Cleave Object]";
          },
        }),
          (i.NumeralFormatter = r(1)),
          (i.DateFormatter = r(2)),
          (i.TimeFormatter = r(3)),
          (i.PhoneFormatter = r(4)),
          (i.CreditCardDetector = r(5)),
          (i.Util = r(6)),
          (i.DefaultProperties = r(7)),
          (("object" == typeof t && t ? t : window).Cleave = i),
          (e.exports = i);
      }).call(
        t,
        (function () {
          return this;
        })()
      );
    },
    function (e, t) {
      "use strict";
      var r = function (e, t, i, n, a, o, l, s, c, u) {
        var d = this;
        (d.numeralDecimalMark = e || "."),
          (d.numeralIntegerScale = t > 0 ? t : 0),
          (d.numeralDecimalScale = i >= 0 ? i : 2),
          (d.numeralThousandsGroupStyle = n || r.groupStyle.thousand),
          (d.numeralPositiveOnly = !!a),
          (d.stripLeadingZeroes = o !== !1),
          (d.prefix = l || "" === l ? l : ""),
          (d.signBeforePrefix = !!s),
          (d.tailPrefix = !!c),
          (d.delimiter = u || "" === u ? u : ","),
          (d.delimiterRE = u ? new RegExp("\\" + u, "g") : "");
      };
      (r.groupStyle = {
        thousand: "thousand",
        lakh: "lakh",
        wan: "wan",
        none: "none",
      }),
        (r.prototype = {
          getRawValue: function (e) {
            return e
              .replace(this.delimiterRE, "")
              .replace(this.numeralDecimalMark, ".");
          },
          format: function (e) {
            var t,
              i,
              n,
              a,
              o = this,
              l = "";
            switch (
              ((e = e
                .replace(/[A-Za-z]/g, "")
                .replace(o.numeralDecimalMark, "M")
                .replace(/[^\dM-]/g, "")
                .replace(/^\-/, "N")
                .replace(/\-/g, "")
                .replace("N", o.numeralPositiveOnly ? "" : "-")
                .replace("M", o.numeralDecimalMark)),
              o.stripLeadingZeroes && (e = e.replace(/^(-)?0+(?=\d)/, "$1")),
              (i = "-" === e.slice(0, 1) ? "-" : ""),
              (n =
                "undefined" != typeof o.prefix
                  ? o.signBeforePrefix
                    ? i + o.prefix
                    : o.prefix + i
                  : i),
              (a = e),
              e.indexOf(o.numeralDecimalMark) >= 0 &&
                ((t = e.split(o.numeralDecimalMark)),
                (a = t[0]),
                (l =
                  o.numeralDecimalMark + t[1].slice(0, o.numeralDecimalScale))),
              "-" === i && (a = a.slice(1)),
              o.numeralIntegerScale > 0 &&
                (a = a.slice(0, o.numeralIntegerScale)),
              o.numeralThousandsGroupStyle)
            ) {
              case r.groupStyle.lakh:
                a = a.replace(/(\d)(?=(\d\d)+\d$)/g, "$1" + o.delimiter);
                break;
              case r.groupStyle.wan:
                a = a.replace(/(\d)(?=(\d{4})+$)/g, "$1" + o.delimiter);
                break;
              case r.groupStyle.thousand:
                a = a.replace(/(\d)(?=(\d{3})+$)/g, "$1" + o.delimiter);
            }
            return o.tailPrefix
              ? i +
                  a.toString() +
                  (o.numeralDecimalScale > 0 ? l.toString() : "") +
                  o.prefix
              : n +
                  a.toString() +
                  (o.numeralDecimalScale > 0 ? l.toString() : "");
          },
        }),
        (e.exports = r);
    },
    function (e, t) {
      "use strict";
      var r = function (e, t, r) {
        var i = this;
        (i.date = []),
          (i.blocks = []),
          (i.datePattern = e),
          (i.dateMin = t
            .split("-")
            .reverse()
            .map(function (e) {
              return parseInt(e, 10);
            })),
          2 === i.dateMin.length && i.dateMin.unshift(0),
          (i.dateMax = r
            .split("-")
            .reverse()
            .map(function (e) {
              return parseInt(e, 10);
            })),
          2 === i.dateMax.length && i.dateMax.unshift(0),
          i.initBlocks();
      };
      (r.prototype = {
        initBlocks: function () {
          var e = this;
          e.datePattern.forEach(function (t) {
            "Y" === t ? e.blocks.push(4) : e.blocks.push(2);
          });
        },
        getISOFormatDate: function () {
          var e = this,
            t = e.date;
          return t[2]
            ? t[2] + "-" + e.addLeadingZero(t[1]) + "-" + e.addLeadingZero(t[0])
            : "";
        },
        getBlocks: function () {
          return this.blocks;
        },
        getValidatedDate: function (e) {
          var t = this,
            r = "";
          return (
            (e = e.replace(/[^\d]/g, "")),
            t.blocks.forEach(function (i, n) {
              if (e.length > 0) {
                var a = e.slice(0, i),
                  o = a.slice(0, 1),
                  l = e.slice(i);
                switch (t.datePattern[n]) {
                  case "d":
                    "00" === a
                      ? (a = "01")
                      : parseInt(o, 10) > 3
                      ? (a = "0" + o)
                      : parseInt(a, 10) > 31 && (a = "31");
                    break;
                  case "m":
                    "00" === a
                      ? (a = "01")
                      : parseInt(o, 10) > 1
                      ? (a = "0" + o)
                      : parseInt(a, 10) > 12 && (a = "12");
                }
                (r += a), (e = l);
              }
            }),
            this.getFixedDateString(r)
          );
        },
        getFixedDateString: function (e) {
          var t,
            r,
            i,
            n = this,
            a = n.datePattern,
            o = [],
            l = 0,
            s = 0,
            c = 0,
            u = 0,
            d = 0,
            m = 0,
            p = !1;
          4 === e.length &&
            "y" !== a[0].toLowerCase() &&
            "y" !== a[1].toLowerCase() &&
            ((u = "d" === a[0] ? 0 : 2),
            (d = 2 - u),
            (t = parseInt(e.slice(u, u + 2), 10)),
            (r = parseInt(e.slice(d, d + 2), 10)),
            (o = this.getFixedDate(t, r, 0))),
            8 === e.length &&
              (a.forEach(function (e, t) {
                switch (e) {
                  case "d":
                    l = t;
                    break;
                  case "m":
                    s = t;
                    break;
                  default:
                    c = t;
                }
              }),
              (m = 2 * c),
              (u = l <= c ? 2 * l : 2 * l + 2),
              (d = s <= c ? 2 * s : 2 * s + 2),
              (t = parseInt(e.slice(u, u + 2), 10)),
              (r = parseInt(e.slice(d, d + 2), 10)),
              (i = parseInt(e.slice(m, m + 4), 10)),
              (p = 4 === e.slice(m, m + 4).length),
              (o = this.getFixedDate(t, r, i))),
            4 !== e.length ||
              ("y" !== a[0] && "y" !== a[1]) ||
              ((d = "m" === a[0] ? 0 : 2),
              (m = 2 - d),
              (r = parseInt(e.slice(d, d + 2), 10)),
              (i = parseInt(e.slice(m, m + 2), 10)),
              (p = 2 === e.slice(m, m + 2).length),
              (o = [0, r, i])),
            6 !== e.length ||
              ("Y" !== a[0] && "Y" !== a[1]) ||
              ((d = "m" === a[0] ? 0 : 4),
              (m = 2 - 0.5 * d),
              (r = parseInt(e.slice(d, d + 2), 10)),
              (i = parseInt(e.slice(m, m + 4), 10)),
              (p = 4 === e.slice(m, m + 4).length),
              (o = [0, r, i])),
            (o = n.getRangeFixedDate(o)),
            (n.date = o);
          var h =
            0 === o.length
              ? e
              : a.reduce(function (e, t) {
                  switch (t) {
                    case "d":
                      return e + (0 === o[0] ? "" : n.addLeadingZero(o[0]));
                    case "m":
                      return e + (0 === o[1] ? "" : n.addLeadingZero(o[1]));
                    case "y":
                      return e + (p ? n.addLeadingZeroForYear(o[2], !1) : "");
                    case "Y":
                      return e + (p ? n.addLeadingZeroForYear(o[2], !0) : "");
                  }
                }, "");
          return h;
        },
        getRangeFixedDate: function (e) {
          var t = this,
            r = t.datePattern,
            i = t.dateMin || [],
            n = t.dateMax || [];
          return !e.length || (i.length < 3 && n.length < 3)
            ? e
            : r.find(function (e) {
                return "y" === e.toLowerCase();
              }) && 0 === e[2]
            ? e
            : n.length &&
              (n[2] < e[2] ||
                (n[2] === e[2] &&
                  (n[1] < e[1] || (n[1] === e[1] && n[0] < e[0]))))
            ? n
            : i.length &&
              (i[2] > e[2] ||
                (i[2] === e[2] &&
                  (i[1] > e[1] || (i[1] === e[1] && i[0] > e[0]))))
            ? i
            : e;
        },
        getFixedDate: function (e, t, r) {
          return (
            (e = Math.min(e, 31)),
            (t = Math.min(t, 12)),
            (r = parseInt(r || 0, 10)),
            ((t < 7 && t % 2 === 0) || (t > 8 && t % 2 === 1)) &&
              (e = Math.min(e, 2 === t ? (this.isLeapYear(r) ? 29 : 28) : 30)),
            [e, t, r]
          );
        },
        isLeapYear: function (e) {
          return (e % 4 === 0 && e % 100 !== 0) || e % 400 === 0;
        },
        addLeadingZero: function (e) {
          return (e < 10 ? "0" : "") + e;
        },
        addLeadingZeroForYear: function (e, t) {
          return t
            ? (e < 10 ? "000" : e < 100 ? "00" : e < 1e3 ? "0" : "") + e
            : (e < 10 ? "0" : "") + e;
        },
      }),
        (e.exports = r);
    },
    function (e, t) {
      "use strict";
      var r = function (e, t) {
        var r = this;
        (r.time = []),
          (r.blocks = []),
          (r.timePattern = e),
          (r.timeFormat = t),
          r.initBlocks();
      };
      (r.prototype = {
        initBlocks: function () {
          var e = this;
          e.timePattern.forEach(function () {
            e.blocks.push(2);
          });
        },
        getISOFormatTime: function () {
          var e = this,
            t = e.time;
          return t[2]
            ? e.addLeadingZero(t[0]) +
                ":" +
                e.addLeadingZero(t[1]) +
                ":" +
                e.addLeadingZero(t[2])
            : "";
        },
        getBlocks: function () {
          return this.blocks;
        },
        getTimeFormatOptions: function () {
          var e = this;
          return "12" === String(e.timeFormat)
            ? {
                maxHourFirstDigit: 1,
                maxHours: 12,
                maxMinutesFirstDigit: 5,
                maxMinutes: 60,
              }
            : {
                maxHourFirstDigit: 2,
                maxHours: 23,
                maxMinutesFirstDigit: 5,
                maxMinutes: 60,
              };
        },
        getValidatedTime: function (e) {
          var t = this,
            r = "";
          e = e.replace(/[^\d]/g, "");
          var i = t.getTimeFormatOptions();
          return (
            t.blocks.forEach(function (n, a) {
              if (e.length > 0) {
                var o = e.slice(0, n),
                  l = o.slice(0, 1),
                  s = e.slice(n);
                switch (t.timePattern[a]) {
                  case "h":
                    parseInt(l, 10) > i.maxHourFirstDigit
                      ? (o = "0" + l)
                      : parseInt(o, 10) > i.maxHours && (o = i.maxHours + "");
                    break;
                  case "m":
                  case "s":
                    parseInt(l, 10) > i.maxMinutesFirstDigit
                      ? (o = "0" + l)
                      : parseInt(o, 10) > i.maxMinutes &&
                        (o = i.maxMinutes + "");
                }
                (r += o), (e = s);
              }
            }),
            this.getFixedTimeString(r)
          );
        },
        getFixedTimeString: function (e) {
          var t,
            r,
            i,
            n = this,
            a = n.timePattern,
            o = [],
            l = 0,
            s = 0,
            c = 0,
            u = 0,
            d = 0,
            m = 0;
          return (
            6 === e.length &&
              (a.forEach(function (e, t) {
                switch (e) {
                  case "s":
                    l = 2 * t;
                    break;
                  case "m":
                    s = 2 * t;
                    break;
                  case "h":
                    c = 2 * t;
                }
              }),
              (m = c),
              (d = s),
              (u = l),
              (t = parseInt(e.slice(u, u + 2), 10)),
              (r = parseInt(e.slice(d, d + 2), 10)),
              (i = parseInt(e.slice(m, m + 2), 10)),
              (o = this.getFixedTime(i, r, t))),
            4 === e.length &&
              n.timePattern.indexOf("s") < 0 &&
              (a.forEach(function (e, t) {
                switch (e) {
                  case "m":
                    s = 2 * t;
                    break;
                  case "h":
                    c = 2 * t;
                }
              }),
              (m = c),
              (d = s),
              (t = 0),
              (r = parseInt(e.slice(d, d + 2), 10)),
              (i = parseInt(e.slice(m, m + 2), 10)),
              (o = this.getFixedTime(i, r, t))),
            (n.time = o),
            0 === o.length
              ? e
              : a.reduce(function (e, t) {
                  switch (t) {
                    case "s":
                      return e + n.addLeadingZero(o[2]);
                    case "m":
                      return e + n.addLeadingZero(o[1]);
                    case "h":
                      return e + n.addLeadingZero(o[0]);
                  }
                }, "")
          );
        },
        getFixedTime: function (e, t, r) {
          return (
            (r = Math.min(parseInt(r || 0, 10), 60)),
            (t = Math.min(t, 60)),
            (e = Math.min(e, 60)),
            [e, t, r]
          );
        },
        addLeadingZero: function (e) {
          return (e < 10 ? "0" : "") + e;
        },
      }),
        (e.exports = r);
    },
    function (e, t) {
      "use strict";
      var r = function (e, t) {
        var r = this;
        (r.delimiter = t || "" === t ? t : " "),
          (r.delimiterRE = t ? new RegExp("\\" + t, "g") : ""),
          (r.formatter = e);
      };
      (r.prototype = {
        setFormatter: function (e) {
          this.formatter = e;
        },
        format: function (e) {
          var t = this;
          t.formatter.clear(),
            (e = e.replace(/[^\d+]/g, "")),
            (e = e.replace(/^\+/, "B").replace(/\+/g, "").replace("B", "+")),
            (e = e.replace(t.delimiterRE, ""));
          for (var r, i = "", n = !1, a = 0, o = e.length; a < o; a++)
            (r = t.formatter.inputDigit(e.charAt(a))),
              /[\s()-]/g.test(r) ? ((i = r), (n = !0)) : n || (i = r);
          return (
            (i = i.replace(/[()]/g, "")), (i = i.replace(/[\s-]/g, t.delimiter))
          );
        },
      }),
        (e.exports = r);
    },
    function (e, t) {
      "use strict";
      var r = {
        blocks: {
          uatp: [4, 5, 6],
          amex: [4, 6, 5],
          diners: [4, 6, 4],
          discover: [4, 4, 4, 4],
          mastercard: [4, 4, 4, 4],
          dankort: [4, 4, 4, 4],
          instapayment: [4, 4, 4, 4],
          jcb15: [4, 6, 5],
          jcb: [4, 4, 4, 4],
          maestro: [4, 4, 4, 4],
          visa: [4, 4, 4, 4],
          mir: [4, 4, 4, 4],
          unionPay: [4, 4, 4, 4],
          general: [4, 4, 4, 4],
        },
        re: {
          uatp: /^(?!1800)1\d{0,14}/,
          amex: /^3[47]\d{0,13}/,
          discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
          diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
          mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
          dankort: /^(5019|4175|4571)\d{0,12}/,
          instapayment: /^63[7-9]\d{0,13}/,
          jcb15: /^(?:2131|1800)\d{0,11}/,
          jcb: /^(?:35\d{0,2})\d{0,12}/,
          maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
          mir: /^220[0-4]\d{0,12}/,
          visa: /^4\d{0,15}/,
          unionPay: /^(62|81)\d{0,14}/,
        },
        getStrictBlocks: function (e) {
          var t = e.reduce(function (e, t) {
            return e + t;
          }, 0);
          return e.concat(19 - t);
        },
        getInfo: function (e, t) {
          var i = r.blocks,
            n = r.re;
          t = !!t;
          for (var a in n)
            if (n[a].test(e)) {
              var o = i[a];
              return { type: a, blocks: t ? this.getStrictBlocks(o) : o };
            }
          return {
            type: "unknown",
            blocks: t ? this.getStrictBlocks(i.general) : i.general,
          };
        },
      };
      e.exports = r;
    },
    function (e, t) {
      "use strict";
      var r = {
        noop: function () {},
        strip: function (e, t) {
          return e.replace(t, "");
        },
        getPostDelimiter: function (e, t, r) {
          if (0 === r.length) return e.slice(-t.length) === t ? t : "";
          var i = "";
          return (
            r.forEach(function (t) {
              e.slice(-t.length) === t && (i = t);
            }),
            i
          );
        },
        getDelimiterREByDelimiter: function (e) {
          return new RegExp(e.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), "g");
        },
        getNextCursorPosition: function (e, t, r, i, n) {
          return t.length === e
            ? r.length
            : e + this.getPositionOffset(e, t, r, i, n);
        },
        getPositionOffset: function (e, t, r, i, n) {
          var a, o, l;
          return (
            (a = this.stripDelimiters(t.slice(0, e), i, n)),
            (o = this.stripDelimiters(r.slice(0, e), i, n)),
            (l = a.length - o.length),
            0 !== l ? l / Math.abs(l) : 0
          );
        },
        stripDelimiters: function (e, t, r) {
          var i = this;
          if (0 === r.length) {
            var n = t ? i.getDelimiterREByDelimiter(t) : "";
            return e.replace(n, "");
          }
          return (
            r.forEach(function (t) {
              t.split("").forEach(function (t) {
                e = e.replace(i.getDelimiterREByDelimiter(t), "");
              });
            }),
            e
          );
        },
        headStr: function (e, t) {
          return e.slice(0, t);
        },
        getMaxLength: function (e) {
          return e.reduce(function (e, t) {
            return e + t;
          }, 0);
        },
        getPrefixStrippedValue: function (e, t, r, i, n, a, o, l, s) {
          if (0 === r) return e;
          if (e === t && "" !== e) return "";
          if (s && "-" == e.slice(0, 1)) {
            var c = "-" == i.slice(0, 1) ? i.slice(1) : i;
            return (
              "-" +
              this.getPrefixStrippedValue(e.slice(1), t, r, c, n, a, o, l, s)
            );
          }
          if (i.slice(0, r) !== t && !l) return o && !i && e ? e : "";
          if (i.slice(-r) !== t && l) return o && !i && e ? e : "";
          var u = this.stripDelimiters(i, n, a);
          return e.slice(0, r) === t || l
            ? e.slice(-r) !== t && l
              ? u.slice(0, -r - 1)
              : l
              ? e.slice(0, -r)
              : e.slice(r)
            : u.slice(r);
        },
        getFirstDiffIndex: function (e, t) {
          for (var r = 0; e.charAt(r) === t.charAt(r); )
            if ("" === e.charAt(r++)) return -1;
          return r;
        },
        getFormattedValue: function (e, t, r, i, n, a) {
          var o = "",
            l = n.length > 0,
            s = "";
          return 0 === r
            ? e
            : (t.forEach(function (t, c) {
                if (e.length > 0) {
                  var u = e.slice(0, t),
                    d = e.slice(t);
                  (s = l ? n[a ? c - 1 : c] || s : i),
                    a
                      ? (c > 0 && (o += s), (o += u))
                      : ((o += u), u.length === t && c < r - 1 && (o += s)),
                    (e = d);
                }
              }),
              o);
        },
        fixPrefixCursor: function (e, t, r, i) {
          if (e) {
            var n = e.value,
              a = r || i[0] || " ";
            if (
              e.setSelectionRange &&
              t &&
              !(t.length + a.length <= n.length)
            ) {
              var o = 2 * n.length;
              setTimeout(function () {
                e.setSelectionRange(o, o);
              }, 1);
            }
          }
        },
        checkFullSelection: function (e) {
          try {
            var t = window.getSelection() || document.getSelection() || {};
            return t.toString().length === e.length;
          } catch (r) {}
          return !1;
        },
        setSelection: function (e, t, r) {
          if (e === this.getActiveElement(r) && !(e && e.value.length <= t))
            if (e.createTextRange) {
              var i = e.createTextRange();
              i.move("character", t), i.select();
            } else
              try {
                e.setSelectionRange(t, t);
              } catch (n) {
                console.warn(
                  "The input element type does not support selection"
                );
              }
        },
        getActiveElement: function (e) {
          var t = e.activeElement;
          return t && t.shadowRoot ? this.getActiveElement(t.shadowRoot) : t;
        },
        isAndroid: function () {
          return navigator && /android/i.test(navigator.userAgent);
        },
        isAndroidBackspaceKeydown: function (e, t) {
          return !!(this.isAndroid() && e && t) && t === e.slice(0, -1);
        },
      };
      e.exports = r;
    },
    function (e, t) {
      (function (t) {
        "use strict";
        var r = {
          assign: function (e, r) {
            return (
              (e = e || {}),
              (r = r || {}),
              (e.creditCard = !!r.creditCard),
              (e.creditCardStrictMode = !!r.creditCardStrictMode),
              (e.creditCardType = ""),
              (e.onCreditCardTypeChanged =
                r.onCreditCardTypeChanged || function () {}),
              (e.phone = !!r.phone),
              (e.phoneRegionCode = r.phoneRegionCode || "AU"),
              (e.phoneFormatter = {}),
              (e.time = !!r.time),
              (e.timePattern = r.timePattern || ["h", "m", "s"]),
              (e.timeFormat = r.timeFormat || "24"),
              (e.timeFormatter = {}),
              (e.date = !!r.date),
              (e.datePattern = r.datePattern || ["d", "m", "Y"]),
              (e.dateMin = r.dateMin || ""),
              (e.dateMax = r.dateMax || ""),
              (e.dateFormatter = {}),
              (e.numeral = !!r.numeral),
              (e.numeralIntegerScale =
                r.numeralIntegerScale > 0 ? r.numeralIntegerScale : 0),
              (e.numeralDecimalScale =
                r.numeralDecimalScale >= 0 ? r.numeralDecimalScale : 2),
              (e.numeralDecimalMark = r.numeralDecimalMark || "."),
              (e.numeralThousandsGroupStyle =
                r.numeralThousandsGroupStyle || "thousand"),
              (e.numeralPositiveOnly = !!r.numeralPositiveOnly),
              (e.stripLeadingZeroes = r.stripLeadingZeroes !== !1),
              (e.signBeforePrefix = !!r.signBeforePrefix),
              (e.tailPrefix = !!r.tailPrefix),
              (e.swapHiddenInput = !!r.swapHiddenInput),
              (e.numericOnly = e.creditCard || e.date || !!r.numericOnly),
              (e.uppercase = !!r.uppercase),
              (e.lowercase = !!r.lowercase),
              (e.prefix = e.creditCard || e.date ? "" : r.prefix || ""),
              (e.noImmediatePrefix = !!r.noImmediatePrefix),
              (e.prefixLength = e.prefix.length),
              (e.rawValueTrimPrefix = !!r.rawValueTrimPrefix),
              (e.copyDelimiter = !!r.copyDelimiter),
              (e.initValue =
                void 0 !== r.initValue && null !== r.initValue
                  ? r.initValue.toString()
                  : ""),
              (e.delimiter =
                r.delimiter || "" === r.delimiter
                  ? r.delimiter
                  : r.date
                  ? "/"
                  : r.time
                  ? ":"
                  : r.numeral
                  ? ","
                  : (r.phone, " ")),
              (e.delimiterLength = e.delimiter.length),
              (e.delimiterLazyShow = !!r.delimiterLazyShow),
              (e.delimiters = r.delimiters || []),
              (e.blocks = r.blocks || []),
              (e.blocksLength = e.blocks.length),
              (e.root = "object" == typeof t && t ? t : window),
              (e.document = r.document || e.root.document),
              (e.maxLength = 0),
              (e.backspace = !1),
              (e.result = ""),
              (e.onValueChanged = r.onValueChanged || function () {}),
              e
            );
          },
        };
        e.exports = r;
      }).call(
        t,
        (function () {
          return this;
        })()
      );
    },
  ]);
});
gform.types["currency"] = _.extend({}, gform.types["input"], {
  defaults: {
    placeholder: "$0.00",
    value: "",
    validate: [{ type: "numeric" } /*,{type:'numeric'}*/],
  },
  toString: function (name, report) {
    if (!report) {
      return (
        "<dt>" +
        this.label +
        "</dt> <dd>" +
        ((this.item.pre || "") +
          (typeof this.cleave !== "undefined" && this.cleave instanceof Cleave
            ? this.cleave.getFormattedValue()
            : this.value) +
          (this.item.post || "") || '<span class="text-muted">(empty)</span>') +
        "</dd><hr>"
      );
    } else {
      return this.value;
    }
  },
  display: function () {
    var val = this.value;
    if (typeof this.cleave !== "undefined" && this.cleave instanceof Cleave) {
      val = this.cleave.getFormattedValue();
    }

    return typeof this.value !== "undefined" && this.value !== ""
      ? (this.item.pre || "") +
          (typeof this.cleave !== "undefined" && this.cleave instanceof Cleave
            ? this.cleave.getFormattedValue()
            : this.value) +
          (this.item.post || "")
      : "(empty)";
  },
  initialize: function () {
    //   this.iel = this.el.querySelector('input[name="' + this.name + '"]')
    //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
    this.onchangeEvent = function (input) {
      //   this.input = input;
      this.internalValue = this.get();
      if (this.el.querySelector(".count") != null) {
        var text = (this.value + "").length;
        if (this.limit > 1) {
          text += "/" + this.limit;
        }
        this.el.querySelector(".count").innerHTML = text;
      }
      //   this.update({value:this.get()},true);
      //   gform.types[this.type].focus.call(this)
      gform.types[this.type].setup.call(this);
      this.parent.trigger(["change"], this, { input: this.value });
      if (input) {
        this.parent.trigger(["input"], this, { input: this.value });
      }
    }.bind(this);
    this.input = this.input || false;
    this.el.addEventListener("input", this.onchangeEvent.bind(null, true));

    this.el.addEventListener("change", this.onchangeEvent.bind(null, false));
    this.item.cleave = {
      ...(!this.item.pre
        ? {
            prefix: "$",
            noImmediatePrefix: true,
            rawValueTrimPrefix: true,
          }
        : {}),
      numeral: true,
      numeralThousandsGroupStyle: "thousand",
      ...(!(this.item.post || "").indexOf(".")
        ? { numeralDecimalScale: 0 }
        : {}),
    };

    this.placeholder = this.placeholder.substring(
      this.placeholder.indexOf(this.pre) + 1,
      this.placeholder.indexOf(this.post)
    );
    this.cleave = new Cleave(this.el.querySelector("input"), {
      ...this.item.cleave,
    });

    gform.types[this.type].setup.call(this);
  },
  setup: function () {
    this.labelEl = this.el.querySelector("label");
    gform.types[this.type].setLabel.call(this);
    this.infoEl = this.el.querySelector(".gform-info");
    this.el.querySelector("input").placeholder = this.placeholder;
  },
  set: function (value) {
    if (!("el" in this)) {
      this.internalValue = value;
      return;
    }

    // this.el.querySelector('input[name="' + this.name + '"]').value = value;
    this.cleave.setRawValue(value);
  },
  get: function () {
    if (!("el" in this)) {
      return this.internalValue;
    }

    return parseFloat(this.cleave.getRawValue()) || 0;
    // return parseInt(this.el.querySelector('input[name="' + this.name + '"]').value,10);
  },
  render: function () {
    return gform
      .render(this.type, this)
      .split('value=""')
      .join('value="' + this.value + '"');
  },
  satisfied: function (value) {
    if (this.cleave.getRawValue().length == 0 && this.value == 0) return false;
    value = value || this.value;
    // if(_.isArray(value)){return !!value.length;}
    return (
      typeof value !== "undefined" &&
      value !== null &&
      value !== "" &&
      !(typeof value == "number" && isNaN(value))
    );
  },
});

const fieldLibrary = (function () {
  let group_id =
    typeof resource_id !== "undefined"
      ? resource_id
      : typeof instanceData !== "undefined"
      ? instanceData.group_id
      : null;
  // let mycomposites = (typeof composites !== 'undefined')?composites:[]
  let collection = {
    layout: {
      label: "Layout",
      name: "layout",
      options: "layouts",
      value: 0,
      format: {
        display: "{{{original.label}}} {{title}} ",
        label: "{{title}}",
        value: layout => parseInt(layout.value),
      },
      type: "combobox",
    },
    group: {
      label: "Group",
      name: "group_id",
      strict: true,
      type: "combobox",
      required: true,
      value: parseInt(group_id),
      edit: [
        { type: "not_matches", name: "_method", value: "edit" },
        { type: "test", test: () => resource_id == "" },
      ],
      options: "groups",
      format: {
        title:
          '{{{label}}}{{^label}}Group{{/label}} <span class="text-success pull-right">{{value}}</span>',
        label: "{{name}}",
        value: group => group.id,
      },
    },
    icon: {
      label: "Icon",
      name: "icon",
      type: "combobox",
      template: '<i class="fa fa-{{attributes.icon}}"></i>',
      format: {
        title:
          'Icon <span class="pull-right"><i class="fa fa-{{value}}"></i></span>',
        label: i => i.name.replace(/(\r\n|\s)/gm, ""),
        value: function (item) {
          return (item.value || "").split("-")[1];
        },
        template: '<i class="fa fa-{{value}}"></i>',
        display:
          '<span style="text-transform:capitalize;"><i class="{{value}}"></i> {{{label}}}',
      },
      options: "icons",
      required: false,
    },
    name: [
      { label: "Name", name: "name", required: true },
      { label: "Slug", name: "slug", required: true },
    ],
    composites: [
      {
        label: "Limit Composite Groups",
        name: "limit",
        value: function (e) {
          if (typeof e.form !== "undefined" && !e.form.isActive) {
            return (
              typeof e.form.options.data.groups !== "undefined" &&
              _.compact(e.form.options.data.groups).length > 0
            );
          } else {
            return e.initial.value;
          }
        },
        type: "checkbox",
        options: [
          { label: "No", value: false },
          { label: "Yes", value: true },
        ],
        strict: true,
        template:
          "{{#attributes.groups.length}}Yes{{/attributes.groups.length}}{{^attributes.groups.length}}No{{/attributes.groups.length}}",
        show: [
          { type: "matches", name: "public", value: false },
          {
            type: "test",
            test: () => $g.collections.get("composites").length > 0,
          },
        ],
      },
      {
        label: "Composites",
        get: function () {
          return this.visible ? gform.types[this.type].get.call(this) : null;
        },
        legend: "Composites",
        parse: true,
        array: { min: 1, max: 100, duplicate: { copy: true } },
        name: "groups",
        type: "combobox",
        options: "composites",
        format: {
          label: "{{name}}",
          value: function (i) {
            return i.id;
          },
        },
        show: [{ type: "matches", name: "limit", value: true }],
        validate: [{ type: "unique", message: "Duplicate group" }],
      },
    ],
    _display: [
      {
        label: "List in page menu",
        name: "unlisted",
        value: 0,
        type: "checkbox",
        options: [
          { label: "No", value: true },
          { label: "Yes", value: false },
        ],
      },
      {
        label: "Limit Device",
        name: "device",
        type: "select",
        value: 0,
        options: [
          { label: "All", value: "0" },
          { label: "Desktop Only", value: "1" },
          { label: "Tablet and Desktop", value: "2" },
          { label: "Tablet and Phone", value: "3" },
          { label: "Phone Only", value: "4" },
        ],
      },
      {
        label: "Public",
        name: "public",
        type: "checkbox",
        options: [
          { label: "No", value: false },
          { label: "Yes", value: true },
        ],
        edit: [{ type: "matches", name: "limit", value: false }],
      },
    ],
  };
  Object.defineProperty(collection, "content", {
    get: () => {
      const { name, icon, _display, composites } = collection;
      return [
        ...name,
        icon,
        ..._display,
        ...composites,
        { name: "order", type: "hidden" },
      ];
    },
    configurable: false,
  });

  return collection;
})();

_.each(
  ["success", "danger", "info", "warning", "default", "primary", "link"],
  actionType => {
    gform.types[actionType] = _.defaultsDeep(
      { toString: () => "" },
      gform.types["button"],
      {
        defaults: {
          action: "save",
          modifiers: "btn btn-" + actionType,
        },
      }
    );
  }
);
