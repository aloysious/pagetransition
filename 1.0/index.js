/**
 * @fileoverview webapp页面切换动画工具插件
 * @author shouzuo<aloysious.ld@taobao.com>
 * @module pagetransition
 **/
KISSY.add(function (S, NODE, Base) {
	
	"use strict";

	var PageTransition = {
		
		/**
		 * @brief 左右切换过场动画
		 * @param left         {selector} 舞台左边的page
		 * @param right        {selector} 舞台右边的page
		 * @param isToRight    {Boolean}  true为左至右，false为右至左
		 * @param isDarkenLeft {Boolean}  过场时左边page是否变换亮度
		 * @param offsetLeft   {String}   左边page相对于舞台的偏离度，可以形如'50'或'50%'
		 * @param duration     {Number}   过场持续时间，单位ms
		 * @param easeFn       {String}   动画时间函数，与css3的transition easing一致
		 */
		_slide: function(left, 
					     right, 
						 isToRight, 
						 isDarkenLeft, 
						 offsetLeft, 
						 duration, 
						 easeFn) {

			var offsetStr = offsetLeft.indexOf('%') !== -1? offsetLeft: (offsetLeft + 'px');

			this._polishPage(left);
			this._polishPage(right);
			
			left = NODE.one(left);
			right = NODE.one(right);
			
			right.css({
				'position': 'absolute',
				'top': 0,
				'left': (!isToRight? 0: '100%'),
				'-webkit-transform': 'translate3d(0,0,0)'
			});
			left.css({
				'-webkit-transform': 'translate3d(' + (!isToRight? ('-' + offsetStr): 0)+ ',0,0)'
			});

			if (isToRight) {
				right.show();
			} else {
				left.show();
			}
			
			setTimeout(function() {
				right.css({
					'-webkit-transition': '-webkit-transform ' + duration + 'ms ' + easeFn,
					'-webkit-transform': 'translate3d(' + (!isToRight? '': '-') +'100%,0,0)',
				});
				left.css({
					'-webkit-transition': '-webkit-transform ' + duration + 'ms ' + easeFn,
					'-webkit-transform': 'translate3d(' + (!isToRight? 0: ('-' + offsetStr)) + ',0,0)',
				});
			}, 10);
		
			if (isToRight) {
				this._darken(left, (isDarkenLeft? 0.7: 1), duration, easeFn);
			} else {
				this._brighten(left, 1, duration, easeFn);
			}
			
			setTimeout(function() {
				right.css({
					'position': 'relative',
					'left': 0,
					'-webkit-transition': '',
					'-webkit-transform': ''
				});
				left.css({
					'-webkit-transition': '',
					'-webkit-transform': ''
				});

				if (isToRight) {
					left.hide();
				} else {
					right.hide();
				}
			}, duration + 10);
		},

		_polishPage: function(ele) {
			NODE.one(ele).addClass('ks-pagetrans-view');
		},
		
		/**
		 * @brief 使page变暗
		 * @param selector {selector} 需要处理的page
		 * @param val      {Number}   亮度值，1最亮，0最暗
		 * @param duration {Number}   变暗持续时间
		 * @param easeFn   {String}   动画时间函数
		 *
		 */
		_darken: function(selector, val, duration, easeFn) {
			var con = NODE.one(selector),
				opacity = 1 - val;

			if (!con.one('.ks-pagetrans-mask')) {
				con.append('<div class="ks-pagetrans-mask"></div>');
			}
			
			con.one('.ks-pagetrans-mask').show();
			con.one('.ks-pagetrans-mask').css({
				'-webkit-transition': 'opacity ' + duration + 'ms ' + easeFn
			});
			setTimeout(function() {
				con.one('.ks-pagetrans-mask').css({
					'opacity': opacity
				});
			}, 10);
		},

		/**
		 * @brief 使page变亮
		 * @param selector {selector} 需要处理的page
		 * @param val      {Number}   亮度值，1最亮，0最暗
		 * @param duration {Number}   变亮持续时间
		 * @param easeFn   {String}   动画时间函数
		 *
		 */
		_brighten: function(selector, val, duration, easeFn) {
			var con = NODE.one(selector),
				opacity = 1 - val;

			if (!con.one('.ks-pagetrans-mask')) {
				con.append('<div class="ks-pagetrans-mask"></div>');
			}
			
			con.one('.ks-pagetrans-mask').css({
				'-webkit-transition': 'opacity ' + duration + 'ms ' + easeFn
			});
			setTimeout(function() {
				con.one('.ks-pagetrans-mask').css({
					'opacity': opacity
				});
			}, 10);
			setTimeout(function() {
				con.one('.ks-pagetrans-mask').hide();
			}, duration + 10);
		},

		/**
		 * @brief 元素的一个缩小放大周期
		 * @param left         {selector} 舞台左边的page
		 */
		_scaleUpDown: function(ele, duration, easeFn) {
			ele = NODE.one(ele);

			ele.css({
				'-webkit-animation': 'scaleUpDown ' + duration + 'ms ' + easeFn,
				'-webkit-transform-origin': '50% 0'
			});

			setTimeout(function() {
				ele.css({
					'-webkit-animation': '',
					'-webkit-transform-origin': ''
				});
			}, duration + 100);
		},

		/**
		 * @brief 走马灯过场动画
		 * @param left         {selector} 舞台左边的page
		 * @param right        {selector} 舞台右边的page
		 * @param isToRight    {Boolean}  true为左至右，false为右至左
		 * @param duration     {Number}   过场持续时间，单位ms
		 * @param easeFn       {String}   动画时间函数，与css3的transition easing一致
		 */
		carousel: function(left, right, isToRight, duration, easeFn) {
			this._slide(left, right, isToRight, false, '100%', duration, easeFn);
		},
		
		/**
		 * @brief 仿ios7覆盖式过场动画
		 * @param left         {selector} 舞台左边的page
		 * @param right        {selector} 舞台右边的page
		 * @param isToRight    {Boolean}  true为左至右，false为右至左
		 * @param duration     {Number}   过场持续时间，单位ms
		 * @param easeFn       {String}   动画时间函数，与css3的transition easing一致
		 */
		cover: function(left, right, isToRight, duration, easeFn) {
			this._slide(left, right, isToRight, true, '50', duration, easeFn);
		},

		/**
		 * @brief 仿ios7缩放过场动画
		 * @param from          {selector} 切出的page
		 * @param to            {selector} 切入的page
		 * @param isToExpansion {Number}   切入page放大或缩小，true为放大，false为缩小
		 * @param origin        {Object}   缩放的基准点{x, y}，相对于视窗左上角的坐标
		 * @param duration      {Number}   过场持续时间，单位ms
		 * @param easeFn        {String}   动画时间函数，与css3的transition easing一致
		 */
		popup: function(from, to, isToExpansion, origin, duration, easeFn) {
			var tmp = to;
			
			this._polishPage(from);
			this._polishPage(to);
			
			to = !isToExpansion? NODE.one(from): NODE.one(to);
			from = !isToExpansion? NODE.one(tmp): NODE.one(from);
		
			to.css({
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'-webkit-transform': 'scale(' + (isToExpansion? '0, 0': '1, 1') + ')',
				'z-index': isToExpansion? 9999: -1
			});
			from.css({
				'-webkit-transform': 'scale(' + (isToExpansion? '1, 1': '2, 2') + ')',
				'opacity': (isToExpansion? 1: 0)
			});

			if (isToExpansion) {
				to.show();
			} else {
				from.show();
			}

			setTimeout(function() {
				to.css({
					'-webkit-transition': '-webkit-transform ' + duration + 'ms ' + easeFn,
					'-webkit-transform': 'scale(' + (isToExpansion? '1, 1': '0, 0') + ')',
					'-webkit-transform-origin': origin.x + 'px ' + origin.y + 'px',
				});
				from.css({
					'-webkit-transition': '-webkit-transform ' + duration + 'ms,' + (duration + 350) + 'ms ' + easeFn,
					'-webkit-transform': 'scale(' + (isToExpansion? '2, 2': '1, 1') + ')',
					'-webkit-transform-origin': origin.x + 'px ' + origin.y + 'px',
					'opacity': (isToExpansion? 0: 1)
				});
			}, 10);

			setTimeout(function() {
				to.css({
					'position': 'relative',
					'-webkit-transition': '',
					'-webkit-transform': '',
					'z-index': 0
				});
				from.css({
					'opacity': 1,
					'-webkit-transition': '',
					'-webkit-transform': '',
					'-webkit-transform-origin': ''
				});

				if (isToExpansion) {
					from.hide();
				} else {
					to.hide();
				}
			}, duration + 100);
		},

		rotate: function(from, to, duration, easeFn) {
			var parent;

			from = NODE.one(from);
			to = NODE.one(to);
			parent = from.parent();

			this._polishPage(from);
			this._polishPage(to);

			to.show();

			parent.css({
				'-webkit-perspective': 1000
			});
			to.css({
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'-webkit-transform': 'rotateY(-180deg)',
				'-webkit-backface-visibility': 'hidden'
			});
			from.css({
				'-webkit-transform': 'rotateY(0deg)',
				'-webkit-backface-visibility': 'hidden'
			});

			setTimeout(function() {
				to.css({
					'-webkit-transition': '-webkit-transform ' + duration + 'ms ' + easeFn,
					'-webkit-transform': 'rotateY(0deg)'
				});
				from.css({
					'-webkit-transition': '-webkit-transform ' + duration + 'ms ' + easeFn,
					'-webkit-transform': 'rotateY(180deg)'
				});
			}, 10);

			setTimeout(function() {
				to.css({
					'position': 'relative',
					'-webkit-transition': '',
					'-webkit-transform': ''
				});
				from.css({
					'position': 'relative',
					'-webkit-transition': '',
					'-webkit-transform': ''
				});
				from.hide();
			}, duration + 100);
		},

		scaleSwitch: function(left, right, isToRight, duration, easeFn) {
			left = NODE.one(left);
			right = NODE.one(right);

			this._polishPage(left);
			this._polishPage(right);

			right.css({
				'position': 'absolute',
				'top': 0,
				'left': (!isToRight? 0: '110%')
			});

			var leftAnim = '@-webkit-keyframes leftAnim {' +
								'0% {-webkit-transform: scale(1,1) translate3d(' + (!isToRight? '-110%': 0) + ',0,0);}' +
								'30% {-webkit-transform: scale(0.85,0.85) translate3d(' + (!isToRight? '-110%': 0) + ',0,0);}' +
								'100% {-webkit-transform: scale(1,1) translate3d(' + (!isToRight? 0: '-110%') + ',0,0);}' +
							'}',
				rightAnim = '@-webkit-keyframes rightAnim {' +
								'0% {-webkit-transform: scale(1,1) translate3d(0,0,0);}' +
								'30% {-webkit-transform: scale(0.85,0.85) translate3d(0,0,0);}' +
								'100% {-webkit-transform: scale(1,1) translate3d(' + (!isToRight? '': '-') + '110%,0,0);}' +
							'}';

			if (document.styleSheets && document.styleSheets.length) {
				this._deleteStyleRule('leftAnim');
				this._deleteStyleRule('rightAnim');
				document.styleSheets[0].insertRule(leftAnim);
				document.styleSheets[0].insertRule(rightAnim);
			
			} else {
				var styleTag = document.createElement('style');
				styleTag.innerHTML = leftAnim + rightAnim;
				document.getElementByTagName('head')[0].appendChild(styleTag);
			}

			if (isToRight) {
				right.show();
			} else {
				left.show();
			}

			right.css({
				'-webkit-animation': 'rightAnim ' + duration + 'ms ' + easeFn,
				'-webkit-transform-origin': '50% 100px'
			});
			left.css({
				'-webkit-animation': 'leftAnim ' + duration + 'ms ' + easeFn,
				'-webkit-transform-origin': (!isToRight? '-50%': '50%') + ' 100px'
			});

			setTimeout(function() {
				
				if (isToRight) {
					left.hide();
				} else {
					right.hide();
				}
				
				right.css({
					'position': 'relative',
					'left': 0,
					'-webkit-animation': '',
					'-webkit-transform-origin': ''
				});
				left.css({
					'-webkit-animation': '',
					'-webkit-transform-origin': ''
				});

			}, duration);
			
		},

		_deleteStyleRule: function(ruleName) {
			var rules = document.styleSheets[0].rules;
			S.each(rules, function(rule, index) {
				if (rule.name === ruleName) {
					document.styleSheets[0].deleteRule(index);
					return false;
				}
			});
		}

	};

	return PageTransition;

}, {requires:['node', 'base', './index.css']});



