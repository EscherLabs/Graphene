toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
function render(template, data){
  if(typeof templates[template] === 'undefined'){
    templates[template] =  Hogan.compile($('#'+template).html());
  }
return templates[template].render(data, templates);
}
function modal(options) {
  $('#myModal').remove();
  this.ref = $(render('modal', options));

  options.legendTarget = this.ref.find('.modal-title');
  options.actionTarget = this.ref.find('.modal-footer');

  $(this.ref).appendTo('body');

  if(options.content) {
    $('.modal-body').html(options.content);
    options.legendTarget.html(options.legend);
  }else{
    options.autoDestroy = true;
    var myform = this.ref.find('.modal-body').berry(options).on('destroy', $.proxy(function(){
      this.ref.modal('hide');
    },this));

    this.ref.on('shown.bs.modal', $.proxy(function () {
      this.$el.find('.form-control:first').focus();
    },myform));
  }
  if(options.onshow){
    this.ref.on('shown.bs.modal', options.onshow);
  }  
  this.ref.modal();
  return this;
};