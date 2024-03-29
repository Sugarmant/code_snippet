<script setup>
    import {provide, reactive, ref, inject, watch,computed} from 'vue'
    import SiderTree from './SiderTree.vue'
    import $l from '@/lang'
    import { useCatelogStore,useMaskStore } from '@/store'

    const catelogStore = useCatelogStore()
    const maskStore = useMaskStore()
    
    const currentIpt = reactive({
        type:'',
        item:''
    })

    const popupProp = reactive({
        show:false,
        top:0,
        left:0
    })

    const root = computed(()=>catelogStore.list)
    catelogStore.setActiveCatelog(root.value)

    function onRightClick(e,item){
        e.stopPropagation()
        e.preventDefault()
        if(e.target instanceof HTMLButtonElement && !item) return
        catelogStore.setActiveCatelog(root.value)
        if(item){
            catelogStore.setActiveCatelog(item)
        }else{
            catelogStore.setActiveCatelog(root.value)
        }
        popupProp.show = true
        popupProp.top = e.y
        popupProp.left = e.x
        maskStore.onShow(function(){
            popupProp.show = false
        })
    }

    function handleMenu(event){
        switch(event){
            case 'new file':{
                currentIpt.item = catelogStore.activeCatelog
                currentIpt.type = 'file'
                if(catelogStore.activeCatelog && catelogStore.activeCatelog.id!=0) catelogStore.setCatelogCheck(catelogStore.activeCatelog.id,1)
                setTimeout(()=>{
                    document.querySelector('#create-ipt').focus()
                },10)
                break;
            };
            case 'new folder':{
                currentIpt.item = catelogStore.activeCatelog
                currentIpt.type = 'folder'
                if(catelogStore.activeCatelog && catelogStore.activeCatelog.id!=0) catelogStore.setCatelogCheck(catelogStore.activeCatelog.id,1)
                setTimeout(()=>{
                    document.querySelector('#create-ipt').focus()
                },10)
                break;
            };
            case 'delete':{
                catelogStore.removeCatelog(catelogStore.activeCatelog)
                break;
            };
            default:{};
        }
        maskStore.onHide()
    }

    function onCreateCatelog(name){
        if(name){
            const obj = {
                id:Date.now(),
                pid:catelogStore.activeCatelog.id,
                name,
                is_file:currentIpt.type=='file'?1:0
            }
            if(currentIpt.type=='folder') obj['child'] = []
            catelogStore.setActiveCatelog(obj)
            catelogStore.createCatelog(obj)
        }
    }

    provide('currentIpt',currentIpt)
    provide('onRightClick',onRightClick)
    provide('onCreateCatelog',onCreateCatelog)

</script>

<template>
    <div @contextmenu="onRightClick" class="node">
        <div class="title">
            <span>{{ $l('WORKSPACE') }}</span>
            <span v-if="catelogStore.loading">
                <svg t="1708779286319" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1649" width="32" height="32"><path d="M512 74.666667c-17.066667 0-32 14.933333-32 32v149.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V106.666667c0-17.066667-14.933333-32-32-32zM693.333333 362.666667c8.533333 0 17.066667-2.133333 23.466667-8.533334l104.533333-104.533333c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-104.533333 104.533333c-12.8 12.8-12.8 32 0 44.8 4.266667 6.4 12.8 8.533333 21.333333 8.533334zM917.333333 480h-149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h149.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM714.666667 669.866667c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l104.533333 104.533333c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-106.666666-104.533333zM512 736c-17.066667 0-32 14.933333-32 32v149.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-149.333333c0-17.066667-14.933333-32-32-32zM309.333333 669.866667l-104.533333 104.533333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l104.533334-104.533333c12.8-12.8 12.8-32 0-44.8s-36.266667-12.8-46.933334 0zM288 512c0-17.066667-14.933333-32-32-32H106.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h149.333333c17.066667 0 32-14.933333 32-32zM247.466667 202.666667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l104.533333 104.533333c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-106.666666-104.533333z" fill="#999999" p-id="1650"></path></svg>
            </span>
        </div>
        <SiderTree :root="root"></SiderTree>

        <div v-if="root.child.length == 0 && !currentIpt.item" class="empty">
            <div class="tip">{{ $l('empty workspace') }}</div>
            <div class="btns">
                <button @click="handleMenu('new file')">{{ $l('New File...') }}</button>
                <button @click="handleMenu('new folder')">{{ $l('New Folder...') }}</button>
            </div>
        </div>

        <div v-if="popupProp.show" class="popup" :style="`top:${popupProp.top}px;left:${popupProp.left}px;`">
            <!-- File right click option -->
            <template v-if="catelogStore.activeCatelog.is_file">
                <button @click="handleMenu('delete')">{{ $l('Delete') }}</button>
            </template>
            <!-- Folder right click option -->
            <template v-else>
                <button @click="handleMenu('new file')">{{ $l('New File...') }}</button>
                <button @click="handleMenu('new folder')">{{ $l('New Folder...') }}</button>
                <button @click="handleMenu('delete')" v-if="catelogStore.activeCatelog.id != 0">{{ $l('Delete') }}</button>
            </template>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .node{width:250px;background-color:#181818;height:calc(100vh - 32px);border-right:solid 1px #333;
        .title{height:32px;font-size:12px;color:#999;display:flex;justify-content:space-between;align-items:center;padding:0 30px;box-sizing:border-box;padding-right:10px;
            span:last-child{display:flex;align-items:center;font-size:12px;color:#666}
            svg{width:18px;height:18px;animation:rotation 5s linear infinite;margin-right:2px;margin-top:2px;}
        }
        .empty{padding:50px 0;
            .tip{text-align:center;color:var(--main-text-color);font-size:14px;}
            .btns{display:flex;justify-content:center;padding-top:15px;
                button:first-child{margin-right:8px}
                button{cursor:pointer;background-color:#0078d4;color:#fff;border:none;line-height:28px;padding:0 10px;border-radius:2px;outline:none;
                    &:hover{background-color:#056cbc}
                }
            }
        }
        .popup{width:250px;padding:5px;border-radius:4px;position:absolute;left:0;top:0;background-color:#1f1f1f;border:solid 1px #3f3f3f;z-index:999;box-shadow:0 0 5px rgba(0,0,0,.5);
            button{cursor:pointer;width:100%;height:28px;border-radius:4px;padding:0 15px;background:none;border:none;text-align:left;color:var(--main-text-color);font-size:12px;
                &:hover{background-color:#04395e;}
            }
        }
    }
</style>