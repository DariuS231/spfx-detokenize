const { assert, expect } = require('chai');
const content = require("../lib/content");
let { apiURLValue, config, apiIdValue, replaceArrayData } = require("./testData");

const newArgKey = "NewArgKey", newArgValue = "newArgValue", appIdKey = "appId", endpointUrlKey = "endpointUrl";
describe('#content', function () {
    describe('#string', function () {
        it(`should replace all coincidences`, () => {
            content.string.Replace("","", "");
            expect('foobar').to.contain('foo');


            expect(fn).to.change(obj, 'val');
        });
    });

    describe('#file', function () {
        it(`should replace all coincidences`, () => {
        });
    });
}); 