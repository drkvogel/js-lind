
### make js-lind responsive

cause it ain't, currently

js-lind meta viewport tag -> ay
already has:
```html
<meta name="viewport" content="width=device-width,initial-scale=1">
```


OK, so... `gulp build-nomin` works in `cbird@yoga3 ~/Projects/js-lind/yo`:

    2017-03-30 20:51:36 cbird@yoga3 ~/Projects/js-lind/yo
    $ gulp build-nomin
    ...
    [20:51:30] Starting 'scripts'...
    [20:51:30] Starting 'images'...
    [20:51:30] Starting 'fonts'...
    [20:51:30] Starting 'extras'...
    (node:19908) DeprecationWarning: os.tmpDir() is deprecated. Use os.tmpdir() instead.
    ...
    [20:51:35] Finished 'build-nomin' after 505 ms

but `gulp build` does not (nor on Q108):

    2017-03-30 20:51:36 cbird@yoga3 ~/Projects/js-lind/yo
    $ gulp build
    [21:17:27] Starting 'html'...
    events.js:160 throw er; // Unhandled 'error' event
    Error at new JS_Parse_Error (eval at <anonymous> (C:\Users\cbird\Projects\js-lind\yo\node_modules\uglify-js\tools\node.js:28:1), <anonymous>:1534:18)

and if we put `gulp-util` into our `html` task:

```js
var gulpUtil = require('gulp-util')
...
gulp.task('html', ['styles', 'scripts'], () => {
    ...
    .pipe($.uglify().on('error', gulpUtil.log))
...
```

we get a bit more information:

```
  message: 'C:\\Users\\cbird\\Projects\\js-lind\\yo\\app\\index.html: SyntaxError: Unexpected token: operator (<)',
  fileName: 'C:\\Users\\cbird\\Projects\\js-lind\\yo\\app\\index.html',
  lineNumber: 1,
  stack: 'Error\n    at new JS_Parse_Error (eval at <anonymous> (C:\\Users\\cbird\\Projects\\js-lind\\yo\\node_modules\\uglify-js\\tools\\node.js:28:1)'
```

It looks like uglify.js is trying to parse `index.html`!
If we disable all tasks like in `build-nomin` except

    .pipe($.if('*.html', $.htmlmin({ collapseWhitespace: true })))

