var parser = require('mdast');
var fs = require('fs');
var _ = require( 'lodash' )

var raw = fs.readFileSync(__dirname + '/free-programming-books-zh_CN/README.md', 'utf8');
// var raw = fs.readFileSync(__dirname + '/demo.md', 'utf8');
var tokens = parser.parse(raw);

var results = [];

function listToTable(list){
    var listItems = list.children;
    _.each(listItems, item => {
        var baseChildren = item.children[0].children[0];
        var gitRegex = /github\.com|gitbook\.io/;
        if(baseChildren.children && baseChildren.children[0] && gitRegex.test(baseChildren.href)) {
            results.push({
                href: baseChildren.href,
                title: baseChildren.children[0].value
            });
        }
    });
    return results;
}

var result = _.map(_.filter(tokens.children, it => {
    return it.type === 'list';
}), listToTable);

console.log(result);