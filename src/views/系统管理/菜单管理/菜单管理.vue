<script setup>
import Store from '@/store'
import { onMounted, reactive, ref } from 'vue'
import { getPathByIdInTree, modalConfirm } from '@/utils'
import { apiDelMenu, apiSaveMenu, apiUpdateMenu, apiGetMenuList } from '@/api/系统管理/菜单管理'

const FORM = ref()
const state = reactive({
    search: {
        name: ''
    },
    data: [],
    rowItem: {},
    modal: {
        title: '新增',
        visible: false,
        data: {},
        list: {}
    }
})

const queryList = () => {
    apiGetMenuList({
        ...state.search,
        projectCode: Store.state.app.appName
    }).then((data) => {
        state.data = data
    })
}

onMounted(queryList)

const mapTree = (tree, id) => {
    tree.forEach((item) => {
        if (item.type === 1 || (id && getPathByIdInTree(state.modal.list, item.id).join('').startsWith(getPathByIdInTree(state.modal.list, id).join('')))) {
            item.disabled = true
        }
        item.children && item.children.length && mapTree(item.children, id)
    })
}

const add = (record) => {
    state.modal.visible = true
    state.rowItem = record
    state.modal.title = '新增' + (record ? '下级' : '')
    state.modal.data = {
        type: 0,
        url: record ? record.url : '',
        parentId: record ? record.id : '',
        parentCode: record ? record.code : 0,
        sort: record ? (record.children ? record.children.length + 1 : 1) : state.data.length + 1
    }
    state.modal.list = JSON.parse(JSON.stringify(state.data))
    mapTree(state.modal.list)

    console.log(state.modal.list, state.modal.data, 'addd')
}

const edit = (record) => {
    state.modal.title = '编辑'
    state.rowItem = record
    state.modal.visible = true
    state.modal.data = {
        ...record,
        parentId: record ? record.id : '',
        parentCode: record ? record.parentCode : 0
    }
    state.modal.list = JSON.parse(JSON.stringify(state.data))
    mapTree(state.modal.list, record.id)
}

const del = async (row) => {
    if (await modalConfirm('确认删除该条数据？')) {
        apiDelMenu({ codes: [row.code] }).then(queryList)
    }
}

const save = () => {
    FORM.value.validate().then(() => {
        const params = {
            url: state.modal.data.url,
            type: state.modal.data.type,
            parentCode: state.modal.data.parentCode,
            projectCode: Store.state.app.appName,
            sort: state.modal.data.sort,
            name: state.modal.data.type === 0 ? state.modal.data.url.split('/').at(-1) : state.modal.data.name
        }
        if (state.modal.title === '编辑') {
            params.code = state.rowItem.code
            apiUpdateMenu(params).then(() => {
                queryList()
                state.modal.visible = false
            })
        } else {
            apiSaveMenu(params).then(() => {
                queryList()
                state.modal.visible = false
            })
        }
    })
}
</script>

<template>
    <div class="index h100 flexc">
        <Form v-model.fill="state.search" @query="queryList" @reset="queryList">
            <FormInput name="name" label="名称" />
        </Form>
        <div class="w100 flex1 mt16">
            <Table v-model:data="state.data" title="菜单管理">
                <template #header>
                    <div class="flex flex_fe">
                        <a-button type="primary" @click="add()">新增</a-button>
                    </div>
                </template>
                <TableColumn dataIndex="name" title="名称">
                    <template #default="{ record: { type, url, name } }">{{ type === 0 ? url.split('/').at(-1) : name }}</template>
                </TableColumn>
                <TableColumn dataIndex="url" title="地址">
                    <template #default="{ record: { url } }">
                        <a-button type="link" @click="$router.replace(url)">{{ url }}</a-button>
                    </template>
                </TableColumn>
                <TableColumn dataIndex="type" title="类型">
                    <template #default="{ record: { type } }">
                        <a-tag v-if="+type === 0" color="processing" style="margin: 0">页面</a-tag>
                        <a-tag v-if="+type === 1" color="success" style="margin: 0">按钮</a-tag>
                    </template>
                </TableColumn>
                <TableColumn dataIndex="sort" title="排序">
                    <template #default="{ record: { id }, text }">
                        <div :style="{ marginLeft: ((getPathByIdInTree(state.data, id).length - 1) / 2) * 15 + 'px' }">{{ text }}</div>
                    </template>
                </TableColumn>
                <TableColumn title="操作">
                    <template #default="{ record }">
                        <a-button type="link" :disabled="!(record.type === 0)" @click="add(record)">新增</a-button>
                        <a-button type="link" @click="edit(record)">编辑</a-button>
                        <a-button type="link" danger @click="del(record)">删除</a-button>
                    </template>
                </TableColumn>
            </Table>
        </div>
        <a-modal v-model:open="state.modal.visible" :title="state.modal.title" destroyOnClose centered width="50vw" @ok="save">
            <Form ref="FORM" v-model="state.modal.data" width="calc((100% - 26px) / 2)" hideRight layout="vertical" wrap>
                <FormRadio
                    name="type"
                    label="类型"
                    :options="[
                        { label: '页面', value: 0 },
                        { label: '按钮', value: 1 }
                    ]"
                    :rules="[{ required: true, message: '请选择类型' }]"
                />
                <FormInput name="url" label="地址" :rules="[{ required: true, message: '请输入地址', whitespace: true }]" spaceX="0px" />
                <FormSelectTree label="上级" changeOnSelect name="parentId" :options="state.modal.list" :fieldNames="{ label: 'name', value: 'id', children: 'children' }" />
                <FormInput number showHandler name="sort" label="排序" :rules="[{ required: true }]" spaceX="0px" />
                <FormInput v-if="state.modal.data.type === 1" name="name" label="名称" :rules="[{ required: true, message: '请输入名称', whitespace: true }]" />
            </Form>
        </a-modal>
    </div>
</template>
