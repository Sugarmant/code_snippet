import {ref,computed} from 'vue'
import { defineStore } from 'pinia'
import ss from 'good-storage'

export const useNoticeStore = defineStore('useNoticeStore', ()=>{
    const show = ref(false)
    const list = ref([])

    function addNotice(item){
        // list.value.push({
        //     time: new Date().getTime(),
        //     title: '通知标题',
        //     content: '通知内容',
        //     type: 'info'
        // })
        list.value.push(item)
        show.value = true
    }

    function removeNotice(index){
        list.value.splice(index, 1)
        if(list.value.length == 0) show.value = false
    }

    function removeAllNotice(){
        list.value = []
        show.value = false
    }

    function onHide(){
        show.value = false
    }

    return {
        show,
        list,
        addNotice,
        onHide,
        removeNotice,
        removeAllNotice
    }
})


