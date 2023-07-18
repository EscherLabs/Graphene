describe('Textarea', function () {
    beforeEach(function() {
        triggerOnChange = sinon.spy();
        mygform = new gform({fields:[{name:'test',value: 'hello', type: 'textarea'}]}, '#gform');
    });
    afterEach(function() {
        mygform.destroy();
    });
    it('sets value with set - get value from form to JSON', function () {
        expect(mygform.toJSON('test')).to.equal('hello');
        mygform.find('test').set('test');
        expect(mygform.toJSON()).to.deep.equal({test: 'test'}); //was originally .equal, but it causes an error
    });
    it('should trigger events', function () {
        mygform.on('change:test', triggerOnChange);
        mygform.find('test').set('hello');
        expect(triggerOnChange.called).to.be.false;
        mygform.find('test').set('test');
        expect(triggerOnChange.called).to.be.true;
    });
    it('should create a textarea correctly', function () {
        expect(document.querySelector('textarea[name=test]')).to.not.be.undefined;
    });
    it('sets values with set', function () {
        expect(mygform.toJSON().test).to.equal('hello');
        mygform.find('test').set('test');
        expect(mygform.find('test').value).to.equal('test');
    });
    it('sets values with set - get value from name', function () {
        expect(mygform.toJSON('test')).to.equal('hello');
		mygform.find('test').set('test');
		expect(mygform.toJSON('test')).to.equal('test');
    });
    it('should return expected JSON', function () {
        expect(mygform.toJSON()).to.deep.equal({test: 'hello'}); //was originally .equal, but it causes an error
    });
    it('should return expected value', function () {
        expect(mygform.toJSON('test')).to.equal('hello');
    });
});