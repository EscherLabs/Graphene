describe('Data population', function () {
    beforeEach(function() {
        triggerOnChange = sinon.spy();
    });
    afterEach(function() {
        mygform.destroy();
    });
    it('should populate nested data properly', function () {
        var fields = [
            {type: 'fieldset', name:'basics', legend: '<i class="fa fa-th"></i> Basics', hideLabel: true, inline: true, fields:[
                {type: 'text', required: true, label: 'Field Label', name: 'label'},
                {type: 'text', label: 'Name', name: 'name'},
                {type: 'select', label: 'Display', name: 'type', value: 'select', options: [
                    {label: 'Dropdown', value: 'select'},
                    {label: 'Radio', value: 'radio'},
                    // {label: 'Range', value: 'range'}
                ]},
                // {type: 'text', label: 'External List', name: 'options'},

                // {type: 'text', label: 'Label-key', name: 'label_key'},
                // {type: 'text', label: 'Value-key', name: 'value_key'},

                {type: 'text', label: 'Default Value', name: 'value'},
                // {type: 'number', label: 'Max', name: 'max'},
                // {type: 'number', label: 'Min', name: 'min'},
                // {type: 'number', label: 'Step', name: 'step'},
                {type: 'textarea', label: 'Instructions', name: 'help'},
                {type: 'checkbox', label: 'Required', name: 'required'},
            ]},
            {type: 'fieldset', name:'options_c', legend: '<i class="fa fa-th-list"></i> options', hideLabel: true,  inline: true, fields:[
                {type: 'fieldset', label: false, array: true, name: 'options', fields: [
                    {label: 'Label'},
                    {label: 'Value'}
                ]}
            ]}
        ]
        var data = {"label":"Field Label","name":"label","type":"select","value":"","help":"","required":false,"options":[{"label":"Hello","value":"Stuff"}]}
        mygform = new gform({strict:false,fields:fields,data:data}, '#gform')

        expect(mygform.toJSON().options_c.options[0].label).to.be.equal('Hello');
    });
});