<template>
  <Select
    :value="value"
  >
    <Option
      v-for="item in list"
      :value="item.storageId"
      :key="item.storageId"
    >{{item.storageName}}</Option>
  </Select>
</template>
<script lang="ts" src="./storage-select.component.ts"></script>
