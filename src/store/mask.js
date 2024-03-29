import {ref,computed} from 'vue'
import { defineStore } from 'pinia'

export const useMaskStore = defineStore('useMaskStore', ()=>{
    const show = ref(false)
    let tempFun = function(){}

    function onShow(fun){
        show.value = true
        tempFun = fun
    }

    function onHide(){
        show.value = false
        tempFun()
    }

    return {
        show,
        onShow,
        onHide
    }
})


