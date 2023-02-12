# Run

**Run** is a tiny library that runs user-provided code into a **Web Worker**. 
Its main purpose is to allow data transformation through snippet of code, therefore some global capabilities are disabled.

The library takes a chunk of javascript code (as string) and a data payload and return the result from its execution.

It does try to run "untrusted" code as safer as possible, since:

- The Web Worker can't access the DOM
- The Web Worker can't access the domain context of the host application
- The Web Worker runs in a separated thread, it doesn't block the UI
- The Web Worker shouldn't be able to make network operations (still in investigation)

The main use-case is within low-code application where users can run snippets of code (not necessarily created by the same user) for a variety of tasks.



### Install

Use your favorite package manager:

```shell
npm install @slashd/run
```

Then, include it in the browser:

```html
<script src="node_modules/dist/slashd-run.min.js"></script>
```

or with ES6 in a module or within a bundler:

```js
import SlashdRun from '@slashd/run'
```





### How to use

The library requires a one-off init somewhere in your code, i.e.:

```js
import SlashdRun from '@slashd/run'
SlashdRun.setup()
```



The `exe` method returns a promise, so you can use it with `await`:

```js
const myCode = `return Math.random() * param`

const res = await SlashdRun.exe(myCode, {param:20})

// res is i.e. 12.345657676
```



### Configuration

You can specify to load external libraries within the worker by adding the prop `deps` in the setup as an array of external paths:

```js
SlashdRun.setup({deps:['https://unpkg.com/lodash', 'https://www.example.com/mylibrary.js']})
```

With the above setup, it's possible to use `lodash` in the provided code:

```js
const myCode = `_.difference(arr1, arr2);`

const res = await SlashdRun.exe(myCode, {arr1:[2, 1], arr2:[2, 3]})

// => [1]
```

By default the Web Worker tries to limit some operation, such as the network capabilities.
If you want to disable this behavior and keep all the standard Web Worker capabilities, add the prop `restrict` set to `false`:

```js
SlashdRun.setup({restrict:false})
```

With this option the user-provided code can make network operations, such `fetch()`.

### Contribute

Install dependencies:

```shell
npm i
```


Start the watcher

```shell
npm start 
```

