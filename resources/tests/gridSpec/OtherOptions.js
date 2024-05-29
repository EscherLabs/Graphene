describe('Other customization options', function () {
    var options = {
        el:'#myGrapheneDataGrid',
        schema:[{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"name",label:"Names"}],
        search: true,
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
        gridCleanup(gdg);
    });
    it('default count', function () {
        expect(gdg.options.count).to.equal(25);
    });
    it('page count for default', function () {
        expect(gdg.options.pagecount).to.equal(2);
    });
    it('default entries', function () {
        var opt = gdg.options.entries;
        var arr = [25, 50, 100];
        for (let i = 0; i < opt.length; i++) {
            expect(opt[i]).to.equal(arr[i]);
        } 
    });
    it('default search', function() {        
        expect(gdg.showSearch).to.be.true;
    });   
    it('default filter = true', function() {
        expect(gdg.options.filter).to.be.true;
    });
    it('default columns = true', function() {
        expect(gdg.options.columns).to.be.true;
    });
    it('default upload = true', function() {
        expect(gdg.options.upload).to.be.true;
    });
    it('default download = true', function() {
        expect(gdg.options.download).to.be.true;
        options = {                                         //switch options for non-default tests
            el:'#myGrapheneDataGrid',
            schema:[{type:"number", name:"number", label:"Numbers"}, {type:"text", name:"name",label:"Names"}],
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
        expect(gdg.options.count).to.equal(6);
    });
    it('page count for custom', function () {
        expect(gdg.options.pagecount).to.equal(5);
    });
    it('custom entries', function() {
        var opt = gdg.options.entries;
        var arr = [10, 20, 30];
        for (let i = 0; i < opt.length; i++) {
            expect(opt[i]).to.equal(arr[i]);
        } 
    });
    it('search = false', function() {    
        expect(gdg.showSearch).to.be.false;
    });
    it('filter = false', function() {
        expect(gdg.options.filter).to.be.false;
    });
    it('columns = false', function() {
        expect(gdg.options.columns).to.be.false;
    });
    it('upload = false', function() {
        expect(gdg.options.upload).to.be.false;
    });
    it('download = false', function() {
        expect(gdg.options.download).to.be.false;
    });
});