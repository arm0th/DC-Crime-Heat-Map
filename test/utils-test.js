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

        it("should handle a null value", function () {
            var result = utils.capitalizeStr(null);
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

        it("should capitalize the first letter of each sentence", function () {
            var result = utils.capitalizeStr("sentence one. SENTENCE TWO.");
            result.should.equal("Sentence one. Sentence two.");
        });

        it("should handle elipsese", function () {
            var result = utils.capitalizeStr("sentence one ... SENTENCE TWO.");
            result.should.equal("Sentence one ... sentence two.");
        });
    });
});
