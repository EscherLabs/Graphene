describe('Delete Actions', function () {                       
    before(function() {  
        triggerOnDelete = sinon.spy();			
        triggerOnModelDelete = sinon.spy();
        triggerOnDeleted = sinon.spy();	
        triggerOnModelDeleted = sinon.spy();	
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

        gdg.on('delete', triggerOnDelete);
        gdg.on('model:delete', triggerOnModelDelete);
        gdg.on('deleted', triggerOnDeleted);
        gdg.on('model:deleted', triggerOnModelDeleted);

        triggerOnDelete.resetHistory();
        triggerOnModelDelete.resetHistory();
        triggerOnDeleted.resetHistory();
        triggerOnModelDeleted.resetHistory();
        sinon.stub(window, 'confirm').callsFake(() => true);        //  Create a mock using sinon.stub() for the window.confirm() function and control its return value during tests
    });
    afterEach(function() {
        window.confirm.restore();       //  Good practice to restore a window after stubbing, in other scenarios this can effect subsequent tests
        gridCleanup(gdg);
    });
    it('default - delete on empty and all records', function () {
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

        expect(triggerOnDelete.calledOnce).to.be.true;
        expect(triggerOnModelDelete.calledTwice).to.be.true;
        expect(triggerOnDeleted.calledOnce).to.be.true;
        expect(triggerOnModelDeleted.calledTwice).to.be.true;

        // records get deleted, but the attributes still exist with a flag
        expect(gdg.models[0].deleted).to.be.true;
        expect(gdg.models[1].deleted).to.be.true;
    });

    it('default - delete individual records', function() {
        expect(triggerOnDelete.called).to.be.false;
        expect(triggerOnModelDelete.called).to.be.false;
        expect(triggerOnDeleted.called).to.be.false;
        expect(triggerOnModelDeleted.called).to.be.false;

        gdg.models[1].toggle();
        gdg.$el.find('[data-event="delete"]').click();
        expect(triggerOnDelete.calledOnce).to.be.true;
        expect(triggerOnModelDelete.calledOnce).to.be.true;
        expect(triggerOnDeleted.calledOnce).to.be.true;
        expect(triggerOnModelDeleted.calledOnce).to.be.true;
    });

    it('prevent default', function() {
        gdg.destroy();
        gdg = new GrapheneDataGrid({
            el:'#myGrapheneDataGrid',
            schema: [{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"string",label:"Strings"}], 
            data: [
                {string:'test', number: 1},
                {string:'random', number: 2}
            ]
        }).on('delete', function(e) {
            e.preventDefault();
        });

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
        expect(triggerOnModelDelete.notCalled).to.be.true;
        expect(triggerOnDeleted.notCalled).to.be.true;
        expect(triggerOnModelDeleted.notCalled).to.be.true;
    });
});