import {ref,computed} from 'vue'
import { defineStore } from 'pinia'
import ss from 'good-storage'
import {apiCreateItem,apiGetCatalog,apiRemoveItem,apiGetArticle,apiSaveArticle} from '@/api'
import {sortData,setAllChecked} from './helper'
import { useNoticeStore } from '../notice'

export const useDataStore = defineStore('useDataStore', ()=>{
    let originData = ss.get('__md__originData', [])
    const syncing = ref(false)
    const state = ref({id:0,name:"root",is_file:0,key:'0',child:[]})
    const tabs = ref([])
    const tempTab = ref({})
    const activeTab = ref({})
    const activeItem = ref({})
    
    const articleLoading = ref(false)
    const articles = ref([])
    const activeArticle = ref({})

    /* 初始化 */
    ss.get('__md__tabs', '').split(',').map(v=> v && tabs.value.push(originData.find(vv=>vv.id == v)))
    activeTab.value = originData.find(v=>v.id == ss.get('__md__activeTabId','')) || {}
    tempTab.value = originData.find(v=>v.id == ss.get('__md__tempTabId','')) || {}
    if(activeTab.value.id) setActiveTab(activeTab.value)
    if(activeTab.value.id == ss.get('__md__activeArticle',{}).pid) {
        activeArticle.value = ss.get('__md__activeArticle',{})
        articles.value = ss.get('__md__articles',[])
    }

    refreshData()
    
    /* 创建目录 */
    const createItem = async (item) => {
        const res = originData.find(v=>v.name == item.name && v.is_file == item.is_file)
        if(res) return
        syncing.value = true
        const result = await apiCreateItem({
            name:item.name,
            is_file:item.is_file,
            pid:item.pid
        })
        if(result.code){
            item.id = result.data
            originData.push(item)
            refreshData()
        }
        syncing.value = false
        if(item.is_file) addTab(item)
    }

    /* 设置当前item */
    function setActiveItem(item){
        activeItem.value = item
    }

    getCatalog()
    /* 获取线上目录 */
    async function getCatalog(){
        syncing.value = true
        const result = await apiGetCatalog()
        if(result.code){
            const newData = result.data.map(v=>{
                return Object.assign({},v,originData.find(vv=>vv.id == v.id))
            })
            originData = newData
            refreshData()
        }
        syncing.value = false
    }
    
    /* 设置目录开关 */
    const setCheckStatus = (id,status) => {
        if(status === undefined){
            originData.find(v=>v.id == id).checked = !originData.find(v=>v.id == id).checked
        }else{
            originData.find(v=>v.id == id).checked = status
        }
        refreshData()
    }

    /* 删除item */
    async function removeItem(item){
        if(originData.some(v=>v.pid == item.id)){
            useNoticeStore().addNotice({
                content:'请先删除子目录'
            })
            return
        }
        syncing.value = true
        const result = await apiRemoveItem(item.id)
        if(result.code){
            originData = originData.filter(v=>v.id != item.id)
            refreshData()
            if(tabs.value.find(v=>v.id == item.id || tempTab.value.id == item.id) || activeTab.value.id == item.id){
                removeTab(item)
            }
        }else{
            useNoticeStore().addNotice({
                content:result.msg
            })
        }
        syncing.value = false
    }

    /* 添加tab */
    const addTab = tab => {
        if(tabs.value.find(v=>v.id == tab.id)) return
        if(tab.id == tempTab.value.id) {
            tempTab.value = {}
            ss.remove('__md__tempTabId')
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
            ss.set('__md__tempTabId',tab.id)
        }
        setActiveTab(tab)
        ss.set('__md__activeTabId',tab.id)
    }

    /* 删除tab */
    const removeTab = tab => {
        if(tab.id == activeTab.value.id){
            activeTab.value = {}
        }
        if(tab.id == tempTab.value.id){
            tempTab.value = {}
            ss.remove('__md__tempTabId')
        }else{
            tabs.value = tabs.value.filter(v=>v.id != tab.id)
            refreshTabs()
        }
        if(tabs.value.length){
            setActiveTab(tabs.value[tabs.value.length-1])
        }else{
            if(tempTab.value.id) setActiveTab(tempTab.value)
        }
        articles.value = articles.value.filter(v=>v.pid != tab.id)
        ss.set('__md__articles',articles.value)
    }

    /* 设置active tab */
    function setActiveTab(tab){
        if(tab.id == activeTab.value.id) return
        activeTab.value = tab
        setActiveItem(tab)
        setAllChecked(tab,originData)
        refreshData()
        ss.set('__md__activeTabId',tab.id)
        refreshArticle()
    }

    /* 刷新目录 */
    function refreshData(){
        ss.set('__md__originData',originData)
        state.value = sortData({id:0,name:"root",is_file:0,key:'0',child:[]},JSON.parse(JSON.stringify(originData)))
    }

    /* 刷新Tabs */
    function refreshTabs(){
        let strs = ''
        tabs.value.map(v=>strs += v.id + ',')
        strs = strs.slice(0,-1)
        ss.set('__md__tabs',strs)
    }

    /* 刷新文章 */
    async function refreshArticle(){
        const res = articles.value.find(v=>v.pid == activeTab.value.id)
        if(res){
            activeArticle.value = res
            ss.set('__md__activeArticle',res)
            return
        }
        articleLoading.value = true
        const result = await apiGetArticle(activeTab.value.id)
        if(result.code){
            activeArticle.value = result.data
            addArticle(result.data)
            ss.set('__md__activeArticle',result.data)
        }
        articleLoading.value = false
    }

    function addArticle(article){
        if(articles.value.some(v=>v.id == article.id)) return
        articles.value.push(article)
        ss.set('__md__articles',articles.value)
    }

    /* 设置未保存的文案 */
    function setUnsavedText(text){
        activeArticle.value.unsavedText = text
        ss.set('__md__activeArticle',activeArticle.value)
        const tab = tabs.value.find(v=>v.id == activeArticle.value.pid) || tempTab.value
        if(activeArticle.value.unsavedText.replace(/^\s+|\s+$/g, '') != activeArticle.value.text.replace(/^\s+|\s+$/g, '')){
            tab.unsaved = true
        }else{
            tab.unsaved = false
        }
    }

    /* 保存文章 */
    async function saveArticle(){
        if(activeArticle.value.unsavedText == '') return
        const tab = tabs.value.find(v=>v.id == activeArticle.value.pid) || tempTab.value
        tab.loading = true
        const result = await apiSaveArticle({
            id:activeArticle.value.id,
            text:activeArticle.value.unsavedText
        })
        if(result.code){
            activeArticle.value.text = activeArticle.value.unsavedText
            ss.set('__md__activeArticle',activeArticle.value)
            setUnsavedText(activeArticle.value.text)
        }
        tab.loading = false
    }

    return {
        state,
        syncing,
        activeItem,
        createItem,
        setCheckStatus,
        removeItem,
        setActiveItem,

        tabs,
        tempTab,
        activeTab,
        addTab,
        setTempTab,
        setActiveTab,
        removeTab,

        activeArticle,
        articleLoading,
        setUnsavedText,
        saveArticle
    }
})


