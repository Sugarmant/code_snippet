import {recursion} from '@/utils'

export function sortData(root,data){
    if(data.length == 0) return root
    let i = 0;
    let level = 1;
    if(root.level != null) level = root.level + 1
    while(i<data.length){
        if(!root.is_file && root.child == undefined) root.child = []
        if(root.id == data[i].pid){
            const aa = data[i]
            aa['level'] = level
            data.splice(i,1)
            root.child.push(sortData(aa,data))
        }else{
            i++
        }
    }
    if(!root.is_file && root.child.length > 0){
        const folder = root.child.filter(v=>v.is_file == 0)
        const files = root.child.filter(v=>v.is_file == 1)
        root.child = recursion(folder).concat(recursion(files))
    }
    return root
}

export function setAllChecked(root,data){
    if(root.pid != 0){
        const proot = data.find(v=>v.id == root.pid)
        proot.checked = true
        setAllChecked(proot,data)
    }
}