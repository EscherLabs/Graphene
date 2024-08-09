describe("Modal", function () {
    let opts = {};
    opts.config = {
	templates: [{name: "Main", content: "<div><button id='test-element'></button></div>"}],
	scripts: [{name: "Main", content: ""}]
    };
    opts.$el = $(".main")
    opts.data = {}
    const app = $g.engines['graphene']['v1'](opts)
    app.load()

    const content = "This is a modal!";

    afterEach(function () {
        // remove all modals
        Array.from(document.getElementsByClassName("modal")).forEach((x) =>
            x.remove(),
        );
    });

    // `app.modal(content)` creates a modal
    it('creates a modal', function () {
	app.app.modal(content);
	it("should produce an modal on `app.modal(content)`", function () {
	    expect(() => app.modal(content))
		.to.increase(() => document.querySelectorAll(".modal").length)
		.by(1);
	});
    })

    // `app.modal(content)` creates a modal with the content, `content`
    it("should produce a modal with the content `content` on `app.modal(content)`", function () {
        app.app.modal(content);
        expect(document.querySelector("output[name=modal]").textContent).to.equal(
            content,
        );
    });

    it("should close the modal when the X button is clicked", function () {
	app.app.modal(content);
	const closeButton = document.querySelector("div.modal-header>button.close")
	expect(() => closeButton.click())
	    .to.decrease(() => document.querySelectorAll(".modal").length);
	
    })

    it("should close the modal when the 'Close' button is clicked", function () {
	debugger;
	app.app.modal(content);
	const closeButton = document.querySelector("div.modal-footer>div>button")
	expect(() => {closeButton.click(); app.app.redraw()})
	    .to.decrease(() => document.querySelectorAll(".modal").length);
	
    })
})
