const assert = require('assert');

const spfxTokenReplace = require('../lib');
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
                assert.equal(typeof replaceObj.execute, 'function');
            });
        });
    });

    describe('#Execute()', function () {
        before(function () {
            process.argv.push("--appId", apiIdValue, "--endpointUrl", apiURLValue);
            replaceArrayData = getFilesOriginalData(replaceArrayData, config);
        });

        it(`Should have replaced content of files`, async () => {
            await spfxTokenReplace(replaceArrayData).execute(config);
            const isDataDifferent = isFilesOriginalDataDifferent(replaceArrayData, config);
            assert.equal(true, isDataDifferent);
        });

        after(function () {
            setFilesOriginalData(replaceArrayData, config);
        });
    });
}); 