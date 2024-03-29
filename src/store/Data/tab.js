import {ref,watch} from 'vue'
import { defineStore } from 'pinia'
import ss from 'good-storage'
import {apiCreateItem,apiGetCatalog,apiRemoveItem,apiGetArticle,apiSaveArticle} from '@/api'
import {sortData,setAllChecked} from './helper'
import { useNoticeStore } from '../notice'
import { useArticleStore } from './article'
import { useCatelogStore} from './catelog'

export const useTabStore = defineStore('useTabStore', ()=>{
    const tabs = ref([])
    const tempTab = ref({})
    const activeTab = ref({})

    const catelogStore = useCatelogStore()
    /* 初始化 */
    ss.get('__md__tabs', '').split(',').map(v=> v && tabs.value.push(catelogStore.originList.find(vv=>vv.id == v)))
    tempTab.value = catelogStore.originList.find(v=>v.id == ss.get('__md__tempTabId','')) || {}
    activeTab.value = catelogStore.originList.find(v=>v.id == ss.get('__md__activeTabId','')) || {}
    if(activeTab.value.id) setActiveTab(activeTab.value)

    /* 添加tab */
    const addTab = tab => {
        if(tabs.value.find(v=>v.id == tab.id)) return
        if(tab.id == tempTab.value.id) {
            tempTab.value = {}
        }
        tabs.value.push(tab)
        refreshTabs()
        setActiveTab(tab)
    }

    /* 设置临时tab */
    const setTempTab = tab => {
        if(tab.id == activeTab.value.id) return
        if(!tabs.value.find(v=>v.id == tab.id)){
            tempTab.value = tab
        }
        setActiveTab(tab)
    }

    /* 删除tab */
    const removeTab = tab => {
        if(tab.id == activeTab.value.id){
            activeTab.value = {}
        }

        if(tab.id == tempTab.value.id){
            tempTab.value = {}
        }else{
            tabs.value = tabs.value.filter(v=>v.id != tab.id)
            refreshTabs()
        }
        
        if(tabs.value.length){
            setActiveTab(tabs.value[tabs.value.length-1])
        }else{
            if(tempTab.value.id) setActiveTab(tempTab.value)
        }
        useArticleStore().dispatch('removeTab',tab)
        // articles.value = articles.value.filter(v=>v.pid != tab.id)
        // ss.set('__md__articles',articles.value)
    }

    /* 设置active tab */
    function setActiveTab(tab){
        if(tab.id == activeTab.value.id) return
        activeTab.value = tab
        
        useArticleStore().dispatch('setActiveArticle',tab.id)
        useCatelogStore().dispatch('setActiveCatelog',tab)
    }

    /* 刷新Tabs */
    function refreshTabs(){
        let strs = ''
        tabs.value.map(v=>strs += v.id + ',')
        strs = strs.slice(0,-1)
    }

    function dispatch(event,payload){
        if(event == 'removeCatelog'){
            removeTab(payload)
            return
        }

        if(event == 'addCatelog'){
            addTab(payload)
            return
        }

        if(event == 'setUnsavedText'){
            const tab = tabs.value.find(v=>v.id == payload.tab_id) || tempTab.value
            tab.unsaved = payload.status
            return
        }
        if(event == 'loading'){
            const tab = tabs.value.find(v=>v.id == payload.tab_id) || tempTab.value
            tab.loading = payload.status
            return
        }
    }

    watch(tabs,val=>{
        ss.set('__md__tabs',val.map(v=>v.id).join(','))
    },{deep:true})
    watch(tempTab,val=>{
        ss.set('__md__tempTabId',val.id)
    },{deep:true})
    watch(activeTab,val=>{
        ss.set('__md__activeTabId',val.id)
    },{deep:true})

    return {
        tabs,
        tempTab,
        activeTab,

        setTempTab,
        setActiveTab,
        addTab,
        removeTab,
        dispatch
    }
})


