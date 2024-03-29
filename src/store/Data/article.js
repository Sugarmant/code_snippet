import {ref,computed,watch} from 'vue'
import { defineStore } from 'pinia'
import ss from 'good-storage'
import {apiCreateItem,apiGetCatalog,apiRemoveItem,apiGetArticle,apiSaveArticle} from '@/api'
import {sortData,setAllChecked} from './helper'
import { useNoticeStore } from '../notice'
import {useTabStore} from './tab'

export const useArticleStore = defineStore('useArticleStore', ()=>{

    const loading = ref(false)
    const articles = ref(ss.get('__md__articles',[]))
    const activeArticle = ref(ss.get('__md__activeArticle',{}))
    let loadId = null

    async function addArticleById(id){
        const res = articles.value.find(v=>v.pid == id)
        if(res){
            activeArticle.value = res
            return
        }
        if(loadId == id) return
        loadId = id
        loading.value = true
        const result = await apiGetArticle(id)
        if(result.code){
            articles.value.push(result.data)
            activeArticle.value = result.data
        }
        loading.value = false
        loadId = null
    }

    /* 设置未保存的文案 */
    function setUnsavedText(text){
        if(!activeArticle.value.id) return
        activeArticle.value.unsavedText = text
        let status = false
        if(activeArticle.value.unsavedText.replace(/^\s+|\s+$/g, '') != activeArticle.value.text.replace(/^\s+|\s+$/g, '')){
            status = true
        }else{
            status = false
        }
        useTabStore().dispatch('setUnsavedText',{status,tab_id:activeArticle.value.pid})
    }

    /* 保存文章 */
    async function saveArticle(){
        useTabStore().dispatch('loading',{status:1,tab_id:activeArticle.value.pid})
        const result = await apiSaveArticle({
            id:activeArticle.value.id,
            text:activeArticle.value.unsavedText
        })
        if(result.code){
            activeArticle.value.text = activeArticle.value.unsavedText
            setUnsavedText(activeArticle.value.text)
        }
        useTabStore().dispatch('loading',{status:0,tab_id:activeArticle.value.pid})
    }

    function dispatch(event,payload){
        if(event == 'removeTab'){
            if(payload.id == activeArticle.value.pid){
                activeArticle.value = {}
            }
            articles.value = articles.value.filter(v=>v.pid != payload.id)
        }

        if(event == 'setActiveArticle'){
            addArticleById(payload)
        }
    }

    watch(articles,val=>{
        ss.set('__md__articles',val)
    },{deep:true})

    watch(activeArticle,val=>{
        ss.set('__md__activeArticle',val)
    },{deep:true})

    return {
        activeArticle,
        loading,
        
        setUnsavedText,
        saveArticle,
        addArticleById,
        dispatch
    }
})


