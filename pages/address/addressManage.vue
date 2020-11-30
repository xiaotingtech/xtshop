<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.username" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			<text v-if="canChooseLocation" @click="chooseLocation" class="input">
				{{addressData.address_district}}
			</text>
			<text v-if="canChooseLocation" class="yticon icon-shouhuodizhi"></text>
			<input v-if="!canChooseLocation" class="input" type="text" 
			v-model="addressData.address_district" placeholder="请填写省市区地址" placeholder-class="placeholder" />
		</view>
		<view class="row b-b"> 
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="addressData.address_door" placeholder="楼号、门牌" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.is_default" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import { saveAddressData } from '@/api/address'
	export default {
		data() {
			return {
				canChooseLocation:true,
				addressData: {
					id:0,
					username: '',
					phone: '',
					address:'',
					address_district: '在地图选择',
					address_door: '',
					is_default: false
				}
			}
		},
		onLoad(option){
			let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑收货地址'
				
				this.addressData = JSON.parse(option.data)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			switchChange(e){
				this.addressData.is_default = e.detail.value;
			},
			
			//地图选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						this.addressData.address = data.address;
						this.addressData.address_district = data.name;
					},
					fail:(data)=>{
						this.canChooseLocation=false;
						if(this.addressData.address_district === '在地图选择'){
							this.addressData.address_district = '';
						}
					}
				})
			},
			
			//提交
			confirm(){
				let data = this.addressData;
				if(!data.username){
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phone)){
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if(!data.address){
					if(data.address_district){
						data.address=data.address_district;
					}else{
						if(this.canChooseLocation){
							this.$api.msg('请在地图选择位置');
							return;
						}else{
							this.$api.msg('请填写省市区地址');
							return;
						}
					}
				}
				if(data.address_district==='在地图选择'){
					this.$api.msg('请在地图选择位置');
					return;
				}
				if(!data.address_door){
					this.$api.msg('请填写门牌号信息');
					return;
				}
				saveAddressData(data).then(res=> {
						//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
						this.$api.prePage().refreshList();
						this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
						setTimeout(()=>{
							uni.navigateBack()
						}, 800)
				}).catch(err=> { console.log(err) })
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
