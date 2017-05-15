// https://github.com/vzaccaria/mdtable2json
// Copyright © 2015 Vittorio Zaccaria Released under the BSD license.

var _ = require( 'lodash' );
var parser = require('mdast');
var fs = require('fs');

function tableToJson(t) {
    var headerCellArray = t.children[0].children;
    var headers = _.map(headerCellArray, (it) => {
            return it.children[0].value;
        });
        // Remove head
    t.children.splice(0, 1)
    var matrix = _.map(t.children, (row) => {
        return _.map(row.children, (cell) => {
            if (!_.isUndefined(cell.children[0])) {
                if(cell.children[0].type === 'text') {
                    return cell.children[0].value
                } else if(cell.children[0].type === 'link') {
                    return cell.children[0].href
                }
            } else {
                return ""
            }
        })
    })
    var json = _.map(matrix, (row) => {
        var o = {}
        _.map(row, (cell, index) => {
            o[headers[index]] = cell
        })
        return o
    })
    return json
}


function getTables(string) {
    var tokens = parser.parse(string);
    var results = [];

    _.forEach(tokens.children, function(token){
        if(token.type === 'heading') {
            heading = token.children[0].value
        }
        if(token.type === 'table') {
            var result = tableToJson(token);
            if(!_.isEmpty(result)){
                results.push({
                    heading: heading,
                    childrens: result
                });
            }
        }
    })

    return results;
}

var raw = fs.readFileSync(__dirname + '/books.md', 'utf8');
var result = getTables(raw);
fs.writeFileSync('api.json', JSON.stringify(result, null, 4));
