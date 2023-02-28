# Run

**Run** is a tiny library that runs user-provided code into a **Web Worker**. 
Its main purpose is to allow data transformation through snippet of code, therefore some global capabilities are disabled.

The library takes a chunk of javascript code (as string) and a data payload and return the result from its execution.

It does try to run *"untrusted"* code as safer as possible, since:

- The Web Worker can't access the DOM
- The Web Worker can't access the domain context of the host application
- The Web Worker runs in a separated thread, it doesn't block the UI
- The Web Worker shouldn't be able to make network operations (still in investigation)

The main use-case is within low-code applications where users can run snippets of code (not necessarily created by the same user) for a variety of tasks.

**Run** will be used in our upcoming Open Source Chart SDK project **Slashd**.



### Install

With **UnPkg CDN**:

```html
<script src="https://unpkg.com/@slashd/run"></script>
```



With **SkyPack CDN**:

```html
<script type="module">
import SlashdRun from 'https://cdn.skypack.dev/@slashd/run'
// your code
</script>
```



With a package manager:

```shell
npm install @slashd/run
```

Then, include it in the browser:

```html
<script src="node_modules/@slashd/run/dist/slashd-run.min.js"></script>
```

or with ES6 in a module with a bundler:

```js
import SlashdRun from '@slashd/run'
```





### How to use

You can create one or more tasks (independent workers):

```js
import SlashdRun from '@slashd/run'

const task = new SlashdRun()
```



The `exe` method returns a promise, so you can use it with `await`:

```js
const myCode = `return Math.random() * param`

const res = await task.exe(myCode, {param:20})

// res is i.e. 12.345657676
```


You can catch code error with:

```js
const myCode = `return MathRandom * param`

try{
    const res = await task.exe(myCode, {param:20})
}catch(e){
    console.log(e)
}

// ReferenceError: MathRandom is not defined
```


### Configuration

You can specify to load external libraries within the worker by adding the prop `deps` in the setup as an array of external paths:

```js
const task = new SlashdRun({deps:['https://unpkg.com/lodash', 'https://www.example.com/mylibrary.js']})
```

With the above setup, it's possible to use `lodash` in the provided code:

```js
const myCode = `_.difference(arr1, arr2);`

const res = await task.exe(myCode, {arr1:[2, 1], arr2:[2, 3]})

// => [1]
```

By default the Web Worker tries to limit some operation, such as the network capabilities.
If you want to disable this behavior and keep all the standard Web Worker capabilities, add the prop `restrict` set to `false`:

```js
const task = new SlashdRun({restrict:false})
```

With this option the user-provided code can make network operations, such `fetch()`.


To terminate the worker you can use:

```js
task.destroy()
```

### Contribute

Install dependencies:

```shell
npm i
```


Start the watcher

```shell
npm start 
```

