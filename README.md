# spfx-detokenize

An package to help de-tokenizing values within our source code when building or debugging SPFx solutions, avoiding having some information hardcoded in the code or relaying on environment variables.

## Installation

Install the package and save it as a dev dependency on top of a SPFx solution.

``` shell
npm i --save-dev spfx-detokenize
```
Now you are all set up and ready to start using the package.

## Setting-up the tokens information

Update the `gulpfile.js` with the following:

1. Import the module.

``` javascript
const detokenize = require("SPFx-detokenize");
```
2. Before the `build.initialize(gulp);` line, pass an array of `Token Object` to the `detokenize()` function and then pass the returned task to the `build.rig.addBuildTasks()` function.

``` javascript
const replaceTask = detokenize([{
    paramName: "welcomeText",
    token: "$WELCOME_TEXT$",
    files: ["webparts/helloWorld/components/HelloWorld.tsx"]
}]);

build.rig.addBuildTasks(replaceTask);
```

The `detokenize()` function accepts an **array of 'Token objects'** and a **name(__optional__)** as parameters.

### Token Object
The properties for the token object are:

|Property|Type|Required/Optional|Description|
|--------|----|-----------------|-----------|
|**paramName**|string|Required|Name of the parameter specified in the build command line.|
|**paramDescription**|string|Optional|Friendly name for the parameter to be used when prompting the user in case the parameter hasn't been specified though the command line|
|**token**|string|Required|Token to be replaced by the specified value within the specified files.|
|**files**|string[]|Required|Files where the Token is to be replaced.|

### Full Example
Here is an example of the final version of a `gulpfile.js` using the de-tokenizer module. 

``` javascript
'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const detokenize = require("SPFx-detokenize");

const replaceTask = detokenize([{
    paramName: "appId",
    token: "$AD_APP_ID$",
    files: ["webparts/helloWorld/components/HelloWorld.tsx"]
}, {
    paramName: "resourceURL",
    paramDescription: "Azure Resource URL",
    token: "$RESOURCE_URL$",
    files: [
        "webparts/helloWorld/HelloWorldWebPart.ts",
        "webparts/helloWorld/components/HelloWorld.tsx"
    ]
}, {
    paramName: "welcomeText",
    token: "$WELCOME_TEXT$",
    files: ["webparts/helloWorld/components/HelloWorld.tsx"]
}]);

build.rig.addBuildTasks(replaceTask);

build.initialize(gulp);

```
## Usage

After finishing with all the set-up in the `gulpfile.js`, you can either run the gulp task and pass the values along, or simply run the task without any values and then provide the vales when prompted.  

### Passing Parameters on Command line

The values should be provided after the name of the gulp task(`serve`, `build`) with the following format ` --paramName "VALUE" `.
``` shell
#build
gulp build --appId "0ae21bb6-5a8f-44ca-95fe-4dd2c05be1c8" 
            --welcomeText "Welcome to JS 231 SP!!!"
            --resourceURL "https://js231sp.com/"
            --ship
# Serve
gulp serve --appId "0ae21bb6-5a8f-44ca-95fe-4dd2c05be1c8"
            --welcomeText "Welcome to JS 231 SP!!!"
            --resourceURL "https://js231sp.com/"
```
   
### Without Passing Parameters on Command line

If there is a missing parameter or no parameter has been provided at all, the task will pause and prompt the user for the missing values. 

![SPFx de-tokenizer request parameter](https://raw.githubusercontent.com/DariuS231/spfx-detokenize/master/images/SPFX-Detokenizer-request-parameter.png "SPFx de-tokenizer request parameter")

## Result
After running the task, the tokens in the code within the specified files will be replaced by the provided values.

![SPFx de-tokenizer result](https://raw.githubusercontent.com/DariuS231/spfx-detokenize/master/images/SPFX-Detokenizer-result.png "SPFx de-tokenizer result")