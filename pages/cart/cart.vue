<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛...</navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<navigator class="navigator" url="../index/index" open-type="switchTab">加载中...</navigator>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view
						class="cart-item" 
						:class="{'b-b': index!==cartList.length-1}"
					>
						<view class="image-wrapper">
							<image :src="item.img" 
								class="item.loaded"
								mode="aspectFill" 
								@load="onImageLoad('loadCartList', item.id)" 
								@error="onImageError('loadCartList', item.id)"
								@click="navToDetailPage(item)"
							></image>
							<view 
								class="yticon icon-xuanzhong2 checkbox"
								:class="{checked: item.checked}"
								@click="check('item', index)"
							></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.product_name}}</text>
							<text class="attr">{{item.property_value}}</text>
							<text class="price">¥{{item.product_price}}</text>
							<uni-number-box 
								class="step"
								:min="1" 
								:max="item.product_stock"
								:value="item.product_num>item.product_stock?item.product_stock:item.product_num"
								:index="index"
								@change="numberChange"
							></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section" v-if="hasLogin && total>0">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{total}}</text>
					<!-- <text class="coupon">
						已优惠
						<text>74.35</text>
						元
					</text> -->
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniNumberBox from '@/components/uni-number-box.vue'
	import { getCartList,incCart,decCart,delCart,clearCart } from '@/api/cart'
	import { loginWechat } from '@/api/user'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				loadCartList:[]
			};
		},
		// onLoad(){
		// 	this.loadData();
		// },
		onShow(){
			this.loadData();
		},
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods: {
			//请求数据
			async loadData(){
				if(this.hasLogin){
					this.goLoadData();
				}else{
					loginWechat().then(res=>{
						this.goLoadData();
					});
				}
			},
			goLoadData(){
				let list = [];
				getCartList().then(res=> {
						list = res;
						let cartList = list.map(item=>{
							item.checked = true;
							let nowLoaded = '';
							this.loadCartList.map(loadItem=>{
								if(loadItem.item_id==item.id){
									nowLoaded=loadItem.loaded;
								}
							})
							item.loaded=nowLoaded;
							return item;
						});
						this.cartList = cartList;
						this.calcTotal();  //计算总价
				}).catch(err=> { console.log(err) })
			},
			//监听image加载完成
			onImageLoad(index) {
				let exitFlag=false;
				if(this.loadCartList.length>0){
					this.loadCartList.forEach(loadItem=>{
						if(index==loadItem.item_id){
							exitFlag=true;
						}
					})
				}
				if(!exitFlag){
					this.loadCartList.push({
						'item_id':index,
						'loaded':'loaded'
					});
					let list = this.cartList;
					let newCartList=list.map(item=>{
						if(item.id==index){
							item.loaded='loaded';
						}
						return item;
					})
					this.cartList=newCartList;
				}
			},
			//监听image加载失败
			onImageError(index) {
				let list = this.cartList;
				let newCartList=list.map(item=>{
					this.loadCartList.forEach(loadItem=>{
						if(item.id==loadItem.item_id){
							item.img='/static/errorImage.jpg';
						}
					})
					return item;
				})
				this.cartList=newCartList;
			},
			//商品详情
			navToDetailPage(item){
				let id = item.product_id;
				let sku_product_id = item.sku_product_id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}&sku_product_id=${sku_product_id}`
				})
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			 //选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data){
				let nowNumber=data.number;
				if(nowNumber == this.cartList[data.index].product_num){
					return false;
				}
				let cartIndexNum=this.cartList[data.index].product_num;
				if(nowNumber>cartIndexNum){
					//增加
					incCart({cart_id:this.cartList[data.index].id}).then(res=> {
							this.cartList[data.index].product_num = data.number;
							this.calcTotal();
					}).catch(err=> { console.log(err) })
				}else{
					//减少
					decCart({cart_id:this.cartList[data.index].id}).then(res=> {
							this.cartList[data.index].product_num = data.number;
							this.calcTotal();
					}).catch(err=> { console.log(err) })
				}
			},
			//删除
			deleteCartItem(index){
				let list = this.cartList;
				let row = list[index];
				let id = row.id;
				delCart({cart_id:id}).then(res=> {
							this.cartList.splice(index, 1);
							this.calcTotal();
							uni.hideLoading();
					}).catch(err=> { console.log(err) })
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							clearCart().then(res=> {
										this.cartList = [];
								}).catch(err=> { console.log(err) })
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				let list = this.cartList;
				if(list.length === 0){
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						total += item.product_price * item.product_num;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder(){
				let list = this.cartList;
				let goodsData = [];
				list.forEach(item=>{
					if(item.checked){
						goodsData.push({
							id: item.id,
							img: item.img,
							product_id: item.product_id,
							sku_product_id: item.sku_product_id,
							product_num: item.product_num,
							product_price: item.product_price,
							product_name: item.product_name,
							sku_property: item.sku_property,
							property_value: item.property_value,
						})
					}
				})

				uni.navigateTo({
					url: `/pages/order/createOrder?data=${JSON.stringify({
						goodsData: goodsData
					})}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:30upx 40upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
</style>
