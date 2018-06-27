# spfx-detokenize
Detokenize files on SPFX build

## Instalation

```
npm i --save-dev spfx-detokenize
```

## Basic Usage

Update the gulpfile.js and import the module.

```
const detokenize = require("spfx-detokenize");
```
Before the `build.initialize(gulp);` line, add the task:

```
build.rig.addBuildTasks(detokenize([{
    paramName: "welcomeText",
    token: "$WELCOME_TEXT$",
    files: ["webparts/helloWorld/components/HelloWorld.tsx"]
}]));
```
## Example
```
'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const detokenize = require("spfx-detokenize");
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

build.rig.addBuildTasks(detokenize([{
    paramName: "appId",
    token: "$AD_APP_ID$",
    files: ["webparts/helloWorld/HelloWorldWebPart.ts", "webparts/helloWorld/components/HelloWorld.tsx"]
}, {
    paramName: "resourceURL",
    paramDescription: "Please Provide ",
    token: "$RESOURCE_URL$",
    files: ["webparts/helloWorld/HelloWorldWebPart.ts"]
}, {
    paramName: "welcomeText",
    token: "$WELCOME_TEXT$",
    files: ["webparts/helloWorld/components/HelloWorld.tsx"]
}]));

build.initialize(gulp);

```
## Build

The values should be provided after the name of the gul past(`serve`, `build`).

```
gulp build --appId "0ae21bb6-5a8f-44ca-95fe-4dd2c05be1c8" --welcomeText "Hello!" --resourceURL "https://google.com"
```

```
gulp serve --appId "0ae21bb6-5a8f-44ca-95fe-4dd2c05be1c8" --welcomeText "Hello!" --resourceURL "https://google.com"
```

Otherwise they will be prompted during the build process. 

It is recommended to provided the values particularly when running `gulp serve` as they will be prompted again and again after each change on the source code.