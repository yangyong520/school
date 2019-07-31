<template>
	<div class="AttendanceDetails">
		<div @click="goBack">
			<a-icon type="left" />
			<span class="attendanceDetailTitle">{{collegeNameTitle}}-{{professionNameTitle}}-{{gradeNameTitle}}级-{{classNameTitle}}班</span>
		</div>
		<!--头部-->
		<div class="inner-style">
			<div class="box-left"></div>
			<div class="box-right">
				<div class="btn-box">
					<a-input-search placeholder="被访人姓名/学号" v-model="val" @search="handleSearchAttendD" enterButton/>
				</div>
				<div class="btn-box">
					<a-button class="btn-item" @click="exportLog">导出</a-button>
				</div>
				<div class="btn-box" @click="visibleAttendDSearch = !visibleAttendDSearch">
					<i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
				</div>
			</div>
		</div>
		<!--头部-->
		<p class="attendanceDetailCont">
			该时间段内，人均外出总时长{{countData.totalTime || 0}}h，
			<span>外出时长低于平均值25%，{{countData.lowerTwoFiveCount || 0}}人；低于50%，{{countData.lowerFiveCount || 0}}人；低于75%，{{countData.lowerSevenFiveCount}}人</span>
		</p>
		<DataTable
			ref="table_page"
			:showRowSelection="false"
			:columns="columns"
			:queryObj="queryObj"
			reqType="attandence"
			@change="x => selectedRowKeys = x">
		</DataTable>
		<!--考勤分析-->
		<a-modal :maskClosable="false" title="考勤分析" v-model="visibleAttendanceD" @ok="handleAttendanceDOk" okText="确定" class="modal-box">
			<div class="input-box">
				<p><span>姓名：</span><span>{{ObjData.name}}</span></p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<p><span>学号：</span><span>{{ObjData.userNum}}</span></p>
			</div>
			<div class="input-box">
				<span>时间：</span>
				<a-range-picker class="input-select" v-model="timer"/>&nbsp;&nbsp;&nbsp;
				<a-button class="btn-item" @click="attendanceDAnalysis">分析</a-button>
			</div>
			<div>该时间段内，外出总时长{{items.outTime || 0}}h，班级人均外出时长{{items.userAvg || 0}}h</div>
		</a-modal>
		<!--筛选-->
		<a-modal @cancel="attendDClearSearch" :maskClosable="false" title="筛选" v-model="visibleAttendDSearch" @ok="handleSearchAttendD" okText="查询" class="modal-box">
			<div class="input-box">
				<span>状态:</span>
				<a-select v-model="status" class="input-select">
					<a-select-option value="0">全部</a-select-option>
					<a-select-option value="1">正常</a-select-option>
					<a-select-option value="2">低于25%以上</a-select-option>
					<a-select-option value="3">低于50%以上</a-select-option>
					<a-select-option value="4">低于70%以上</a-select-option>
				</a-select>
			</div>
			<div class="input-box">
				<span>时间:</span>
				<a-range-picker format="YYYY-MM-DD" @change="changeTime" v-model="LeaveDate" class="input-box-item vistorTime" />
			</div>
			<div class="input-box">
				<a-button block @click="attendDClearSearch">重置</a-button>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import DataTable from '@/components/DataTable'
	import req from "@/req/req";
	import { baseUrl } from '@/baseUrl'
	const {
		statAttendStudentInfo,
		statAttendInfoByClassId,
		queryVisitorInOutList, //获取考勤分析列表
	} = req;
	export default {
		name: 'AttendanceDetails',
		components: {
			DataTable
		},
		data() {
			return {
				ObjData: {},
				timer: [],
				items: {},
				countData: {},
				selectedRowKeys: [],
				classId: localStorage.getItem('id'),
				collegeNameTitle: localStorage.getItem('collegeName'),
				professionNameTitle: localStorage.getItem('professionName'),
				gradeNameTitle: localStorage.getItem('gradeName'),
				classNameTitle: localStorage.getItem('className'),
				val: '', //姓名/学号
				visibleAttendanceD: false, //考勤分析弹窗
				visibleAttendDSearch: false, // 筛选弹窗
				LeaveDate: [], //查询时间数组
				startTime: '', //查询开始时间
				endTime: '', //查询结束时间
				status: '0',  //查询状态
				columns: [
					{
						title: '姓名',
						dataIndex: 'studentName'
					},
					{
						title: '学号',
						dataIndex: 'studentCode'
					},
					{
						title: '外出时长（h）',
						dataIndex: 'outTime',
					},
					{
						title: '状态',
						dataIndex: 'statusStr',
					},
					{
						title: '当日人均外出时长（h）',
						dataIndex: 'avgTime'
					},
					// {
					// 	title: '操作',
					// 	dataIndex: 'password',
					// 	customRender: (text, record, index) => {
					// 		return(
					// 			<div class="todo-box">
					// 				<span onClick={() => this.getData(record)}>
					// 					考勤分析
					// 				</span>
					// 			</div>
					// 		)
					// 	}
					// }
				]
			}
		},
		computed: {
			queryObj () {
				return {
					classId: this.$route.query.id || '',
					status: this.status,
					startTime: this.startTime,
					endTime: this.endTime,
					queryInfo: this.val,
					pageSize: 1,
					pageNum: 10
				}
			}
		},
		mounted() {
			this.getDetail()
		},
		methods: {
			changeTime (time) {
				this.startTime = time[0].format("YYYY-MM-DD");
				this.endTime = time[1].format("YYYY-MM-DD")
			},
			exportLog () {
				var elemIF = document.createElement("iframe")
				elemIF.src = baseUrl + `/attandence/exportAttendStudentList?classId=${this.$route.query.id}&queryInfo=${this.val}&status=${this.status}&startTime=${this.startTime}&endTime=${this.endTime}`
				elemIF.style.display = "none"
				document.body.appendChild(elemIF)
			},
			getDetail () {
				statAttendInfoByClassId({
					classId: this.classId,
				}).then(({data: {msg, code, data}}) => {
					if (code === 0) {
						this.countData = data
					} else {
						this.$message.warning(msg)
					}
				})
			},
			getData (item) {
				this.visibleAttendanceD = !this.visibleAttendanceD
				this.ObjData = item
			},
			//筛选
			handleSearchAttendD () {
				this.$refs.table_page.getDataTable()
			},
			//重置
			attendDClearSearch () {
				this.LeaveDate = [];
				this.startTime = "";
				this.endTime = "";
				this.status='0'
			},
			//点击关闭考勤分析
			handleAttendanceDOk (e) {
				this.visibleAttendanceD = false
			},
			//考勤分析
			attendanceDAnalysis () {
				if (this.timer.length === 0) {
					this.$message.warning('请选择日期！')
					return
				}
				if(this.timer[0]) {
					const str = this.timer[0].format("YYYY-MM-DD")
					const end = this.timer[1].format("YYYY-MM-DD")
				}
				statAttendStudentInfo({
					id: this.ObjData.id,
					startTime: str,
					endTime: end
				}).then(({data: {data, msg, code}}) => {
					if (code === 0) {
						this.items = data
					} else {
						this.$message.warning(msg)
					}
				})
			},
			goBack () {
				this.$router.go(-1)
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';
	.attendanceDetailTitle {
		margin-bottom: 0px !important;
		font-size: 16px !important;
		font-weight: bold;
	}

	.attendanceDetailCont {
		font-size: 14px;
		margin-bottom: 15px;
	}

	.attendanceDetailCont span {
		color: #FF6C79;
	}
</style>
