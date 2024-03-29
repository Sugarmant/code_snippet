import {ref,watch} from 'vue'
import { defineStore } from 'pinia'
import ss from 'good-storage'
import {apiCreateItem,apiGetCatalog,apiRemoveItem,apiGetArticle,apiSaveArticle} from '@/api'
import {sortData,setAllChecked} from './helper'
import { useNoticeStore } from '../notice'
import {useTabStore} from './tab'
import {useArticleStore} from './article'

export const useCatelogStore = defineStore('useCatelogStore', ()=>{
    let originList = ref([])
    const list = ref({id:0,name:"root",is_file:0,key:'0',child:[]})
    const loading = ref(false)
    const activeCatelog = ref(ss.get('__md__activeCatelog', {}))

    const articleStore = useArticleStore()
    
    /* 创建目录 */
    const createCatelog = async (item) => {
        //判断是否同级并且同名
        const cate = originList.value.find(v=>v.name == item.name && v.is_file == item.is_file && v.pid == item.pid)
        if(cate){
            useNoticeStore().addNotice({content:"同级目录或文件已存在"})
            return
        }

        //线上同步
        loading.value = true
        const result = await apiCreateItem({
            name:item.name,
            is_file:item.is_file,
            pid:item.pid
        })
        if(result.code){
            item.id = result.data
            originList.value.push(item)
        }
        loading.value = false
        //如果是文件则添加到tab，并且添加到article
        if(item.is_file){
            useTabStore().addTab(item)
            articleStore.dispatch('addArticleById',item.id)
        }
    }

    /* 设置当前item */
    function setActiveCatelog(item){
        activeCatelog.value = item
    }

    getCatalogList()
    /* 获取线上目录 */
    async function getCatalogList(){
        loading.value = true
        const result = await apiGetCatalog()
        if(result.code){
            const newData = result.data.map(v=>{
                return Object.assign({},v,originList.value.find(vv=>vv.id == v.id))
            })
            originList.value = newData
        }
        loading.value = false
    }
    
    /* 设置目录开关 */
    const setCatelogCheck = (id,status) => {
        if(status === undefined){
            originList.value.find(v=>v.id == id).checked = !originList.value.find(v=>v.id == id).checked
        }else{
            originList.value.find(v=>v.id == id).checked = status
        }
    }

    /* 删除目录或文件 */
    async function removeCatelog(item){
        if(originList.value.some(v=>v.pid == item.id)){
            useNoticeStore().addNotice({
                content:'请先删除子目录'
            })
            return
        }
        loading.value = true
        const result = await apiRemoveItem(item.id)
        if(result.code){
            originList.value = originList.value.filter(v=>v.id != item.id)
            useTabStore().dispatch('removeTab',item)
        }else{
            useNoticeStore().addNotice({
                content:result.msg
            })
        }
        loading.value = false
    }

    function dispatch(event,payload){
        if(event == 'setActiveCatelog'){
            setAllChecked(payload,originList.value)
            setActiveCatelog(payload)
            return
        }
    }

    watch(activeCatelog,val=>{
        ss.set('__md__activeCatelog',val)
    })

    watch(originList,val=>{
        ss.set('__md__catelogList',val)
        list.value = sortData({id:0,name:"root",is_file:0,key:'0',child:[]},JSON.parse(JSON.stringify(originList.value)))
    },{deep:true})
    
    originList.value = ss.get('__md__catelogList', [])
    

    return {
        originList,
        list,
        loading,
        activeCatelog,

        createCatelog,
        setActiveCatelog,
        removeCatelog,
        setCatelogCheck,
        dispatch
    }
})


