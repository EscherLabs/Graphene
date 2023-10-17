describe('Create Actions', function () {
    before(function() {  
        triggerOnCreate = sinon.spy();			
        triggerOnCreated = sinon.spy();	
        triggerOnModelCreated = sinon.spy();	
        gdg = new GrapheneDataGrid({
            el:'#myGrapheneDataGrid',
            schema: [{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"string",label:"Strings"}], 
            data: [
                {string:'test', number: 1},
                {string:'random', number: 2}
            ]
        });
    });
    afterEach(function() {
        gdg.destroy();
    });
    it('default - new', function () {
        gdg.on('create', triggerOnCreate);
        gdg.on('created', triggerOnCreated);
        gdg.on('model:created', triggerOnModelCreated);
        expect(triggerOnCreate.called).to.be.false;
        expect(triggerOnCreated.called).to.be.false;
        expect(triggerOnModelCreated.called).to.be.false;
        gdg.$el.find('[data-event="create"]').click();
        expect(triggerOnCreate.calledOnce).to.be.true;
        expect(document.querySelector('form#modal.gform').length).to.be.equal(2);
        expect(document.querySelector('div#f915.row').innerText).to.include('Numbers');
        expect(document.querySelector('div#f916.row').innerText).to.include('Strings');
        document.querySelector('button#el_f913.btn.btn-default.hidden-print.btn-success').click();
        expect(triggerOnCreated.calledOnce).to.be.true;
        expect(triggerOnModelCreated.calledOnce).to.be.true;
        expect(gdg.models[2].attributes.number).to.deep.equal(NaN);
        expect(gdg.models[2].attributes.string).to.equal('');
    });
    it('prevent default', function() {
        gdg = new GrapheneDataGrid({
            el:'#myGrapheneDataGrid',
            schema: [{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"string",label:"Strings"}], 
            data: [
                {string:'test', number: 1},
                {string:'random', number: 2}
            ]
        }).on('create', function(e) {
            e.preventDefault();
        });
        //should I include created and model:created spies?
        triggerOnCreate.resetHistory();
        triggerOnCreated.resetHistory();
        triggerOnModelCreated.resetHistory();
        expect(triggerOnCreate.called).to.be.false;
        expect(triggerOnCreated.called).to.be.false;
        expect(triggerOnModelCreated.called).to.be.false;
        gdg.$el.find('[data-event="create"]').click();
        expect(triggerOnCreate.notCalled).to.be.true;
        expect(triggerOnCreated.notCalled).to.be.true;
        expect(triggerOnModelCreated.notCalled).to.be.true;
    });
});