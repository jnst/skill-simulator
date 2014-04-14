/* global.js
------------------------------------------------------------------------------*/
/*
function getCookie(cookieName){
var cookies=document.cookie;
if(cookies.indexOf(cookieName)==-1)return false;
cookie=cookies.substr(cookies.indexOf(cookieName));
cookie=cookie.split(';')[0];
cookie=cookie.substr(cookie.indexOf('=')+1);
return cookie;
}

function setCookie( name, value, expiredays )
{
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}*/
function getStyleAtt(obj,stylePrp){
var att="";
if(obj.currentStyle){
stylePrp=stylePrp.replace(/\-(\w)/g,function(k,z){return z.toUpperCase();});
att=obj.currentStyle[stylePrp];
}
else if(document.defaultView&&document.defaultView.getComputedStyle){
att=document.defaultView.getComputedStyle(obj,null).getPropertyValue(stylePrp);
}
return att;
}

//popup
function openPopup(obj,objWidth,objHeight,objName,objScroll,deny,objFull,addParam){
try{
	if (objScroll!==1&&objScroll!==0&&objScroll!=='1'&&objScroll!=='0') {
		var objScrollCopy=objScroll;
		objScroll=objName;
		objName=objScrollCopy;
	}

	if(typeof(obj)=='string'){
		var setup="width="+objWidth+",height="+objHeight+",toolbar=no,location=no,status=no,menubar=no,top=20,left=20,scrollbars="+objScroll+",resizable=no";
		if(objName==""||!objName)objName="popup";
		if(objFull)setup="fullscreen=1,scrollbars=0";
		var win=window.open(obj,objName,setup);
		if(win!=null)
		win.focus();
		return win;
	}
	if(!objName)objName="popup";
	if(!objScroll)objScroll="auto";
	var url=addParam?obj.href+'?'+addParam:obj.href;
	var setup="width="+objWidth+",height="+objHeight+",toolbar=no,location=no,status=no,menubar=no,top=20,left=20,scrollbars="+objScroll+",resizable=no";
	if(objFull)setup="fullscreen=1,scrollbars=0";
	var win=window.open(url,objName,setup);
	if(deny){
	if(win==null)alert('ポップアップブロックを解除してください.');
	else win.focus();
	}

	return win;
}
catch(e){}
}

/* bns.js
------------------------------------------------------------------------------*/
/* 롤링배너 develop by dentibes */
	var rollingData = function( option ) {
		this.opt = option || {};
		this.init();
	};
	rollingData.prototype = {
		init: function() {
			if ( !this.opt.banner ) {
				return;
			}
			this.old = this.ing = this.loop = null;
			this.opt.time = this.opt.time || 4000;
			this.now = this.opt.startAt || 0;
			this.opt.fn = this.opt.fn || [ 'basic' ];
			this.opt.term = this.opt.term || 0;
			this.prepare();
		},
		prepare: function() {
			$( this.opt.banner + ' .hidden').remove();
			$( this.opt.banner ).find( this.opt.bannerFind ).hide().has( 'img[src="about:blank"]' ).remove();
			this.banners = $( this.opt.banner ).find( this.opt.bannerFind );
			this.total = this.banners.length - 1;

			this.pager = $( this.opt.page );

			if (this.total <1) this.pager.hide()
			else this.pager.show();

			for ( var i = 0, ins = $( this.opt.page ); i <= this.total; i++ ) {
				// ins.append( '<a href="' + $(this.banners[i]).find("a").attr("href") + '">' + i + '</a>' );
				ins.append( '<a>' + i + '</a>' );
			}
			this.pages = $( this.opt.page + ' a');

			var _this = this;
			this.loop = function() {
				_this.old = _this.now;
				_this.now = _this.now >= _this.total ? 0 : _this.now + 1;
				if(!_this.total) return;
				_this.eff();
				_this.ing = setTimeout( _this.loop, _this.opt.time );
			}
			this.evtBind();
			this.start();
		},
		evtBind: function() {
			var _this = this;
			$( [this.pages, this.banners] ).each(function() {
				var target = this;
				target.bind({
					mouseover: function() { on( target, target.index( this ) ) },
					focusin: function() { on( target, target.index( this ) ) },
					mouseout: restart,
					focusout: restart
				});
			});
			function on( target, index ) {
				_this.stop();
				if ( target === _this.pages && _this.now !== index ) {
					_this.old = _this.now;
					_this.now = index;
					_this.eff();
				}
			}
			function restart() { _this.ing = setTimeout( _this.loop, _this.opt.time ) }
			$(this.opt.banner).find('.prevPage').bind('click', function() {
				_this.prev();
			});
			$(this.opt.banner).find('.nextPage').bind('click', function() {
				_this.next();
			});
		},
		start: function() {
			this.eff();
			this.banners.eq( this.now ).show();
			this.pages.eq( this.now ).attr( 'class', this.addOn );

			var me = this;
			setTimeout( function(){
				me.ing = setTimeout( me.loop, me.opt.time );
			}, this.opt.term );
		},
		eff: function() {
			for ( var i = 0; i < this.opt.fn.length; i++ ) {
				if ( this[ this.opt.fn[i] ] ) {
					this[ this.opt.fn[i] ]();
				}
			}
			if ( this.ing ) {
				this.pages.eq( this.old ).attr( 'class', this.rmvOn );
				this.pages.eq( this.now ).attr( 'class', this.addOn );
			}
		},
		stop: function() { clearTimeout( this.ing ); },
		addOn: function( i, v ) { if(!v) v=""; return v + 'on'; },
		rmvOn: function( i, v ) { if(!v) v=""; return v.replace( 'on', '' ); },
		basic: function() {
			if ( !this.ing ) {
				return;
			}
			this.banners.eq( this.old ).hide();
			this.banners.eq( this.now ).show();
		},
		next: function() {
			this.stop();
			this.old = this.now;
			this.now = this.now >= this.total ? 0 : this.now + 1;
			this.eff();
			this.ing = setTimeout( this.loop, this.opt.time );
		},
		prev: function() {
			this.stop();
			this.old = this.now;
			this.now = this.now <= 0 ? this.total : this.now - 1;
			this.eff();
			this.ing = setTimeout( this.loop, this.opt.time );
		}
	};

	rollingData.prototype.fadeInOut = function() {
		if ( !this.ing ) {
			this.banners.show().css( 'zIndex', '0' );
			this.banners.eq( this.now ).css( 'zIndex', '2' );
			return;
		}
		var _this = this;
		this.banners.eq( this.now ).css( 'zIndex', '1' );
		this.banners.eq( this.old ).animate( { 'opacity': 0 }, {
			duration: 1000,
			queue: false,
			complete: function() {
				$( this ).css( { 'opacity': 1, 'zIndex': '0' } );
				_this.banners.eq( _this.now ).css( 'zIndex', '2' );
			}
		});
	};

