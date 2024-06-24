<template>
    <div class="forget">
        <div class="forget-container">
            <div class="header">重置密码</div>
            <div class="main___1xvTy">
                <div class="main___6l-_a">
                    <a-form ref="forgetForm" :model="params" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                        <a-form-item v-if="tabIndex == 1" :label="'工\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0号'" name="jobNo">
                            <a-input-search v-model:value="params.jobNo" placeholder="请输入工号" @search="onSearch('jobNo')" allow-clear>
                                <template #enterButton>
                                    <a-button type="primary">查询账户</a-button>
                                </template>
                            </a-input-search>
                        </a-form-item>
                        <a-form-item label="账户列表" name="loginName">
                            <a-select v-model:value="params.loginName" show-search allowClear @change="handleChange" placeholder="请选择一个账户">
                                <a-select-option v-for="(item, index) in accountList" :value="item.value" :key="index">
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item :label="'验\u00a0\u00a0证\u00a0\u00a0码'" name="verifyCode">
                            <a-input-search v-model:value="params.verifyCode" :readOnly="readOnly" placeholder="" autocomplete="off" @click="readOnly = false" @search="onSearch('code')">
                                <template #enterButton>
                                    <a-button type="primary" :disabled="isSendCode"> {{ sendCodeText }}</a-button>
                                </template>
                            </a-input-search>
                        </a-form-item>
                        <a-form-item :label="`新\u00a0\u00a0密\u00a0\u00a0码`" name="newPwd">
                            <a-popover placement="right" :visible="isPopconfirm" :footer="{}">
                                <template v-slot:content>
                                    <div style="width: 200px; color: #000">
                                        <p :style="{ color: color }">强度：{{ colorList[color] }}</p>
                                        <a-progress :percent="percent" :strokeColor="color" :show-info="false" />
                                        <p>请至少输入包含大小写字母和数字的8~20个字符。</p>
                                    </div>
                                </template>
                                <a-input-password
                                    v-model:value.trim="params.newPwd"
                                    placeholder="至少八位密码,区分大小写"
                                    allow-clear
                                    :maxLength="20"
                                    @blur="isPopconfirm = false"
                                    @change="checkNewPwd"
                                >
                                </a-input-password>
                            </a-popover>
                        </a-form-item>
                        <a-form-item label="确认密码" name="confirm">
                            <a-input-password placeholder="确认密码" v-model:value.trim="params.confirm" allow-clear :maxLength="20"></a-input-password>
                        </a-form-item>
                        <div class="flex flex_sb">
                            <a-button style="marginleft: 50px" type="primary" @click="submitForm">确定修改</a-button>
                            <a-button @click="goback">返回登录</a-button>
                        </div>
                    </a-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Store from '@/store'
import { nextTick } from 'vue'
import Encrypt from '@/utils/Encrypt'
import { message } from 'ant-design-vue'
import { getCode, resetPass, getAccountList } from '@/api/登录'

const strong = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*? ])(.{8,20})$/
const middle = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(.{8,20})$/

