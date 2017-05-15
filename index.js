// https://github.com/vzaccaria/mdtable2json
// Copyright © 2015 Vittorio Zaccaria Released under the BSD license.

var _ = require( 'lodash' )
var parser = require('mdast')
var fs = require('fs');

function tableToJson(t) {
    var headerCellArray = t.children[0].children
    var headers = _.map(headerCellArray, (it) => {
            return it.children[0].value
        })
        // Remove head
    t.children.splice(0, 1)
    var matrix = _.map(t.children, (row) => {
        return _.map(row.children, (cell) => {
            if (!_.isUndefined(cell.children[0])) {
                return cell.children[0].value
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
    return {
        headers, json
    }
}


function getTables(string) {
    var tokens = parser.parse(string)
    return _.map(_.filter(tokens.children, it => {
        return it.type === 'table'
    }), tableToJson)
}

var raw = fs.readFileSync(__dirname + '/README.md', 'utf8');
var result = getTables(raw);
fs.writeFileSync('api.json', JSON.stringify(result, null, 4));
