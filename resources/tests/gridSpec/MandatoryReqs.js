describe('Mandatory Options', function () {
    const schema = [{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"string",label:"Strings"}];
    beforeEach(function() {  			
        gdg = new GrapheneDataGrid({
            el:'#myGrapheneDataGrid',
            schema, 
            data: [
                {string:'test', number: 1},
            ]
        });
    });
    afterEach(function() {
        gridCleanup(gdg);
    });
    it('grid should be an object', function () {
        expect(gdg).to.be.an('object');
    });
    it('grid should have data', function () {
        expect(gdg.toJSON()).to.deep.equal([{string: 'test', number: 1}]);
    });
    it('grid should follow schema', function () {
        for (let i = 0; i < gdg.options.schema.length; i++) {
            expect(gdg.options.schema[i].item).to.deep.equal(schema[i]);    
        }
    });
});