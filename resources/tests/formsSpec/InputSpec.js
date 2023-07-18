describe('Text Input', function () {
    beforeEach(function() {
        triggerOnChange = sinon.spy();
        mygform = new gform({name: 'gformTest', fields:[{label:'test' ,value: 'hello'}]}, '#gform');
    });
    afterEach(function() {
        mygform.destroy();
    });
    it('should create a text input correctly', function () {
        expect(document.querySelector('input[name=test]')).to.not.be.null;
    });
    it('sets value with set', function () {
        expect(mygform.toJSON('test')).to.equal('hello');
        mygform.find('test').set('test');
        expect(mygform.toJSON().test).to.equal('test');
    });
    it('sets value with set - get value from name', function () {
        expect(mygform.toJSON('test')).to.equal('hello')
        mygform.find('test').set('test');
		expect(mygform.toJSON('test')).to.equal('test');
    });
    it('should return expected JSON', function () {
        expect(mygform.toJSON()).to.deep.equal({test: 'hello'}); //was originally .equal, but it causes an error
    });
    it('should return expected value', function () {
        expect(mygform.toJSON('test')).to.equal('hello');
    });
    it('should trigger events', function () {
        mygform.on('change', triggerOnChange);
        mygform.find('test').set('hello');
        expect(triggerOnChange.called).to.be.false;
        mygform.find('test').set('test');
        expect(triggerOnChange.called).to.be.true;
    });
    it('should trigger field events', function () {
        mygform.on('change:test', triggerOnChange);
        mygform.find('test').set('hello');
        expect(triggerOnChange.called).to.be.false;
        mygform.find('test').set('test');
        expect(triggerOnChange.called).to.be.true;
    });
    it('sets value with set - get value from form to JSON', function () {
        expect(mygform.toJSON('test')).to.equal('hello');
        mygform.set('test','test');
        expect(mygform.toJSON()).to.deep.equal({test: 'test'}); //was originally .equal, but it causes an error
    });
});