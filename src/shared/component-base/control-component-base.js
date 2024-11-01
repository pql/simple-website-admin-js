import AppComponentBase from "@/shared/component-base/app-component-base";

/**
 * 组件基类
 */
const ControlComponentBase = {
    mixins: [AppComponentBase],
    emits: ['update:value', 'change'],
    props: {
        value: {
            type: [String, Number, Object, Boolean, Array, Date, Function, Symbol],
            required: true,
        }
    },
    data() {
        return {
            innerValue: this.value
        }
    },
    watch: {
        value: {
            handler(v) {
                this.innerValue = v;
                this.handleExtraChangeEvent(v);
            },
            immediate: true,
        }
    },
    methods: {
        innerValueChange() {
            this.$emit('update:value', this.innerValue);
            this.$emit('change', this.innerValue);
        },
        /** 外部组件触发change事件，联动本组件 */
        handleExtraChangeEvent(data) {
            console.log(data);
            // 如果外部组件需要联动本组件，请补充方法
        },
    }
}

export default ControlComponentBase;