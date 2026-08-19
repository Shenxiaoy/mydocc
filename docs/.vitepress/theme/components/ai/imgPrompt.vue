<template>
    <div class="ai-prompt-container">
        <div v-for="(item, k) in imgs" :key="k" class="img-item-wrapper">
            <div class="model-box" :class="curActiveIndex === k ? 'active-model-box' : ''">
                <div 
                  class="img-prompt-text three-hangyichu" 
                  @click="handleShowAllPrompt(k)"
                >
                  {{ prompts[k] }}
                </div>
                <img class="ai-img" :src="item" @click="handleImgPreview(item)" alt="">
            </div>
            <div
              class="prompt-all-box"
              @click="handleHiddenAllPrompt(k)"
              :class="curActiveIndex === k ? 'active-all-box' : ''"
            >
                {{ prompts[k] }}
            </div>
        </div>
        <div class="img-preview" v-if="acitveImgSrc" @click.stop>
            <img :src="acitveImgSrc" alt="" @click="handleCancelImg">
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps({
    prompts: {
        type: Array,
        default: () => []
    },
    imgs: {
        type: Array,
        default: () => []
    }
})
const acitveImgSrc = ref(null);
const curActiveIndex = ref(null);
const handleShowAllPrompt = (index) => {
    curActiveIndex.value = index
};
const handleHiddenAllPrompt = (index) => {
    curActiveIndex.value = null;
};
const handleImgPreview = (src) => {
    acitveImgSrc.value = src;
};
const handleCancelImg = () => {
    acitveImgSrc.value = null;
};

</script>
<style scoped>
.img-preview {
    position: fixed;
    inset: 0;
    z-index: 1000;
    padding: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        max-width: 640px;
    }
}
.active-model-box {
    filter: blur(2px);
}
.active-all-box {
    opacity: 1 !important;
    z-index: 999 !important;
}
.ai-prompt-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.img-item-wrapper {
    width: 30%;
    min-width: 230px;
    position: relative;
}
.prompt-all-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    z-index: -2;
    font-size: 13px;
    overflow: auto;
}
.img-prompt-text {
    width: 100%;
    cursor: pointer;
    font-size: 13px;
}
.ai-img{
    
}
.two-hangyichu {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.three-hangyichu {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}

</style>