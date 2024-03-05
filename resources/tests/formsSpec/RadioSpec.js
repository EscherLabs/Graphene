describe("Radio Input", function () {
  beforeEach(function () {
    triggerOnChange = sinon.spy();
    mygform = new gform(
      {
        fields: [{ name: "test", type: "radio", options: ["hello", "stuff"] }],
      },
      "#gform"
    );
  });
  afterEach(function () {
    mygform.destroy();
  });
  it("should create a radio input correctly", function () {
    expect(document.querySelector("input[type=radio][name=test]")).to.not.be
      .undefined;
  });
  it("sets value with set - get value from form to JSON", function () {
    expect(mygform.toJSON("test")).to.equal("");
    mygform.find("test").set("stuff");
    expect(mygform.toJSON()).to.deep.equal({ test: "stuff" }); //was originally .equal, but it causes an error
  });
  it("should trigger events", function () {
    mygform.on("change", triggerOnChange);
    mygform.find("test").set("hello", true);
    expect(triggerOnChange.called).to.be.false;
    mygform.find("test").set("stuff");
    expect(triggerOnChange.called).to.be.true;
  });
  it("sets value with set", function () {
    expect(mygform.toJSON().test).to.equal("");
    mygform.find("test").set("stuff");
    expect(mygform.find("test").value).to.equal("stuff");
  });
  it("sets value with set - get value from name", function () {
    expect(mygform.toJSON("test")).to.equal("");
    mygform.find("test").set("stuff");
    expect(mygform.toJSON("test")).to.equal("stuff");
  });
  it("should return expected JSON", function () {
    expect(mygform.toJSON()).to.deep.equal({ test: "" }); //was originally .equal, but it causes an error
  });
  it("should return expected value", function () {
    expect(mygform.toJSON().test).to.equal("");
  });
});
