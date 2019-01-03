<template>
  <Select :value="value">
    <Option v-for="item in list" :value="item.sipId" :key="item.code + item.regionId">{{item.name}}</Option>
  </Select>
</template>
<script lang="ts" src="./zone-select.component.ts"></script>
