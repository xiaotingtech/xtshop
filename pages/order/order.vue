<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in tabItem.orderList" :key="index"
						class="order-item"
					>
						<view class="i-top b-b">
							<text class="time">{{item.create_time}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<text 
								v-if="item.state===9" 
								class="del-btn yticon icon-iconfontshanchu1"
								@click="deleteOrder(index)"
							></text>
						</view>
						
						<scroll-view v-if="item.product_order.length > 1" class="goods-box" scroll-x>
							<view
								v-for="(goodsItem, goodsIndex) in item.product_order" :key="goodsIndex"
								class="goods-item"
							>
								<image class="goods-img" :src="goodsItem.product_img" mode="aspectFill"
								@click="navToDetailPage(goodsItem)"></image>
							</view>
						</scroll-view>
						<view 
							v-if="item.product_order.length === 1" 
							class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.product_order" :key="goodsIndex"
						>
							<image class="goods-img" :src="goodsItem.product_img" mode="aspectFill"
							@click="navToDetailPage(goodsItem)"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.product_name}}</text>
								<text class="attr-box">{{goodsItem.property_value}}  x {{goodsItem.product_num}}</text>
								<text class="price">{{goodsItem.price}}</text>
							</view>
						</view>
						
						<view class="price-box">
							共
							<text class="num">{{item.product_num}}</text>
							件商品 实付款
							<text class="price">{{item.total_price}}</text>
						</view>
						<view class="action-box b-t" v-if="item.order_status == 1">
							<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
							<button class="action-btn recom"  @click="goToPay(item)">立即支付</button>
						</view>
						<view class="action-box b-t" v-if="item.order_status == 3">
							<button class="action-btn" @click="queryOrderExpress(item)">查看物流</button>
							<button class="action-btn recom" @click="confirmOrder(item)">确认收货</button>
						</view>
						<view class="action-box b-t" v-if="item.order_status == 2">
							<button class="action-btn recom">等待发货</button>
						</view>
						<view class="action-box b-t" v-if="item.order_status == 4">
							<button class="action-btn recom">交易完成</button>
						</view>
						<view class="action-box b-t" v-if="item.order_status == 0">
							<button class="action-btn">订单已关闭</button>
						</view>
					</view>
					 
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import { getOrderList,closeOrder,createOrder,queryOrder,confirmProductOrder,queryExpress } from '@/api/order'
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						loadingFinish: false,
						orderList: [],
						nowPage:1,
						list_row:10,
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						loadingFinish: false,
						orderList: [],
						nowPage:1,
						list_row:10,
					},
					{
						state: 2,
						text: '待发货',
						loadingType: 'more',
						loadingFinish: false,
						orderList: [],
						nowPage:1,
						list_row:10,
					},
					{
						state: 3,
						text: '待收货',
						loadingType: 'more',
						loadingFinish: false,
						orderList: [],
						nowPage:1,
						list_row:10,
					},
					{
						state: 4,
						text: '已完成',
						loadingType: 'more',
						loadingFinish: false,
						orderList: [],
						nowPage:1,
						list_row:10,
					}
				],
			};
		},
		
		onLoad(options){
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state;
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if(options.state == 0){
				this.loadData()
			}
			// #endif
			
		},
		 
		methods: {
			//获取订单列表
			loadData(source){
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				
				if(source === 'tabChange' && navItem.loaded === true){
					//tab切换只有第一次需要加载数据
					return;
				}else{
					if(navItem.loadFinish === true){
						//加载完了不在加载
						return;
					}
				}
				
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				
				navItem.loadingType = 'loading';
				
				getOrderList({page:navItem.nowPage,list_row:navItem.list_row,order_status:navItem.state}).then(res=>{
					let resOrderList=res.list;
					setTimeout(()=>{
						let orderList = resOrderList.filter(item=>{
							//添加不同状态下订单的表现形式
							item = Object.assign(item, this.orderStateExp(item.order_status));
							return item
						});
						orderList.forEach(item=>{
							navItem.orderList.push(item);
						})
						//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
						this.$set(navItem, 'loaded', true);
						//判断是否加载完成
						if(navItem.nowPage>=res.pages){
							this.$set(navItem, 'loadFinish', true);
							//判断是否还有数据， 有改为 more， 没有改为noMore 
							navItem.loadingType = 'noMore';
						}else{
							navItem.loadingType = 'more';
							navItem.nowPage++;
						}
					}, 600);
				}).catch(err=> { 
					console.log(err) 
				})	
			}, 

			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(index){
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(()=>{
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600)
			},
			//取消订单
			cancelOrder(item){
				uni.showLoading({
					title: '请稍后'
				})
				closeOrder({order_id:item.id}).then(res=>{
					setTimeout(()=>{
						let {stateTip, stateTipColor} = this.orderStateExp(0);
						item = Object.assign(item, {
							state: 0,
							stateTip, 
							stateTipColor
						})
						
						//取消订单后删除待付款中该项
						let list = this.navList[1].orderList;
						let index = list.findIndex(val=>val.id === item.id);
						index !== -1 && list.splice(index, 1);
						uni.hideLoading();
						//如果当前不是全部订单则重置全部订单列表重新加载
						if(this.tabCurrentIndex==0){
							item.order_status=0;
						}else{
							this.navList[0].orderList=[];
							this.navList[0].loadFinish=false;
							this.navList[0].nowPage=1;
							this.navList[0].loadingType='more';
							this.navList[0].loaded=false;
						}
					}, 600)
				}).catch(err=> { 
					console.log(err);
					uni.hideLoading();
				})
			},
			queryOrderExpress(item){
				uni.showLoading({
					title: '请稍后'
				});
				queryExpress({order_id:item.id}).then(res=>{
					uni.hideLoading();
					let expressInfo=res.data;
					let expressCompany=res.logistics_company;
					let expressNo=res.logistics_bill_no;
					let expressStr='';
					expressInfo.forEach(val=>{
						expressStr+=val.time+' '+val.description+"\r\n";
					})
					uni.showModal({
					    title: expressCompany+"\r\n"+expressNo,
					    content: expressStr,
					    success: function (res) {
					        if (res.confirm) {
					            uni.hideModel();
					        } else if (res.cancel) {
					            uni.hideModel();
					        }
					    }
					});
				}).catch(err=> { 
					console.log(err);
					uni.hideLoading();
				})
			},
			//确认订单
			confirmOrder(item){
				uni.showLoading({
					title: '请稍后'
				})
				confirmProductOrder({order_id:item.id}).then(res=>{
					setTimeout(()=>{
						let {stateTip, stateTipColor} = this.orderStateExp(4);
						item = Object.assign(item, {
							state: 4,
							stateTip, 
							stateTipColor
						})
						
						//确认订单后删除待收货中该项
						let list = this.navList[3].orderList;
						let index = list.findIndex(val=>val.id === item.id);
						index !== -1 && list.splice(index, 1);
						uni.hideLoading();
						//如果当前不是全部订单则重置全部订单列表重新加载
						if(this.tabCurrentIndex==0){
							item.order_status=4;
						}else{
							//全部订单重新加载
							this.navList[0].orderList=[];
							this.navList[0].loadFinish=false;
							this.navList[0].nowPage=1;
							this.navList[0].loadingType='more';
							this.navList[0].loaded=false;
							//已完成重新加载
							this.navList[4].orderList=[];
							this.navList[4].loadFinish=false;
							this.navList[4].nowPage=1;
							this.navList[4].loadingType='more';
							this.navList[4].loaded=false;
						}
					}, 600)
				}).catch(err=> { 
					console.log(err);
					uni.hideLoading();
				})
			},
			//订单状态文字和颜色
			orderStateExp(state){
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch(state){
					case 1:
						stateTip = '待付款'; break;
					case 2:
						stateTip = '待发货'; break;
					case 3:
						stateTip = '待收货'; break;
					case 4:
						stateTip = '已完成'; break;
					case 0:
						stateTip = '订单已关闭'; 
						stateTipColor = '#909399';
						break;
						
					//更多自定义
				}
				return {stateTip, stateTipColor};
			},
			//详情
			navToDetailPage(item){
				let id = item.product_id;
				let sku_product_id = item.sku_product_id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}&sku_product_id=${sku_product_id}`
				})
			},
			goToPay(param){
				uni.showLoading({
					title: '请稍后'
				})
				createOrder({
					'order_id':param.id
				}).then(res=>{
					this.order_no=res.order_no;
					this.weixinPay(res.pay_str,param);
				}).catch(err=> { 
					console.log(err) 
					uni.hideLoading();
				})
			},
			weixinPay(pay_str,param) {
			      uni.requestPayment({
			        provider: 'wxpay',
			        timeStamp: pay_str.timeStamp,
			        package: pay_str.package,
			        nonceStr: pay_str.nonceStr,
			        paySign: pay_str.paySign,
			        signType: pay_str.signType,
			        success: e => {
			          if(e.errMsg== "requestPayment:ok"){
			            this.checkPayback(this.order_no,param);
			          }else{
			            console.log('debug log -支付取消->', e.errMsg,);
						uni.hideLoading();
			          }
			        },
			        fail: e => {
			          console.log("fail支付失败,原因为:", e);
					  uni.hideLoading();
			        },
			        complete: e => {
			          console.log("debug log -支付完成->", e);
					  uni.hideLoading();
			        }
			      });
			},
			checkPayback(order_no,item){
			      queryOrder({order_no: order_no}).then(res => {
			        if(res && res.order_status == 2){
			          uni.hideLoading();
					  let {stateTip, stateTipColor} = this.orderStateExp(0);
					  item = Object.assign(item, {
					  	state: 0,
					  	stateTip, 
					  	stateTipColor
					  });
					  //支付订单后删除待付款中该项
					  let list = this.navList[1].orderList;
					  let index = list.findIndex(val=>val.id === item.id);
					  index !== -1 && list.splice(index, 1);
					  if(this.tabCurrentIndex==0){
					  	item.order_status=2;
					  }else{
					  	this.navList[2].orderList=[];
					  	this.navList[2].loadFinish=false;
					  	this.navList[2].nowPage=1;
					  	this.navList[2].loadingType='more';
					  	this.navList[2].loaded=false;
					  }
			        }else{
			          uni.hideLoading();
			        }
			      })
			},
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	uni-modal .uni-modal__bd{      
	    white-space: pre-wrap;      
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.price{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
