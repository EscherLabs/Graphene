describe('Fieldset', function () {
    beforeEach(function() {
        triggerOnChange = sinon.spy();
        mygform = new gform({flatten: false, fields:[{type: 'fieldset', name: 'first', fields: [{name:'test',value: 'hello'}] }] }, '#gform');
    });
    afterEach(function() {
        mygform.destroy();
    });
    it('should trigger events', function () {
        mygform.on('change', triggerOnChange);
        mygform.fields[0].fields[0].set('hello');
        expect(triggerOnChange.called).to.be.false;
        mygform.fields[0].fields[0].set('test');
        expect(triggerOnChange.called).to.be.true;
    });
    it('sets value with set', function () {
        expect(mygform.toJSON('first.test')).to.equal('hello');
        mygform.fields[0].fields[0].set('test');
	    expect(mygform.toJSON('first.test')).to.equal('test');
    });
    it('should create a text input correctly', function () {
        expect(document.querySelector('input[name=test]')).to.not.be.undefined;
    });
    it('should return expected value', function () {
        expect(mygform.toJSON('first').test).to.equal('hello'); //made changes, show github
    });
});