gform.stencils = {
  _style: `
/*input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}*/

.array_container + button{
  display:none;
}
.array_container:empty + button{
  display:inline-block;
}

input[type=checkbox]:after{
  content:attr(data-false);
  display: inline;
  position:relative;
  top: -1px;
  left: 24px;
  color:#333;
}
input[type=checkbox]:checked:after{
  content:attr(data-true);
}

  .trueLabel, .falseLabel {
      display: none;position:relative;
  }
  .falseLabel{display:inline}

  input:checked  ~ .falseLabel{
    display:none;
  }
  input:checked  ~ .trueLabel{
      display: inline;
  }
  .gform_isArray{position:relative}
  /* The switch - the box around the slider */
.switch {
	position: relative;
	display: inline-block;
	width: 2.8rem;
	height: 1.6rem;
/*  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23fff'/%3E%3C/svg%3E");*/

}

/* Hide default HTML checkbox */
.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

/* The slider */
.switch .slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	-webkit-transition: 0.2s;
	transition: 0.2s;
  border-radius:.8rem;

}

.switch .slider:before {
	position: absolute;
	content: "";
	height: 1.3rem;
	width: 1.3rem;
  top: .15rem;
	left: .15rem;
	bottom: .15rem;
  border-radius: 50%;
	background-color: white;
	-webkit-transition: 0.2s;
	transition: 0.2s;
}

input:not(:checked) + .slider {
	border-color: #c8c8c8;
	background-color: #ccc;
}

input:focus + .slider {
	border-color: rgba(0, 0, 0, .25 );
	box-shadow: 0 0 0 0.125em rgba(100, 100, 100, 0.25);
}

input:checked + .slider:before {
	-webkit-transform: translateX(1.2rem);
	-ms-transform: translateX(1.2rem);
	transform: translateX(1.2rem);
}
input:disabled + .slider {
	background-color: #ddd;
}



/*dont keep this*/
.btn-close {
  background: transparent url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3E%3C/svg%3E") 50%/1em auto no-repeat
}

.btn-close:focus {
  opacity: 1
}

.btn-close.disabled,.btn-close:disabled {
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  opacity: .25
}

.btn-close-white {
  -webkit-filter: invert(1) grayscale(100%) brightness(200%);
  filter: invert(1) grayscale(100%) brightness(200%)
}

.modal {
  z-index: 1055;
  background: rgb(37 41 59 / 75%);
}

.modal-dialog {
  margin: 4em .5rem 0
}

.modal.fade .modal-dialog {
  -webkit-transition: -webkit-transform .3s ease-out;
  transition: -webkit-transform .3s ease-out;
  transition: transform .3s ease-out;
  transition: transform .3s ease-out,-webkit-transform .3s ease-out;
  -webkit-transform: translateY(-50px);
  transform: translateY(-50px)
}

@media(prefers-reduced-motion:reduce) {
  .modal.fade .modal-dialog {
      -webkit-transition: none;
      transition: none
  }
}

.modal.show .modal-dialog {
  -webkit-transform: none;
  transform: none;
}

.modal.modal-static .modal-dialog {
  -webkit-transform: scale(1.02);
  transform: scale(1.02)
}

.modal-dialog-scrollable {
  height: calc(100% - 1rem)
}

.modal-dialog-scrollable .modal-content {
  max-height: 100%;
  overflow: hidden
}

.modal-dialog-scrollable .modal-body {
  overflow-y: auto
}

.modal-dialog-centered {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-height: calc(100% - 1rem)
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100vw;
  height: 100vh;
  background-color: #000
}

.modal-backdrop.fade {
  opacity: 0
}

.modal-backdrop.show {
  opacity: .5
}

.modal-header .btn-close {
  padding: .5rem;
  margin: -.5rem -.5rem -.5rem auto
}

.modal-body {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto
}

@media(min-width: 576px) {
  .modal-dialog {
      max-width:700px;
      margin: 5rem auto;
  }

  .modal-dialog-scrollable {
      height: calc(100% - 3.5rem)
  }

  .modal-dialog-centered {
      min-height: calc(100% - 3.5rem)
  }

  .modal-sm {
      max-width: 300px
  }
}

@media(min-width: 992px) {
  .modal-lg,.modal-xl {
      max-width:800px
  }
}

@media(min-width: 1200px) {
  .modal-xl {
      max-width:1140px
  }
}

.modal-fullscreen {
  width: 100vw;
  max-width: none;
  height: 100%;
  margin: 0
}

.modal-fullscreen .modal-content {
  height: 100%;
  border: 0;
  border-radius: 0
}

.modal-fullscreen .modal-header {
  border-radius: 0
}

.modal-fullscreen .modal-body {
  overflow-y: auto
}

.modal-fullscreen .modal-footer {
  border-radius: 0
}

@media(max-width: 575.98px) {
  .modal-fullscreen-sm-down {
      width:100vw;
      max-width: none;
      height: 100%;
      margin: 0
  }

  .modal-fullscreen-sm-down .modal-content {
      height: 100%;
      border: 0;
      border-radius: 0
  }

  .modal-fullscreen-sm-down .modal-header {
      border-radius: 0
  }

  .modal-fullscreen-sm-down .modal-body {
      overflow-y: auto
  }

  .modal-fullscreen-sm-down .modal-footer {
      border-radius: 0
  }
}

@media(max-width: 767.98px) {
  .modal-fullscreen-md-down {
      width:100vw;
      max-width: none;
      height: 100%;
      margin: 0
  }

  .modal-fullscreen-md-down .modal-content {
      height: 100%;
      border: 0;
      border-radius: 0
  }

  .modal-fullscreen-md-down .modal-header {
      border-radius: 0
  }

  .modal-fullscreen-md-down .modal-body {
      overflow-y: auto
  }

  .modal-fullscreen-md-down .modal-footer {
      border-radius: 0
  }
}

@media(max-width: 991.98px) {
  .modal-fullscreen-lg-down {
      width:100vw;
      max-width: none;
      height: 100%;
      margin: 0
  }

  .modal-fullscreen-lg-down .modal-content {
      height: 100%;
      border: 0;
      border-radius: 0
  }

  .modal-fullscreen-lg-down .modal-header {
      border-radius: 0
  }

  .modal-fullscreen-lg-down .modal-body {
      overflow-y: auto
  }

  .modal-fullscreen-lg-down .modal-footer {
      border-radius: 0
  }
}

@media(max-width: 1199.98px) {
  .modal-fullscreen-xl-down {
      width:100vw;
      max-width: none;
      height: 100%;
      margin: 0
  }

  .modal-fullscreen-xl-down .modal-content {
      height: 100%;
      border: 0;
      border-radius: 0
  }

  .modal-fullscreen-xl-down .modal-header {
      border-radius: 0
  }

  .modal-fullscreen-xl-down .modal-body {
      overflow-y: auto
  }

  .modal-fullscreen-xl-down .modal-footer {
      border-radius: 0
  }
}

@media(max-width: 1399.98px) {
  .modal-fullscreen-xxl-down {
      width:100vw;
      max-width: none;
      height: 100%;
      margin: 0
  }

  .modal-fullscreen-xxl-down .modal-content {
      height: 100%;
      border: 0;
      border-radius: 0
  }

  .modal-fullscreen-xxl-down .modal-header {
      border-radius: 0
  }

  .modal-fullscreen-xxl-down .modal-body {
      overflow-y: auto
  }

  .modal-fullscreen-xxl-down .modal-footer {
      border-radius: 0
  }
}
.combobox-container .form-control[contenteditable="false"]
{
	background: #eee;
}
.combobox-selected .caret {
	display: none;
}
/* :not doesn't work in IE8 */
.combobox-container:not(.combobox-selected) .fa-times {
	display: none;
}
.combobox-list {
	max-height: 300px;
	overflow-y: auto;
  max-width: 100%;
  min-width: 25%;
  cursor:pointer;
}
.combobox-list a{
  width:100%;display:block;
}
.combobox-list li {
  min-width: 200px;
}
.combobox-list li.active{
  background:#888
}
.combobox-container .form-control{
  width:1%;
	/*overflow: hidden;white-space: nowrap;position: absolute;width:auto;right:37px;left:0;*/
}

.combobox-container:not(.loaded) .status-icon,
.combobox-container:not(.loaded) .status-icon:after\ {
  border-radius: 50%;
  width: 10em;
  height: 10em;
	color:red;
}
.combobox-container:not(.loaded) .status-icon {
  margin: 0px auto;
	    position: absolute !important;
    top: 15px;
    right: 9px;
  font-size: 2px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #fff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.combobox-container.loaded .status-icon {
 		background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'/></svg>") no-repeat center 1px;
		background-size: 20px 24px;
    width: 100%;
    height: 100%;
		display:block;
}

.combobox-container.loaded:not(.combobox-selected) .status-icon {
 background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/></svg>");
}



.combobox-container .form-control:empty::before {
	content: attr(placeholder);
	color: #aaa;
}
select:empty::before {
	content: attr(placeholder);
	color: #aaa;
}
.combobox-container .form-control:empty:focus::before {
	content: "";
}

.combobox-container button{
  display: inline-block;
  font: normal normal normal 1em/1 'LineIcons';
  flex-shrink: 0;
  speak: none;
  text-transform: none;
  line-height: 1;
  vertical-align: -.25em;
  /* Better Font Rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/*.combobox-container button:before{
  content: "\\ea6a";
}
.combobox-container.combobox-selected button:before{
  content: "\\ea5e";
}


.combobox-container .dropdown-toggle{
	height: 34px;position: relative;border-left: solid 1px #ccc;width: 38px;
}*/

form.optional label.o-label:after,
form.optional legend.o-label:after {
    content: "(Optional)";
    color: #bbb;
    margin-left: 0.25rem;
} 

form label.o-label.required:after,
form legend.required:after {
    content: "*";
    color: #f00;
    margin-left: 0.25rem;
} 


input[type="color"] {
  -webkit-appearance: none;
   width: 30px;
   height: 30px;
   border: 0;
   border-radius: 50%;
   padding: 0;
   overflow: hidden;
   box-shadow: 2px 2px 5px rgba(0,0,0,.1);
}
input[type="color"]::-webkit-color-swatch-wrapper {
   padding: 0;
}
input[type="color"]::-webkit-color-swatch {
   border: none;
}
input:disabled + div > .gform-clear,
input:placeholder-shown + div > .gform-clear {
    opacity: 0;
    pointer-events: none;
}
`,
  _icons: {
    times_circle_outline: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    plus: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4V20M20 12L4 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    minus: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    times_circle: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`,
  },
  _arraycontainer: `
    <div data-id="{{id}}" class="col-xs-12">
      {{#array.legend}}<div class=" grid grid-cols-1 mb-2">
      <legend class="text-2xl">{{array.legend}}</legend>
      </div>
      {{/array.legend}}

      <div class="array_container"></div>               
      {{#array}}{{^append.enable}}{{>button}}
      {{/append.enable}}
      {{#append.enable}}<div style="text-align:left">{{>button}}</div>{{/append.enable}}{{/array}}
    </div>`,
  _inputClass: `disabled:bg-gray-200 disabled:text-gray-600 transition ease-in-out col-span-12 border-gray-300 focus:border-gform-300 focus:ring focus:ring-gform-200 focus:ring-opacity-50 rounded-md shadow-sm block w-full`,
  _checkClasses: `border-gray-300 text-gform-600 shadow-sm focus:border-gform-300 focus:ring focus:ring-gform-200 focus:ring-opacity-50`,
  _container: `
  <form class="gform grid gap-y-2 {{name}}" name="{{name}}"  {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}} novalidate  {{^autocomplete}}autocomplete="off"{{/autocomplete}}>
  <header class="mb-2 border-b-2 pb-4 empty:hidden">{{#legend}}<legend class="text-2xl" for="{{name}}"><h4>{{{legend}}}</h4></legend>{{/legend}}{{#subtitle}}<p class="text-gray-600">{{subtitle}}</p>{{/subtitle}}</header>
  <fieldset></fieldset>

  <footer class="gform-footer flex justify-between"></footer>
  </form>`,

  _clear: `
    <span data-id="{{id}}" class="transition duration-300 ease-in-out gform-clear cursor-pointer relative right-1 text-gray-300 hover:text-gray-500">
    {{>_icons.times_circle}}
    </span>
  `,
  _eye: `
  <div>
<svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"data-id="{{id}}" class="peer cursor-poiter gform-password absolute right-8 rounded-full bottom-2 h-6 w-6 p-0.5 pointer{{#show_password}}
   text-green-400 hover:green-600">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
{{/show_password}}
{{^show_password}}
   text-red-400 hover:red-600">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
{{/show_password}}

  </svg>

  <div class="rounded shadow-md absolute bottom-0 right-16 border border-gray-300 bg-gray-100 invisible peer-hover:visible">
<div class="px-2 py-1 text-gray-900 whitespace-nowrap">{{#show_password}}Hide Password{{/show_password}}
{{^show_password}}Show Password{{/show_password}}</div>
</div>
  </div>`,
  text: `
  <div class="relative">

  {{>_label}}
    <div class="relative rounded-md shadow-sm mt-1">
        {{#limit}}<small class="count absolute -bottom-5 right-1 text-gray-400" style="text-align:right">0/{{limit}}</small>{{/limit}}
        <input class="peer pr-8 {{_inputClass}}" {{#limit}} maxlength="{{limit}}"{{/limit}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}} " name="{{name}}" type="{{elType}}{{^elType}}{{type}}{{^type}}text{{/type}}{{/elType}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{id}}" />
              <div class="absolute inset-y-0 right-0 flex items-center">
        {{>_clear}}
        </div>
    </div>

  {{>_feedback}}
  {{>_actions}} 
  </div>
`,
  color: `
<div class="relative">

{{>_label}}
  <div class="relative rounded-md shadow-sm mt-1">
      {{#limit}}<small class="count absolute -bottom-5 right-1 text-gray-400" style="text-align:right">0/{{limit}}</small>{{/limit}}
      <div class="{{_inputClass}} p-1 flex border items-center focus-within:border-gform-300 focus-within:ring focus-within:ring-gform-200 focus-within:ring-opacity-50 relative overflow-hidden">
      <input class="peer w-10" name="{{name}}" type="color" value="{{value}}" id="{{id}}" />
      <input class="peer border-0 ml-1 focus:shadow-none focus:ring-0 p-0 absolute left-10" size="10" placeholder="{{placeholder}}" name="_{{name}}" type="text" {{#selected}} checked {{/selected}} value="{{value}}" id="_{{id}}" />

            <div class="absolute inset-y-0 right-0 flex items-center">
      {{>_clear}}
      </div>
      </div>
  </div>

{{>_feedback}}
{{>_actions}} 
</div>
`,
  range: `
<div class="relative">
{{>_label}}
  <div class="flex rounded-md mt-1 relative items-center">
  {{#pre}}<label class="whitespace-pre-wrap font-medium mr-2 text-xs md:max-w-[12rem]" for="{{id}}_{{name}}_1">{{{pre}}}</label>{{/pre}}

      <input class="peer flex-1 {{_inputClass}}" {{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}} " name="{{name}}" type="{{type}}{{^type}}text{{/type}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{id}}" />
      
      {{#alt}}<div class="flex items-center ml-4">{{>_clear}}</div><input name="value_of_{{name}}" placeholder="{{placeholder}}" disabled type="text" class="border-0 text-center bg-gray-100 font-bold rounded-md ml-2" value="{{value}}" size="{{size}}{{^size}}3{{/size}}/>{{/alt}}
      {{#post}}<label class="whitespace-pre-wrap font-medium ml-2 text-xs md:max-w-[12rem]" for="{{id}}_{{name}}_{{options.length}}">{{{post}}}</label>{{/post}}

</div>

{{>_feedback}}
{{>_actions}} 
</div>
`,
  sample: `
    <div class="relative">
    {{>_label}}
      <div class="relative rounded-md shadow-sm mt-1">
          {{#limit}}<small class="count absolute -bottom-5 right-1 text-gray-400" style="text-align:right">0/{{limit}}</small>{{/limit}}
          <div class="bg-white peer h-10 border pr-8 {{_inputClass}} flex items-center pl-3 {{^value}}text-gray-500{{/value}}" {{#limit}} maxlength="{{limit}}"{{/limit}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}} " name="{{name}}" type="output" {{#selected}} checked {{/selected}} value="{{value}}" id="{{id}}" >{{value}}{{^value}}{{placeholder}}{{/value}}</div>
                <div class="absolute inset-y-0 right-0 flex items-center">
          {{>_clear}}
          </div>
      </div>
    {{>_feedback}}
    {{>_actions}} 
    </div>

`,
  radio_preview: `<div class="relative">
    {{>_label}}
      {{#limit}}<small class=" count absolute top-1 right-1 text-gray-800" style="text-align:right">0/{{limit}}</small>{{/limit}}
    {{#options}}
      {{#label}}
      <b data-id="{{optgroup.id}}" class="text-muted {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}">{{label}}</b>
      {{/label}}
        <span class="col-span-12 grid md:grid-cols-{{size}}"">
          {{#options}}
                <label class="{{^horizontal}}my-1 {{/horizontal}}peer-disabled:text-gform-200 flex">
                <input class="{{_checkClasses}} mt-1 mr-2" data-id="{{optgroup.id}}" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{i}}" type="{{^multiple}}radio{{/multiple}}{{#multiple}}checkbox{{/multiple}}"><span class="noselect" style="font-weight:normal">{{{label}}}{{^label}}&nbsp;{{/label}}</span>
                </label>
          {{/options}}
        </span>
    {{/options}}
    {{>_feedback}}
    {{>_actions}}
  </div>
`,
  password: `
  <div class="relative">
  {{>_label}}

      <div class="mt-1 relative rounded-md shadow-sm col-span-12">
  <input class="peer pr-8  {{_inputClass}}" {{#limit}} maxlength="{{limit}}"{{/limit}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}} " name="{{name}}" type="{{^show_password}}{{type}}{{/show_password}}{{#show_password}}text{{/show_password}}{{^type}}text{{/type}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{id}}" />
          <div class="absolute inset-y-0 right-0 flex items-center">
   
  {{>_clear}}
  {{>_eye}}
  </div>
    </div>
  {{>_feedback}}
  {{>_actions}} 
  </div>
`,

  richtext: `
<div class="relative">
<div class="col-span-12">
  {{>_label}}
  <div name="{{name}}" id="{{id}}" class="trix-content">{{{display}}}</div>
  {{>_feedback}}
  {{>_actions}} 
  </div>
  </div>
`,
  imageview: `
<div class="relative">
  <img name="{{name}}" id="{{id}}" alt="{{label}}" src="{{value}}"></div>
`,
  switch: `

<div class="relative">
{{>_label}}
<label class="switch mt-2 mb-2">
<input data-false="{{{options.0.label}}}" data-true="{{{options.1.label}}}" name="{{name}}" type="checkbox" {{^editable}}disabled{{/editable}} {{#options.1.selected}}checked=checked{{/options.1.selected}} value="{{value}}" id="{{name}}" />
<span class="slider round bg-gform-500 border-gform-500 focus:shadow-lg"></span>
<span class="falseLabel left-14">{{{options.0.label}}} </span>
<span class="trueLabel left-14">{{{options.1.label}}}</span>
  
  {{>_feedback}}
  </label>
  {{>_actions}}  
  </div></div> 
`,
  checkbox: `
<div class="relative">
  {{>_label}}
  <div>
  <label class="col-span-12 pt-3 pb-3 disabled:text-gform-200 block">
      <input data-false="{{{options.0.label}}}" data-true="{{{options.1.label}}}" class="peer {{_checkClasses}} rounded mr-2" name="{{name}}" id="{{id}}" type="checkbox" {{^editable}}disabled{{/editable}} {{#options.1.selected}}checked=checked{{/options.1.selected}}>{{format.display}}&nbsp;
  </label>
  {{>_feedback}}
  </div>
  {{>_actions}}   
  </div>
`,
  hidden: `<input name="{{name}}" type="hidden" value="{{value}}" id="{{id}}" />{{>_feedback}}`,
  textarea: `
<div class="relative">
  {{>_label}}
  {{#limit}}<small class="count absolute bottom-1 right-1 text-gray-400" style="text-align:right">0/{{limit}}</small>{{/limit}}
  <textarea class="{{_inputClass}} mt-1" {{#limit}} maxlength="{{limit}}"{{/limit}} placeholder="{{placeholder}}" name="{{name}}" rows="{{size}}{{^size}}3{{/size}}" type="{{type}}" id="{{id}}" />{{value}}</textarea>
  {{>_feedback}}
  {{>_actions}}   
</div> `,
  select: `
  <div class=" relative">

    {{>_label}}
      {{#limit}}<small class="count absolute bottom-1 right-1 text-gray-400" style="text-align:right">0/{{limit}}</small>{{/limit}}

    {{#mapOptions.waiting}}<div style="position:relative;height:0">    <i class="loading" style="width: 30px;height: 30px;position:absolute;top:5px;left:5px"></i>
    </div>{{/mapOptions.waiting}}
    <div>
      <select class="peer mt-1 pr-8 {{_inputClass}}" {{#multiple}}multiple=multiple{{/multiple}}  {{#size}}size={{size}}{{/size}}  name="{{name}}{{#multiple}}[]{{/multiple}}" value="{{value}}" id="{{id}}" />

      {{#options}}
        {{^optgroup}}
          <option {{#selected}}selected='selected'{{/selected}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}  value="{{i}}">{{{label}}}</option>
        {{/optgroup}}
        {{#optgroup}}
        {{#optgroup.label}}<optgroup label="{{label}}" data-id="{{optgroup.id}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}">{{/optgroup.label}}

        {{#options}}
          <option data-id="{{optgroup.id}}" {{#selected}}selected='selected'{{/selected}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}  value="{{i}}">{{{label}}}</option>
        {{/options}}

        {{#optgroup.label}}</optgroup>{{/optgroup.label}}
        {{/optgroup}}
      {{/options}}

      </select>
      {{>_feedback}}
      {{>_actions}}  
    </div>
  </div>     
`,
  radio: `
<div class="relative">

  {{>_label}}
    {{#limit}}<small class=" count absolute top-1 right-1 text-gray-800" style="text-align:right">0/{{limit}}</small>{{/limit}}

  {{#options}}
  {{#optgroup}}
    {{#optgroup.label}}
    <b data-id="{{optgroup.id}}" class="text-muted {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}">{{label}}</b>
    {{/optgroup.label}}
    {{#visible}}
      <span class="col-span-12 grid md:grid-cols-{{size}}"">
        {{#options}}
              {{#visible}}<label class="{{^horizontal}}my-1 {{/horizontal}}peer-disabled:text-gform-200 flex">
              <input class="{{_checkClasses}} mt-1 mr-2" data-id="{{optgroup.id}}" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{i}}" type="{{^multiple}}radio{{/multiple}}{{#multiple}}checkbox{{/multiple}}"><span class="noselect" style="font-weight:normal">{{{label}}}{{^label}}&nbsp;{{/label}}</span>
              </label>{{/visible}}
        {{/options}}
      </span>
    {{/visible}}
  {{/optgroup}}
  {{/options}}




  {{>_feedback}}
  {{>_actions}}
</div>
  `,

  scale: `
    <div>
  {{>_label}}
  <fieldset class="flex flex-col">
    {{#options}}
    {{#optgroup}}
      <ul class="flex flex-row items-start mt-0.5 w-full">
        {{#pre}}<label class="whitespace-pre-wrap font-medium mr-2 mt-6 text-xs  md:max-w-[12rem]" for="{{id}}_{{name}}_1">{{{pre}}}</label>{{/pre}}
        {{#options}}
        <li class="relative flex-1 flex flex-col-reverse items-center min-w-fit w-10">
          <label class="inset-0 absolute text-center text-sm"  id="{{id}}_{{name}}_{{index}}_label" for="{{id}}_{{name}}_{{index}}">{{{label}}}</label>

          <input class="my-1" aria-labelledby="{{id}}_{{name}}_{{index}}_label" id="{{id}}_{{name}}_{{index}}" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{i}}" type="radio">
          <div>&nbsp;</div>
          <!--input class="peer sr-only my-1" id="{{name}}_{{index}}" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio">
          <label class="p-2 border rounded bg-white border-gray-300 cursor-pointer focus:outline-none hover:bg-gray-100 peer-checked:ring-gform-500 peer-checked:ring-2 peer-checked:border-transparent" for="{{name}}_{{index}}">{{{label}}}</label!-->
        </li>
        {{/options}}
        {{#post}}<label class="whitespace-pre-wrap font-medium ml-2 mt-6 text-xs md:max-w-[12rem]" for="{{id}}_{{name}}_{{options.length}}">{{{post}}}</label>{{/post}}
      </ul>
    {{/optgroup}}
    {{/options}}
    {{>_feedback}}
    {{>_actions}}
  </fieldset>
  </div>`,
  _fieldset: `<div>
    <fieldset {{#section}}data-section="{{index}}"{{/section}} class="px-1 {{#array}}bg-slate-300 bg-opacity-10 border-l  border-gray-300 border-dashed {{/array}}" id="{{id}}" name="{{name}}">
          {{#label}}
            <div class="o-label-c  border-b border-gray-300 mb-2">
            <legend class=" w-full" for="{{name}}">
            <h5 class=" o-label font-bold text-lg text-legend">{{{label}}}</h5>
            <small class="text-gray-600 o-help">{{{help}}}</small>
            {{>_feedback}}
            </legend>
            </div>
            {{^array}}<div class="row-container"></div>{{/array}}
          {{/label}}
          {{^label}}<small class="text-gray-600 o-help">{{{help}}}</small>{{>_feedback}}{{/label}}
        {{>_actions}}
    </fieldset>
  </div>`,
  grid: `<div class="grid grid-cols-12">
  <fieldset id="{{id}}" name="{{name}}" class="col-span-12">
  {{>_label}}
  {{>_feedback}}
  <div class=" overflow-hidden rounded-md border-gray-200 ">
  <table class="table table-striped min-w-full bg-white text-left" style="margin-bottom:0">
  <thead>
      <tr class="border-gray-300 border-b-2">
          <th style="width:25%" class="min-w-fit text-left py-2 px-4"></th>
          {{#list}}
          <th  class="py-1 text-center" >{{label}}</th>
          {{/list}}
      </tr>
  </thead>
  <tbody>
  {{#fields}}
      <tr class="border-gray-200 border-b">
          <td class="text-left py-2 px-4" ><label style="font-weight: 500;" for="{{id}}">{{{label}}}</label></td>

          {{#list}}
          <td class="text-center relative">
          {{#multiple}}
              <div><input name="{{id}}" type="checkbox" aria-labelledby="grid_{{parent.id}}_{{value}}" {{#selected}} checked {{/selected}} value="{{value}}"/>
          {{/multiple}}
          {{^multiple}}
              <label for="{{id}}_{{value}}" class="inset-0 absolute text-transparent">{{label}}</label><input style="margin-right: 5px;" name="{{id}}" id="{{id}}_{{value}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio">
          {{/multiple}}
          </td>
          {{/list}}
      </tr>
      {{/fields}}
  </tbody>
  </table>
</div>
  {{>_actions}}

  </fieldset>
</div>`,

  _actions: `      
  {{#array}}
  <div data-name="{{name}}" data-ref="{{am.id}}" class="hover:opacity-100 opacity-75 right-0 top-0 absolute actions noprint inline-flex z-10 flex-row-reverse gap-x-2" >
  {{#duplicate.enable}}
  <button data-id="{{id}}" class="gform-add shadow-md hover:shadow-lg focus:shadow-lg rounded-full  h-7 w-7 bg-green-500 text-white font-medium text-xs leading-tight uppercase hover:bg-green-600 focus:bg-green-600 focus:z-10 focus:outline-none focus:ring ring-offset-1 active:bg-green-700 transition duration-150 ease-in-out flex justify-center items-center" value="duplicate" type="button">{{duplicate.label}}{{^duplicate.label}}{{>_icons.plus}}{{/duplicate.label}}</button>
  {{/duplicate.enable}}
{{#remove.enable}}
  <button data-id="{{id}}" class="gform-minus shadow-md hover:shadow-lg focus:shadow-lg rounded-full h-7 w-7 bg-red-500 text-white font-medium text-xs leading-tight uppercase hover:bg-red-600 focus:bg-red-600 focus:outline-none focus:ring ring-offset-1 active:bg-red-700 transition duration-150 ease-in-out flex justify-center items-center" type="button" value="remove">{{remove.label}}{{^remove.label}}{{>_icons.minus}}{{/remove.label}}</button>
{{/remove.enable}}
  </div>
  {{/array}}
`,
  _tooltip: `<div id="tooltip" role="tooltip">
<span class="info-close"></span>
<div class="tooltip-body"></div>
<div id="arrow" data-popper-arrow></div>
</div>`,
  _info: `<div class="rounded shadow-md absolute left-4 bottom-full border bg-white hidden peer-hover:inline-block">
<div class="p-1 text-gray-900 whitespace-nowrap">{{info}}</div>
</div>`,
  _label: `<div class="relative o-label-c">
<label class="o-label font-medium font-sans text-sm text-label {{#required}}required{{/required}}" for="{{id}} ">{{#label}}{{{label}}}{{/label}}</label>
{{#help}}<small class="text-gray-600 o-help">{{{help}}}</small>{{/help}}{{#info}}
<span class="relative">
<svg data-id="{{id}}" class="peer bottom-0.5 left-1 relative cursor-pointer inline w-5 h-5 text-gray-400 hover:text-gray-600 fill-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
{{>_info}}
</span>
{{/info}}
</div>`,
  _feedback: `<small class="col-span-12 feedback"></small>`,
  // button: `<button data-id="{{id}}" type="button" role="button" class="justify-self-start p-2 border border-transparent rounded-md font-semibold text-xs  uppercase tracking-widest text-white bg-{{color}}-800 hover:bg-{{color}}-700 active:bg-{{color}}-900 focus:outline-none focus:border-{{color}}-900 focus:ring focus:ring-{{color}}-300 disabled:opacity-25 transition {{modifiers}}">{{{label}}}</button>`,
  button: `<button data-id="{{id}}" data-action="{{action}}" type="button" role="button" class="rounded inline-block px-6 py-2.5 font-medium text-xs leading-tight uppercase  focus:outline-none focus:ring-0 transition duration-150 ease-in-out  {{^color}}text-gray-700 hover:bg-gray-100 {{/color}}{{#color}}disabled:bg-{{color}}-100 bg-{{color}}-500 shadow-md hover:bg-{{color}}-600 hover:shadow-lg focus:bg-{{color}}-600 focus:shadow-lg  active:bg-{{color}}-700 active:shadow-lg text-white rounded {{/color}}{{modifiers}}">{{{label}}}</button>`,
  modal_container: `

<!-- Modal -->
<div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
  id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog relative w-auto pointer-events-none">
    <div
      class="modal-content border shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
      <div
        class="modal-header {{modal.header_class}} flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
        <h5 class="text-xl font-medium leading-normal text-gform-800" id="exampleModalLabel">{{{title}}}{{{legend}}}</h5>
        <button type="button"
          class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
          onClick="gform.instances.{{name}}.destroy()" aria-label="Close"></button>
      </div>
      <div class="modal-body relative p-4">

      {{{body}}}
      {{^sections}}
      <form id="{{name}}" {{^autocomplete}}autocomplete="off"{{/autocomplete}} name="{{name}}" class="gform {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}></form>
      {{/sections}}
      {{#sections}}
      <form id="{{name}}" novalidate {{^autocomplete}}autocomplete="off"{{/autocomplete}} name="{{name}}" class="gform tab-content {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>
    <ul class="tabs">
      {{#fields}}
          {{#section}}
      
              <a href="#tabs{{id}}" data-toggle="tab"><li {{^index}}class="active"{{/index}}>{{{legend}}}</li></a>
          
        {{/section}}		
      {{/fields}}
      </ul></form>
      {{/sections}}

      </div>
      <div
        class="modal-footer p-4 border-t border-gray-200 rounded-b-md">
  <div class="footer gform-footer flex justify-between">{{{footer}}}</div>

      </div>
    </div>
  </div>
</div>

`,
  _custom_radio_button: `
<button type="button" role="button" name="{{id}}" value="{{i}}"  data-value="{{i}}" data-id="{{optgroup.id}}" class="{{^selected}}{{defaultClass}}{{/selected}}{{#selected}}{{selectedClass}}{{/selected}} justify-self-start mt-2 px-2 py-2 border border-gray-200 rounded-md font-semibold text-xs tracking-widest focus:ring focus:outline-none disabled:opacity-25 transition {{modifiers}}">
{{{label}}}{{^label}}&nbsp;{{/label}}
</button>`,
  custom_radio: `
<div class="relative">
  {{>_label}}
    {{#options}}
      {{#optgroup}}
        {{#optgroup.label}}
        <b data-id="{{optgroup.id}}" class="text-muted {{^editable}}disabled{{/editable}}">{{label}}</b>
        <hr>
        {{/optgroup.label}}
        <fieldset name="{{name}}" class="col-span-12 mb-1 {{^visible}}hidden{{/visible}} {{#size}}grid grid-cols-{{size}}{{/size}}">

        {{#options}}
          {{#visible}}{{>_custom_radio_button}}{{/visible}}
        {{/options}}
        </fieldset>
      {{/optgroup}}
    {{/options}}
    {{#limit}}<small class="count absolute -bottom-5 right-1 text-gray-400" style="text-align:right">0/{{limit}}</small>{{/limit}}

  {{>_feedback}}
  {{>_actions}}
</div>`,

  contenteditable: `<div class="row clearfix form-group {{modifiers}} {{#array}}isArray" data-min="{{array.min}}" data-max="{{array.max}}{{/array}}" data-type="{{type}}">
{{>_label}}
{{#label}}
{{^horizontal}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/horizontal}}
{{#horizontal}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/horizontal}}
{{/label}}
{{^label}}
<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
{{/label}}

  <div class="formcontrol" style="height:auto" id={{id}}><div placeholder="{{placeholder}}" style="outline:none;border:solid 1px #cbd5dd;{{^unstyled}}background:#fff;padding:10px{{/unstyled}}" name="{{name}}">{{content}}{{value}}</div></div>
  {{#limit}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/limit}}
  {{>_addons}}
    {{>_actions}}
</div>
</div>`,
  trixeditor: `<div class="row clearfix form-group {{modifiers}} {{#array}}isArray" data-min="{{array.min}}" data-max="{{array.max}}{{/array}}" data-type="{{type}}">
{{>_label}}

<div class="col-md-12">

  <input id="{{id}}" value="{{value}}" type="hidden" name="{{name}}">
  <trix-editor input="{{id}}" class="trix-content"></trix-editor>
  {{#limit}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/limit}}
  {{>_addons}}
    {{>_actions}}
</div>
</div>`,
  output: `
<div class="row">
<div>
		{{>_label}}
		
	<div class="col-xs-12">
    <output name="{{name}}" id="{{id}}">{{{display}}}{{^display}}&nbsp;{{/display}}</output>
		{{>_addons}}
		{{>_actions}} 
		</div>
    </div>
    </div>
`,
  template:
    '<div><div class="column column-100">{{#array}}{{#append.enable}}<button data-id="{{id}}" data-parent="{{parent.id}}" class="gform-append float-right">{{append.label}}{{^append.label}}Add{{/append.label}}</button>{{/append.enable}}{{/array}}<legend>{{label}}</legend><div class="list-group gform-template_row"></div></div></div>',
  template_item: `<div class="input-template"><div class="gform-template_container">{{{format.template}}}{{^format.template}}{{{value}}}{{/format.template}}</div></div>`,
  child_modal_footer: `<button class="hidden-print button-outline gform-minus float-left" style="margin:0 15px">X Delete</button><button class="float-right hidden-print done" style="margin:0 15px"><i class="fa fa-check-o"></i>Done</button>`,
  table: `
    <div class="column column-100">
      {{#array}}
      <div style="overflow:scroll" class="column column-100">
        {{#append.enable}}<button data-id="{{id}}" data-parent="{{parent.id}}" class="gform-append float-right">{{append.label}}
        {{^append.label}}Add{{/append.label}}</button>{{/append.enable}}
        {{/array}}<h3>{{label}}</h3><table class="{{#array.sortable.enable}}sortable{{/array.sortable.enable}}"><thead>{{#fields}}<th>{{label}}</th>{{/fields}}</thead><tbody></tbody></table></div></div>`,
};
// gform.columns = 12;
gform.columnClasses = _.map(new Array(13), function (item, i) {
  return "col-span-12 sm:col-span-" + i;
});
gform.columnClasses[0] = "hidden";
gform.offsetClasses = _.map(new Array(13), function (item, i) {
  return "sm:col-offset-" + (i + 1);
});

gform.startClasses = _.map(new Array(13), function (item, i) {
  return "sm:col-start-" + (i + 1);
});

// gform.columnClasses = _.map(['','10','20','25','33','40','50','60','66','75','80','90','100'],function(item){return 'column-'+item+' column'})
gform.prototype.options.default.suffix = "";
gform.prototype.options.columns = 12;

gform.handleError = function (field) {
  let feedback_el = field.el.querySelector(".feedback");
  if (feedback_el == null) return;
  _j.toggleClass(feedback_el, "text-red-500", !field.valid);
  _j.toggleClass(feedback_el, "text-green-500", field.valid);
  feedback_el.innerHTML = field.valid
    ? field.success || field.validText || ""
    : field.errors;
  // feedback_el;
  // text-red-500
  // if (field.valid) {
  //     if (field.satisfied(field.get())) {
  //         if (field.el.querySelector(".valid") !== null) {
  //             field.el.querySelector(".valid").innerHTML =
  //                 field.success || field.validText || "";
  //         }
  //     }
  //     field.el.classList.remove("error");
  //     if (field.el.querySelector(".error-text") !== null) {
  //         field.el.querySelector(".error-text").innerHTML = "";
  //     }
  // } else {
  //     if (field.el.querySelector(".error-text") !== null) {
  //         field.el.querySelector(".error-text").innerHTML = field.errors;
  //     }
  //     field.el.classList.add("error");

  //     if (field.el.querySelector(".valid") !== null) {
  //         field.el.querySelector(".valid").innerHTML = "";
  //     }
  // }
};
close = function () {};
gform.prototype.options.default.color = "gray";

gform.types["custom_radio"].defaults = {
  selectedClass:
    "text-white bg-gform-500 hover:bg-gform-600 active:bg-gform-800 focus:border-gform-800 focus:ring-gform-200",
  defaultClass:
    "hover:bg-gray-200 active:bg-gray-300 focus:border-gray-900 focus:ring-gray-300",
};
gform.types["custom_radio"].get = function () {
  if (!("el" in this)) {
    return this.internalValue;
  }
  if (this.multiple) {
    return (this.internalValue = _.isArray(this.internalValue)
      ? this.internalValue
      : _.compact([this.internalValue]));
  }
  return this.internalValue;
};
gform.types["custom_radio"].set = function (value) {
  if (this.multiple && _.isArray(value)) {
    _.each(value, value => {
      let option = _.find(this.list, { value: value });
      if (!this.el) return;
      if (option !== null) {
        _j.addClass(
          this.el.querySelector('[data-value="' + option.i + '"]'),
          this.selectedClass
        );
        _j.removeClass(
          this.el.querySelector('[data-value="' + option.i + '"]'),
          this.defaultClass
        );
      }
    });
  } else {
    let option = _.find(this.list, { value: value }) ?? null;
    if (!this.el) return;
    if (option !== null) {
      _j.addClass(
        this.el.querySelector('[data-value="' + option.i + '"]'),
        this.defaultClass
      );
      _j.removeClass(
        this.el.querySelector('[data-value="' + option.i + '"]'),
        this.selectedClass
      );
    }
  }
  if (this.el.querySelector(".count") != null) {
    var text = value.length;
    if (this.limit > 1) {
      text += "/" + this.limit;
    }
    this.el.querySelector(".count").innerHTML = text;
  }

  if (typeof gform.types[this.type].setup == "function") {
    gform.types[this.type].setup.call(this);
  }
};
gform.types["custom_radio"].toggle = function (e) {
  var newval = true;
  if (this.multiple && _.isArray(this.internalValue)) {
    if (
      this.internalValue.indexOf(
        (
          _.find(this.list, {
            i: parseInt(e.target.dataset.value, 10),
          }) || {}
        ).value
      ) >= 0
    ) {
      newval = false;
    }
  }
  //maybe reneable to allow no selection - but i dont think its quite right as is
  // else {
  //   if ((_.find(this.list, { i: parseInt(e.target.dataset.value, 10) }) || {}).value == this.internalValue) {
  //     newval = false;
  //   }
  // }

  var currentSelection;

  if (!this.multiple) {
    currentSelection = this.el.querySelector(".bg-gform-500");

    if (currentSelection !== null) {
      gform.toggleClass(currentSelection, this.selectedClass, false);
      gform.toggleClass(currentSelection, this.defaultClass, true);
    }
  } else if (this.limit) {
    currentSelection = this.el.querySelectorAll(".bg-gform-500");
    if (currentSelection.length >= this.limit) {
      newval = false;
    }
  }

  gform.toggleClass(e.target, this.defaultClass, !newval);
  gform.toggleClass(e.target, this.selectedClass, newval);

  if (!this.multiple) {
    this.internalValue = (
      _.find(this.list, {
        i: parseInt(
          (e.target || { dataset: { value: this.internalValue } }).dataset
            .value,
          10
        ),
      }) || {}
    ).value;
  } else {
    this.internalValue = _.map(this.el.querySelectorAll(".bg-gform-500"), e => {
      return (_.find(this.list, { i: parseInt(e.dataset.value, 10) }) || {})
        .value;
    });
  }
  if (this.el.querySelector(".count") != null) {
    var text = this.get().length;
    if (this.limit > 1) {
      text += "/" + this.limit;
    }
    this.el.querySelector(".count").innerHTML = text;
  }
  this.owner.trigger("change", this);
  this.owner.trigger("input", this);
};

gform.types["trixeditor"] = _.extend({}, gform.types["input"], {
  render: function () {
    return gform.render("trixeditor", this);
  },
  set: function (value) {
    // this.quill.root.setHTML(value);
  },
  get: function () {
    // if ("el" in this && this.el.parentElement) debugger;
    return "el" in this && this.el.parentElement
      ? this.element.editor.selectionManager.element.value
      : this.internalValue;
  },
  initialize: function () {
    this.$el = this.el.querySelector(".formcontrol > div");
    this.onchangeEvent = function (input) {
      this.internalValue = this.get();
      gform.types[this.type].setup.call(this);
      this.parent.trigger(["change"], this, {
        input: this.internalValue,
      });

      // if (input) {
      this.parent.trigger(["input"], this, {
        input: this.internalValue,
      });
      // }
    }.bind(this);
    this.element = this.el.querySelector("trix-editor");
    gform.types[this.type].set.call(this, this.value, true);
    this.element.addEventListener("trix-change", this.onchangeEvent);
    gform.types[this.type].setLabel.call(this);
  },
  satisfied: function (value) {
    value = this.get();
    return (
      typeof value !== "undefined" &&
      value !== null &&
      value !== "" &&
      value !== "<p><br></p>"
    );
  },
  focus: function () {
    // this.quill.focus();
  },
});

gform.types["contenteditable"] = gform.types["summernote"] = _.extend(
  {},
  gform.types["input"],
  {
    render: function () {
      return gform.render("contenteditable", this);
    },
    set: function (value) {
      this.$el.summernote("code", value);
    },
    get: function () {
      //   return this.el.querySelector('textarea[name="' + this.name + '"]').value;
      return "el" in this ? this.$el.summernote("code") : this.internalValue;
    },
    initialize: function () {
      this.$el = $(this.el).find(".formcontrol > div");
      this.$el.off();
      if (this.onchange !== undefined) {
        this.$el.on("input", this.onchange);
      }
      this.$el.summernote({
        disableDragAndDrop: true,
        dialogsInBody: true,
        toolbar: this.item.toolbar || [
          // [groupName, [list of button]]
          ["style", ["bold", "italic", "underline", "clear"]],

          ["color", ["color"]],
          // ["link", ["linkDialogShow", "unlink"]],
          ["fontsize", ["fontsize"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["font", ["strikethrough", "superscript", "subscript"]],

          // ["height", ["height"]],
          // ["view", ["fullscreen"]],
        ],
      });
      $(this.el).find(".note-editable").addClass("trix-content");
      gform.types[this.type].set.call(this, this.value, true);

      this.$el.on(
        "summernote.change",
        function () {
          this.owner.trigger("change", this);

          this.owner.trigger("input", this);
        }.bind(this)
      );
      gform.types[this.type].setLabel.call(this);
    },
    satisfied: function (value) {
      value = this.get();
      return (
        typeof value !== "undefined" &&
        value !== null &&
        value !== "" &&
        value !== "<p><br></p>"
      );
    },
    destroy: function () {
      this.$el.summernote("destroy");
      if (this.$el) {
        this.$el.off();
      }
    },
  }
);
gform.types["custom_editable"] = _.extend({}, gform.types["input"], {
  default: { row: false, label: false },
  create: function () {
    var tempEl = gform.create(this.render());
    // var tempEl = document.createElement("span");
    tempEl.setAttribute("id", "el_" + this.id);
    tempEl.setAttribute("contenteditable", false);
    tempEl.dataset.type = "custom_editable";
    tempEl.dataset.placeholder = this.placeholder || "";
    tempEl.innerText = this.value;
    gform.addClass(
      tempEl,
      gform.columnClasses[this.columns || gform.prototype.options.columns]
    );
    tempEl.addEventListener("mousedown", () => {
      if (document.activeElement == tempEl) return;
      tempEl.setAttribute("contenteditable", true);
      debugger;
      gform.types["custom_editable"].focus(tempEl);
    });
    tempEl.addEventListener("blur", () => {
      tempEl.setAttribute("contenteditable", false);
    });
    // gform.addClass(
    //     tempEl,
    //     gform.offsetClasses[this.offset || gform.prototype.options.offset]
    // );
    gform.toggleClass(tempEl, "gform_isArray", !!this.array);
    //   if(this.owner.options.clear){
    // tempEl.setAttribute("class", gform.columnClasses[this.columns]+' '+gform.offsetClasses[this.offset]);
    //   }
    // tempEl.innerHTML = this.render();
    return tempEl;
  },
  render: function () {
    return '<div style="user-select:none" class="outline-offset-8 mb-1 outline-blue-400 outline-rounded inline-block w-full" spellcheck="false"></div>';
  },
  set: function (value) {
    if (this.el.innerText !== value) this.el.innerText = value;
  },
  get: function () {
    //   return this.el.querySelector('textarea[name="' + this.name + '"]').value;
    return "el" in this ? this.el.innerText : this.internalValue;
  },
  // initialize: function () {
  //     // this.$el = $(this.el).find(".formcontrol > div");
  //     this.$el.off();
  //     if (this.onchange !== undefined) {
  //         this.$el.on("input", this.onchange);
  //     }

  //     this.$el.on(
  //         "summernote.change",
  //         function () {
  //             this.owner.trigger("change", this);

  //             this.owner.trigger("input", this);
  //         }.bind(this)
  //     );
  //     gform.types[this.type].setLabel.call(this);
  // },
  // satisfied: function (value) {
  //     value = this.get();
  //     return true;
  // },
  focus: function (elin) {
    let el = elin || this.el;
    el.focus();
    if (
      typeof window.getSelection != "undefined" &&
      typeof document.createRange != "undefined"
    ) {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  },
  destroy: function () {},
});
gform.types.richtext = {
  ...gform.types.input,
  base: "content",
  defaults: { parse: false, report: false },
};
gform.types.imageview = {
  ...gform.types.input,
  base: "content",
  defaults: { parse: false, report: false },
};
gform.types.sample = {
  ...gform.types.input,
  defaults: {
    limit: 10,
    help: "Help text",
    info: "Some extra info goes here",
  },
};

_.each(["text", "number"], type => {
  gform.stencils[type + "_preview"] = gform.stencils.sample;
});

gform.types.radio_preview = {
  // ...gform.types.input,
  ...gform.types.radio,
  defaults: {
    // limit: 10,
    help: "Help text",
    info: "Some extra info goes here",
  },
};

gform.types["color"] = _.extend({}, gform.types["input"], {
  get: function () {
    return "el" in this
      ? this.el.querySelector('[name="' + this.name + '"]').value
      : this.internalValue;
  },

  set: function (value) {
    if ("el" in this) {
      this.el.querySelector('[name="' + this.name + '"]').value =
        value || "#000000";
      this.el.querySelector('[name="_' + this.name + '"]').value =
        value || "#000000";
    }
  },
  resetValue: function () {
    return this.item.defaultValue || "#000000";
  },
  initialize: function () {
    this.onchangeEvent = function (input, e) {
      if (e.target.name == this.name) {
        this.internalValue = this.get() || this.owner.call("resetValue", this);
        this.el.querySelector('[name="_' + this.name + '"]').value =
          this.internalValue;
      } else if (e.target.name == "_" + this.name) {
        this.internalValue =
          this.el.querySelector('[name="_' + this.name + '"]').value ||
          this.owner.call("resetValue", this);
        this.el.querySelector('[name="' + this.name + '"]').value =
          this.internalValue;
      }

      gform.types[this.type].setup.call(this);
      this.parent.trigger(["change"], this, { input: this.value });

      if (input) {
        this.parent.trigger(["input"], this, {
          input: this.value,
        });
      }
    }.bind(this);
    this.input = this.input || false;
    this.el.addEventListener("input", this.onchangeEvent.bind(null, true));

    this.el.addEventListener("change", this.onchangeEvent.bind(null, false));

    gform.types[this.type].setup.call(this);
  },
});

// $(document).on("focusin", function (e) {
//     if ($(e.target).closest(".note-editable").length) {
//         e.stopImmediatePropagation();
//     }
// });
// $(document).on("click", function (e) {
//     if ($(e.target).hasClass(".note-editor")) {
//         e.stopImmediatePropagation();

//         $(e.target).find(".open").removeClass("open");
//     }
// });

gform.types["cancel"] = {
  ...gform.types["button"],
  defaults: {
    ...gform.types["button"].defaults,
    row: false,
    label: '<i class="fa fa-times"></i> Cancel',
    action: "cancel",
    color: "red",
    modifiers: "button-outline float-right",
  },
};
gform.types["save"] = {
  ...gform.types["button"],
  defaults: {
    ...gform.types["button"].defaults,
    row: false,
    label: '<i class="fa fa-check"></i> Save',
    action: "save",
    color: "green",
    modifiers: "",
  },
};
gform.types["reset"] = {
  ...gform.types["button"],
  defaults: {
    ...gform.types["button"].defaults,
    row: false,

    label: '<i class="fa fa-times"></i> Reset',
    action: "reset",
    color: "yellow",
    modifiers: "button-outline",
  },
};
gform.types["clear"] = {
  ...gform.types["button"],
  defaults: {
    ...gform.types["button"].defaults,
    row: false,

    label: '<i class="fa fa-times"></i> Clear',
    action: "clear",
    color: false,
    modifiers: "button-outline",
  },
};

gform.types.fieldset.setLabel = function () {
  this.label = gform.renderString(
    (this.format || { title: null }).title ||
      this.item.title ||
      this.item.label ||
      this.label,
    this
  );

  var labelEl = this.el.querySelector("legend h5");
  if (labelEl !== null) {
    labelEl.innerHTML = this.label;
    gform.toggleClass(this.labelEl, "required", this.required);
  }
};
gform.prototype.options.rowClass =
  "grid grid-cols-12 gap-4 mb-3 items-start col-span-12";

gform.prototype.modal = function (data) {
  var el = this.modalEl || this.el;

  if (!document.body.contains(el)) {
    document.body.appendChild(el);
    el.querySelector(".btn-close").addEventListener(
      "click",
      function () {
        (this.owner || this).trigger("close", this);
      }.bind(this)
    );
  }

  switch (data) {
    case "hide":
      gform.addClass(el, "hidden");
      break;
    default:
      gform.removeClass(el, "hidden");
  }
  // $(this.el).modal(data)
  return this;
};
gform.types["address"] = _.extend(
  {},
  gform.types["input"],
  gform.types["section"],
  {
    defaults: {
      fields: [
        {
          type: "text",
          name: "street",
          label: "Street Address",
          validate: [{ type: "length", max: "255" }],
        },
        {
          type: "text",
          name: "line2",
          label: "Address line 2",
          validate: [{ type: "length", max: "150" }],
        },
        {
          type: "text",
          name: "city",
          label: "City",
          validate: [{ type: "length", max: "255" }],
          columns: 6,
        },
        {
          type: "text",
          name: "state",
          label: "State/Province/Region",
          validate: [{ type: "length", max: "255" }],
          columns: 6,
        }, //,display:[{type:"not_matches",name:"country",value:"US"}]},
        // {type:"combo",name:'state',options:'../data/states.json',format:{label:'{{name}}'},label:"State/Province/Region",columns:6},
        {
          type: "text",
          name: "zip",
          label: "Postal/Zip Code",
          validate: [{ type: "length", max: "15" }],
          columns: 6,
        },
        {
          type: "select",
          name: "country",
          options: [
            {
              type: "optgroup",
              path: "../data/countries.json",
              format: { label: "{{name}}", value: "{{code}}" },
            },
          ],
          label: "Country",
          validate: [{ type: "length", max: "15" }],
          columns: 6,
        },
      ],
    },
  }
);

gform.stencils[
  "number_range"
] = `<div class="row clearfix form-group {{modifiers}}" data-type="{{type}}">
<div class="col-md-12">
  <span style="display:flex;">
  <span style="position:relative"><input autocomplete="off" class="form-control" size=4 maxlength="4" placeholder="Min" type="number" name="min_{{name}}" id="min_{{id}}" value="" /> <div class="gclear" data-clear="min_"><svg style="width:1.25em;height:1.25em;cursor:pointer;transition-duration: 300ms;transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);transition-property: color;color:#333;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></span>
  <span style="position:relative"><input autocomplete="off" class="form-control" size=4 maxlength="4" placeholder="Max" type="number" name="max_{{name}}" id="max_{{id}}" value="" /> <div class="gclear" data-clear="max_"><svg style="width:1.25em;height:1.25em;cursor:pointer;transition-duration: 300ms;transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);transition-property: color;color:#333;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></span>
  </span>
  </div>
</div>`;
gform.stencils[
  "freetext_filter"
] = `<div class=" clearfix form-group {{modifiers}}" data-type="{{type}}">
  
  <div class="">
    {{#pre}}<div class="input-group col-xs-12"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
    {{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
    <span style="display:flex;position:relative"><input {{^autocomplete}}autocomplete="off"{{/autocomplete}} class="form-control" {{^editable}}readonly disabled{{/editable}} {{#limit}}maxlength="{{limit}}"{{/limit}} min="{{min}}" {{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}}{{^placeholder}}Filter{{/placeholder}}" type="{{elType}}{{^elType}}{{type}}{{/elType}}" name="{{name}}" id="{{id}}" value="" /> <div class="gclear" ><svg class="" style="width:1.25em;height:1.25em;cursor:pointer;transition-duration: 300ms;transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);transition-property: color;color:#333;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></span>
    
    {{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
    {{^post}}{{#pre}}</div>{{/pre}}{{/post}}
    {{#limit}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/limit}}
  
    {{>_addons}}
    {{>_actions}}
  </div>
  </div>`;
gform.stencils[
  "date_range"
] = `<div class=" clearfix form-group {{modifiers}}" data-type="{{type}}">
<div class="">
  <span class="flex flex-col items-center overflow-hidden">
    <span class="flex-1 relative"><input autocomplete="off" class="peer pr-8 {{_inputClass}}" size=4 maxlength="4" placeholder="Min" type="date" name="min_{{name}}" id="min_{{id}}" value="" /> 
    
    <div class="gclear absolute  flex items-center right-1 inset-y-0" data-clear="min_"><svg style="width:1.25em;height:1.25em;cursor:pointer;transition-duration: 300ms;transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);transition-property: color;color:#333;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></span>
    
    <span class="flex-1 relative"><input autocomplete="off" class="peer pr-8 {{_inputClass}}" size=4 maxlength="4" placeholder="Max" type="date" name="max_{{name}}" id="max_{{id}}" value="" /> 
    <div class="gclear absolute  flex items-center right-1 inset-y-0" data-clear="max_"><svg style="width:1.25em;height:1.25em;cursor:pointer;transition-duration: 300ms;transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);transition-property: color;color:#333;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></span>
  </span>
  </div>
</div>`;
gform.stencils[
  "filter"
] = `<div name="{{name}}" id="{{id}}" data-type="{{type}}" style="position:relative">
{{^hideLabel}}<label>{{{label}}}{{^label}}&nbsp;{{/label}}</label>{{/hideLabel}}
<span class="badge count" style="position: absolute;top: -5px;left: -5px;background:#466769"></span>
<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: 100%;display: flex;justify-content: space-between;align-items: center;padding-left: 1em;padding-right: 0.5em;gap: 0.5em;">
  Filter <span class="caret"></span>
</button>
<ul class="dropdown-menu" style="left:initial;padding: 5px 0 0;z-index: 10;">

  <li style="position:relative"><input type="text" placeholder="Search..." style="margin:-3px 2px 2px;width:auto" class="form-control"/> <div class="gclear" >

<svg class="" style="width:1.25em;height:1.25em;cursor:pointer;transition-duration: 300ms;transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);transition-property: color;color:#333;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
</svg>

    </div></li>
<ul style="padding-left:0;max-height: 250px;overflow: scroll;border-bottom: solid 1px #eee;border-top: solid 1px #eee;"></ul>
    <li class="greset text-danger"><a href="#" style="color: inherit">Reset {{{label}}} Filters</a></li>
</ul></div>
</div></div>`;

document.body.appendChild(
  gform.create("<style>" + gform.render("_style", {}, "all") + "</style>")
);

gform.stencils.actions = `
<table style="width:100%">
<thead>
<tr>
<th>
<div class="btn-group pull-left" style="white-space: nowrap; font-size: 0;" role="group" aria-label="...">

{{#options.actions}}
{{#name}}
<a href="javascript:void(0);" style="display: inline-block;font-size: 14px;float: none;clear: none;" data-event="{{name}}" class="grid-action disabled btn btn-{{type}}{{^type}}default{{/type}}">{{{label}}}</a>
{{/name}}

{{^name}}
</div>
</th>
<th style="width:100%">
<div class="btn-group pull-{{^align}}left{{/align}}{{align}}" style="margin-left:15px;white-space: nowrap; font-size: 0;" role="group" aria-label="...">

{{/name}}
{{/options.actions}}
</div>
</th>
</tr>
</thead>
</table>`;

gform.stencils.count = `{{#checked_count}}<h5 class="range label label-info checked_count" style="margin:7px 0">{{checked_count}} item(s) selected</h5>{{/checked_count}}`;

gform.stencils.mobile_head = `
<div style="clear:both;">

  {{#options.sort}}

  <div class="row" style="margin-bottom:10px">

    <div class="col-xs-6">
    {{#options.filter}}

      <div name="reset-search" style="position:relative" class="btn btn-default" data-toggle="tooltip" data-placement="left" title="Clear Filters">
        <i class="fa fa-filter"></i>
        <i class="fa fa-times text-danger" style="position: absolute;right: 5px;"></i>
      </div>    

    <div class="btn btn-info filterForm">Filter</div>
  {{/options.filter}}
    </div>
    <div class="col-xs-6">
    		{{#options.search}}<input type="text" name="search" class="form-control" style="" placeholder="Search">{{/options.search}}
        </div>
    </div>
    <div class="input-group">
      <span class="" style="display: table-cell;width: 1%;white-space: nowrap;vertical-align: middle;padding-right:5px">
        <button class="btn btn-default reverse" type="button" tabindex="-1"><i class="fa fa-sort text-muted"></i></button>
      </span>
        <select class="form-control sortBy">
          <option value=true>None</option>
          {{#items}}
            {{#visible}}
              <option value="{{id}}">{{label}}</option>
            {{/visible}}
          {{/items}}
        <select>
    </div>
  {{/options.sort}}

</div>
`;
gform.stencils.mobile_row = `<tr><td colspan="100%" class="filterable">		
{{^options.hideCheck}}

<div data-event="mark" data-id="{{[[}}id{{]]}}"  style="text-align:left;padding:0;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;">
<span class="text-muted fa {{[[}}#iswaiting{{]]}}fa-spinner fa-spin {{[[}}/iswaiting{{]]}} {{[[}}^iswaiting{{]]}} {{[[}}#checked{{]]}}fa-check-square-o{{[[}}/checked{{]]}} {{[[}}^checked{{]]}}fa-square-o{{[[}}/checked{{]]}}{{[[}}/iswaiting{{]]}}" style="margin:6px; cursor:pointer;font-size:24px"></span>
</div>
  {{/options.hideCheck}}
<div>
{{#items}}
{{#visible}}{{#isEnabled}}<div class="row" style="min-width:85px"><span class="col-sm-3"><b>{{label}}</b></span><span class="col-sm-9 col-xs-12">{{{name}}}</span></div>{{/isEnabled}}{{/visible}}
{{/items}}
</div>
</td></tr>`;
gform.stencils.mobile_data_grid = `<div class="well table-well">
<div style="height:40px;">
  <div name="actions" class=" pull-left" style="margin-bottom:10px;width:62%" ></div>

  <input type="file" class="csvFileInput" accept=".csv" style="display:none">

  <div class="hiddenForm" style="display:none"></div>
  <div class="btn-group pull-right" style="margin-bottom:10px" role="group" aria-label="...">
    {{#showAdd}}
    <div data-event="add" class="btn btn-success"><i class="fa fa-pencil-square-o"></i> New</div>
    {{/showAdd}}

    {{#options.actions}}
      {{#global}}<div class="btn btn-default custom-event" data-event="{{name}}" data-id="{{[[}}id{{]]}}">{{{label}}}</div>{{/global}}
    {{/options.actions}}
    {{#options.download}}
    <div class="btn btn-default hidden-xs" name="bt-download" data-toggle="tooltip" data-placement="left" title="Download"><i class="fa fa-download"></i></div>
    {{/options.download}}
    {{#options.upload}}
    <div class="btn btn-default hidden-xs" name="bt-upload" data-toggle="tooltip" data-placement="left" title="Upload"><i class="fa fa-upload"></i></div>
    {{/options.upload}}


    {{#options.columns}}
    <div class="btn-group columnEnables" data-toggle="tooltip" data-placement="left" title="Display Columns">
      <button class="btn btn-default dropdown-toggle" type="button" id="enables_{{options.id}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        <i class="fa fa-list"></i>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu pull-right" style="padding-top:10px" aria-labelledby="enables_{{options.id}}">
        {{#items}}
        {{#visible}}
        <li><label data-field="{{id}}" style="width:100%;font-weight:normal"><input type="checkbox" {{#isEnabled}}checked="checked"{{/isEnabled}} style="margin: 5px 0 5px 15px;"> {{label}}</label></li>
        {{/visible}}
        {{/items}}
      </ul>
    </div>
    {{/options.columns}}

  </div>


</div>	
    {{>mobile_head}}


{{^options.hideCheck}}
<div style="padding: 16px 0 0 15px;"><i name="select_all" class="fa fa-2x fa-square-o"></i></div>
{{/options.hideCheck}}

<div class="table-container" style="width:100%;overflow:auto">

<div style="min-height:100px">
  <table class="table {{^options.noborder}}table-bordered{{/options.noborder}} table-striped table-hover dataTable" style="margin-bottom:0px">
    <tbody class="list-group">
      <tr><td colspan="100">
        <div class="alert alert-info" role="alert">You have no items.</div>
      </td></tr>
    </tbody>

  </table>
</div>

</div>
<div class="paginate-footer" style="overflow:hidden;margin-top:10px"></div>
</div>`;

gform.stencils.data_grid = `<div class="well table-well">
<input type="file" class="csvFileInput" accept=".csv" style="display:none">
<div class="hiddenForm" style="display:none"></div>

<div style="overflow:hidden">
  <div name="actions" class=" pull-left" style="margin-bottom:10px;" ></div>
</div>	
<div>

  <div class="btn-group pull-right" style="margin-bottom:10px;margin-left:10px" role="group" aria-label="...">

    {{#options.download}}
    <div class="btn btn-default hidden-xs" name="bt-download" data-toggle="tooltip" data-placement="left" title="Download"><i class="fa fa-download"></i></div>
    {{/options.download}}
    {{#options.upload}}
    <div class="btn btn-default hidden-xs" name="bt-upload" data-toggle="tooltip" data-placement="left" title="Upload"><i class="fa fa-upload"></i></div>
    {{/options.upload}}


    {{#options.columns}}
    <div class="btn-group columnEnables" data-toggle="tooltip" data-placement="left" title="Display Columns">
      <button class="btn btn-default dropdown-toggle" type="button" id="enables_{{options.id}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        <i class="fa fa-list"></i>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu pull-right" style="padding-top:10px;padding-left:10px" aria-labelledby="enables_{{options.id}}">
        {{#items}}
        {{#visible}}
        <li><label data-field="{{id}}" style="width:100%;font-weight:normal"><input type="checkbox" {{#isEnabled}}checked="checked"{{/isEnabled}}> {{label}}</label></li>
        {{/visible}}
        {{/items}}
      </ul>
    </div>
    {{/options.columns}}
  </div>
  {{#options.search}}<input type="text" name="search" class="form-control pull-right" style="max-width:300px; margin-bottom:10px" placeholder="Search">{{/options.search}}

  <span name="count"></span>
</div>

{{^options.autoSize}}
<div class="paginate-footer hidden-xs" style="overflow:hidden;margin-top:10px;clear:both"></div>
{{/options.autoSize}}

<div class="table-container" style="width:100%;overflow:auto">
{{#options.autoSize}}
<table class="table {{^options.noborder}}table-bordered{{/options.noborder}}" style="margin-bottom:0px">
<thead class="head">
{{>data_grid_head}}
</thead>
</table>
{{/options.autoSize}}


<div style="min-height:100px">
  <table class="table {{^options.noborder}}table-bordered{{/options.noborder}} table-striped table-hover dataTable" style="margin-bottom:0px;{{#options.autoSize}}margin-top: -19px;{{/options.autoSize}}">
    {{^options.autoSize}}
    <thead class="head">
    {{>data_grid_head}}
    </thead>
    {{/options.autoSize}}
{{#options.autoSize}}
    <thead>
          <tr  class="list-group-row">
              {{^options.hideCheck}}
  <th style="width:60px" class="select-column"></th>
  {{/options.hideCheck}}
        {{#items}}
  {{#visible}}
<th  style="min-width:85px">
  {{/visible}}
  {{/items}}
  </tr>
  </thead>
{{/options.autoSize}}
    <tbody class="list-group">
      <tr><td colspan="100">
        <div class="alert alert-info" role="alert">You have no items.</div>
      </td></tr>
    </tbody>

  </table>
</div>

</div>
<div class="paginate-footer" style="overflow:hidden;margin-top:10px"></div>
</div>`;
gform.stencils.data_grid_footer = `<div>
{{#multiPage}}
<nav class="pull-right" style="margin-left: 10px;">
{{#size}}
  <ul class="pagination" style="margin:0">
    {{^isFirst}}
    {{^showFirst}}<li class="pagination-first"><a data-page="1" href="javascript:void(0);" aria-label="First"><span aria-hidden="true">&laquo;</span></a></li>{{/showFirst}}
    <li><a data-page="dec" href="javascript:void(0);" aria-label="Previous"><span aria-hidden="true">&lsaquo;</span></a></li>
    {{/isFirst}}
    {{#pages}}
      <li class="{{active}}"><a data-page="{{name}}" href="javascript:void(0);">{{name}}</a></li>
    {{/pages}}
    {{^isLast}}
    <li><a data-page="inc" href="javascript:void(0);" aria-label="Next"><span aria-hidden="true">&rsaquo;</span></a></li>
    {{^showLast}}<li class="pagination-last"><a data-page="" href="javascript:void(0);" aria-label="Last"><span aria-hidden="true">&raquo;</span></a></li>{{/showLast}}
    {{/isLast}}

  </ul>
{{/size}}
</nav>

{{/multiPage}}	
<h5 class="range badge {{^size}}alert-danger{{/size}} pull-left" style="margin-right:15px;">{{#size}}Showing {{first}} to {{last}} of {{size}} results{{/size}}{{^size}}No matching results{{/size}}</h5>
  {{#entries.length}}
  <span class="pull-left">
    <select class="form-control" style="display:inline-block;width:auto;min-width:50px" name="count">
    <option value="10000">All</option>
    {{#entries}}
    <option value="{{value}}" {{#selected}}selected="selected"{{/selected}}>{{value}}</option>
    {{/entries}}

    </select>
    <span class="hidden-xs">results per page</span>
  </span>
  {{/entries.length}}
</div>`;
gform.stencils.data_grid_head = `  <tr style="cursor:pointer" class="noselect table-sort">
{{^options.hideCheck}}
<th style="width: 60px;min-width:60px;padding: 0 0 0 20px;" class="select-column"><i name="select_all" class="fa fa-2x fa-square-o"></i></th>
{{/options.hideCheck}}

{{#items}}
{{#visible}}
<th {{#options.sort}}data-sort="{{cname}}"{{/options.sort}}><h6 style="margin: 2px;font-size:13px;white-space: nowrap">{{#options.sort}}<i class="fa fa-sort text-muted"></i> {{/options.sort}}{{{label}}}</h6></th>
{{/visible}}
{{/items}}
</tr>
{{#options.filter}}
<tr class="filter">
{{^options.hideCheck}}<td>
<div name="reset-search" style="position:relative" class="btn" data-toggle="tooltip" data-placement="left" title="Clear Filters">
  <i class="fa fa-filter"></i>
  <i class="fa fa-times text-danger" style="position: absolute;right: 5px;"></i>
</div>
</td>{{/options.hideCheck}}

{{#items}}
{{#visible}}
<td data-inline="{{cname}}" style="min-width:85px" id="{{id}}"></td>
{{/visible}}
{{/items}}
</tr>
{{/options.filter}}`;
gform.stencils.data_grid_row = `{{^options.hideCheck}}

<td data-event="mark" data-id="{{[[}}id{{]]}}" style="width: 60px;min-width:60px;text-align:left;padding:0;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;">
  <span class="text-muted fa {{[[}}#iswaiting{{]]}}fa-spinner fa-spin {{[[}}/iswaiting{{]]}} {{[[}}^iswaiting{{]]}} {{[[}}#checked{{]]}}fa-check-square-o{{[[}}/checked{{]]}} {{[[}}^checked{{]]}}fa-square-o{{[[}}/checked{{]]}}{{[[}}/iswaiting{{]]}} " style="margin:6px 0 6px 20px; cursor:pointer;font-size:24px"></span>
   </td>

  {{/options.hideCheck}}
{{#items}}
{{#visible}}{{#isEnabled}}<td style="min-width:85px">{{{name}}}</td>{{/isEnabled}}{{/visible}}
{{/items}}`;

gform.stencils.combobox = `
<div class="row clearfix form-group {{modifiers}}" data-type="{{type}}">
	{{>_label}}

	<div>
        <div class="combobox-container relative">
            <div class="relative flex flex-wrap items-stretch w-full" contentEditable="false">
                {{#pre}}<span class="input-group-addon">{{{pre}}}</span>{{/pre}}
                <div {{^autocomplete}}autocomplete="off"{{/autocomplete}} class="transition overflow-hidden ease-in-out border outline-none py-2 px-3 whitespace-nowrap bg-white form-control relative flex-auto min-w-0 block w-full col-span-12 border-gray-300 focus:border-gform-300 focus:ring focus:ring-gform-200 focus:ring-opacity-50 rounded-l-md shadow-sm mt-1" {{^editable}}readonly disabled{{/editable}} {{#limit}}maxlength="{{limit}}"{{/limit}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}}" {{#editable}}contentEditable{{/editable}} type="combobox"  name="{{name}}" id="{{name}}" value="{{value}}" ></div>
                <button type="button" class="dropdown-toggle mt-1 px-3 py-2 bg-gray-400 w-10 text-white rounded-r-md" data-dropdown="dropdown"><span class="text-white h-5 w-4 status-icon" data-dropdown="dropdown"></button>

            </div>
            <ul class="combobox-list dropdown-menu dropdown-menu absolute right-0 hidden bg-white text-base z-50 py-2 list-none text-left items-center border border-gray-300 rounded shadow-lg top-12 left-0.5 m-0 bg-clip-padding"></ul>
        </div>
        {{>_error}}
        {{>_actions}}
	</div>
</div>`;
(gform.stencils.combobox_item =
  '<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{i}}" class="dropdown-item p-1">{{{display}}}{{^display}}{{{label}}}{{/display}}</a>'),
  (gform.types["combobox"] = _.extend({}, gform.types["input"], {
    base: "collection",
    destroy: function () {
      this.el.removeEventListener("change", this.onchangeEvent);
      //   this.el.removeEventListener('change',this.onchange );
      this.el.removeEventListener("input", this.onchangeEvent);
      this.combo.removeEventListener("blur", this.handleBlur);
    },
    itemTemplate: gform.stencils.combobox_item,
    satisfied: function (value) {
      value = value || this.value;
      if (this.strict) {
        value = (_.find(this.options, { value: value }) || { value: "" }).value;
      }
      if (_.isArray(value)) {
        return !!value.length;
      }
      return (
        typeof value !== "undefined" &&
        value !== null &&
        value !== "" &&
        !(typeof value == "number" && isNaN(value))
      );
    },
    toString: function (name, display) {
      if (!display) {
        return (
          "<dt>" +
          this.label +
          "</dt> <dd>" +
          ((typeof this.combo !== "undefined"
            ? this.combo.innerText
            : this.get()) || "(empty)") +
          "</dd><hr>"
        );
      } else {
        return typeof this.combo !== "undefined"
          ? this.combo.innerText
          : this.get();
      }
    },
    focus: function () {
      if (!this.active) return;
      //var node = this.el.querySelector('[type=combobox]');
      var node = this.combo;
      if (node !== null) {
        node.focus();
        if (node.textContent == "") return;
        var sel = window.getSelection();
        var focus = sel.focusNode;

        if (focus !== null && focus !== document) {
          var range = document.createRange();
          range.selectNode(focus);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
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
      return gform.render("combobox", this);
    },
    get: function () {
      return (
        this.strict
          ? _.find(this.options, { value: this.value }) || {
              value: "",
            }
          : this
      ).value;
    },
    set: function (value, silent, input) {
      value =
        typeof value == "string" ? value.replace(/  |\r\n|\n|\r/gm, "") : value;
      var item =
        _.find(this.options, { value: value }) ||
        _.find(this.options, { label: value });
      if (typeof item !== "undefined") {
        if (
          !input ||
          (input == "nosearch" &&
            (this.el.querySelector("[type=combobox]") !==
              document.activeElement ||
              this.combo.innerText !== item.label))
        ) {
          this.combo.innerText = item.label;
          gform.addClass(
            this.el.querySelector(".combobox-container"),
            "combobox-selected"
          );
        }
        this.internalValue = item.value;
      } else {
        if (typeof this.search == "string" && input !== "nosearch") {
          gform.removeClass(
            this.el.querySelector(".combobox-container"),
            "loaded"
          );

          gform.ajax({
            sourceID: "set" + this.id,
            path: gform.renderString(this.search, {
              value: value,
            }),
            success: this.searchData.bind(this, value),
          });
        } else if (typeof this.search == "function" && input !== "nosearch") {
          gform.removeClass(
            this.el.querySelector(".combobox-container"),
            "loaded"
          );

          async function asyncCall() {
            const result = await new Promise(
              function (resolve) {
                let response = this.search.call(
                  this,
                  { value: value },
                  resolve
                );
                if (typeof response == "object") {
                  resolve(response);
                }
              }.bind(this)
            );
            this.searchData.call(this, value, result);
          }

          // const promise1 = new Promise((resolve, reject) => {
          //     setTimeout(resolve, 500, 'one');
          // });

          const promise2 = new Promise((resolve, reject) => {
            setTimeout(resolve, 100, "two");
          });

          Promise.race([asyncCall.call(this), promise2]).then(value => {
            console.log(value);
            // Both resolve, but promise2 is faster
          });
        }
        this.internalValue = value || "";

        if ("el" in this) {
          if (this.combo.innerHTML !== value) {
            this.combo.innerHTML = value;
            gform.types.combobox.focus.call(this);
          }

          if (
            typeof value == "undefined" ||
            (typeof value !== "undefined" && this.combo.innerText !== value)
          ) {
            this.combo.innerText = this.value || "";

            this.trigger(["undefined"], this);
          }
          gform.toggleClass(
            this.el.querySelector(".combobox-container"),
            "combobox-selected",
            this.value !== ""
          );
        }
      }
      gform.types[this.type].setLabel.call(this);
      if (!silent) {
        this.parent.trigger(["change"], this);
      }
    },
    edit: function (state) {
      this.editable = state;
      this.el
        .querySelector(".form-control")
        .setAttribute("contenteditable", state ? "true" : "false");
      gform.toggleClass(this.el, "disabled", !state);
    },
    initialize: function () {
      this.activeClass = "bg-gray-200";
      this.onchangeEvent = _.debounce(
        function (input) {
          this.renderMenu();
          this.set(this.combo.innerText, false, true);
          this.parent.trigger(["input"], this, {
            input: this.value,
          });
        }.bind(this),
        300
      );
      gform.types[this.type].setup.call(this);
      this.processOptions = function (option) {
        option.visible = "visible" in option ? option.visible : true;
        option.editable = "editable" in option ? option.editable : true;

        if (typeof option.optgroup !== "undefined") {
          if (
            typeof option.optgroup.options !== "undefined" &&
            option.optgroup.options.length
          ) {
            _.each(option.optgroup.options, this.processOptions.bind(this));
          }
        } else {
          option = this.createLI(false, option);
        }
      };
      this.createLI = function (force, option) {
        if (typeof option !== "undefined" && typeof option !== "object") {
          option = { label: option, value: option };
        }
        // option.i = (option.i || (++index));
        // if (typeof this.format !== 'undefined') {
        //     if (typeof this.format.label !== 'undefined') {
        //         option.label = gform.renderString(this.format.label, option);
        //     }
        //     if (typeof this.format.display !== 'undefined') {
        //         option.display = gform.renderString(this.format.display, option);
        //     }
        //     if (typeof this.format.value == 'string') {
        //         option.value = gform.renderString(this.format.value, option);
        //     } else if (typeof this.format.value == 'function') {
        //         option.value = this.format.value.call(this, option)
        //     }
        // }
        if (!("processed" in option)) {
          option = _.reduce(
            ["label", "display", "value" /*,'cleanlabel'*/],
            function (format, option, prop) {
              if (prop in format) {
                if (prop in option) {
                  option.original = option.original || {};
                  option.original[prop] = option[prop];
                }
                option[prop] =
                  typeof format[prop] == "string"
                    ? format[prop] in option
                      ? option[format[prop]]
                      : gform.renderString(format[prop], option)
                    : typeof format[prop] == "function"
                    ? format[prop].call(this, option)
                    : option[prop];
              }
              option.processed = true;
              return option;
            }.bind(this, this.format),
            option
          );
        }
        option.visible = "visible" in option ? option.visible : true;
        option.editable = "editable" in option ? option.editable : true;
        if (
          this.filter !== false &&
          (force ||
            this.combo.innerText == "" ||
            _.score(
              option.label.toLowerCase(),
              this.combo.innerText.toLowerCase()
            ) > 0.6)
        ) {
          var li = document.createElement("li");
          li.className = "p-1";
          li.innerHTML = gform.renderString(
            gform.types[this.type].itemTemplate,
            option
          );
          this.menu.appendChild(li);
          option.filter = true;
        } else {
          // if (this.filter == false) {
          //     var li = document.createElement("li");
          //     li.innerHTML = gform.renderString(gform.types[this.type].itemTemplate, option);
          //     this.menu.appendChild(li);
          // }
          option.filter = false;
        }
        return option;
      }.bind(this);
      this.searchData = function (value, data) {
        if (data.length > 0 && this.combo.innerText == value) {
          if (!this.active) return;
          this.menu.style.display = "none";
          this.shown = false;
          this.menu.innerHTML = "";

          index = this.options.length;
          this.options = this.mapOptions.getoptions();

          this.menu.innerHTML = "";
          this.options = this.options.concat(
            _.map(data, this.createLI.bind(null, true))
          );

          if (typeof this.custom == "object") {
            var li = document.createElement("li");
            li.innerHTML = gform.renderString(
              '<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{custom.name}}" class="dropdown-item">{{{custom.display}}}</a>',
              this
            );
            this.menu.appendChild(li);
          }

          var first = this.menu.querySelector("li");
          if (first !== null) {
            gform.addClass(first, "active");
          } else {
            this.internalValue = null;
          }
          var item =
            _.find(this.options, { value: value }) ||
            _.find(this.options, { label: value });

          this.shown =
            typeof item == "undefined" &&
            data.length > 0 &&
            this.el.contains(document.activeElement);
          this.menu.style.display = this.shown ? "block" : "none";

          this.set((item || { value: value }).value, true, "nosearch");

          this.parent.trigger(["change"], this, {
            input: this.value,
          });
        }
        gform.addClass(this.el.querySelector(".combobox-container"), "loaded");
      };
      this.renderMenu = function () {
        if (!this.active) return;
        this.menu.style.display = "none";
        this.shown = false;
        this.menu.innerHTML = "";
        this.options = this.mapOptions.getoptions();
        _.each(this.options, this.processOptions.bind(this));

        var first = this.menu.querySelector("li");
        if (first !== null) {
          gform.addClass(first, this.activeClass);
          this.menu.style.display = "block";
          this.shown = true;
        }
        if (typeof this.search == "undefined") {
          if (typeof this.custom == "object") {
            this.menu.style.display = "block";
            this.shown = true;

            var li = document.createElement("li");
            li.className = "p-1";
            li.innerHTML = gform.renderString(
              '<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{custom.name}}" class="dropdown-item">{{{custom.display}}}</a>',
              this
            );
            this.menu.appendChild(li);
          }
        }
      };
      this.shown = false;
      this.input = this.input || false;
      this.menu = this.el.querySelector("ul");
      this.combo = this.el.querySelector("[type = combobox]");
      // this.owner.container.onresize = function(){
      //     this.combo.style.width = this.combo.offsetWidth+'px'
      // };
      // this.combo.style.width = this.combo.offsetWidth+'px'
      this.set = gform.types[this.type].set.bind(this);

      this.select = function (index) {
        if (!isNaN(parseInt(index))) {
          var item = _.find(this.options, { i: parseInt(index) });
          this.set(item.value);
          this.parent.trigger(["input"], this, {
            input: this.value,
          });

          this.menu.style.display = "none";
          this.shown = false;
          gform.types.combobox.focus.call(this);
        } else {
          if (typeof this.custom == "object" && this.custom.name == index) {
            if (typeof this.custom.action == "function") {
              this.custom.action.call(this, {
                form: this.owner,
                field: this,
                event: this.custom.name,
              });
            }
            this.parent.trigger(index, this);
          }
        }
      };
      $(this.el).on(
        "click",
        ".dropdown-item",
        function (e) {
          if (
            e.currentTarget.dataset.editable != "false" &&
            e.currentTarget.dataset.editable != false
          )
            this.select(e.currentTarget.dataset.index);
          e.stopPropagation();
        }.bind(this)
      );

      this.el.addEventListener(
        "mouseup",
        function (e) {
          if (
            typeof e.target.dataset.dropdown !== "undefined" &&
            this.editable
          ) {
            e.stopPropagation();
            if (this.el.querySelector(".combobox-selected") !== null) {
              this.set(null, false, "nosearch");
              this.parent.trigger(["input"], this, {
                input: "",
              });
              this.renderMenu();
            } else {
              if (this.shown) {
                this.menu.style.display = "none";
                this.shown = false;
              } else {
                this.renderMenu();
              }
            }
            gform.types.combobox.focus.call(this);
          }
          this.mousedropdown = false;
        }.bind(this)
      );
      let field = this;
      this.el.addEventListener("focusin", () => {
        if (!field.active) field.el.querySelector(".form-control").blur();
      });
      this.el.addEventListener(
        "mousedown",
        function (e) {
          if (typeof e.target.dataset.dropdown !== "undefined") {
            this.mousedropdown = true;
          }
        }.bind(this)
      );

      this.el.addEventListener(
        "keydown",
        function (e) {
          if (!this.shown) {
            if (e.keyCode == 40) {
              this.renderMenu();
            }
            if (e.keyCode == 13) {
              e.preventDefault();
            }
            return;
          }
          switch (e.keyCode) {
            case 9: // tab
            case 13: // enter
              e.preventDefault();
              let activeEl = this.menu.querySelector(
                "li." + this.activeClass + " a"
              );
              if (activeEl !== null) {
                this.select(activeEl.dataset.index);
              }
              break;
            case 27: // escape
              e.preventDefault();
              this.menu.style.display = "none";
              this.shown = false;
              break;

            case 38: // up arrow
              e.preventDefault();
              var active = this.menu.querySelector("." + this.activeClass);
              gform.removeClass(active, this.activeClass);

              prev = active.previousElementSibling;

              if (!prev) {
                var list = this.menu.querySelectorAll("li");
                prev = list[list.length - 1];
              }

              gform.addClass(prev, this.activeClass);

              var active = $(this.menu).find("." + this.activeClass);
              //fixscroll $(this.menu).css('padding-top')??
              if (active.length) {
                var top = active.position().top;
                var bottom = top + active.height();
                var scrollTop = $(this.menu).scrollTop();
                var menuHeight = $(this.menu).height();
                if (bottom > menuHeight) {
                  $(this.menu).scrollTop(scrollTop + bottom - menuHeight);
                } else if (top < 0) {
                  $(this.menu).scrollTop(scrollTop + top);
                }
              }
              break;

            case 40: // down arrow
              e.preventDefault();
              var active = this.menu.querySelector("." + this.activeClass);
              gform.removeClass(active, this.activeClass);
              next = active.nextElementSibling;
              if (!next) {
                next = this.menu.querySelector("li");
              }
              gform.addClass(next, this.activeClass);
              var active = $(this.menu.querySelector("." + this.activeClass));
              //fixscroll
              if (active.length) {
                var top = active.position().top;
                var bottom = top + active.height();
                var scrollTop = $(this.menu).scrollTop();
                var menuHeight = $(this.menu).height();
                if (bottom > menuHeight) {
                  $(this.menu).scrollTop(scrollTop + bottom - menuHeight);
                } else if (top < 0) {
                  $(this.menu).scrollTop(scrollTop + top);
                }
              }
              break;
          }
          e.stopPropagation();
        }.bind(this)
      );

      $(this.menu).on(
        "mouseenter",
        "li",
        function (e) {
          this.mousedover = true;
          if (this.menu.querySelector("." + this.activeClass) !== null) {
            gform.removeClass(
              this.menu.querySelector("." + this.activeClass),
              this.activeClass
            );
          }
          gform.addClass(e.currentTarget, this.activeClass);
        }.bind(this)
      );

      $(this.menu).on(
        "mouseleave",
        "li",
        function (e) {
          this.mousedover = false;
        }.bind(this)
      );

      /*look into clean up this way*/
      this.handleBlur = function (e) {
        if (e.sourceCapabilities == null) return;
        /*clean up value to just be a string*/
        var input = document.createElement("input");
        input.value = this.combo.innerText;
        this.combo.innerHTML = input.value;

        if (
          !(
            gform.hasClass(e.relatedTarget, "dropdown-item") ||
            gform.hasClass(e.relatedTarget, "dropdown-toggle") ||
            this.mousedropdown
          )
        ) {
          if (this.shown) {
            var list = _.filter(this.options, { filter: true });
            if (this.strict) {
              if (list.length == 1) {
                this.set(list[0].value);
              } else {
                list = _.filter(this.options, {
                  label: this.combo.innerText,
                });
                if (list.length) {
                  this.set(list[0].value);
                }
              }
            } else {
              this.set(this.combo.innerText);
            }
            if (!this.mousedover && this.shown) {
              setTimeout(
                function () {
                  this.menu.style.display = "none";
                  this.shown = false;
                }.bind(this),
                200
              );
            }
            this.parent.trigger(["input"], this, {
              input: this.value,
            });
            this.menu.style.display = "none";
            this.shown = false;
          } else {
          }

          if (this.strict) {
            let updateVal = this.value || this.combo.innerText;
            this.set(updateVal, true, "nosearch");
            let newVal = gform.types[this.type].get.call(this);
            this.set(newVal);
            if (updateVal !== newVal)
              this.parent.trigger(["input"], this, {
                input: newVal,
              });
          } else {
            if (
              typeof _.find(this.options, {
                value: this.value,
              }) !== "undefined"
            ) {
              this.set(this.value);
            } else {
              this.parent.trigger(["undefined"], this);
            }
          }
        }
      }.bind(this);
      this.combo.addEventListener("blur", this.handleBlur);
      this.options = this.mapOptions.getoptions();
      if (
        typeof this.search == "string" &&
        typeof this.value !== "undefined" &&
        this.value !== ""
      ) {
        gform.removeClass(
          this.el.querySelector(".combobox-container"),
          "loaded"
        );
        gform.ajax({
          sourceID: "init" + this.id,
          path: gform.renderString(this.search, {
            value: this.value,
          }),
          success: function (data) {
            index = this.options.length;
            this.options = this.options.concat(
              _.map(data, this.createLI.bind(null, false))
            );
            if (typeof this.value !== "undefined") {
              this.set(this.value);
            }
            this.parent.trigger(["options"], this);
            gform.addClass(
              this.el.querySelector(".combobox-container"),
              "loaded"
            );
          }.bind(this),
        });
      } else if (
        typeof this.search == "function" &&
        typeof this.value !== "undefined" &&
        this.value !== ""
      ) {
        gform.removeClass(
          this.el.querySelector(".combobox-container"),
          "loaded"
        );

        index = this.options.length;
        this.options = this.options.concat(
          _.map(
            this.search.call(this, { value: value }),
            this.createLI.bind(null, false)
          )
        );
        if (typeof this.value !== "undefined") {
          this.set(this.value);
        }
        this.parent.trigger(["options"], this);
        gform.addClass(this.el.querySelector(".combobox-container"), "loaded");
      } else {
        gform.addClass(this.el.querySelector(".combobox-container"), "loaded");

        if (typeof this.value !== "undefined") {
          this.set(this.value);
        }
      }

      this.el.addEventListener("input", this.onchangeEvent.bind(null, true));
    },
  }));
