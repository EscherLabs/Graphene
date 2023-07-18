describe('Select Input', function () {
    beforeEach(function() {
        triggerOnChange = sinon.spy();
        mygform = new gform({fields:[{label:'test', type: 'select', value: 'hello', options: ['hello', 'stuff'] }]}, '#gform');
    });
    it('sets value with set - get value from form to JSON', function () {
        expect(mygform.toJSON('test')).to.equal('hello');
        mygform.set('test','stuff');
        expect(mygform.toJSON()).to.deep.equal({test: 'stuff'});    //was originally .equal, but it causes an error
    });
    it('sets value with set - get value from name', function () {
        expect(mygform.toJSON('test')).to.equal('hello');
        mygform.set('test','stuff');
		expect(mygform.toJSON('test')).to.equal('stuff');
      });
    it('sets value with set', function () {
        expect(mygform.toJSON('test')).to.equal('hello');
        mygform.find('test').set('stuff');
        expect(mygform.toJSON().test).to.equal('stuff');
    });
    it('should return expected JSON', function () {
        expect(mygform.toJSON()).to.deep.equal({test: 'hello'});    //was originally .equal, but it causes an error
    });
    it('should load choices from function', function () {
        mygform.destroy();
        mygform = new gform({fields:[
            {name: 'test', label: 'Label Field', type: 'select', options: function() {
                return [{"label":"Title","value":"second"},{"label":"Top Right","name":"topright"},{"label":"Bottom Right","name":"bottomright"},{"label":"Bottom Left","name":"bottomleft"},{"label":"Top Left","name":"topleft"}];
            }}]
        }, '#gform');
        expect(document.querySelector('select[name=test] option')).to.not.be.null;
    });
    it('should trigger events on update', function () {
        mygform.on('change', triggerOnChange);
        mygform.find('test').update({value:'test'});
        expect(triggerOnChange.called).to.be.true;
    });
    it('should not trigger events if silent', function () {
        mygform.on('change', triggerOnChange);
        mygform.find('test').update({value:'hello'}, true);
        expect(triggerOnChange.called).to.be.false;
    });
    it('should create a select input correctly', function () {
        expect(document.querySelector('select[name=test]')).to.not.be.null;
    });
    it('should load optGroups', function () {
        mygform.destroy();
        mygform = new gform({fields:[
            {name: 'test', label: 'Label Field', type: 'select', options: function(){
                return [{"label":"Title","value":"second"},{"label":"Top Right","name":"topright"},{"label":"Bottom Right","name":"bottomright"},{"label":"Bottom Left","name":"bottomleft"},{"label":"Top Left","name":"topleft"}];
            }}]
        }, '#gform');
        expect(document.querySelector('select[name=test] option')).to.not.be.null;
    });
});