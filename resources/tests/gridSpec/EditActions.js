describe('Edit Actions', function () {
    before(function() {  
        triggerOnEdit = sinon.spy();			
        triggerOnModelEdit = sinon.spy();
        triggerOnEdited = sinon.spy();	
        triggerOnModelEdited = sinon.spy();	
        gdg = new GrapheneDataGrid({
            el:'#myGrapheneDataGrid',
            schema: [{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"string",label:"Strings"}], 
            data: [
                {string:'test', number: 1},
                {string:'random', number: 2}
            ]
        });
    });
    beforeEach(function () {
        triggerOnEdit.resetHistory();
        triggerOnModelEdit.resetHistory();
        triggerOnEdited.resetHistory();
        triggerOnModelEdited.resetHistory();
    });
    afterEach(function() {
       gridCleanup(gdg);
    });
    it('default - edit', function () {
        gdg.on('edit', triggerOnEdit);
        gdg.on('model:edit', triggerOnModelEdit);
        gdg.on('edited', triggerOnEdited);
        gdg.on('model:edited', triggerOnModelEdited);
        expect(triggerOnEdit.called).to.be.false;
        expect(triggerOnModelEdit.called).to.be.false;
        expect(triggerOnEdited.called).to.be.false;
        expect(triggerOnModelEdited.called).to.be.false;

        gdg.$el.find('[data-event="edit"]').click();
        expect(triggerOnEdit.calledOnce).to.be.true;
        expect(triggerOnModelEdit.called).to.be.false;

        gdg.models[0].toggle();
        gdg.models[1].toggle();
        triggerOnEdit.resetHistory();
        triggerOnModelEdit.resetHistory();
        gdg.$el.find('[data-event="edit"]').click();
        expect(triggerOnEdit.calledOnce).to.be.true;
        expect(triggerOnModelEdit.calledTwice).to.be.true;
        expect(triggerOnEdited.called).to.be.false;
        expect(triggerOnModelEdited.called).to.be.false;

        gdg.models[1].toggle();
        triggerOnEdit.resetHistory();
        triggerOnModelEdit.resetHistory();
        gdg.$el.find('[data-event="edit"]').click();
        expect(triggerOnEdit.calledOnce).to.be.true;                       
        expect(triggerOnModelEdit.calledOnce).to.be.true;
        expect(document.querySelector('form').length).to.be.equal(2);
        expect(document.querySelector('form')[0].value).to.be.equal('1');
        expect(document.querySelector('form')[1].value).to.be.equal('test');
        document.querySelector('form')[0].value = 5; 
        document.querySelector('form')[1].value = 'str'; 
        document.querySelector('button.btn-success').click();
        expect(triggerOnEdited.calledOnce).to.be.true;
        expect(triggerOnModelEdited.calledOnce).to.be.true;
        expect(gdg.models[0].attributes.number).to.be.equal(5);
        expect(gdg.models[0].attributes.string).to.be.equal('str');
    });
    it('prevent default', function() {
        gdg = new GrapheneDataGrid({
            el:'#myGrapheneDataGrid',
            schema: [{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"string",label:"Strings"}], 
            data: [
                {string:'test', number: 1},
                {string:'random', number: 2}
            ]
        }).on('edit', function(e) {
            e.preventDefault();
        });

        gdg.on('edit', triggerOnEdit);
        gdg.on('model:edit', triggerOnModelEdit);
        gdg.on('edited', triggerOnEdited);
        gdg.on('model:edited', triggerOnModelEdited);
        
        expect(triggerOnEdit.called).to.be.false;
        expect(triggerOnModelEdit.called).to.be.false;
        expect(triggerOnEdited.called).to.be.false;
        expect(triggerOnModelEdited.called).to.be.false;
        
        gdg.$el.find('[data-event="edit"]').click();
        expect(triggerOnEdit.calledOnce).to.be.true;
        expect(triggerOnModelEdit.notCalled).to.be.true;
        expect(triggerOnEdited.notCalled).to.be.true;
        expect(triggerOnModelEdited.notCalled).to.be.true;
        
        triggerOnEdit.resetHistory();
        gdg.models[1].toggle();
        gdg.$el.find('[data-event="edit"]').click();
        expect(triggerOnEdit.calledOnce).to.be.true;
        expect(triggerOnModelEdit.calledOnce).to.be.true;
        expect(triggerOnEdited.notCalled).to.be.true;
        expect(triggerOnModelEdited.notCalled).to.be.true;
    });
});