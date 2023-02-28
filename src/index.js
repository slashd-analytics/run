let count = 0

export default function(props){

    const queue = {}
    const rejec = {}

    const {deps, restrict=true} = props || {}

    let externalScriptsDirective = ''

    if(deps){
        const ext = JSON.stringify(deps).replace(/[\[\]]/mig, '')
        externalScriptsDirective = `self.importScripts(${ext})`
    }

    let restrictSandboxDirective = restrict ? `dangObjects.forEach(d => self[d] = {})` : ''

    const workerRunnerStrFunc = `function workerRunner(){

        ${externalScriptsDirective}

        const dangObjects = ['Worker', 'fetch', 'location', 'IndexedDB', 'WebTransport', 'WebSocketStream', 'BroadcastChannel', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'WorkerNavigator', 'navigator']
        ${restrictSandboxDirective}
        
        self.onmessage = function(event) {
            const {code, context, uid, wid} = event.data
            const keys = Object.keys(context)
            const keysStr = keys.toString()
            try{
                const func = new Function(keysStr, code)
                const arrkeys = keys.map(k => context[k])
                const res = func(...arrkeys)
                self.postMessage({uid, res, wid})
            }catch(res){
                self.postMessage({uid, res, error:true, wid})
            }
        }

    }`

    const workerBlob = new Blob(
        [workerRunnerStrFunc.replace(/^function .+\{?|\}$/g, '')],
        { type:'module' }
    )

    const workerBlobUrl = URL.createObjectURL(workerBlob)
    const evalWorker = new Worker(workerBlobUrl)
    count++
    const wid = count

    const callback = function(event){
        const {wid, uid, res, error} = event.data
        if(error){
            rejec[uid](res)
        }else{
            queue[uid](res)
        }

        rejec[uid] = null
        delete rejec[uid]

        queue[uid] = null
        delete queue[uid]
    }

    evalWorker.addEventListener('message', callback, false)


    this.exe = (code, context={}) => {
        const uid = wid + '_' + new Date().getTime() + '_' + Math.random()
        evalWorker.postMessage({code,context,uid,wid})
        return new Promise((resolve, reject) => {
            queue[uid] = resolve
            rejec[uid] = reject
        })
    }

    this.destroy = () => {
        evalWorker.removeEventListener('message', callback, false)
        evalWorker.terminate()
    }

}

