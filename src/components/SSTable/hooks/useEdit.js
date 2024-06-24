import { nextTick, ref, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'

export default ({ rowKey, selectAll, dataSource, childrenColumnName }) => {
    let lock = false
    const ADD = '__ADD__'
    const virtual = ref(true)
    const xVirtual = ref(true)
    const edits = ref([])
    const RefForm = ref()
    const isRowEdit = (scope) => scope && scope.column && scope.record && scope.recordIndexs

    const findByRecordIndexs = (arr, recordIndexs) => recordIndexs.reduce((t, e, i) => (recordIndexs.length - 1 === i ? t[e] : t[e][childrenColumnName.value]), arr)

    watch(dataSource, () => !lock && (edits.value.length = 0))

    const dataChange = () => {
        lock = true
        nextTick(() => (lock = false))
    }
    return {
        edits,
        RefForm,
        virtual,
        xVirtual,
        dataChange,
        add: (row, range) => {
            if (edits.value.length) return message.info('当前有正在 新增/编辑 的数据 请 保存/取消 后重试')
            selectAll({ target: { checked: true } })
            const add = { ...row, [rowKey.value]: ADD }
            if (range) {
                dataSource.value = [...dataSource.value, add]
            } else {
                dataSource.value = [add, ...dataSource.value]
            }
            lock = true
            edits.value.push(add)
            xVirtual.value = false
            nextTick(() => (lock = false))
        },
        edit: (scope) => {
            if (isRowEdit(scope)) {
                if (edits.value.length) return message.info('当前有正在 新增/编辑 的数据 请 保存/取消 后重试')
                selectAll({ target: { checked: true } })
                edits.value.push(scope.record)
                xVirtual.value = false
            } else {
                if (dataSource.value.some((e) => e[childrenColumnName.value] && e[childrenColumnName.value].length)) {
                    return Modal.info({ centered: true, title: '提示', content: '树形表格不支持整体编辑' })
                } else {
                    virtual.value = false
                    xVirtual.value = false
                    edits.value = dataSource.value
                    console.warn('不建议使用整体编辑，因为这会关闭表格虚拟滚动功能导致表格明显卡顿')
                }
            }
        },
        validate: () => {
            return new Promise((resolve, reject) => {
                RefForm.value
                    ?.validate()
                    .then((value) => {
                        resolve(JSON.parse(JSON.stringify(value)))
                    })
                    .catch(reject)
            })
        },
        save: (scope) => {
            return new Promise((resolve, reject) => {
                RefForm.value
                    ?.validate()
                    .then((value) => {
                        virtual.value = true
                        xVirtual.value = true
                        if (isRowEdit(scope)) {
                            if (edits.value[0][rowKey.value] === ADD) {
                                resolve(JSON.parse(JSON.stringify({ ...edits.value[0], [rowKey.value]: undefined })))
                            } else {
                                resolve(JSON.parse(JSON.stringify({ ...scope.record, ...findByRecordIndexs(value, scope.recordIndexs) })))
                                edits.value.splice(edits.value.indexOf(scope.record), 1)
                            }
                        } else {
                            resolve(dataSource.value.map((e, i) => ({ ...e, ...value[i] })))
                        }
                    })
                    .catch(reject)
            })
        },
        cancel: () => {
            virtual.value = true
            xVirtual.value = true
            if (edits.value.length === 1 && edits.value[0][rowKey.value] === ADD) {
                dataSource.value.splice(dataSource.value.indexOf(edits.value[0]), 1)
                dataSource.value = [...dataSource.value]
            }
            if (edits.value.length > 1) {
                RefForm.value.resetFields()
            }
            edits.value.length = 0
        },
        editing: (scope) => Boolean(isRowEdit(scope) ? edits.value.includes(scope.record) : edits.value.length),
        getFormItemName: (recordIndexs, dataIndex) =>
            recordIndexs.reduce((t, e, i) => {
                t.push(e)
                t.push(i === recordIndexs.length - 1 ? dataIndex : childrenColumnName.value)
                return t
            }, [])
    }
}
