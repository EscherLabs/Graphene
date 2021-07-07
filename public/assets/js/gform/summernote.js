
gform.types['textarea'] = _.extend({}, gform.types['input'], {
      set: function(value) {
        //   this.el.querySelector('textarea[name="' + this.name + '"]').value = value;


          	// if(typeof this.lastSaved === 'undefined'){
			// 	this.lastSaved = value;
			// }
			// this.editor.setContent(value)
			this.$el.summernote('code', value)
			this.value = value;
			// this.$el.html(value)

			return this.$el;
      },
      get: function() {
        //   return this.el.querySelector('textarea[name="' + this.name + '"]').value;
        return this.$el.summernote('code')

      },

		// type: 'contenteditable',
		// create: function() {
		// 		return b.render('berry_contenteditable', this);
		// 	},
		initialize: function() {
			this.$el = this.self.find('.formcontrol > div');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			// this.$el.on('input', $.proxy(function(){this.trigger('change');},this));
			this.$el.summernote({
				disableDragAndDrop: true,
		    dialogsInBody: true,
				toolbar: [
					// [groupName, [list of button]]
					['style', ['bold', 'italic', 'underline', 'clear']],
			        ['link', ['linkDialogShow', 'unlink']],
					['font', ['strikethrough', 'superscript', 'subscript']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['view', ['fullscreen']]
				]
			});
			this.$el.on('summernote.change', $.proxy(function(){this.trigger('change');},this));
		},
		setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			// this.editor.setContent(value)
			this.$el.summernote('code', value)
			this.value = value;
			// this.$el.html(value)

			return this.$el;
		},
		getValue: function(){
			return this.$el.summernote('code')
			// return this.editor.getContent()
			// return this.$el.html();
		},satisfied: function(){
			this.value = this.getValue()
			return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '' && this.value !== "<p><br></p>");
		},	
        destroy: function() {
            this.$el.summernote('destroy');
            if(this.$el){
                this.$el.off();
            }
        }

  });


// $(document).on('focusin', function(e) {
//     if ($(e.target).closest(".note-editable").length) {
//         e.stopImmediatePropagation();
			
//     }
// });
// $(document).on('click', function(e) {
//     if ($(e.target).hasClass(".note-editor")) {
//         e.stopImmediatePropagation();

// 			$(e.target).find('.open').removeClass('open')
//     }
// });
