<template>
  <div class="bvue-page">
    <b-childheader :title="header.title" :subtitle="header.description" :showBack="header.showBack"></b-childheader>

    <Icon type="ios-refresh" size="32" />

    <Button type="primary" @click="createNewPage">
      <Icon type="md-create" /> 创建
    </Button>

    <Dropdown trigger="click" @on-click="changeMenu">
      <Button>
        更多操作
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem name="startup">开机</DropdownItem>
        <DropdownItem name="shutdown">关机</DropdownItem>
        <DropdownItem :disabled="aaa">资源移交</DropdownItem>
        <DropdownItem>销毁保护</DropdownItem>
        <DropdownItem divided>资源标签</DropdownItem>
        <DropdownItem divided>制作镜像</DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <Button @click="handleSelectAll(true)">全选</Button>
    <Button @click="handleSelectAll(false)">取消全选</Button>
    <Button @click="exportData(1)">
      <Icon type="ios-download-outline"></Icon> 导出
    </Button>

    <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <Checkbox label="name">Name</Checkbox>
      <Checkbox label="show">Show</Checkbox>
      <Checkbox label="day30">30, retained</Checkbox>
      <Checkbox label="tomorrow">The next day left</Checkbox>
      <Checkbox label="day">Day Active</Checkbox>
      <Checkbox label="week">Week Active</Checkbox>
      <Checkbox label="month">Month Active</Checkbox>
    </Checkbox-group>

    <Table @on-selection-change="getSelectData" :loading="loading" ref="selection" stripe highlight-row border :columns="tableColumns2" :data="tableData2"></Table>

    <Modal :title="Title" v-model="modal8" :mask-closable="false" :closable="false">
      <Alert type="warning" show-icon>
        确定要对实例【【勿删】香港区-计费-验证】开机吗?
      </Alert>
    </Modal>

    <Modal v-model="modal9" :mask-closable="false" :loading="loading2" :closable="false" @on-ok="modalSave">
      <Alert type="warning" show-icon>
        确定要对实例“teamview专用”进行关机操作吗?
      </Alert>

      <Input v-model="desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>

    </Modal>

  </div>

</template>
<script>
// import formUI from
export default {
  data: function() {
    return {
      tempSelectData: null,
      desc: "",
      Title: "",
      aaa: true,
      modal8: false,
      modal9: false,
      loading2: true,
      loading: true,
      header: {
        title: "Table表格",
        description: "显示及维护系统内的所有菜单",
        showBack: false
      },
      tableColumnsChecked: [
        "name",
        "show",
        "day30",
        "tomorrow",
        "day",
        "week",
        "month"
      ],
      tableColumns2: [],
      tableData2: this.mockTableData2()
    };
  },
  methods: {
    getSelectData(selection) {
      this.tempSelectData = selection;
    },
    modalSave() {
      setTimeout(() => {
        this.modal9 = false;
      }, 2000);
    },
    changeMenu(name) {
      if (name == "startup") {
        this.startup();
      } else if (name == "shutdown") {
        this.shutdown();
      }
    },
    startup() {
      const selectList =
      this.tempSelectData.length > 0 ? this.tempSelectData[0] : [];
      const content = '<p>确定要对实例'+selectList.name+'进行开机操作吗?';
      this.$Modal.info({
        title: "开机",
        content: content
      });

      // this.Title = selectList.name;
      // this.modal8 = true;
    },
    shutdown() {
      this.Title = "关机";
      this.modal9 = true;
    },
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.tableData2[index].show}<br>Age：${
          this.tableData2[index].show
        }<br>Address：${this.tableData2[index].day30}`
      });
    },
    createNewPage() {
      this.$router.push({ name: "sip-UIDemo-list-form" });
    },
    mockTableData2() {
      let data = [];
      function getNum() {
        return Math.floor(Math.random() * 10000 + 1);
      }
      for (let i = 0; i < 10; i++) {
        data.push({
          name: "Name " + (i + 1),
          fav: 0,
          show: getNum(),
          day30: getNum(),
          tomorrow: getNum(),
          day: getNum(),
          week: getNum(),
          month: getNum()
        });
      }
      return data;
    },
    changeTableColumns() {
      this.tableColumns2 = this.getTable2Columns();
    },
    getTable2Columns() {
      const table2ColumnList = {
        aa: {
          type: "selection",
          width: 60,
          align: "center"
        },
        name: {
          title: "Name",
          key: "name",
          width: 100
        },
        show: {
          title: "Show",
          key: "show",
          width: 150,
          sortable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                    fontSize: "14px"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                params.row.show
              )
            ]);
          }
        },
        day30: {
          title: "30, retained",
          key: "day30",
          width: 150,
          sortable: true
        },
        tomorrow: {
          title: "The next day left",
          key: "tomorrow",
          width: 150,
          sortable: true
        },
        day: {
          title: "Day Active",
          key: "day",
          sortable: true
        },
        week: {
          title: "Week Active",
          key: "week",
          width: 150,
          sortable: true
        },
        month: {
          title: "Month Active",
          key: "month",
          width: 150,
          sortable: true
        }
      };

      let data = [table2ColumnList.aa];
      this.tableColumnsChecked.forEach(col => {
        data.push(table2ColumnList[col]);
      });

      return data;
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    exportData(type) {
      if (type === 1) {
        this.$refs.selection.exportCsv({
          filename: "The original data"
        });
      } else if (type === 2) {
        this.$refs.selection.exportCsv({
          filename: "Sorting and filtering data",
          original: false
        });
      } else if (type === 3) {
        this.$refs.selection.exportCsv({
          filename: "Custom data",
          columns: this.columns8.filter((col, index) => index < 4),
          data: this.data7.filter((data, index) => index < 4)
        });
      }
    }
  },
  mounted() {
    this.changeTableColumns();

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
};
</script>
<style scoped>
.ivu-checkbox-group {
  padding: 20px;
}
</style>
