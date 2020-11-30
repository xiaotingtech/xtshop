const globalPul = {
	install: function(Vue, pluOp = {}) {
		// 全局点击事件监听阻止
		Vue.directive('preventReClick', {
			inserted(el, binding) {
				el.addEventListener('click', (e) => {
				if (!el.$disabled) {
						el.$disabled = true;
						el.$click=[...el.events.click];
						el.events.click = [];
						setTimeout(() => {
							el.events.click = el.$click;
							el.$disabled = false;
					
						}, binding.value || 1000)
					
					}
				})
			}
		})
	}
};

export default globalPul
