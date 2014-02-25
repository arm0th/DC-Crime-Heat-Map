/*global require, describe, it */
var utils = require("html/js/utils.js"),
    should = require('chai').should();

describe("utils", function () {
    "use strict";
    
    describe("capitalizeStr", function () {
        it("should handle an empty string", function () {
            var result = utils.capitalizeStr("");
            
            result.should.equal("");
        });
        
        it("should capitalize only the first letter of all uppercase letters", function () {
            var result = utils.capitalizeStr("THIS IS A TEST");
            result.should.equal("This is a test");
            
        });
        
        it("should capitalize only the first letter of all lowercase letters", function () {
            var result = utils.capitalizeStr("this is a test");
            result.should.equal("This is a test");
            
        });
    });
});
