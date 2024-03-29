import req from '@/request'

export function apiTest(){
    return req.post('/index/user/index')
}

export function apiCreateItem(form){
    return req.post('/api/markdown/create_item',form)
}

export function apiGetCatalog(){
    return req.post('/api/markdown/get_catalog')
}

export function apiRemoveItem(id){
    return req.post('/api/markdown/remove_item',{id})
}

export function apiGetArticle(id){
    return req.post('/api/markdown/get_article',{id})
}

export function apiSaveArticle(form){
    return req.post('/api/markdown/save_article',form)
}