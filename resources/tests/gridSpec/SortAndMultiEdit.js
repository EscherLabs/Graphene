describe('Sort and MultiEdit Options', function () {
    beforeEach(function() {  		
        triggerOnEdit = sinon.spy();
        triggerOnModelEdit = sinon.spy();
        triggerOnEdited = sinon.spy();	
        triggerOnModelEdited = sinon.spy();	
        gdg = new GrapheneDataGrid({
            el:'#myGrapheneDataGrid',
            schema:[{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"name",label:"Names"}, {type:"text", name:"string",label:"Strings"}], 
            sort: 'number', multiEdit: ['number', 'string'],
            data: [
                {string: 'value', name:'Gru', number: 19},
                {string: 'value', name:'Joe Mama', number: 19},
                {string: 'value', name:'Baby Hands', number: 30},
                {string: 'value', name:'Dwayne "The Rock" Johnson', number: 30},
                {string: 'value', name:'Shrek', number: 21},
                {string: 'value', name:'Big Chungus', number: 315},
            ], 
        });
    });
    afterEach(function() {
        gdg.destroy();
    });
    it('grid should be sorted in decreasing order', function () {
        var max = gdg.grab(gdg.options)[0].attributes.number;
        for (let i = 1; i < gdg.grab(gdg.options).length; i++) {
            expect(gdg.grab(gdg.options)[i].attributes.number).to.be.at.most(max);
            max = gdg.grab(gdg.options)[i].attributes.number;
        } 
    });
    it('multiedit', function () {
        gdg.on('edit', triggerOnEdit); 
        gdg.on('model:edit', triggerOnModelEdit);
        gdg.on('edited', triggerOnEdited);
        gdg.on('model:edited', triggerOnModelEdited);
        expect(triggerOnEdit.called).to.be.false;
        expect(triggerOnModelEdit.called).to.be.false;
        expect(triggerOnEdited.called).to.be.false;
        expect(triggerOnModelEdited.called).to.be.false;
        gdg.models[2].toggle();
        gdg.models[3].toggle();
        gdg.$el.find('[data-event="edit"]').click();
        expect(triggerOnEdit.calledOnce).to.be.true;
        expect(triggerOnModelEdit.calledTwice).to.be.true;
        expect(document.querySelector('h4#myModalLabel.modal-title').textContent.match(/\d+/)[0]).to.be.equal('2');
        expect(document.querySelector('form#f153.gform').length).to.be.equal(2);
        expect(document.querySelector('form#f153.gform')[0].value).to.be.equal('30');
        expect(document.querySelector('form#f153.gform')[1].value).to.be.equal('value');
        document.querySelector('input#f154.form-control').value = 5; 
        document.querySelector('input#f155.form-control').value = 'str'; 
        document.querySelector('button#el_f157.btn.btn-default.hidden-print.btn-success').click();
        expect(triggerOnEdited.calledOnce).to.be.true;
        expect(triggerOnModelEdited.calledTwice).to.be.true;
        expect(gdg.models[2].attributes.number).to.be.equal(5);
        expect(gdg.models[3].attributes.number).to.be.equal(5);
        expect(gdg.models[2].attributes.string).to.be.equal('str');
        expect(gdg.models[3].attributes.string).to.be.equal('str');
    });
});