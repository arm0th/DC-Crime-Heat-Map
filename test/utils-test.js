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

    describe("insertCommas", function () {
        it("should accept numbers", function () {
            var result = utils.insertCommas(1);
            result.should.equal("1");
        });

        it("should accept string representation of numbers", function () {
            var result = utils.insertCommas("1");
            result.should.equal("1");
        });

        it("should return an empty string for strings that aren't numbers", function () {
            var result = utils.insertCommas("asdf");
            result.should.equal("");
        });

        it("should accept three digit positive numbers", function () {
            var result = utils.insertCommas("999");
            result.should.equal("999");
        });

        it("should insert commas for positive whole numbers greater than 3 digits", function () {
            var result = utils.insertCommas("3137");
            result.should.equal("3,137");

            result = utils.insertCommas("100000");
            result.should.equal("100,000");

            result = utils.insertCommas("123456789");
            result.should.equal("123,456,789");
        });

        it("should accept 2 digit negative whole numbers", function () {
            var result = utils.insertCommas("-99");
            result.should.equal("-99");
        });

        it("should accept three digit negative whole numbers", function () {
            var result = utils.insertCommas("-999");
            result.should.equal("-999");
        });

        it("should accept positive decimal numbers", function () {
            var result = utils.insertCommas("100.10");
            result.should.equal("100.10");
        });

        it("should accept negative decimal numbers", function () {
            var result = utils.insertCommas("-100.10");
            result.should.equal("-100.10");
        });

        it("should accept positive decimal four digit numbers", function () {
            var result = utils.insertCommas("1000.10");
            result.should.equal("1,000.10");
        });

        it("should accept negative decimal four digit numbers", function () {
            var result = utils.insertCommas("-1000.10");
            result.should.equal("-1,000.10");
        });
    });
});
