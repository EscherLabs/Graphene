describe('Custom Actions', function () {
    before(function() {  
        triggerOnCustom = sinon.spy();
        triggerOnCreate = sinon.spy();			    
        triggerOnCreated = sinon.spy();	
        triggerOnModelCreated = sinon.spy();	
    });
    beforeEach(function() {
        var custom = function(e){
            gdg.$el.find('[data-event="create"]').click(); 
            document.querySelector('form')[0].value = '3';
            document.querySelector('form')[1].value = 'txt';
            document.querySelector('button.btn-success').click();
        }
        gdg = new GrapheneDataGrid({     
            el:'#myGrapheneDataGrid',
            schema: [{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"string",label:"Strings"}], 
            data: [
                {string:'test', number: 1},
                {string:'random', number: 2}
            ],
            actions: [
                {name: "create", type: "success", min: 0, label: ' New'}, "|",
                {name: "customevent", type: "success", min: 0, label: ' Custom'}, "|",
                {name: "delete", type: "danger", min: 1, max: 1, label: ' Delete'}
            ],
        }).on('customevent', custom);      
    
        triggerOnCustom.resetHistory();
        triggerOnCreate.resetHistory();
        triggerOnCreated.resetHistory();
        triggerOnModelCreated.resetHistory();

        gdg.on('customevent', triggerOnCustom);
        gdg.on('create', triggerOnCreate);
        gdg.on('created', triggerOnCreated);
        gdg.on('model:created', triggerOnModelCreated);
    });
    afterEach(function() {
        gridCleanup(gdg);
    });
    it('check for edit function', function () {   
        triggerOnEdit = sinon.spy();			
        triggerOnModelEdit = sinon.spy();
        triggerOnEdited = sinon.spy();	
        triggerOnModelEdited = sinon.spy();	
        gdg.on('edit', triggerOnEdit);
        gdg.on('model:edit', triggerOnModelEdit);
        gdg.on('edited', triggerOnEdited);
        gdg.on('model:edited', triggerOnModelEdited);
        expect(triggerOnEdit.called).to.be.false;
        expect(triggerOnModelEdit.called).to.be.false;
        expect(triggerOnEdited.called).to.be.false;
        expect(triggerOnModelEdited.called).to.be.false;

        gdg.$el.find('[data-event="edit"]').click();        //nothing toggled
        expect(triggerOnEdit.called).to.be.false;
        expect(triggerOnModelEdit.called).to.be.false;
        expect(triggerOnEdited.called).to.be.false;
        expect(triggerOnModelEdited.called).to.be.false;

        gdg.models[0].toggle();                             //multiple entries toggled
        gdg.models[1].toggle(); 
        gdg.$el.find('[data-event="edit"]').click();
        expect(triggerOnEdit.called).to.be.false;
        expect(triggerOnModelEdit.called).to.be.false;
        expect(triggerOnEdited.called).to.be.false;
        expect(triggerOnModelEdited.called).to.be.false;

        gdg.models[1].toggle();                             //individual entry toggled
        gdg.$el.find('[data-event="edit"]').click();
        expect(triggerOnEdit.called).to.be.false;
        expect(triggerOnModelEdit.called).to.be.false;
        expect(triggerOnEdited.called).to.be.false;
        expect(triggerOnModelEdited.called).to.be.false;
    });
    it('testing custom functionality', function () {   
        expect(triggerOnCustom.called).to.be.false;
        expect(triggerOnCreate.called).to.be.false;
        expect(triggerOnCreated.called).to.be.false;
        expect(triggerOnModelCreated.called).to.be.false;

        gdg.$el.find('[data-event="customevent"]').click();     //custom action creates a row with number=3 and string='txt'
        expect(triggerOnCustom.calledOnce).to.be.true;        
        expect(triggerOnCreate.calledOnce).to.be.true;
        expect(triggerOnCreated.calledOnce).to.be.true;
        expect(triggerOnModelCreated.calledOnce).to.be.true;

        expect(gdg.models[2].attributes.number).to.equal(3);        //checks the gdg to see if the object was created
        expect(gdg.models[2].attributes.string).to.equal('txt'); 
    });
});
