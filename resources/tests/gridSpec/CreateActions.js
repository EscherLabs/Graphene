describe('Create Actions', function () {
    before(function() {  
        triggerOnCreate = sinon.spy();			    
        triggerOnCreated = sinon.spy();	
        triggerOnModelCreated = sinon.spy();	
    });
    beforeEach(function() {
        gdg = new GrapheneDataGrid({     
            el:'#myGrapheneDataGrid',
            schema: [{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"string",label:"Strings"}], 
            data: [
                {string:'test', number: 1},
                {string:'random', number: 2}
            ]
        });

        triggerOnCreate.resetHistory();
        triggerOnCreated.resetHistory();
        triggerOnModelCreated.resetHistory();

        gdg.on('create', triggerOnCreate);
        gdg.on('created', triggerOnCreated);
        gdg.on('model:created', triggerOnModelCreated);
    });
    afterEach(function() {
        gridCleanup(gdg);
    });
    it('default without values - new', function () {   
        expect(triggerOnCreate.called).to.be.false;
        expect(triggerOnCreated.called).to.be.false;
        expect(triggerOnModelCreated.called).to.be.false;
        
        gdg.$el.find('[data-event="create"]').click();     
        expect(triggerOnCreate.calledOnce).to.be.true;
        expect(document.querySelector('form').length).to.be.equal(2);
        expect(document.querySelector('label[for="number"]').innerText).to.equal('Numbers'); 
        expect(document.querySelector('label[for="string"]').innerText).to.include('Strings');
        document.querySelector('button.btn-success').click();
        expect(triggerOnCreated.calledOnce).to.be.true;
        expect(triggerOnModelCreated.calledOnce).to.be.true;
        expect(gdg.models[2].attributes.number).to.deep.equal(NaN);
        expect(gdg.models[2].attributes.string).to.equal(''); 
    });
    it('default with values - new', function () {  
        expect(triggerOnCreate.called).to.be.false;
        expect(triggerOnCreated.called).to.be.false;
        expect(triggerOnModelCreated.called).to.be.false;

        gdg.$el.find('[data-event="create"]').click();     
        expect(triggerOnCreate.called).to.be.true;
        document.querySelector('form')[0].value = '3';
        document.querySelector('form')[1].value = 'txt';
        document.querySelector('button.btn-success').click();
        expect(triggerOnCreated.called).to.be.true;
        expect(triggerOnModelCreated.called).to.be.true;
        expect(gdg.models[2].attributes.number).to.equal(3);
        expect(gdg.models[2].attributes.string).to.equal('txt'); 
    });
    it('prevent default', function() {
        gridCleanup(gdg);
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

        gdg.on('create', triggerOnCreate);
        gdg.on('created', triggerOnCreated);
        gdg.on('model:created', triggerOnModelCreated);
        
        expect(triggerOnCreate.called).to.be.false;
        expect(triggerOnCreated.called).to.be.false;
        expect(triggerOnModelCreated.called).to.be.false;
        gdg.$el.find('[data-event="create"]').click();
        expect(triggerOnCreate.called).to.be.true;
        expect(triggerOnCreated.notCalled).to.be.true;
        expect(triggerOnModelCreated.notCalled).to.be.true;
    });
});