we get:

    [21:32:29] { Error: Parse Error: < 0 || enteredNumber > MAXSTARTRAND) {

as if `htmlmin` is parsing the js, and if we enable only `cssnano()`:

    [21:53:35] { [Error: C:\Users\cbird\Projects\js-lind\yo\index.html:1:1: Unknown word> 1 | <!doctype html>
        | ^
      2 | <html lang="">
      3 | ]
      message: 'C:\\Users\\cbird\\Projects\\js-lind\\yo\\index.html:1:1: Unknown word\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 1 | \u001b[39m<!doctype
    html>\n \u001b[90m   | \u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 2 | \u001b[39m<html lang=\u001b[32m""\u001b[39m>\n \u001b[90m 3 | \u0
    01b[39m',
      showStack: false,
      showProperties: true,
      plugin: 'gulp-cssnano',

as if cssnano is trying to parse the html... 
It's as if `$.if()` isn't working, or.... I wonder if they are trying to parse the map file?
If we move

    .pipe(ignore.exclude([ "**/*.map" ]))

to earlier in the chain:

    21:55:40] 'html' errored after 36 ms
    [21:55:40] ReferenceError: ignore is not defined
        at Gulp.<anonymous> (C:/Users/cbird/Projects/js-lind/yo/gulpfile.babel.js:58:15)

if in doubt,:

    2017-03-30 21:57:50 cbird@yoga3 ~/Projects/js-lind/yo
    $ rm -rf node_modules && npm install

still [22:10:03] ReferenceError: ignore is not defined

http://stackoverflow.com/questions/26708110/how-to-tell-gulp-to-skip-or-ignore-some-files-in-gulp-src

    gulp.src(['css/**/!(ignore.css)*.css'])

or

    2017-03-30 22:10:03 cbird@yoga3 ~/Projects/js-lind/yo
    $ npm install --save-dev gulp-ignore
    C:\Users\cbird\Projects\js-lind\yo
    `-- gulp-ignore@2.0.2
      `-- gulp-match@1.0.3

no dice. what is:

    const $ = gulpLoadPlugins();

try to load into babel-node REPL:

    2017-03-30 22:25:43 cbird@yoga3 ~/Projects/js-lind/yo
    $ npm install -g babel
    C:\Users\cbird\AppData\Roaming\npm\babel -> C:\Users\cbird\AppData\Roaming\npm\node_modules\babel\lib\cli.js
    C:\Users\cbird\AppData\Roaming\npm\babel-node -> C:\Users\cbird\AppData\Roaming\npm\node_modules\babel\lib\cli.js
    C:\Users\cbird\AppData\Roaming\npm\babel-external-helpers -> C:\Users\cbird\AppData\Roaming\npm\node_modules\babel\lib\cli.js
    C:\Users\cbird\AppData\Roaming\npm
    `-- babel@6.23.0
    $ babel-node gulpfile.babel.js
    You have mistakenly installed the `babel` package, which is a no-op in Babel 6.
    Babel's CLI commands have been moved from the `babel` package to the `babel-cli` package.
        npm uninstall babel
        npm install --save-dev babel-cli
    See http://babeljs.io/docs/usage/cli/ for setup instructions.
    $ npm uninstall babel
    $ npm install -g babel-cli
    $ babel-node gulpfile.babel.js
    > require('./gulpfile.babel.js');
    {}
    > $
    ReferenceError: $ is not defined
    > gulpUtil
    ReferenceError: gulpUtil is not defined
    > var gulpfile = require('./gulpfile.babel.js');
    undefined
    > gulpfile.$
    undefined

pffft...

look at previous versions of `gulpfile.babel.js`, and compare to working versions in other projects

    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))

    2017-03-30 23:05:48 cbird@yoga3 ~/Projects/js-lind/yo
    $ git diff  895f3f3d428a2ba29a6bb155ba HEAD gulpfile.babel.js
    [opens in WinMerge]

http://stackoverflow.com/questions/3338126/how-to-diff-the-same-file-between-two-different-commits-on-the-same-branch

not sure original ever worked for `gulp build`, though did for `gulp serve`...

OK, instead of

    .pipe($.uglify().on('error', gulpUtil.log))     # calls uglify without if
    .pipe($.if('*.js', $.uglify()))

do

    .pipe($.if('*.js', $.uglify().on('error', gulpUtil.log)))

and

```js
import ignore from 'gulp-ignore';
    ...
    .pipe(ignore.exclude([ "**/*.map" ]))
    ...
```

or
```js
const $ = gulpLoadPlugins();    // where 'gulp-ignnore' is in package.json
    ...
    .pipe($.ignore.exclude([ "**/*.map" ]))
    ...
```

was missing `$.` in `.pipe($.ignore.exclude([ "**/*.map" ]))` before...
but `gulp-if` still seems not to be working....

http://stackoverflow.com/questions/23101139/how-to-use-gulp-if-to-conditionally-compile-less-files

    2017-03-30 23:52:36 cbird@yoga3 ~/Projects/js-lind/yo
    $ git diff gulpfile.babel.js ~/Projects/bb-quizzes/trails/yo/gulpfile.babel.js
    [doesn't open in WinMerge - why?]

copied

    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))

from working (last I tried) C:\Users\cbird\Projects\bb-quizzes\trails\yo\gulpfile.babel.js, still doesn't work.
It's as if gulp-if isn't working, is parsing all files, or... isn't being lazy
or, '*.js' is not the correct parameter, it should be a function reference

so

    .pipe($.if('*.js', $.uglify().on('error', gulpUtil.log)))

causes e.g. `index.html` to pass through and uglify throws an error;

    //.pipe($.if('*.js', $.uglify().on('error', gulpUtil.log)))

commented out skips uglification and leaves the unminified versions in `./dist/scripts` (confirmed), whereas:

```js
var ifConditionJS = function(file) {
    if (file.extname == '.js') return true;
};
        ...
        .pipe($.if(ifConditionJS, $.uglify()))
        ...
```

correctly filters out `*.js` files and uglifies them...

as mentioned in this post: http://stackoverflow.com/a/42552148/535071

https://github.com/robrich/gulp-if#condition
>condition
>Type: boolean or stat object or function that takes in a vinyl file and returns a boolean or RegularExpression that works on the file.path
The condition parameter is any of the conditions supported by gulp-match. The file.path is passed into gulp-match.
If a function is given, then the function is passed a vinyl file. The function should return a boolean.

"RegularExpression that works on the file.path"....

both js-lind and bb-quizzes/trails have mostly the same packages, and the same versions:

    "gulp": "^3.9.0",
    "gulp-if": "^1.2.5"
    "gulp-uglify": "^1.1.0",

gulp-if still not recognising `*.html` (`file` is `undefined`?) but others now work with funcs instead of regex and htmlmin passes instead of throwing.
so css, js minified, html not. obscures business logic I suppose, looks more professional and responsive stuff works (better at least), can show to AY....

    2017-03-31 00:24:40 cbird@yoga3 ~/Projects/js-lind/yo
    $ node
    > var path = require('path');
    undefined
    > path.
    path.__defineGetter__      path.__defineSetter__
    path.__lookupGetter__      path.__lookupSetter__
    path.__proto__             path.constructor
    path.hasOwnProperty        path.isPrototypeOf
    path.propertyIsEnumerable  path.toLocaleString
    path.toString              path.valueOf
    path._makeLong             path.basename
    path.delimiter             path.dirname
    path.extname               path.format
    path.isAbsolute            path.join
    path.normalize             path.parse
    path.posix                 path.relative
    path.resolve               path.sep
    path.win32


at Fri Mar 31 00:51:18 2017
I have spent all evening and several White Russians on this...

Fri Mar 31 01:03:52 2017

>use file.extname === undefined to filter html
I don't like it, but...

try gulp build in bb-quizzes/trails/yo

    2017-03-31 01:09:49 cbird@yoga3 ~/Projects/bb-quizzes/trails/yo
    $ gulp build
    [01:09:55] Failed to load external module babel-register
    [01:09:55] Failed to load external module babel-core/register
    [01:09:55] Failed to load external module babel/register
    [01:09:55] Local gulp not found in ~\Projects\bb-quizzes\trails\yo
    [01:09:55] Try running: npm install gulp
    2017-03-31 01:09:55 cbird@yoga3 ~/Projects/bb-quizzes/trails/yo
    $ npm install    
    ...
    $ bower install
    $ gulp build
    events.js:160
          throw er; // Unhandled 'error' event
          at C:\Users\cbird\Projects\bb-quizzes\trails\yo\node_modules\uglify-js\tools\node.js:71:33

OK, looks like same problem....

has gulp or node changed since this worked? 

    2017-03-31 01:21:19 cbird@yoga3 ~/Projects/bb-quizzes/trails/yo
    $ gulp --version
    [01:22:59] Requiring external module babel-register
    [01:22:59] CLI version 3.9.1
    [01:22:59] Local version 3.9.1

Does it still work on Q108?

meta: this is "only" noddy Yeoman and jQuery, but has proven to be fragile.
Not sure if an overall benefit, cost-savings thing.


tell Gulp to skip or ignore some files in gulp.src([...])? (http://stackoverflow.com/questions/26708110/how-to-tell-gulp-to-skip-or-ignore-some-files-in-gulp-src)
Automatically Load Gulp Plugins with gulp-load-plugins | Andy Carter (http://andy-carter.com/blog/automatically-load-gulp-plugins-with-gulp-load-plugins)
javascript - gulp-load-plugins not loading plugins (http://stackoverflow.com/questions/29288870/gulp-load-plugins-not-loading-plugins)
Using Babel · Babel (https://babeljs.io/docs/setup/#installation)
Using the ES6 transpiler Babel on Node.js (http://2ality.com/2015/03/babel-on-node.html)
CLI · Babel (https://babeljs.io/docs/usage/cli/)
I am getting error while running npm start · Issue #263 · kriasoft/react-starter-kit (https://github.com/kriasoft/react-starter-kit/issues/263)
javascript - How do I load my script into the node.js REPL? (http://stackoverflow.com/questions/8425102/how-do-i-load-my-script-into-the-node-js-repl)
npm - How to use gulp-load-plugins with Browser-Sync? (http://stackoverflow.com/questions/33388559/how-to-use-gulp-load-plugins-with-browser-sync)
How to use gulp-if to conditionally compile less files? (http://stackoverflow.com/questions/23101139/how-to-use-gulp-if-to-conditionally-compile-less-files)
robrich/gulp-if: Conditionally run a task (https://github.com/robrich/gulp-if)
OverZealous/lazypipe: Lazily create a pipeline out of reusable components. Useful for gulp. (https://github.com/OverZealous/lazypipe)
gulp-if/package.json at master · robrich/gulp-if (https://github.com/robrich/gulp-if/blob/master/package.json)
robrich/gulp-match: Does a vinyl file match a condition? (https://github.com/robrich/gulp-match)
gulpjs/vinyl-fs: Vinyl adapter for the file system. (https://github.com/gulpjs/vinyl-fs)
isaacs/minimatch: a glob matcher in javascript (https://github.com/isaacs/minimatch)
How to get the first file with a .txt extension in a directory with nodejs? (http://stackoverflow.com/questions/17518193/how-to-get-the-first-file-with-a-txt-extension-in-a-directory-with-nodejs)
