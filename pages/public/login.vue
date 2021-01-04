<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">XTSHOP</view>
			<view class="welcome">
				欢迎您！
			</view>
			<button openType="getUserInfo" class="input-content">
				<view v-if="!hasLogin" class="login_view">
					<image src="/static/login.png" mode="aspectFit" class="login_img"></image>
				</view>
				<view v-if="!hasLogin" class="login_view" @click="toLogin">
					<text class="login_text">点我授权</text>
				</view>
			</button>
			<button v-if="!hasLogin" class="input-content" @click="navBack">
				<view class="login_view">
					<text class="login_cancel text-error">取消登录</text>
				</view>
			</button>
		</view>
	</view>
</template>

<script>
	import {  
        mapMutations  
    } from 'vuex';
	import { loginWechat,updateInfo } from '@/api/user'
	
	export default{
		data(){
			return {
				logining: false
			}
		},
		onLoad(){
			
		},
		methods: {
			...mapMutations(['login']),
			navBack(){
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			async toLogin(){
				this.logining = true;
				let that=this;
				uni.showModal({
				    title: '是否要登录？',
				    content: '登录将获取您的微信用户信息',
				    success: function (res) {
				        if (res.confirm) {
								uni.login({
								    provider: "weixin",
								    success: loginRes => {
								      console.log('debug log --> ', loginRes)
									  loginWechat({code:loginRes.code}).then(codeRes=> {
										if(codeRes.result.is_bind==1){
											uni.navigateBack();
											return false;
										} 
										uni.getUserInfo({
										        provider: "weixin",
										        success: (infoRes) => {
										            updateInfo({
										              iv: infoRes.iv,
										              encrypted_data: infoRes.encryptedData
										            }).then(res => {
														that.login(res);
														uni.navigateBack();
										            }).catch(err => {
										              console.log('debug log --> ', err)
										              uni.showToast({
										                title: err.errMsg,
										                icon: "none",
										                duration: 2000
										              })
										            })
										        },
										        fail: () => {
										            uni.showToast({
										              title: '用户信息获取失败',
										              icon: 'none',
										              duration: 2000
										            })
										        }
										  })
									  }).catch(err=> { 
										  uni.showToast({
										    title: '登陆失败',
										    icon: "none",
										    duration: 2000
										  })
										  that.logining = false;
										})
								    },
								    fail: (loginErr) => {
								      console.log('debug log --> ', loginErr)
								      uni.showToast({
								        title: loginErr.errMsg,
								        icon: "none",
								        duration: 2000
								      })
									  that.logining = false;
								    }
							})
				        } else{
							that.logining = false;
							uni.switchTab({
								url: '/pages/index/index'
							})
				        }
				    }
				});
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -90upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 50px 50px 50px 50px;
		}
		&:after{
			position: absolute;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 50px 50px 50px;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -20upx;
		bottom: 200upx;
		z-index: 99;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #d0d1fd;
		}
		&:before{
			transform: rotate(0deg);
			border-radius: 0 0 0 0;
		}
		&:after{
			position: absolute;
			top: 200upx;
			transform: rotate(90deg);
			border-radius: 0 0 0 0;
			/* background: pink; */
		}
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		border:none;
		overflow: visible;
		padding: 0;
		height:200upx;
		justify-content: center;
		color: $font-color-spec;
		background-color: #FFF;
		&:after{
			border:none;
		}
		.login_view{
			justify-content: center;
			text-align: center;
			.login_img{
				width:100upx;
				height:100upx;
				flex-direction: column;
			}
			.login_text{
				width:100%;
				color: $font-color-spec;
				flex-direction: column;
			}
		}
		.login_cancel{
			margin-top:50rpx;
			color: red;
		}
	}
</style>
