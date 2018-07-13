const { assert, expect } = require('chai');

const spfxTokenReplace = require('../index');
let { apiURLValue, config, apiIdValue, replaceArrayData } = require("./testData");
const { setFilesOriginalData, getFilesOriginalData, isFilesOriginalDataDifferent } = require("./testUtils");

describe('spfxTokenReplace instance', function () {
    describe('Returned Instance properties', function () {
        before(function () {
            process.argv.push("--appId", apiIdValue, "--endpointUrl", apiURLValue);
        });
        describe('Name', function () {
            describe('Not Specified', function () {
                it('Should be default: "detokenize-files"', function () {
                    const replaceObj = spfxTokenReplace(replaceArrayData);
                    assert.equal(replaceObj.name, "detokenize-files");
                });
            });

            describe('Specified', function () {
                const nameTest = "nameTest";
                it(`Should be: "${nameTest}"`, function () {
                    const replaceObj = spfxTokenReplace(replaceArrayData, nameTest);
                    assert.equal(replaceObj.name, nameTest);
                });
            });
        });

        describe('Execute', function () {
            it(`Should be a function`, function () {
                const replaceObj = spfxTokenReplace(replaceArrayData);
                expect(replaceObj.execute).to.be.an('function');
            });
        });
    });

    describe('#Execute()', function () {
        var originalLog;
        before(function () {
            originalLog = console.log;
            
            process.argv.push("--appId", apiIdValue, "--endpointUrl", apiURLValue);
            replaceArrayData = getFilesOriginalData(replaceArrayData, config);
        });

        it(`Should have replaced content of files`, async () => {
            console.log = function () {};
            await spfxTokenReplace(replaceArrayData).execute(config);
            console.log = originalLog;
            const isDataDifferent = isFilesOriginalDataDifferent(replaceArrayData, config);
            assert.equal(true, isDataDifferent);
        });

        after(function () {
            setFilesOriginalData(replaceArrayData, config);
        });
    });
}); 