<template>
    <div v-if="showFrame">
        <template v-for="frame in getFramePages" >
            <div v-if="frame.meta.frameSrc" :key="frame.path" >
                <FramePage v-show="showIframe(frame)" :frameSrc="frame.meta.frameSrc" />
            </div>
        </template>
    </div>
</template>

<script setup>
import { useFrameKeepAlive } from './useFrameKeepAlive';
import FramePage from '@/views/sys/iframe/index.vue';
import { unref, computed, defineComponent } from 'vue';

defineComponent({
    name: 'FrameLayout',
});

const { getFramePages, showIframe } = useFrameKeepAlive();

const showFrame = computed(() => unref(getFramePages).length > 0);

</script>