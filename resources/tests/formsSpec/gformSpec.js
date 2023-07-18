describe('gform Initialization', function () {
    beforeEach(function() {
        mygform = new gform({name: 'gformTest', fields:[{label:'test' ,value: 'hello'}]}, '#gform');
    });
    it('should be an object', function () {
        expect(mygform).to.be.an('object');
    });
    it('should create a form', function () {
        expect(document.querySelector('form')).to.not.be.null;
    });
});