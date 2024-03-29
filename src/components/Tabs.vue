<script setup>
    import { useTabStore } from '@/store';
    const tabStore = useTabStore();

    function removeTab(e,item){
        e.stopPropagation() //阻止冒泡
        tabStore.removeTab(item)
    }
</script>

<template>
    <div v-if="tabStore.tabs.length || tabStore.tempTab.name" class="tabbar">
        <button @click="tabStore.setActiveTab(item)" v-for="(item,key) in tabStore.tabs" :class="tabStore.activeTab.id == item.id?'active':''" :key="key">
            {{item.name}}
            <div v-if="!item.loading" class="icon">
                <svg @click="removeTab($event,item)" t="1708959782537" viewBox="0 0 1035 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2450" width="32" height="32"><path d="M868.248009 806.105382c17.398599 17.398599 17.398599 45.612844 0 63.011443-8.699299 8.699299-20.105295 13.054519-31.500152 13.054519s-22.800853-4.355219-31.500152-13.054519L517.491363 581.360484 229.735022 869.116825c-8.699299 8.699299-20.105295 13.054519-31.500153 13.054519s-22.800853-4.355219-31.500152-13.054519c-17.398599-17.398599-17.398599-45.612844 0-63.011443l287.745203-287.756341-287.756342-287.756342c-17.398599-17.398599-17.398599-45.612844 0-63.011443s45.612844-17.398599 63.011444 0l287.756341 287.756341 287.745203-287.745203c17.398599-17.398599 45.612844-17.398599 63.011443 0s17.398599 45.612844 0 63.011444L580.491668 518.360179l287.756341 287.756342z" p-id="2451"></path></svg>
            </div>
            <div v-if="item.unsaved && !item.loading" class="unsaved">
                <svg t="1709209994177" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1730" width="32" height="32"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#ffffff" p-id="1731"></path></svg>
            </div>

            <div v-if="item.loading" class="loading">
                <svg t="1708779286319" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1649" width="32" height="32"><path d="M512 74.666667c-17.066667 0-32 14.933333-32 32v149.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V106.666667c0-17.066667-14.933333-32-32-32zM693.333333 362.666667c8.533333 0 17.066667-2.133333 23.466667-8.533334l104.533333-104.533333c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-104.533333 104.533333c-12.8 12.8-12.8 32 0 44.8 4.266667 6.4 12.8 8.533333 21.333333 8.533334zM917.333333 480h-149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h149.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM714.666667 669.866667c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l104.533333 104.533333c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-106.666666-104.533333zM512 736c-17.066667 0-32 14.933333-32 32v149.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-149.333333c0-17.066667-14.933333-32-32-32zM309.333333 669.866667l-104.533333 104.533333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l104.533334-104.533333c12.8-12.8 12.8-32 0-44.8s-36.266667-12.8-46.933334 0zM288 512c0-17.066667-14.933333-32-32-32H106.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h149.333333c17.066667 0 32-14.933333 32-32zM247.466667 202.666667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l104.533333 104.533333c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-106.666666-104.533333z" fill="#999999" p-id="1650"></path></svg>
            </div>
        </button>
        
        <button @click="tabStore.setActiveTab(tabStore.tempTab)" style="font-style:italic" v-if="tabStore.tempTab.name" :class="tabStore.activeTab.id == tabStore.tempTab.id?'active':''">
            {{tabStore.tempTab.name}}
            <div v-if="!tabStore.tempTab.loading" class="icon">
                <svg @click="removeTab($event,tabStore.tempTab)" t="1708959782537" viewBox="0 0 1035 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2450" width="32" height="32"><path d="M868.248009 806.105382c17.398599 17.398599 17.398599 45.612844 0 63.011443-8.699299 8.699299-20.105295 13.054519-31.500152 13.054519s-22.800853-4.355219-31.500152-13.054519L517.491363 581.360484 229.735022 869.116825c-8.699299 8.699299-20.105295 13.054519-31.500153 13.054519s-22.800853-4.355219-31.500152-13.054519c-17.398599-17.398599-17.398599-45.612844 0-63.011443l287.745203-287.756341-287.756342-287.756342c-17.398599-17.398599-17.398599-45.612844 0-63.011443s45.612844-17.398599 63.011444 0l287.756341 287.756341 287.745203-287.745203c17.398599-17.398599 45.612844-17.398599 63.011443 0s17.398599 45.612844 0 63.011444L580.491668 518.360179l287.756341 287.756342z" p-id="2451"></path></svg>
            </div>
            <div v-if="tabStore.tempTab.unsaved && !tabStore.tempTab.loading" class="unsaved">
                <svg t="1709209994177" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1730" width="32" height="32"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#ffffff" p-id="1731"></path></svg>
            </div>
            <div class="loading" v-if="tabStore.tempTab.loading">
                <svg t="1708779286319" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1649" width="32" height="32"><path d="M512 74.666667c-17.066667 0-32 14.933333-32 32v149.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V106.666667c0-17.066667-14.933333-32-32-32zM693.333333 362.666667c8.533333 0 17.066667-2.133333 23.466667-8.533334l104.533333-104.533333c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-104.533333 104.533333c-12.8 12.8-12.8 32 0 44.8 4.266667 6.4 12.8 8.533333 21.333333 8.533334zM917.333333 480h-149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h149.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM714.666667 669.866667c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l104.533333 104.533333c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-106.666666-104.533333zM512 736c-17.066667 0-32 14.933333-32 32v149.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-149.333333c0-17.066667-14.933333-32-32-32zM309.333333 669.866667l-104.533333 104.533333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l104.533334-104.533333c12.8-12.8 12.8-32 0-44.8s-36.266667-12.8-46.933334 0zM288 512c0-17.066667-14.933333-32-32-32H106.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h149.333333c17.066667 0 32-14.933333 32-32zM247.466667 202.666667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l104.533333 104.533333c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-106.666666-104.533333z" fill="#999999" p-id="1650"></path></svg>
            </div>
        </button>
    </div>
    <div v-else class="tabs_bar"></div>
</template>

<style lang="less" scoped>
    .tabbar{display:flex;width:100%;height:32px;background-color:#181818;border-bottom:solid 1px #333;box-sizing:border-box;
        button{position:relative;height:32px;background-color:transparent;border:none;color:#999;padding:0 15px;border-right:solid 1px #333;cursor:pointer;box-sizing:border-box;border-bottom:solid 1px #333;padding-right:35px;border-top:solid 1.5px #1f1f1f;
            .icon{display:none;position:absolute;right:7px;top:0;bottom:0;align-items:center;z-index:1;
                svg{width:9px;height:9px;fill:#999;padding:4px;border-radius:4px;
                    &:hover{background-color:#333;}
                }
            }
            .unsaved{display:flex;position:absolute;right:2px;top:0;bottom:0;align-items:center;
                svg{width:10px;height:10px;fill:#999;padding:9px;}
            }
            .loading{display:flex;position:absolute;right:0px;top:0;bottom:0;align-items:center;
                svg{width:16px;height:16px;fill:#999;padding:8px;animation:rotation 5s linear infinite}
            }
            &:hover{background-color:#1e1e1e;
                .icon{display:flex;
                    svg{fill:#fff}
                }
            }
        }
        button.active{background-color:#1f1f1f;color:#fff;border-bottom:solid 1px #1f1f1f;border-top-color:#0078d4;
            .icon{display:flex;
                svg{fill:#fff}
            }
        }

        
    }

    .tabs_bar{width:100%;height:32px;background-color:#1f1f1f}
</style>