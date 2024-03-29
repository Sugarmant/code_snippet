<script setup>
    import { onMounted, watch,ref } from 'vue';
    import { useArticleStore } from '@/store';
    import {apiGetArticle} from '@/api'
    import $l from '@/lang'

    const articleStore = useArticleStore();
    let mdList = {};
    let md = null

    watch(()=>articleStore.activeArticle,article=>{
        setExmple(article.unsavedText?article.unsavedText:article.text)
    })

    function setExmple(name,text){
        if(mdList[name]) mdList[name].setExmple(text)
    }

    function onHookKeybord(e){
        if(e.ctrlKey && e.key == 's'){
            e.preventDefault()
            articleStore.saveArticle()
        }
    }

    watch(()=>articleStore.activeArticle,handleArticle)

    function handleArticle(article){
        if(md) md.entry.style.display = 'none'

        const mdid = 'markdown'+article.id
        if(mdList[mdid]){
            md = mdList[mdid]
            md.entry.style.display = 'block'
            return
        }
        const stage = document.querySelector('#__reserved_editor_stage__')
        const markdown = document.createElement('div')
        markdown.id = mdid
        stage.appendChild(markdown)
        mdList[mdid] = new Markdown({
            editor:'#markdown'+article.id,
            change:(text)=>{
                articleStore.setUnsavedText(text)
            }
        })
        setExmple(mdid,article.unsavedText?article.unsavedText:article.text)
        md = mdList[mdid]
    }
    
    onMounted(()=>{
        if(articleStore.activeArticle.id) handleArticle(articleStore.activeArticle)
    })
</script>

<template>
    <div v-show="!articleStore.loading">
        <div id="__reserved_editor_stage__" v-show="articleStore.activeArticle.id" @keydown="onHookKeybord" class="node dark">
            
        </div>

        <div v-if="!articleStore.activeArticle.id" class="node dark">
            <div style="display:flex;justify-content:center;align-items:center;height:100%;">
                <div style="color:#666;font-size:20px;">{{ $l('Welcome!') }}</div>
            </div>
        </div>

    </div>

    <div v-if="articleStore.loading" class="node dark loading">
        {{$l('Loading...')}}
    </div>
</template>

<style lang="less" scoped>
    .node{flex:1;padding:15px;position:relative;height:calc(100vh - 64px);box-sizing:border-box;overflow-y:auto;
        &::-webkit-scrollbar {
            width: 12px;
        }
        &::-webkit-scrollbar-track {
            background-color: #1f1f1f;
        }
        &::-webkit-scrollbar-thumb {
            transition:.3s;
            background-color: #333;
        }
        &::-webkit-scrollbar-thumb:hover {
            background-color: #555;
        }
    }

    .loading{font-size:14px;text-align:center;padding:50px 0;color:#666}
</style>