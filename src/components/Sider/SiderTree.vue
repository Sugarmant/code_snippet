<script setup>
    import {inject} from 'vue'
    import SiderTree from './SiderTree.vue'
    import { useCatelogStore,useTabStore } from '@/store'

    const catelogStore = useCatelogStore()
    const tabStore = useTabStore()
    
    const currentIpt = inject('currentIpt')
    const onRightClick = inject('onRightClick')
    const onCreateCatelog = inject('onCreateCatelog')
    
    const props = defineProps(['root'])
    let lastClick = null
    function onClickCatelog(item){
        if(item.is_file){
            if(lastClick && Date.now() - lastClick < 300){
                tabStore.addTab(item)
            }else{
                tabStore.setTempTab(item)
            }
            lastClick = Date.now()
            tabStore.setActiveTab(item)
        }else{
            catelogStore.setCatelogCheck(item.id)
        }
        catelogStore.setActiveCatelog(item)
    }

    function onInputEnter(e){
        currentIpt.item = ''
    }
    function onInputBlur(e){
        onCreateCatelog(e.target.value)
        currentIpt.item = ''
    }

</script>

<template>
    <div class="node-tree">
        <div v-if="currentIpt.item.id == props.root.id && currentIpt.type == 'folder'" class="reserve">
            <div :style="`width:${props.root.level*14}px`" class="bar"></div>
            <svg v-if="currentIpt.type == 'folder'" t="1708616366853" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1698"><path d="M707.61856 495.14624l-357.5296-357.5296c-9.30816-9.30688-24.40064-9.30688-33.70752 0-9.30816 9.30816-9.30816 24.40064 0 33.7088L657.056 512 316.38144 852.67456c-9.30816 9.30688-9.30816 24.40064 0 33.7088 4.65408 4.65536 10.75328 6.98112 16.85376 6.98112 6.10048 0 12.19968-2.32576 16.85376-6.98112l357.5296-357.5296C716.92672 519.5456 716.92672 504.4544 707.61856 495.14624z" p-id="1699" fill="#cccccc"></path></svg>
            <svg v-else t="1708616704959" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3014"><path d="M771.6 180.6c14.7 13.7 26.5 25 35.2 34 8.7 9 15.4 16.7 20.1 22.9 4.6 6.3 7.5 11.6 8.6 16 1.1 4.4 1.6 8.2 1.6 11.5v13.1H715.9c-5.5 0-10.2-2-14.3-6.1-4.1-4.1-7.5-8.9-10.2-14.3-2.7-5.5-4.8-11.1-6.1-16.8-1.4-5.7-2-10.2-2-13.5V125.7h2.5c4.4 0 8.9 0.7 13.5 2 4.6 1.4 10 4 16 7.8s13.5 9.3 22.5 16.4c8.8 7.1 20.1 16.7 33.8 28.7z m-140.1 47.5c0 10.9 1.6 22.3 4.9 34 3.3 11.7 8.5 22.7 15.6 32.8 7.1 10.1 16.1 18.4 27 25 10.9 6.6 23.8 9.8 38.5 9.8h119.6v462c0 15.8-3.1 30-9.4 42.6-6.3 12.6-14.6 23.2-25 31.9s-21.8 15.6-34.4 20.5c-12.6 4.9-24.8 7.4-36.9 7.4h-403c-10.4 0-21.7-3-34-9s-23.8-13.9-34.4-23.8c-10.6-9.8-19.5-21-26.6-33.6-7.1-12.6-10.6-25.7-10.6-39.3v-557c0-11.5 2.6-23.3 7.8-35.6 5.2-12.3 12.3-23.6 21.3-34 9-10.4 19.2-19 30.7-25.8 11.5-6.8 23.5-10.2 36-10.2h312.9v102.3z m51.6 511.2c14.2 0 26.2-5.1 36-15.2s14.7-22.3 14.7-36.5-4.9-26.2-14.7-36c-9.8-9.8-21.8-14.7-36-14.7H375.9c-14.2 0-26.2 4.9-36 14.7-9.8 9.8-14.7 21.8-14.7 36s4.9 26.3 14.7 36.5c9.8 10.1 21.8 15.2 36 15.2h307.2z m50.8-255.6c0-14.2-4.9-26.4-14.7-36.5-9.8-10.1-21.8-15.2-36-15.2H375.9c-14.2 0-26.2 5.1-36 15.2s-14.7 22.3-14.7 36.5 4.9 26.2 14.7 36c9.8 9.8 21.8 14.7 36 14.7h307.2c14.2 0 26.2-4.9 36-14.7 9.9-9.8 14.8-21.8 14.8-36z m0 0" p-id="3015" fill="#cccccc"></path></svg>
            <input @keydown.enter="onInputEnter" @blur="onInputBlur" id="create-ipt" type="text" autocomplete="off">
        </div>

        <div v-for="(item,key) in props.root.child" :key="key">
            <button @contextmenu="onRightClick($event,item)" @click="onClickCatelog(item)" :class="item.id == catelogStore.activeCatelog.id?'active':''">
                <div :style="`width:${props.root.level*14}px`" class="bar"></div>
                <svg v-if="!item.is_file" t="1708616366853" :class="item.checked?'extend':''" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1698"><path d="M707.61856 495.14624l-357.5296-357.5296c-9.30816-9.30688-24.40064-9.30688-33.70752 0-9.30816 9.30816-9.30816 24.40064 0 33.7088L657.056 512 316.38144 852.67456c-9.30816 9.30688-9.30816 24.40064 0 33.7088 4.65408 4.65536 10.75328 6.98112 16.85376 6.98112 6.10048 0 12.19968-2.32576 16.85376-6.98112l357.5296-357.5296C716.92672 519.5456 716.92672 504.4544 707.61856 495.14624z" p-id="1699" fill="#cccccc"></path></svg>
                <svg v-else t="1708616704959" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3014"><path d="M771.6 180.6c14.7 13.7 26.5 25 35.2 34 8.7 9 15.4 16.7 20.1 22.9 4.6 6.3 7.5 11.6 8.6 16 1.1 4.4 1.6 8.2 1.6 11.5v13.1H715.9c-5.5 0-10.2-2-14.3-6.1-4.1-4.1-7.5-8.9-10.2-14.3-2.7-5.5-4.8-11.1-6.1-16.8-1.4-5.7-2-10.2-2-13.5V125.7h2.5c4.4 0 8.9 0.7 13.5 2 4.6 1.4 10 4 16 7.8s13.5 9.3 22.5 16.4c8.8 7.1 20.1 16.7 33.8 28.7z m-140.1 47.5c0 10.9 1.6 22.3 4.9 34 3.3 11.7 8.5 22.7 15.6 32.8 7.1 10.1 16.1 18.4 27 25 10.9 6.6 23.8 9.8 38.5 9.8h119.6v462c0 15.8-3.1 30-9.4 42.6-6.3 12.6-14.6 23.2-25 31.9s-21.8 15.6-34.4 20.5c-12.6 4.9-24.8 7.4-36.9 7.4h-403c-10.4 0-21.7-3-34-9s-23.8-13.9-34.4-23.8c-10.6-9.8-19.5-21-26.6-33.6-7.1-12.6-10.6-25.7-10.6-39.3v-557c0-11.5 2.6-23.3 7.8-35.6 5.2-12.3 12.3-23.6 21.3-34 9-10.4 19.2-19 30.7-25.8 11.5-6.8 23.5-10.2 36-10.2h312.9v102.3z m51.6 511.2c14.2 0 26.2-5.1 36-15.2s14.7-22.3 14.7-36.5-4.9-26.2-14.7-36c-9.8-9.8-21.8-14.7-36-14.7H375.9c-14.2 0-26.2 4.9-36 14.7-9.8 9.8-14.7 21.8-14.7 36s4.9 26.3 14.7 36.5c9.8 10.1 21.8 15.2 36 15.2h307.2z m50.8-255.6c0-14.2-4.9-26.4-14.7-36.5-9.8-10.1-21.8-15.2-36-15.2H375.9c-14.2 0-26.2 5.1-36 15.2s-14.7 22.3-14.7 36.5 4.9 26.2 14.7 36c9.8 9.8 21.8 14.7 36 14.7h307.2c14.2 0 26.2-4.9 36-14.7 9.9-9.8 14.8-21.8 14.8-36z m0 0" p-id="3015" fill="#cccccc"></path></svg>
                <span>{{item.name}}</span>
            </button>
            <div v-if="item.checked" class="child">
                <SiderTree :root="item"></SiderTree>
            </div>
        </div>

        
        <div v-if="currentIpt.item.id == props.root.id && currentIpt.type == 'file'" class="reserve">
            <div :style="`width:${props.root.level*14}px`" class="bar"></div>
            <svg v-if="currentIpt.type == 'folder'" t="1708616366853" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1698"><path d="M707.61856 495.14624l-357.5296-357.5296c-9.30816-9.30688-24.40064-9.30688-33.70752 0-9.30816 9.30816-9.30816 24.40064 0 33.7088L657.056 512 316.38144 852.67456c-9.30816 9.30688-9.30816 24.40064 0 33.7088 4.65408 4.65536 10.75328 6.98112 16.85376 6.98112 6.10048 0 12.19968-2.32576 16.85376-6.98112l357.5296-357.5296C716.92672 519.5456 716.92672 504.4544 707.61856 495.14624z" p-id="1699" fill="#cccccc"></path></svg>
            <svg v-else t="1708616704959" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3014"><path d="M771.6 180.6c14.7 13.7 26.5 25 35.2 34 8.7 9 15.4 16.7 20.1 22.9 4.6 6.3 7.5 11.6 8.6 16 1.1 4.4 1.6 8.2 1.6 11.5v13.1H715.9c-5.5 0-10.2-2-14.3-6.1-4.1-4.1-7.5-8.9-10.2-14.3-2.7-5.5-4.8-11.1-6.1-16.8-1.4-5.7-2-10.2-2-13.5V125.7h2.5c4.4 0 8.9 0.7 13.5 2 4.6 1.4 10 4 16 7.8s13.5 9.3 22.5 16.4c8.8 7.1 20.1 16.7 33.8 28.7z m-140.1 47.5c0 10.9 1.6 22.3 4.9 34 3.3 11.7 8.5 22.7 15.6 32.8 7.1 10.1 16.1 18.4 27 25 10.9 6.6 23.8 9.8 38.5 9.8h119.6v462c0 15.8-3.1 30-9.4 42.6-6.3 12.6-14.6 23.2-25 31.9s-21.8 15.6-34.4 20.5c-12.6 4.9-24.8 7.4-36.9 7.4h-403c-10.4 0-21.7-3-34-9s-23.8-13.9-34.4-23.8c-10.6-9.8-19.5-21-26.6-33.6-7.1-12.6-10.6-25.7-10.6-39.3v-557c0-11.5 2.6-23.3 7.8-35.6 5.2-12.3 12.3-23.6 21.3-34 9-10.4 19.2-19 30.7-25.8 11.5-6.8 23.5-10.2 36-10.2h312.9v102.3z m51.6 511.2c14.2 0 26.2-5.1 36-15.2s14.7-22.3 14.7-36.5-4.9-26.2-14.7-36c-9.8-9.8-21.8-14.7-36-14.7H375.9c-14.2 0-26.2 4.9-36 14.7-9.8 9.8-14.7 21.8-14.7 36s4.9 26.3 14.7 36.5c9.8 10.1 21.8 15.2 36 15.2h307.2z m50.8-255.6c0-14.2-4.9-26.4-14.7-36.5-9.8-10.1-21.8-15.2-36-15.2H375.9c-14.2 0-26.2 5.1-36 15.2s-14.7 22.3-14.7 36.5 4.9 26.2 14.7 36c9.8 9.8 21.8 14.7 36 14.7h307.2c14.2 0 26.2-4.9 36-14.7 9.9-9.8 14.8-21.8 14.8-36z m0 0" p-id="3015" fill="#cccccc"></path></svg>
            <input @keydown.enter="onInputEnter" @blur="onInputBlur" id="create-ipt" type="text" autocomplete="off">
        </div>
        
    </div>
</template>

<style lang="less" scoped>
    @LINE_HEIGHT:24px;
    .node-tree{background-color:#181818;
        svg{width:14px;height:14px;margin-right:4px;margin-bottom:2px;
            &.extend{transform:rotateZ(90deg)}
        }
        .bar{border-right:solid 1px #333;height:@LINE_HEIGHT;margin-right:4px;
            // &.highlight{border-color:#444}
        }
        button{width:250px;display:flex;align-items:center;line-height:@LINE_HEIGHT;cursor:pointer;padding:0;padding-left:8px;box-sizing:border-box;background:none;border:none;
            
            span{color:var(--main-text-color);font-size:12px;}
            &.active{border-color:#24abf2;background-color:#37373d;
                &:hover{background-color:#37373d;}
            }
            &:hover{background-color:#2a2d2e;}
            
        }
        .reserve{display:flex;align-items:center;padding-left:8px;
            input{flex:1;padding:0;background-color:#313131;border:solid 1px #0172c8;outline:none;border-radius:4px;line-height:24px;height:24px;color:var(--main-text-color);font-size:12px;box-sizing:border-box;}
        }
    }
</style>