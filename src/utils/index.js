

export function timeStampToTime(timeStamp,format){
    if(typeof timeStamp != 'number') timeStamp = Number(timeStamp)

    if(String(timeStamp).length==10){
        timeStamp = Number(timeStamp+'000')
    }

    var date = new Date(timeStamp)

    return format.replace(/ms/g,('00'+date.getMilliseconds()).slice(-3))
    .replace(/s/g,('0'+date.getSeconds()).slice(-2))
    .replace(/m/g,('0'+date.getMinutes()).slice(-2))
    .replace(/h/g,('0'+date.getHours()).slice(-2))
    .replace(/D/g,('0'+date.getDate()).slice(-2))
    .replace(/M/g,('0'+(date.getMonth()+1)).slice(-2))
    .replace(/Y/g,date.getFullYear())
}

export function parseJson(){
    try{
        return JSON.parse(arguments[0])
    }catch(e){
        return arguments[0]
    }
}

export function copy(str){
    const input = document.createElement('input')
    input.setAttribute('value', str)
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    document.body.removeChild(input)
    showToast('复制成功')
}

export function showLoading(){
    showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration:0
    });
}

export function hideLoading(){
    showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration:.1
    });
}

export function recursion(data) {
    return data.sort(function (a, b) { return a.name.localeCompare(b.name, 'zh-CN') })
}