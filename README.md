# Slashd Run

**Slashd Run** is a tiny library to run untrusted code into a Web Worker. 
The main purpose is to allows data transformation through code, therefore some global capabilities are disabled.

A Web Worker doesn't have access to the DOM therefore it cannot manipulate the webpage.

Ideally, the host can execute some code, providing some data and get back the result.

There are some helper libraries included to help formatting and transformation, such as:
- dayjs
- lodash
- numbro



### Run locally:

Start the watcher

```shell
npm start 
```



### Installation

You can install the library  as regular library:

```html
	<script src="/dist/slashd-run.min.js"></script>
```

or using ES6:

```js
import SlashdRun from '/src/index.js'
```





### How to use

**Slashd Run** return a promise, so you can use it with await:

```js
const myCode = `return Math.random() * param`

const res = await SlashdRun(myCode, {param:20})

// i.e. 12.345657676
```

