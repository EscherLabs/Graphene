//test defaults, make sure actions can only be called with mins and maxes (you don't need to test functionality, but interactions)

//create a new datagrid with a custom action and a prevent default (make sure custom actions are made and functional, make sure prevent default works)

describe('Delete Actions', function () {
    before(function() {  
        triggerOnDelete = sinon.spy();			
        triggerOnModelDelete = sinon.spy();
        triggerOnDeleted = sinon.spy();	
        triggerOnModelDeleted = sinon.spy();	
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
    it('default - delete', function () {
        gdg.on('delete', triggerOnDelete);
        gdg.on('model:delete', triggerOnModelDelete);
        gdg.on('deleted', triggerOnDeleted);
        gdg.on('model:deleted', triggerOnModelDeleted);
        expect(triggerOnDelete.called).to.be.false;
        expect(triggerOnModelDelete.called).to.be.false;
        expect(triggerOnDeleted.called).to.be.false;
        expect(triggerOnModelDeleted.called).to.be.false;

        gdg.$el.find('[data-event="delete"]').click();
        expect(triggerOnDelete.calledOnce).to.be.true;
        expect(triggerOnModelDelete.called).to.be.false;
        expect(triggerOnDeleted.called).to.be.false;
        expect(triggerOnModelDeleted.called).to.be.false;

        gdg.models[0].toggle();
        gdg.models[1].toggle();
        triggerOnDelete.resetHistory();
        gdg.$el.find('[data-event="delete"]').click();
        //window.confirm = () => true;
        expect(triggerOnDelete.calledOnce).to.be.true;
        expect(triggerOnModelDelete.calledTwice).to.be.true;
        expect(gdg.models[0].attributes.number).to.be.equal(1);
        expect(gdg.models[0].attributes.string).to.be.equal('test');
        expect(gdg.models[1].attributes.number).to.be.equal(2);
        expect(gdg.models[1].attributes.string).to.be.equal('random');

        //default max for delete 

        // gdg.models[1].toggle();
        // triggerOnDelete.resetHistory();
        // triggerOnModelDelete.resetHistory();
        // gdg.$el.find('[data-event="delete"]').click();
        // expect(triggerOnDelete.calledOnce).to.be.true;
        // expect(triggerOnModelDelete.calledOnce).to.be.true;
        // expect(document.querySelector('form#modal.gform').length).to.be.equal(2);
        // expect(document.querySelector('form#modal.gform')[0].value).to.be.equal('1');
        // expect(document.querySelector('form#modal.gform')[1].value).to.be.equal('test');
        // document.querySelector('input#f972.form-control').value = 5; 
        // document.querySelector('input#f973.form-control').value = 'str'; 
        // document.querySelector('button#el_f975.btn.btn-default.hidden-print.btn-success').click();
        // expect(triggerOnDeleted.calledOnce).to.be.true;
        // expect(triggerOnModelDeleted.calledOnce).to.be.true;
        // expect(gdg.models[0].attributes.number).to.be.equal('5');
        // expect(gdg.models[0].attributes.string).to.be.equal('str');
    });
    it('prevent default', function() {
    //     gdg = new GrapheneDataGrid({
    //         el:'#myGrapheneDataGrid',
    //         schema: [{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"string",label:"Strings"}], 
    //         data: [
    //             {string:'test', number: 1},
    //             {string:'random', number: 2}
    //         ]
    //     }).on('delete', function(e) {
    //         e.preventDefault();
    //     });
    //     //should I include created and model:created spies?
    //     triggerOnDelete.resetHistory();
    //     triggerOnModelDelete.resetHistory();
    //     triggerOnDeleted.resetHistory();
    //     triggerOnModelDeleted.resetHistory();
    //     expect(triggerOnDelete.called).to.be.false;
    //     expect(triggerOnModelDelete.called).to.be.false;
    //     expect(triggerOnDeleted.called).to.be.false;
    //     expect(triggerOnModelDeleted.called).to.be.false;
    //     gdg.$el.find('[data-event="delete"]').click();
    //     expect(triggerOnDelete.notCalled).to.be.true;
    //     expect(triggerOnModelDelete.notCalled).to.be.true;
    //     expect(triggerOnDeleted.notCalled).to.be.true;
    //     expect(triggerOnModelDeleted.notCalled).to.be.true;
    });
});