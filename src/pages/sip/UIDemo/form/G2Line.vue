<template>
  <div>
    <Row>
      <Col span="12">
      <h4>2018-08 A组售前咨询单次通话时长分布</h4>
      <div id="c1"></div>
      </Col>
      <Col span="12">
          <div id="c2"></div>
      </col>
    </Row>

  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "g2",
  data() {
    return {
      data: [
        { year: "Sports", value: 275 },
        { year: "Strategy", value: 115 },
        { year: "Action", value: 120 },
        { year: "Shooter", value: 350 },
        { year: "Other", value: 150 }
      ],
      data2: [
        { month: 0, tem: 7, city: "tokyo" },
        { month: 1, tem: 6.9, city: "tokyo" },
        { month: 2, tem: 9.5, city: "tokyo" },
        { month: 3, tem: 14.5, city: "tokyo" },
        { month: 4, tem: 18.2, city: "tokyo" },
        { month: 5, tem: 21.5, city: "tokyo" },
        { month: 6, tem: 25.2, city: "tokyo" }
      ]
    };
  },
  mounted() {
    this.renderLine();
    this.renderInterval();
  },
  methods: {
    renderLine() {
      // Step 1: 创建 Chart 对象
      const chart = new G2.Chart({
        container: "c1", // 指定图表容器 ID
        forceFit: true,
        height: 300,
        padding: [50, 20, 50, 50]
      });
      chart.tooltip({
        crosshairs: true
      });
      // Step 2: 载入数据源
      chart.source(this.data);
      // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
      chart.scale("value", {
        min: 0
      });
      chart.scale("year", {
        range: [0, 1]
      });
      chart.tooltip({
        crosshairs: {
          type: "line"
        }
      });
      chart.line().position("year*value");
      chart
        .point()
        .position("year*value")
        .size(4)
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });

      // Step 4: 渲染图表
      chart.render();
    },
    renderInterval() {
      const defs = {
        month: {
          type: "cat",
          values: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"] // 这时候 month 的原始值是索引值
        }
      };
      // Step 1: 创建 Chart 对象
      const chart = new G2.Chart({
        container: "c2", // 指定图表容器 ID
        forceFit: true,
        height: 300
      });

      chart.source(this.data2, defs);
      chart
        .interval()
        .position("month*tem")
        .color("month");
      chart.render();
    }
  }
};
</script>

<style scoped>
</style>