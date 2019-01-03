<template>
  <Select @on-change="change" :value="value"
  @on-query-change="queryChange"
 clearable filterable remote :loading="loading1">
    <Option
      v-for="project in projectList"
      :value="project.projectId"
      :key="project.projectId"
    >{{project.projectName}}</Option>
  </Select>
</template>
<script lang="ts" src="./project-select.component.ts"></script>
