describe('Hidden Input', function () {
    beforeEach(function() {
        triggerOnChange = sinon.spy();
        mygform = new gform({fields:[{name:'test',value: 'hello', type: 'hidden'}]}, '#gform');
    });
    afterEach(function() {
        mygform.destroy();
    });
    it('should trigger events', function () {
        mygform.on('change', triggerOnChange);
        mygform.find('test').set('hello');
        expect(triggerOnChange.called).to.be.false;
        mygform.find('test').set('test');
        expect(triggerOnChange.called).to.be.true;
    });
    it('should return expected value', function () {
        expect(mygform.toJSON('test')).to.equal('hello');
    });
    it('sets value with set - get value from form to JSON', function () {
        expect(mygform.toJSON()).to.deep.equal({test: 'hello'});    //was originally .equal, but it causes an error
        mygform.find('test').set('test');
        expect(mygform.toJSON()).to.deep.equal({test: 'test'});    //was originally .equal, but it causes an error
    });
    it('sets value with set - get value from name', function () {
        expect(mygform.toJSON()).to.deep.equal({test: 'hello'});    //was originally .equal, but it causes an error
        mygform.find('test').set('test');
        expect(mygform.toJSON('test')).to.equal('test');
    });
    it('should create a hidden input correctly', function () {
        expect(document.querySelector('input[type=hidden][name=test]')).to.not.be.undefined;
    });
    it('should return expected JSON', function () {
        expect(mygform.toJSON()).to.deep.equal({test: 'hello'});    //was originally .equal, but it causes an error
    });
    it('sets value with set', function () {
        expect(mygform.toJSON()).to.deep.equal({test: 'hello'});    //was originally .equal, but it causes an error
        mygform.find('test').set('test');
        expect(mygform.find('test').value).to.equal('test');
    });
});