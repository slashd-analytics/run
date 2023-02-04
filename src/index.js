const queue = {}

const workerRunnerStrFunc = `function workerRunner(){

    self.cache = {}
    self.importScripts('https://unpkg.com/numbro', 'https://unpkg.com/dayjs', 'https://unpkg.com/lodash')

    const dangObjects = ['fetch', 'location', 'IndexedDB', 'BroadcastChannel', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'navigator']
    dangObjects.forEach(d => self[d] = {})
    
    self.onmessage = function(event) {
        const {code, context, uid} = event.data
        const keys = Object.keys(context)
        const keysStr = keys.toString()
        
        // if(!self.cache[code]) self.cache[code] = new Function(keysStr, code)
        // const func = self.cache[code]

        const func = new Function(keysStr, code)
        const arrkeys = keys.map(k => context[k])
        const res = func(...arrkeys)
        self.postMessage({uid, res})
    }

}`

const workerBlob = new Blob(
    //[workerRunner.toString().replace(/^function .+\{?|\}$/g, '')],
    [workerRunnerStrFunc.replace(/^function .+\{?|\}$/g, '')],
    { type:'module' }
)

const workerBlobUrl = URL.createObjectURL(workerBlob)

var evalWorker = new Worker(workerBlobUrl)

evalWorker.addEventListener('message', function(event){
    const {uid, res} = event.data
    queue[uid](res)
    queue[uid] = null
    delete queue[uid]
}, false)


export default (code, context) => {
    const uid = new Date().getTime() + Math.random()
    evalWorker.postMessage({code,context,uid})
    return new Promise((resolve, reject) => {
        queue[uid] = resolve
    })
}
