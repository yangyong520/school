<template>
	<div class="ApplicationNotes">
		<Title title="申请记录" />
		<RouterTap :menuArr="menuArr" pathRouter="ApplicationNotes" />
	</div>
</template>

<script>
	import sleepApplication from './components/sleepApplication' // 调寝
	import RepairApplication from './components/RepairApplication' // 报修
	import VisitApplication from './components/VisitApplication' // 被访
	import leaveApplication from './components/leaveApplication' // 请假
	export default {
		name: 'ApplicationNotes',
		data() {
			return {
				menuArr: [{
					name: '调寝',
					component: sleepApplication
				}, {
					name: '报修',
					component: RepairApplication
				}, {
					name: '被访',
					component: VisitApplication
				}, {
					name: '请假',
					component: leaveApplication
				}]
			}
		},
		components: {
			sleepApplication, // 调寝
			RepairApplication, // 报修
			VisitApplication, // 被访
			leaveApplication // 请假
		},
		mounted() {},
		methods: {
			menuCont(data) {
				this.data = data
			}
		}
	}
</script>


<style scoped lang="less">
@import '~@/global';

</style>
