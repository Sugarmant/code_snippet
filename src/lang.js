const lang = {
    'File':'文件',
    'Edit':'编辑',
    'Selection':'选择',
    'View':'视图',
    'Delete':'删除',
    'New File...':'新建文件',
    'New Folder...':'新建文件夹'
}
export default function(key){
    return lang[key]?lang[key]:key
}