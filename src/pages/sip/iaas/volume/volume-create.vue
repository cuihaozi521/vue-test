<template>
  <sip-page>
    <sip-page-header>
      创建存储
      <template slot="desc">描述</template>
    </sip-page-header>
    <sip-page-body>
      <Form ref="form1" :model="model" :rules="formValidator1" :label-width="$labelWidth">
        <FormItem label="项目" prop="projectId">
          <project-select v-model="model.projectId" auto-select ref="project"></project-select>
        </FormItem>
        <FormItem label="区域" prop="regionId">
          <region-btn-select v-model="model.regionId" :region-ids="$refs.project ? $refs.project.regionIds : []" auto-select></region-btn-select>
        </FormItem>
        <FormItem label="设备" prop="storageId">
          <storage-select v-model="model.storageId" :vdcId="model.projectId" :region-id="model.regionId" useby="volume" auto-select ref="storage"></storage-select>
        </FormItem>
        <FormItem label="可用区" prop="zoneCode">
          <zone-select v-model="model.zoneCode" :region-id="model.regionId" :zone-codes="$refs.storage ? $refs.storage.canUseZonecodes : null" auto-select></zone-select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="model.name" show-message="false" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="容量（G）" prop="size">
          <Slider v-model="model.size" :min="1" :max="4096" show-input></Slider>
        </FormItem>
        <FormItem label="描述" prop="desc">
          <Input v-model="model.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">提交</Button>
          <Button @click="handleReset" style="margin-left: 8px">清空</Button>
        </FormItem>
      </Form>
    </sip-page-body>
  </sip-page>
</template>
<script lang="ts" src="./volume-create.ts"></script>
