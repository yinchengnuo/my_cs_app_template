<script setup>
import Store from '@/store'
import Encrypt from '@/utils/Encrypt'
import { onMounted, reactive, ref } from 'vue'
import { makeEnum, modalConfirm } from '@/utils'
import { apiGetRoleList } from '@/api/系统管理/角色管理'
import { apiGetUserList, apiAddUser, apiUpdataUser, apiDelUser, apiRestPassword, apiEnableUser, apiDisableUser } from '@/api/系统管理/用户管理'

const state = reactive({
    search: {
        account: '',
        realName: ''
    },
    selected: [],
    page: {
        total: 0,
        size: 20,
        current: 1
    },
    defaultPageSizeOptions: ['20', '40', '80', '100'],
    data: [],
    modal: {
        title: '新增',
        visible: false,
        data: {},
        list: []
    }
})
const FORM = ref()

const queryList = () => {
    apiGetUserList({ ...state.search, ...state.page }).then(({ records, size, total, current }) => {
        if (total) {
            state.data = records
            state.page.size = size
            state.page.total = total
            state.page.current = current
        } else {
            state.data = []
            state.page.total = 0
            state.page.size = 50
            state.page.current = 1
        }
    })
}

const roleIdChangeHandle = (val) => {
    state.modal.data.roleId = val
}

const add = () => {
    apiGetRoleList({ size: 100, current: 1 }).then((res) => {
        state.modal.list = makeEnum(res.records, 'name', 'code')
        state.modal.data = JSON.parse(JSON.stringify({ password: '123456', sex: 1, status: 0, roleId: [] }))
        state.modal.title = '新增'
        state.modal.visible = true
    })
}

const enableHandle = async (code) => {
    if (await modalConfirm('确认启用?')) {
        apiEnableUser(code).then(queryList)
    }
}

const disableHandle = async (code) => {
    if (await modalConfirm('确认禁用?')) {
        apiDisableUser(code).then(queryList)
    }
}

const edit = (record) => {
    apiGetRoleList({ current: 1, size: 100 }).then((res) => {
        state.modal.list = makeEnum(res.records, 'name', 'code')
        state.modal.title = '编辑'
        state.modal.data = { ...record, roleId: record.roleCodeList.split(',') }
        state.modal.visible = true
    })
}

const del = async (ids) => {
    if (await modalConfirm('确认删除？')) {
        apiDelUser({ codes: ids }).then(queryList)
    }
}

const checkDel = async (ids) => {
    const codes = state.data.filter((item) => ids.includes(item.id)).map((item) => item.code)
    if (await modalConfirm('确认删除？')) {
        apiDelUser({ codes: codes }).then(queryList)
    }
}

const reset = async (code) => {
    if (await modalConfirm('确认重置该用户密码？')) {
        apiRestPassword(code)
    }
}

const save = () => {
    FORM.value.validate().then((value) => {
        const params = {
            ...value,
            roleCodeList: value.roleId,
            password: value.password ? Encrypt.en(value.password) : undefined,
            factoryCode: Store.state.userinfo.all?.factoryCode,
            factoryName: Store.state.userinfo.all?.factoryName
        }
        if (state.modal.title === '新增') {
            apiAddUser(params).then(() => {
                queryList()
                state.modal.visible = false
            })
        } else {
            params.code = state.modal.data.code
            apiUpdataUser(params).then(() => {
                queryList()
                state.modal.visible = false
            })
        }
    })
}

const validator = (_, value) => ((value || '').match(/^[A-Za-z0-9]+$/) ? Promise.resolve() : Promise.reject(new Error()))
const validatorPhone = (_, value) => ((value || '').match(/^1[3|4|5|7|8]\d{9}$/) ? Promise.resolve() : Promise.reject(new Error()))

const query = () => {
    state.page.current = 1
    queryList()
}
onMounted(queryList)
</script>

<template>
    <div class="index h100 flexc">
        <Form v-model.fill="state.search" @query="query" @reset="query">
            <FormInput number name="account" label="账号" />
            <FormInput name="realName" label="名称" />
        </Form>
        <div class="w100 flex1 mt16">
            <Table
                title="用户管理"
                v-model:data="state.data"
                v-model:select.id="state.selected"
                :defaultPageSizeOptions="state.defaultPageSizeOptions"
                v-model:page="state.page"
                pageSize="size"
                @change="queryList"
            >
                <template #header>
                    <div class="flex flex_fe">
                        <a-space>
                            <a-button type="primary" @click="add">新增</a-button>
                            <a-button type="primary" :disabled="state.selected.length === 0" danger @click="checkDel(state.selected)">删除</a-button>
                        </a-space>
                    </div>
                </template>
                <TableColumn dataIndex="account" title="账号" />
                <TableColumn dataIndex="realName" title="名称" />
                <TableColumn dataIndex="phone" title="手机号" />
                <TableColumn dataIndex="sex" title="性别">
                    <template #default="{ record }">
                        <span>{{ record.sex == 1 ? '男' : '女' }}</span>
                    </template>
                </TableColumn>
                <TableColumn dataIndex="status" title="状态">
                    <template #default="{ record }">
                        <span>{{ record.status == 0 ? '正常' : '禁用' }}</span>
                    </template>
                </TableColumn>
                <TableColumn dataIndex="roleNameList" title="角色" />
                <TableColumn title="操作" fixed="right" :width="320">
                    <template #default="{ record }">
                        <a-button type="link" :disabled="record.status == 0" @click="enableHandle(record.code)">启用</a-button>
                        <a-button type="link" :disabled="record.status == 1" @click="disableHandle(record.code)">禁用</a-button>
                        <a-button type="link" @click="edit(record)">编辑</a-button>
                        <a-button type="link" @click="reset(record.code)">重置密码</a-button>
                        <a-button type="link" danger @click="del([record.code])">删除</a-button>
                    </template>
                </TableColumn>
            </Table>
        </div>
        <a-modal v-model:open="state.modal.visible" :title="state.modal.title" destroyOnClose centered width="50vw" @ok="save">
            <Form ref="FORM" v-model="state.modal.data" width="calc((100% - 26px) / 2)" hideRight layout="vertical" wrap>
                <FormInput name="jobNo" label="工号" :rules="[{ required: true, message: '请输入工号', whitespace: true }]" />
                <FormInput name="account" label="账号" spaceX="0px" :rules="[{ required: true, message: '请输入账号(数字/字母组合)', whitespace: true, validator }]" />
                <FormInput name="realName" label="名称" :rules="[{ required: true, message: '请输入名称', whitespace: true }]" />
                <FormInput name="phone" label="手机号" spaceX="0px" :rules="[{ required: true, message: '请输入手机号(长度11位)', whitespace: true, validator: validatorPhone }]" />
                <FormRadio
                    name="sex"
                    label="性别"
                    :rules="[{ required: true, message: '请选择性别' }]"
                    size="small"
                    :options="[
                        { label: '男', value: 1 },
                        { label: '女', value: 2 }
                    ]"
                >
                </FormRadio>
                <FormInput v-if="state.modal.title === '新增'" password spaceX="0px" name="password" label="密码" :rules="[{ required: true, message: '请输入密码' }]" />
                <FormTreeSelect @change="roleIdChangeHandle" multiple label="角色" name="roleId" spaceX="0px" :treeData="state.modal.list" :rules="[{ required: true, message: '请输入角色' }]" />
            </Form>
        </a-modal>
    </div>
</template>
