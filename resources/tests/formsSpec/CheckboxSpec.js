describe('Checkbox Input', function () {
    beforeEach(function() {
        triggerOnChange = sinon.spy();
        mygform = new gform({fields:[{name:'test', type: 'checkbox'}]}, '#gform');
        mygform.on('change:test', triggerOnChange);
    });
    afterEach(function() {
        mygform.destroy();
    });
    it('should return expected JSON', function () {
        expect(mygform.toJSON()).to.deep.equal({test: false});    //was originally .equal, but it causes an error
    });
    it('should create a checkbox correctly', function () {
        expect(document.querySelector('input[name=test]')).to.not.be.null;
    });
    it('sets value with set', function () {
        expect(mygform.toJSON().test).to.equal(false);
		mygform.find('test').set(true);
		expect(mygform.toJSON().test).to.equal(true);
    });
    it('sets value with set - get value from form to JSON', function () {
        expect(mygform.toJSON().test).to.equal(false);
        mygform.find('test').set(true);
        expect(mygform.toJSON()).to.deep.equal({test: true});    //was originally .equal, but it causes an error   
    });
    it('sets value with set - get value from name', function () {
        expect(mygform.toJSON().test).to.equal(false);
		mygform.find('test').set(true);
		expect(mygform.toJSON('test')).to.equal(true);
    });
    it('should return expected value', function () {
        expect(mygform.toJSON().test).to.equal(false);
    });
    it('should trigger events', function () {
        mygform.find('test').set(false);
        expect(triggerOnChange.called).to.be.false;
        mygform.find('test').set(true);
        expect(triggerOnChange.called).to.be.true;
    });
});