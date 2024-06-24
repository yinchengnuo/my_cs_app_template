<script setup>
import Store from '@/store'
import { modalConfirm } from '@/utils'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import { apiGetMenuList, apiGetCodesByRole } from '@/api/系统管理/菜单管理'
import { apiGetRoleList, apiAddRole, apiUpdateRole, apiDelRole, apiGetAuthSet } from '@/api/系统管理/角色管理'

const FORM = ref()
const state = reactive({
    search: {
        name: ''
    },
    data: [],
    page: {
        total: 0,
        size: 20,
        current: 1
    },
    defaultPageSizeOptions: ['20', '40', '80', '100'],
    modal: {
        title: '',
        visible: false,
        data: {}
    },
    modalAuth: {
        code: '',
        visible: false,
        data: [],
        checked: [],
        halfCheckedKeys: []
    }
})

const queryList = () => {
    apiGetRoleList({
        ...state.search,
        ...state.page
    }).then(({ records, size, total, current }) => {
        state.data = records
        state.page.size = size
        state.page.total = total
        state.page.current = current
    })
}

onMounted(queryList)

const add = () => {
    state.modal.title = '新增'
    state.modal.visible = true
}

const edit = (record) => {
    state.modal.title = '编辑'
    state.modal.visible = true
    state.modal.data = {
        name: record.name,
        code: record.code
    }
}

const save = () => {
    FORM.value.validate().then(() => {
        if (state.modal.title === '编辑') {
            apiUpdateRole(state.modal.data).then(() => {
                queryList()
                state.modal.visible = false
            })
        } else {
            apiAddRole({ ...state.modal.data }).then(() => {
                queryList()
                state.modal.visible = false
            })
        }
    })
}

const del = async (code) => {
    if (await modalConfirm('确认删除该条数据？')) {
        apiDelRole({ codes: [code] }).then(queryList)
    }
}

const set = ({ code }) => {
    state.modalAuth.code = code
    Promise.all([apiGetMenuList({ name: '', projectCode: Store.state.app.appName }), apiGetCodesByRole({ codes: [code] })]).then(([data, menu]) => {
        state.modalAuth.data = data
        state.modalAuth.checked = menu.filter((fitem) => fitem.parentFlag === 0).map((item) => item.code)
        state.modalAuth.halfCheckedKeys = menu.filter((fitem) => fitem.parentFlag !== 0).map((item) => item.code)
        state.modalAuth.visible = true
    })
}

const saveAuth = () => {
    if (state.modalAuth.checked.length) {
        const params = state.modalAuth.checked.concat(state.modalAuth.halfCheckedKeys).map((item) => {
            return {
                roleCode: state.modalAuth.code,
                menuCode: item,
                projectCode: Store.state.app.appName
            }
        })
        console.log(params, 'params')
        apiGetAuthSet(params).then(() => {
            queryList()
            state.modalAuth.visible = false
        })
    } else {
        message.info('请选择权限')
    }
}

const check = (checkeds, event) => {
    state.modalAuth.halfCheckedKeys = event?.halfCheckedKeys
    state.modalAuth.checked = checkeds
}
</script>

<template>
    <div class="index h100 flexc">
        <Form v-model.fill="state.search" @query="queryList" @reset="queryList">
            <FormInput name="name" label="名称" />
        </Form>
        <div class="w100 flex1 mt16">
            <Table ref="TABLE" v-model:data="state.data" v-model:page="state.page" :defaultPageSizeOptions="state.defaultPageSizeOptions" pageSize="size" @change="queryList" title="角色管理">
                <template #header>
                    <div class="flex flex_fe">
                        <a-button type="primary" @click="add()">新增</a-button>
                    </div>
                </template>
                <TableColumn dataIndex="name" width="300" align="center" title="名称" />
                <TableColumn title="操作" align="center">
                    <template #default="{ record }">
                        <a-button type="link" :disabled="record.name === '超级管理员'" @click="edit(record)">编辑</a-button>
                        <a-button type="link" @click="set(record)">权限设置</a-button>
                        <a-button type="link" danger :disabled="Boolean(record.name === '超级管理员' || (record.children && record.children.length))" @click="del(record.code)">删除</a-button>
                    </template>
                </TableColumn>
            </Table>
        </div>
        <a-modal v-model:open="state.modal.visible" :title="state.modal.title" destroyOnClose centered width="345px" @ok="save">
            <Form ref="FORM" v-model="state.modal.data" spaceY="20px" hideRight layout="vertical">
                <FormInput name="name" width="100%" label="角色" :rules="[{ required: true, message: '请输入角色名称', type: 'string', whitespace: true }]" />
            </Form>
        </a-modal>
        <a-modal v-model:open="state.modalAuth.visible" title="权限设置" :bodyStyle="{ maxHeight: '61vh', overflow: 'auto' }" destroyOnClose centered width="50vw" @ok="saveAuth">
            <a-tree
                :fieldNames="{ children: 'children', title: 'name', key: 'code' }"
                :checkedKeys="{ checked: state.modalAuth.checked }"
                :tree-data="state.modalAuth.data"
                :selectable="false"
                showIcon
                defaultExpandAll
                checkable
                @check="check"
            >
                <template #icon="{ category }">
                    <span v-if="category === 2" style="color: red">*</span>
                </template>
            </a-tree>
        </a-modal>
    </div>
</template>

<style>
.ant-tree-iconEle {
    width: auto !important;
}
</style>
