<template>
    <div>
        <p v-ellipsis="[100, 1]">single text ellipsis. [width: number, line: number]</p>
        <p v-ellipsis:multiple="[100, 1]">
            multiple text ellipsis. [width: number, line: number]
        </p>
    </div>
</template>