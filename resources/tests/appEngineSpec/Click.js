describe('Click', function () {
    let opts = {};
    opts.config = {
	templates: [{name: "Main", content: "<div><button id='test-element'></button></div>"}],
	scripts: [{name: "Main", content: ""}]
    };
    opts.$el = $(".main")
    opts.data = {}
    const app = $g.engines['graphene']['v1'](opts)
    app.load()

    it('should call the given callback function', function () {
	const callback = sinon.spy();
	app.app.click("#test-element", callback);
	$(app.app.find("#test-element")).click()
	expect(callback.called).to.be.true;
    })
})
