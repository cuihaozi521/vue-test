<template>
  <div>
    <ButtonGroup>
      <Button v-for="item in regionList" :key="item.regionId" @click="click(item)"
      :type="item._isSelected ? 'primary' : 'default'">{{item.regionName}}</Button>
    </ButtonGroup>
    <Spin v-if="loading" style="display: inline-block;"></Spin>
  </div>
</template>
<script lang="ts" src="./region-btn-select.component.ts"></script>
