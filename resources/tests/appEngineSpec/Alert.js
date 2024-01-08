describe("Alerts", function () {
    const app = App();
    const message = "This is some content!";
    const title = "This is a title!";

    afterEach(function () {
        // remove all alerts
        Array.from(document.getElementsByClassName("toast")).forEach((x) =>
            x.remove(),
        );
    });

    it("should have a function, `app.alert`, that exists", function () {
        expect(app.alert).to.exist.and.be.a("function");
    });

    it("should produce an alert on `app.alert(message)`", function () {
        expect(() => app.alert(message))
            .to.increase(() => document.querySelectorAll(".toast").length)
            .by(1);
    });

    it("should produce an alert with the message, `message`, on `app.alert(message)`", function () {
        app.alert(message);
        expect(document.querySelector(".toast-message").textContent).to.equal(
            message,
        );
    });

    it("should produce an alert of type `info`, on `app.alert(message)`", function () {
        app.alert(message);
        expect(
            document.querySelector(".toast").classList.contains("toast-info"),
        ).to.be.true;
    });

    it("should produce an alert with the message, `message`, on `app.alert({content: message})`", function () {
        app.alert({ content: message });
        expect(document.querySelector(".toast-message").textContent).to.equal(
            message,
        );
    });

    it("should produce an alert with no title on `app.alert({content: message})`", function () {
        app.alert({ content: message });
        expect(document.querySelector(".toast-title")).to.be.null;
    });

    it("should produce an alert of type `info`, on `app.alert({content: message})`", function () {
        app.alert({ content: message });
        expect(
            document.querySelector(".toast").classList.contains("toast-info"),
        ).to.be.true;
    });

    it("should produce an alert with the title, `title`, on `app.alert({content: title})`", function () {
        app.alert({ title: title });
        expect(document.querySelector(".toast-title").textContent).to.equal(
            title,
        );
    });

    it("should produce an alert with no content on `app.alert({title: title})`", function () {
        app.alert({ title: title });
        expect(document.querySelector(".toast-content")).to.be.null;
    });

    it("should produce an alert of type `info`, on `app.alert({status: 'info'})`", function () {
        app.alert({ status: "info" });
        expect(
            document.querySelector(".toast").classList.contains("toast-info"),
        ).to.be.true;
    });

    it("should produce an alert of type `warning`, on `app.alert({status: 'warning'})`", function () {
        app.alert({ status: "warning" });
        expect(
            document
                .querySelector(".toast")
                .classList.contains("toast-warning"),
        ).to.be.true;
    });

    it("should produce an alert of type `error`, on `app.alert({status: 'error'})`", function () {
        app.alert({ status: "error" });
        expect(
            document.querySelector(".toast").classList.contains("toast-error"),
        ).to.be.true;
    });

    it("should produce an alert of type `success`, on `app.alert({status: 'success'})`", function () {
        app.alert({ status: "success" });
        expect(
            document
                .querySelector(".toast")
                .classList.contains("toast-success"),
        ).to.be.true;
    });
});
