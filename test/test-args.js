const { assert, expect } = require('chai');
const { spfxArgs } = require("./../lib/args");
let { apiURLValue, config, apiIdValue, replaceArrayData } = require("./testData");

const newArgKey = "NewArgKey", newArgValue = "newArgValue", appIdKey = "appId", endpointUrlKey = "endpointUrl";
describe('#spfxArgs', function () {
    before(function () {
        process.argv.push(`--${appIdKey}`, apiIdValue, `--${endpointUrlKey}`, apiURLValue);
    });

    describe('#GetArguments()', function () {
        it(`shoudl return object with appId and ${endpointUrlKey}`, () => {
            process.argv.push(`--${appIdKey}`, apiIdValue, `--${endpointUrlKey}`, apiURLValue);
            const args = spfxArgs.GetArguments();
            expect(args).to.have.all.keys(appIdKey, endpointUrlKey);
        });

    });

    describe('#setArgument()', function () {
        it(`args should contain the new key`, () => {
            spfxArgs.SetArgument(newArgKey, newArgValue);
            const args = spfxArgs.GetArguments();
            expect(args).to.include.keys(newArgKey);
        });
    });

    describe('#GetArgumentValue()', function () {
        describe('Passing arguments', function () {
            it(`should return ${apiIdValue}`, async () => {
                const tokenData = replaceArrayData[0];
                const args = spfxArgs.GetArguments();
                const argValue = await spfxArgs.GetArgumentValue({ paramName: appIdKey }, args);
                expect(argValue).to.eql(apiIdValue);
            });
        });

        describe('Not passing arguments', function () {
            it(`should return ${apiIdValue}`, async () => {
                const tokenData = replaceArrayData[0];
                const args = spfxArgs.GetArguments();
                const argValue = await spfxArgs.GetArgumentValue({ paramName: appIdKey });
                expect(argValue).to.eql(apiIdValue);
            });
        });
    });
}); 