/* 게시판 */
var device = null;
device = $("html").attr("id");
var viewer, imageIdx = 0;

function popView(src) {
	if (device == "pc")
	{
		if(!viewer){
			
			var fileInfo = /^http:\/\/(?:rc.)*imgfiles.plaync.co.kr\/file\/(.*)\/download\/.*/.exec(src);
			
			viewer = new nc.playinG.ImageViewer(document.body, {isComment: false, channel: (fileInfo && fileInfo[1])?fileInfo[1]: 'Snow3'});
		}
		viewer.onLoaded.removeAll();
		viewer.onLoaded.add(function(){
			for(var i = 0; images[i]; i++){
				if(src === images[i].src){imageIdx = i;break;}
			}

			if(imageIdx)
				viewer.setSelectImageByIndex(imageIdx);

			viewer.show();
		}, window);

		
		var imagesArr = [], images = $(".editorAttachedImage");

		for(var i = 0; images[i]; i++){
			imagesArr.push(images[i].src);
		}
		viewer.setImages([{
			id: '',
			length: images.length,
			albumNm: '',
			albumUrl: '',
			list: imagesArr
		}]);
	} else {
		//srcOrgin = src.replace( '/download_mobile/', '/download/' );
		document.location.href = "/bns/doc/view_image?url=" + src;
	}
}
function resizeImage(img){
	var maxImageWidth = $(".viewArticle").width();
	if(img.width > maxImageWidth) {
		img.style.width = maxImageWidth + 'px';
		img.width = maxImageWidth;
	}
}

/* layout.js */
function bnsLayerLogin() {
	if (jQuery.browser.mobile) {
		return;
	}
	if( $('#bnsLayerLogin').length == 0 ) {
		$.ajax({
			type:'post', url:'/bns/ajax/login_layer', cache:false,
			success: function (response) {
				$(document.body).append(response);
			},
			complete: function (response) {}
		});
	}
	checkLoginPlugin();
	if(IsPluginInstalled()==SUCCESS_RUN){
		var browsersize = setLayerModal.getBrowserSize();
		var scrollposition = setLayerModal.getScroll();
		var divWidth = jQuery('#bnsLayerLogin').width();
		var divHeight = jQuery('#bnsLayerLogin').height();
		var _left = ((browsersize.width-divWidth)/2);
		var _top=((browsersize.height-divHeight)/2);
		setLayerModal.open();

		jQuery('#bnsLayerLogin').css({
			display:'block',
			position:'fixed',
			left:(_left)+'px',
			top:(_top)+'px',
			zIndex:100006
		});
		jQuery('#id').focus();
	}
}
