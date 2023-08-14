describe('Other customization options', function () {
    var options = {
        el:'#myGrapheneDataGrid',
        schema:[{type:"text", name:"number", label:"Numbers"}, {type:"text", name:"name",label:"Names"}],
        data: [
            {name:'Gru', number: 19},
            {name:'Joe Mama', number: 20},
            {name:'Baby Hands', number: 30},
            {name:'Dwayne "The Rock" Johnson', number: 30},
            {name:'Shrek', number: 21},
            {name:'Big Chungus', number: 315},
            {name:'Kevin', number: 19},
            {name:'Stuart', number: 78},
            {name:'Bob', number: 56},
            {name:'Donkey', number: 52},
            {name:'Mario', number: 49},
            {name:'Luigi', number: 360},
            {name:'Peter Griffin', number: 9},
            {name:'Rick', number: 1},
            {name:'Morty', number: 65},
            {name:'Mr. Meeseeks', number: 98},
            {name:'Nemo', number: 46},
            {name:'Mr. Incredible', number: 47},
            {name:'Frozone', number: 15},
            {name:'Elastigirl', number: 19},
            {name:'Donkey Kong', number: 30},
            {name:'Princess Peach', number: 93},
            {name:'President Business', number: 2},
            {name:'Batman', number: 5},
            {name:'Wonder Woman', number: 22},
            {name:'Unikitty', number: 89},
            {name:'Clubber Lang', number: 3},
            {name:'Pigmy Marmoset', number: 87},
            {name:'Jim', number: 2},
            {name:'Michael Scott', number: 5},
        ], 
    };
    beforeEach(function() {  		
        gdg = new GrapheneDataGrid(options);
    });
    afterEach(function() {
        gdg.destroy();
    });
    it('default count', function () {
        expect(gdg.grab(gdg.options).length).to.equal(25);
    });
    it('default entries', function () {
        var opt = document.querySelector('select.form-control');
        var arr = [10000, 25, 50, 100];
        for (let i = 1; i < opt.length; i++) {
            expect(parseInt(opt[i].value)).to.equal(arr[i]);
        } 
    });
    it('default search = true', function() {
        expect(document.querySelector('input.form-control.pull-right').disabled).to.be.false;
    });
    it('default filter = true', function() {
        expect(document.querySelector('tr.filter').hidden).to.be.false;
    });
    it('default columns = true', function() {
        expect(document.querySelector('div.btn-group.columnEnables').hidden).to.be.false;
    });
    it('default upload = true', function() {
        expect(document.querySelector('i.fa.fa-upload').hidden).to.be.false;
    });
    it('default download = true', function() {
        expect(document.querySelector('i.fa.fa-download').hidden).to.be.false;
        options = {                                         //switch options for non-default tests
            el:'#myGrapheneDataGrid',
            schema:[{type:"text", name:"number", label:"Numbers"}, {type:"text", name:"name",label:"Names"}],
            count: 6, entries: [10,20,30], search: false, filter: false, columns: false, upload: false, download: false,
            data: [
                {name:'Gru', number: 19},
                {name:'Joe Mama', number: 20},
                {name:'Baby Hands', number: 30},
                {name:'Dwayne "The Rock" Johnson', number: 30},
                {name:'Shrek', number: 21},
                {name:'Big Chungus', number: 315},
                {name:'Kevin', number: 19},
                {name:'Stuart', number: 78},
                {name:'Bob', number: 56},
                {name:'Donkey', number: 52},
                {name:'Mario', number: 49},
                {name:'Luigi', number: 360},
                {name:'Peter Griffin', number: 9},
                {name:'Rick', number: 1},
                {name:'Morty', number: 65},
                {name:'Mr. Meeseeks', number: 98},
                {name:'Nemo', number: 46},
                {name:'Mr. Incredible', number: 47},
                {name:'Frozone', number: 15},
                {name:'Elastigirl', number: 19},
                {name:'Donkey Kong', number: 30},
                {name:'Princess Peach', number: 93},
                {name:'President Business', number: 2},
                {name:'Batman', number: 5},
                {name:'Wonder Woman', number: 22},
                {name:'Unikitty', number: 89},
                {name:'Clubber Lang', number: 3},
                {name:'Pigmy Marmoset', number: 87},
                {name:'Jim', number: 2},
                {name:'Michael Scott', number: 5},
            ], 
        };
    });
    it('custom count', function() {
        expect(gdg.grab(gdg.options).length).to.equal(6);
    });
    it('custom entries', function() {
        var opt = document.querySelector('select.form-control');
        var arr = [10000, 10, 20, 30];
        for (let i = 1; i < opt.length; i++) {
            expect(parseInt(opt[i].value)).to.equal(arr[i]);
        } 
    });
    it('search = false', function() {
        expect(document.querySelector('input.form-control.pull-right')).to.be.null;
    });
    it('filter = false', function() {
        expect(document.querySelector('tr.filter')).to.be.null;
    });
    it('columns = false', function() {
        expect(document.querySelector('div.btn-group.columnEnables')).to.be.null;
    });
    it('upload = false', function() {
        expect(document.querySelector('i.fa.fa-upload')).to.be.null;
    });
    it('download = false', function() {
        expect(document.querySelector('i.fa.fa-download')).to.be.null;
    });
});