const colorList = {
    // 'red': '弱',
    'rgb(250, 173, 20)': '中',
    '#52c41a': '强'
}
export default {
    data() {
        const checkJobno = (rule, value) => {
            const regex = /^[\\u4e00-\\u9fa5_a-zA-Z0-9-]{1,16}$/
            if (value === '') {
                return Promise.reject(new Error('请输入工号'))
            } else if (!regex.test(value)) {
                return Promise.reject(new Error('工号格式有误'))
            } else {
                return Promise.resolve()
            }
        }
        const checkPass = (rule, value) => {
            const rex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,}$/
            if (value === '') {
                return Promise.reject(new Error('请输入新密码'))
            } else if (!rex.test(value)) {
                return Promise.reject(new Error('密码必须是包含大小写字母/数字的8位以上组合'))
            }
            const validatorArr = ['my', 'muyuan', '002714']
            if (validatorArr.some((item) => value.toLocaleLowerCase().includes(item))) {
                return Promise.reject(new Error('密码不能包含牧原相关信息'))
            }
            if (value.toLocaleLowerCase().includes(this.params.jobNo) && this.params.jobNo) {
                return Promise.reject(new Error('密码不能包含工号信息'))
            } else {
                return Promise.resolve()
            }
        }
        const checkEnterPass = (rule, value) => {
            if (value === '') {
                return Promise.reject(new Error('请输入确认密码'))
            } else if (this.params.newPwd !== value) {
                return Promise.reject(new Error('两次密码不一致'))
            } else {
                return Promise.resolve()
            }
        }

        return {
            readOnly: true,
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
            isSendCode: false,
            sendCodeText: '获取验证码',
            percent: 20,
            color: 'red',
            colorList,
            isPopconfirm: false,
            accountList: [],
            rules: {
                jobNo: [{ required: true, message: '', trigger: 'blur' }, { validator: checkJobno }],
                loginName: [{ required: true, message: '请选择账号', trigger: 'change' }],
                verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
                newPwd: [
                    { required: true, message: '', trigger: 'blur' },
                    { validator: checkPass, trigger: 'blur' }
                ],
                confirm: [
                    { required: true, message: '', trigger: 'blur' },
                    { validator: checkEnterPass, trigger: 'blur' }
                ]
            },
            tabIndex: 1,
            params: {
                jobNo: '',
                loginName: '',
                verifyCode: '',
                newPwd: '',
                confirm: ''
            }
        }
    },
    mounted() {
        this.$refs.forgetForm.resetFields()
    },
    methods: {
        async getAccountInfo() {
            const hide = message.loading('正在查询账号信息....', 0)
            if (!this.params.jobNo) {
                message.info('请输入工号')
                return
            }
            this.accountList = []
            const data = await getAccountList({
                account: this.params.jobNo,
                projectCode: Store.state.app.name,
            })
            setTimeout(hide, 0)
            if (typeof data === 'string' || typeof data === 'number') {
                this.accountList.push({
                    label: data,
                    value: data
                })
            }
        },
        checkNewPwd() {
            if (!this.params.newPwd) {
                this.isPopconfirm = false
                return
            }
            if (strong.test(this.params.newPwd)) {
                this.color = '#52c41a'
                this.percent = 100
            } else if (middle.test(this.params.newPwd)) {
                this.color = 'rgb(250, 173, 20)'
                this.percent = 60
            } else if (!middle.test(this.params.newPwd) && !strong.test(this.params.newPwd)) {
                this.color = 'red'
                this.percent = 30
            }
            this.isPopconfirm = true
        },
        async sendCode() {
            this.isSendCode = true
            const data = await getCode({
                account: this.params.jobNo,
                projectCode: Store.state.app.name
            })
            if (!data.msg || data.msg?.includes('成功')) {
                message.success('验证码已发送至钉钉账号，请注意查收')
                this.sendCodeText = '60秒后重新获取'
                this.second = 59
                this.timer = setInterval(() => {
                    this.second -= 1
                    if (this.second > 0) {
                        this.sendCodeText = this.second + '秒后重新获取'
                    } else {
                        clearInterval(this.timer)
                        this.timer = null
                        this.sendCodeText = '获取验证码'
                        this.isSendCode = false
                    }
                }, 1000)
            } else {
                this.isSendCode = false
            }
        },

        async submitForm() {
            const that = this
            that.$refs.forgetForm.validate().then(async () => {
                const data = await resetPass({
                    account: that.params.jobNo,
                    authCcode: that.params.verifyCode,
                    projectCode: Store.state.app.name,
                    password: Encrypt.en(that.params.newPwd),
                    confirmPassword: Encrypt.en(that.params.newPwd)
                })
                if (!data.msg || data.msg?.includes('成功')) {
                    message.success('密码重置成功,请重新登录')
                    setTimeout(function () {
                        that.$router.replace('/登录')
                        setTimeout(() => {
                            nextTick(() => location.reload())
                        })
                    }, 1500)
                }
            })
        },

        onSearch(type) {
            if (!this.params.jobNo) {
                return
            }
            if (type === 'code') {
                this.sendCode()
            } else {
                this.getAccountInfo()
            }
        },
        handleChange() {},
        tabChange(val) {
            this.tabIndex = val
        },
        goback() {
            this.$router.replace('/login')
            setTimeout(() => {
                nextTick(() => location.reload())
            })
        }
    }
}
</script>
<style lang="scss">
.textAlign {
    width: 100%;
}
.forget-container {
    padding: 60px 100px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.2);
}
.forget {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -100px;
    background: #f0f2f5;
    background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100%;
}
.header {
    display: flex;
    justify-content: center;
    margin: 0 0 30px 0;
    font-size: 20px;
    font-weight: bold;
}
.margin_top___3g0tt {
    text-align: center;
    margin-top: 60px;
}
.main___1xvTy {
    display: flex;
    justify-content: center;
}
.btn {
    display: flex;
    justify-content: space-between;
}
</style>
