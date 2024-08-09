describe("Render", function () {
    let opts = {};
    opts.config = {
	templates: [
	    {name: "Main", content: "<div><button id='test-element'></button>{{>Hello}}{{>Color}}</div>"},
	    {name: "Hello", content: "<p>Hello, World!</p>"},
	    {name: "Color", content: "<p>My favorite color is {{color}}.</p>"}
	],
	scripts: [
	    {name: "Main", content: ""},
	    {name: "Hello", content: ""},
	    {name: "Color", content: ""}
	]
    };
    opts.$el = $(".main")
    opts.data = {}
    const app = $g.engines['graphene']['v1'](opts)
    app.load()


    it('creates a template', function () {
	const templateString = opts.config.templates.find(x => x.name == "Hello").content
	const expected = new DOMParser().parseFromString(templateString, "text/xml")
	const got = new DOMParser().parseFromString(app.app.render("Hello", {}), "text/xml")
        expect(expected.isEqualNode(got)).to.be.true
    })

    it('creates a template with the given text replacement', function () {
	const templateString = opts.config.templates.find(x => x.name == "Color").content
	const expected = new DOMParser().parseFromString(templateString.replace("{{color}}", "blue"), "text/xml")
	const got = new DOMParser().parseFromString(app.app.render("Color", {color: "blue"}), "text/xml")
	debugger;
	app.app.render("Color", {color: "blue"})
        expect(expected.isEqualNode(got)).to.be.true
    })
})
