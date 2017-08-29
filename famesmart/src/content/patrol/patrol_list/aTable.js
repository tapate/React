
import React, { PropTypes,Component } from 'react';
import { 
	Table, 
	Input, 
	Icon,
    Select,
	Button, 
	Row,
	Col,
	Popconfirm, 
	Pagination,
	Menu, 
	Dropdown,
	Radio ,
	Collapse,
} from 'antd'
import appData_local from './../../../assert/Ajax_local';
import appData from './../../../assert/Ajax';
import  '../../../App.css'
const { Option, OptGroup } = Select
const {Panel} = Collapse;
const Search = Input.Search;
const RadioGroup = Radio.Group;
require('./index.css');
export default class pointTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			count: 1,
			total:0,
			listMess:{},
			pageSum:1,
			pageNum:1,
			comm_name:'',

			SearchType: 'status',
			SearchText: '输入状态查询。',

            alert_lvl:[],
            area_code:[],
		};

		this.columns = [
			{
				colSpan:1,
				title: 'ID',
				render:(text,record,index) => {
					return(
						<text>{index+1}</text>
					)
				}
			},
			{
  				colSpan: 1,
				title: '门禁ID',
				dataIndex: 'id',
			}, 
			{
  				colSpan: 1,
				title: '巡更位置',
				dataIndex: 'loc_description',
			}, 
			{
  				colSpan: 1,
				title: '计划时间',
				dataIndex: 'audit_time',
			},
            {
                colSpan: 1,
                title: '刷卡时间',
                dataIndex: 'attempted_at',
            },
            {
                colSpan: 1,
                title: '卡号',
                dataIndex: 'access_number',
            },
            {
                colSpan: 1,
                title: '姓名',
                dataIndex: 'name',
            },
            {
                colSpan: 1,
                title: '联系方式',
                dataIndex: 'mobile',
            },
            {
                colSpan: 1,
                title: '状态',
                dataIndex: 'audit_status',
            },
		];
		
		this.Router;
		this.mess = null;
		this.duration='';
        this.TokenMess = '';
	}

	componentWillMount(){
		this.Router = this.props.Router;
		this.mess = this.props.message;
        appData_local._Storage('get',"Token",(res) =>{
            this.TokenMess = res
            this._getEvent()
        })

    }

	_jump(nextPage,mess){
		this.Router(nextPage,mess,this.mess.nextPage)
	}

	//获取后台信息
	_getEvent(){
        let TokenMess = this.TokenMess;
		let userMess = this.userMess;
		let afteruri = 'entrance_records/search';
		let body = {
            "owner_group":"物业",
            "duration":"all",
            "per_page":10
		}
        appData_local._dataPost(afteruri,body,(res) => {
            let data = res.data
            let pageSum = Math.ceil(res.total/res.per_page)
            let len = data.length;
            this.setState({
                total:res.total,
                dataSource: data,
                count:len,
            })
        },TokenMess)
	}
	
	//操作栏功能
	_action(type,mess){
		if(type === "change"){
			this._jump('eecount_edit', mess)
		}else if(type === "delete"){
			let afteruri = 'vcity/canceluser';
			let body = {
				"mobile": mess.mobile,
				"comm_code": mess.comm_code
			}
			appData._dataPost(afteruri,body,(res) => {
				if(res){
					this._getEvent()
				} else {
					alert('操作失败')
				}
			})
		}
	}

	//分页器activity/list?page=num
	_pageChange(pageNumber){
		let userMess = this.userMess;
		let afteruri = 'users?page=' + pageNumber ;
		// let body = {
		// 	 "comm_code": userMess.comm_code
		// }
		appData._dataGet(afteruri,(res) => {
			let pageSum = Math.ceil(res.total/res.per_page)
			let data = res.data;
			let len = data.length;
			this.setState({
				total:res.total,
				dataSource: data,
				count:len,
				pageNum:pageNumber
			})
		})
	}

    onCheckChange(key) {
		this.duration = key.target.value
	}

    callback() {
        let TokenMess = this.TokenMess;
		let userMess = this.userMess;
		let afteruri = 'entrance_records/search';
		let body = {};
		body = {
            "owner_group":"物业",
            "duration": this.duration,
            "per_page":10
		}
        appData_local._dataPost(afteruri,body,(res) => {
            let data = res.data
            let pageSum = Math.ceil(res.total/res.per_page)
            let len = data.length;
            this.setState({
                total:res.total,
                dataSource: data,
                count:len,
            })
        },TokenMess)
		
    }

	render() {
		const { dataSource } = this.state;
		let columns = this.columns;
        const lableS = {
            color: '#00A0E9',
            fontSize: '15px',
        }
		return (
		<div>
			<Row type="flex" justify="space-between" gutter={1}>
				<Col  className="printHidden">
					<text style={{fontSize: 24, color: '#aaa'}}>巡更管理/</text>
					<text style={{fontSize: 24, color: '#1e8fe6'}}>巡更记录</text>
				</Col>
				<Col className="printHidden">
					<Button style={{height: 32}} onClick={()=>window.print()}>打印</Button>
				</Col>
			</Row>
                
                <Row style={{margin: 10}}>
                    <Collapse disabled>
                        <Panel header="精确筛选" key="1">
                             <RadioGroup  onChange={this.onCheckChange.bind(this)} style={{width: '100%'}}>
                                <Row style={{borderBottom: '1px solid #aaa',padding: "12px 0"}}>
                                    <Col span={2} style={{fontWeight: 'bold', fontSize: 14}}>时间段：</Col>
                                    <Col span={3}><Radio  value="day" style={{fontSize: 14}}>当天</Radio></Col>
                                    <Col span={3}><Radio  value="week" style={{fontSize: 14}}>当周</Radio></Col>
                                    <Col span={3}><Radio  value="month" style={{fontSize: 14}}>当月</Radio></Col>
                                </Row>
                            </RadioGroup >
                            <Row type="flex" justify="end">
                                <Button style={{marginTop: '10px'}} size="large" type="primary" onClick={()=>this.callback()}>搜索</Button>
                            </Row> 
                        </Panel>
                    </Collapse>
                </Row>
			<Table bordered  dataSource={this.state.dataSource} columns={columns} rowKey='key' pagination={false} style={{marginBottom: 20}}/>
			<Row type="flex" justify="end">
			<Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._pageChange.bind(this)} />
			</Row>
		</div>
		);
	}
}