// 含有可操作 table 栏的数据展示
import React from 'react';

import Reqwest from 'reqwest';
import apiConfig from '../config/apiConfig';

import util from '../utils/util';

import {
    Table,
    Button,
    Modal,
    Form,
    message,
    Input,
    Icon,
    Upload
} from 'antd';
const FormItem = Form.Item;

let Feature = React.createClass({
    getInitialState: function() {
        return {
            list: [],
            updateIsShow: false,
            selectedSetname: ''
        }
    },
    render: function() {
        let columns = [{
            title: 'KEY',
            dataIndex: 'key',
        }, {
            title: '数量',
            dataIndex: 'count',
        }, {
            title: '操作',
            type: 'operate', // 操作的类型必须为 operate
            render: (text, item) => (
                <span>
                        <a href={'/udata/mis/exportbigset?key='+item.key+'&app=flyflow'} target="_blank">导出查看</a>
                        <span className="ant-divider" />
                        <a href="javascript:void 0;"  onClick={this.changeSet.bind(this, item.key)}>修改</a>
                        <span className="ant-divider" />
                        <a href="javascript:void 0;" onClick={this.deleteSet.bind(this, item.key)}>删除</a>
                    </span>
            )

        }];

        let formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            },
        };

        return <div className="category">
                    <Button type="primary" onClick={this.addSet} style={{marginBottom: '15px'}}>新增</Button>
                    <Table columns={columns} dataSource={this.state.list} bordered/>
                    <Modal
                        visible={this.state.updateIsShow}
                        title="创建与更新"
                        okText="确定"
                        onCancel={this.handleCancel}
                        onOk={this.handleUpdate}
                        >
                        <Form layout="vertical">
                            <FormItem
                                label="BigSet的名称"
                                key='key'
                                {...formItemLayout}>
                                {
                                    this.state.selectedSetname
                                    ? <Input placeholder='' key={this.state.selectedSetname} value={this.state.selectedSetname}  ref='name' readOnly/>
                                    : <Input placeholder='' ref='name' />
                                }
                            </FormItem>

                            <FormItem
                                label="上传BigSet文件"
                                key='file'
                                {...formItemLayout}>
                                <Input placeholder='' type='file' ref='file' style={{border:'none'}}/>
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
    },
    componentDidMount: function() {

        let that = this;
        // 接口调用数据形式
        // 接口调用数据形式
        Reqwest({
            url: apiConfig.getbigsetlist,
            data: {},

            type: 'json',
            success: function(data) {
                let list = data.data;
                that.setState({
                    list: list
                });
            }
        });
    },
    saveFormRef: function(form) {
        this.form = form;
    },
    handleUpdate: function() {
        let name = this.refs.name.refs.input.value;
        let file = this.refs.file.refs.input.files;

        if (!name) {
            message.warn('请填写大集合名称');
            return;
        } else if (file.length === 0) {
            message.warn('请上传集合文件');
            return;
        }

        util.uploadFiles(apiConfig.uploadBigset, 'file', this.refs.file.refs.input.files[0], {
            param: {
                app: 'flyflow',
                key: name
            }
        });
    },
    handleCancel: function() {
        this.setState({
            updateIsShow: false
        });
    },

    addSet: function() {
        this.setState({
            selectedSetname: '',
            updateIsShow: true,
        });
    },
    changeSet: function(key) {
        console.log(key)
        this.setState({
            selectedSetname: key,
            updateIsShow: true,
        });
    },
    deleteSet: function(key) {
        Reqwest({
            url: apiConfig.delbigset,
            data: {
                app: 'flyflow',
                key: key
            },

            type: 'json',
            success: function(data) {
                // 模拟请求删除成功的回调
            }
        });
    }
});

Feature = Form.create()(Feature)

export default Feature;