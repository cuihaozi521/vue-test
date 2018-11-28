<template>
  <div class="bvue-page">

    <b-childheader :title="header.title" :subtitle="header.description" :showBack="header.showBack"></b-childheader>

    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
      <FormItem label="年龄" prop="age">
        <Input type="text" v-model="formCustom.age" number></Input>
      </FormItem>
      <FormItem label="名称" prop="name">
        <Input v-model="formCustom.name" show-message="false" placeholder="请输入名称"></Input>
      </FormItem>
      <FormItem label="城市" prop="city">
        <Row>
          <Col span="4">
          <Select v-model="formCustom.city" placeholder="选择你的城市" style="width:100px">
            <Option value="beijing">北京</Option>
            <Option value="guangzhou">广州</Option>
            <Option value="shenzhen">深圳</Option>
          </Select>
          </Col>
          <Col span="4">
            
          </Col>
        </Row>

      </FormItem>
      <FormItem label="Date">
        <Row>
          <Col span="11">
          <FormItem prop="date">
            <DatePicker type="date" placeholder="选择日期" v-model="formCustom.date"></DatePicker>
          </FormItem>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
          <FormItem prop="time">
            <TimePicker type="time" placeholder="选择时间" v-model="formCustom.time"></TimePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="性别" prop="gender">
        <RadioGroup v-model="formCustom.gender">
          <Radio label="male">👱</Radio>
          <Radio label="female">👩</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="收入" prop="money">

        <Row>
          <Col span="20">
          <Slider v-model="formCustom.money"></Slider>
          </Col>
          <Col span="2" offset="2">
          <Input v-model="formCustom.money" placeholder="请输入邮箱"></Input>
          </Col>
        </Row>

      </FormItem>
      <FormItem label="爱好" prop="interest">
        <CheckboxGroup v-model="formCustom.interest">
          <Checkbox label="Eat">🍚</Checkbox>
          <Checkbox label="Sleep">💤</Checkbox>
          <Checkbox label="Run">🏃</Checkbox>
          <Checkbox label="Movie">🎬</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="项目" prop="project">
        <Select v-model="model3" style="width:200px">
          <OptionGroup :label="item2.parentName" v-for="(item2,index) in cityList1" >
            <Option v-for="item in item2.cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </OptionGroup>
        </Select>
      </FormItem>
      <FormItem label="标签" prop="address">
        <Row>
          <Col span="12" style="padding-right:10px">
          <Select v-model="model1">
            <Option v-for="(option, index) in cityList" :value="option.value" :key="index">{{option.label}}</Option>
          </Select>
          </Col>
          <Col span="12">
          <Select v-model="model2">
            <Option v-for="(option, index) in cityList" :value="option.value" :key="index">{{option.label}}</Option>
          </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="描述" prop="desc">
        <Input v-model="formCustom.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formCustom')">提交</Button>
        <Button @click="handleReset('formCustom')" style="margin-left: 8px">清空</Button>
      </FormItem>
    </Form>

  </div>
</template>

<script>
export default {
  data() {
    const validateAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Age cannot be empty"));
      }
      if (!Number.isInteger(value)) {
        callback(new Error("Please enter a numeric value"));
      } else {
        if (value < 18) {
          callback(new Error("Must be over 18 years of age"));
        } else {
          callback();
        }
      }
    };
    return {
      model1: "",
      model2: "",
      model3: "",
      value1: "",
      data: [
        {
          value: "beijing",
          label: "北京",
          children: [
            {
              value: "gugong",
              label: "故宫"
            },
            {
              value: "tiantan",
              label: "天坛"
            },
            {
              value: "wangfujing",
              label: "王府井"
            }
          ]
        },
        {
          value: "jiangsu",
          label: "江苏",
          children: [
            {
              value: "nanjing",
              label: "南京",
              children: [
                {
                  value: "fuzimiao",
                  label: "夫子庙"
                }
              ]
            },
            {
              value: "suzhou",
              label: "苏州",
              children: [
                {
                  value: "zhuozhengyuan",
                  label: "拙政园"
                },
                {
                  value: "shizilin",
                  label: "狮子林"
                }
              ]
            }
          ]
        }
      ],
      data2: [],
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      cityList1: [
        {
          parentName: "AA",
          cityList: [
            {
              value: "New York",
              label: "New York"
            },
            {
              value: "London",
              label: "London"
            },
            {
              value: "Sydney",
              label: "Sydney"
            },
            {
              value: "Ottawa",
              label: "Ottawa"
            },
            {
              value: "Paris",
              label: "Paris"
            },
            {
              value: "Canberra",
              label: "Canberra"
            }
          ]
        },
        {
          parentName: "BB",
          cityList: [
            {
              value: "Paris",
              label: "Paris"
            },
            {
              value: "Canberra",
              label: "Canberra"
            }
          ]
        }
      ],
      header: {
        title: "表单",
        description: "表单",
        showBack: true
      },
      formCustom: {
        age: "",
        name: "",
        money: 42,
        mail: "",
        time: "",
        city: "",
        date: "",
        interest: [],
        desc: "",
        gender: ""
      },
      ruleCustom: {
        age: [{ required: true, validator: validateAge, trigger: "blur" }],
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSearch2(value) {
      this.data2 =
        !value || value.indexOf("@") >= 0
          ? []
          : [value + "@qq.com", value + "@sina.com", value + "@163.com"];
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(this.formCustom);
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>

<style scoped>
.ivu-input-number-input {
  text-align: right;
  margin-right: 30px;
}
</style>