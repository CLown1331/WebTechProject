/*
 * JadeWits ARI (Accelerated Responsive Images)
 *
 * Copyright (c) 2017 Nafiul Alam Chowdhury
 * Distribution Prohibited
 *
 * http://jadewits.com/team/nafi
 *
 * Version: 1.0.0
 */
(console.info || console.log).call(console,
	'Powered by JadeWits ARI 🍁 – Version 1.0.0',
	self.location.href);
(function ( $ ) {
	var selectors = [];

	var check_binded = false;
	var check_lock = false;
	var defaults = {
		interval     : 250,
		force_process: false
	};
	var $window = $( window );

	var $prior_appeared = [];

	function appeared( selector ) {
		return $( selector ).filter( function () {
			return $( this ).is( ':appeared' );
		} );
	}

	function process() {
		//console.log($prior_appeared);
		check_lock = false;
		for ( var index = 0, selectorsLength = selectors.length; index < selectorsLength; index ++ ) {
			var $appeared = appeared( selectors[index] );

			$appeared.trigger( 'appear', [$appeared] );
			if ( $prior_appeared[index] ) {
				var $disappeared = $prior_appeared[index].not( $appeared );
				$disappeared.trigger( 'disappear', [$disappeared] );
			}
			$prior_appeared[index] = $appeared;
		}
	}

	function add_selector( selector ) {
		selectors.push( selector );
		$prior_appeared.push();
	}

	// "appeared" custom filter
	$.expr[':'].appeared = function ( element ) {
		var $element = $( element );
		if ( ! $element.is( ':visible' ) ) {
			return false;
		}

		var window_left = $window.scrollLeft();
		var window_top = $window.scrollTop();
		var offset = $element.offset();
		var left = offset.left;
		var top = offset.top;

		if ( top + $element.height() >= window_top &&
			top - ($element.data( 'appear-top-offset' ) || 0) <= window_top + $window.height() &&
			left + $element.width() >= window_left &&
			left - ($element.data( 'appear-left-offset' ) || 0) <= window_left + $window.width() ) {
			//console.log($element.data('ari'));
			return true;
		} else {
			return false;
		}
	};

	$.fn.extend( {
		// watching for element's appearance in browser viewport
		appear: function ( options ) {
			var opts = $.extend( {}, defaults, options || {} );
			var selector = this.selector || this;
			if ( ! check_binded ) {
				var on_check = function () {
					if ( check_lock ) {
						return;
					}
					check_lock = true;

					setTimeout( process, opts.interval );
				};

				$( window ).scroll( on_check ).resize( on_check );
				check_binded = true;
			}
			process();
			if ( opts.force_process ) {
				setTimeout( process, opts.interval );
			}
			add_selector( selector );
			return $( selector );
		}
	} );

	$.extend( {
		// force elements's appearance check
		force_appear: function () {
			if ( check_binded ) {
				process();
				return true;
			}
			return false;
		}
	} );
})( function () {
	if ( typeof module !== 'undefined' ) {
		// Node
		return require( 'jquery' );
	} else {
		return jQuery;
	}
}() );

/*ARI CORE*/
var jwARI = {
	layouts: {
		'120' : 120,
		'200' : 200,
		'320' : 320,
		'400' : 400,
		'640' : 640,
		'800' : 800,
		'1000': 1024
	},
	threshold: 50,
	galid:0,
	caption: function ( title, caption ) {
		return ( title || caption ? ('<span class="jw_media_caption">' + ( title ? '<span class="tt">' + title + '</span>' : '') + (caption ? '<span class="cc">' + caption + '<span>' : '' ) + '</span>') : '')
	},
	calculate: function ( $ari, $img, $path ) {
		//calculate parent width and define source
		/*console.log($ari[$path]);*/
		$( $img ).attr( 'src', $ari[$path] );
	},
	getImagePath: function ( $ob, $w, $h ,$f) {
		var $data = $($ob ).data('ari');
		if ( ! $data.hasOwnProperty( 'layouts' ) ) $data['layouts'] = this.layouts;
		var w = 0,h;
		//console.log($w+'x'+$h+' '+w+'x'+h);
		if($data.hasOwnProperty('fx_width') && $f!='ignore'){
			$w = $data.fx_width;
			h = $h;
		}
		else{
			for ( var i in $data['layouts'] ) {
				if ( $data['layouts'][i] + this.threshold > $w ) {
					w = $data['layouts'][i];
					break;
				}
				w = $data['layouts'][i];
			}
			h = this.ratio( $h, $w, w );
		}
		if($w<$h) {
			w = 0;
			$($ob ).width('auto' ).css({display:'inline-block'});
		}
		return this.mResize( $data['path'], w.toString() + 'x' + h.toString() + 'x1' );
	},
	ariFullscreen: function ( a, $ob ) {
		var $ari = $ob.data('ari');
		//console.log($ari);
		a.addClass( 'pop-media-holder' );
		a.data( 'image', this.getImagePath( $ob, 1024, 0, 'ignore' ) ); //need to work on the full screen reso
		a.data( 'url', $ari.url ); //need to work on the full screen reso
		a.data( 'caption',  $ari.caption?$ari.caption:$ari.title); //need to work on the full screen reso
		//console.log( a.data());
		// lutions
	},
	otherFeatures: function ( $ob ) {
		var $ari = $ob.data( 'ari' );
		var a = $( '<a>' ).addClass( 'jw_media_holder media_image' ).addClass( $ari['pushClass'] ).addClass( $ari['align_current']?$ari['align_current']:$ari['align'] );//.width($ob.width());
		if ( $ari.hasOwnProperty( 'wrapCaption' ) ) {
			if ( $ari.link ) {
				a.attr( 'target', $ari['target'] );
				if ( $ari.link.search( /http/g ) < 0 ) $ari.link = jw_base_url + $ari.link;
				a.attr( 'href', $ari.link );
			}
			else {
				this.ariFullscreen( a, $ob );
			}
		}
		else if ( $ari.hasOwnProperty( 'fullscreen' ) ) {
			this.ariFullscreen( a, $ob );
		}
		else return;
		$( $ob ).wrap( a );
		$( $ob ).parent().width($( $ob ).width()).append( $ari.wrapCaption );//.css({width:prop.width?prop.width:'100%',height:prop.height?prop.height:'auto'});
		$( $ob ).addClass( 'ari-fix' ).data('parent_width',$($ob ).parent().width());
		if($ari.hasOwnProperty('viewPort')) $($ob ).data('viewport_width',$($ari['viewPort'] ).width());
		if($ari.hasOwnProperty('id')) $ob.attr('id','image-'+$ari.id);
	},
	fix: function () {
		$('.content-gal-wrap' ).each(function(){
			//content-gal-wrap
			var $a = $(this ).data('ari');
			if($(this ).data('viewport_width')==$($a.viewPort ).width()){
				return;
			}
			var zum = ($($a.viewPort ).width()/$(this ).data('viewport_width'));
			//console.log(zum);
			$(this ).css({zoom:zum});
		});
		$( '.ari-fix' ).each( function () {
			var $ari = $(this ).data('ari');

			if($ari['align']=='alignfull'){
				if($(this ).data('parent_width')==$(this ).parent().width()) return;
				//console.log($(this ).data('parent_width')+' '+$(this ).parent().width());
				var width = $(this ).width();
				$(this ).width(jwARI.ratio($(this ).width(),$(this ).data('parent_width'),$(this ).parent().width()));
				$(this ).height(jwARI.ratio($(this ).height(),width,$(this ).width()));
				$(this ).data('parent_width',$(this ).parent().width());
			}else{
				if($(this ).data('viewport_width')==$($ari['viewPort'] ).width()){
					return;
				}
				if($($ari['viewPort'] ).width()*0.62>$(this ).width()){
					$(this ).parent().removeClass('alignfull').addClass($ari['align']);
				}else{
					$(this ).parent().removeClass($ari['align'] ).addClass('alignfull');
					var width = $(this ).width();
					if(width>$($ari['viewPort'] ).width()) {
						$( this ).width( jwARI.ratio( $( this ).width(), $( this ).data( 'parent_width' ), $( this ).parent().width() ) );
						$( this ).height( jwARI.ratio( $( this ).height(), width, $( this ).width() ) );
						$( this ).data( 'parent_width', $( this ).parent().width() );
					}
				}
				$(this ).data('viewport_width',$($ari['viewPort'] ).width());
			}
		} );
	},
	main_image: function ( $ob ) {
		var $this = this;
		$ob.appear().on( 'appear', function () {
			if ( $( this ).data( 'ari-processed' ) ) return;
			$( this ).data( 'ari-processed', 1 );
			var img = $( this ).children( 'img' ).hide();
			var $data = $( this ).data( 'ari' );
			var $w = Math.floor( $( this ).width() );
			var $h = Math.floor( $( this ).height() );
			img.attr('alt',$data['alt']);
			//Desigred Width Height for image
			$data['path'] = $this.getImagePath( $(this), $w, $h );
			$this.calculate( $data, img, 'path' );
			img.on( 'load', function () {
				//console.log($( this ).attr('src'));
				var $ari = $( this ).parent().data( 'ari' );
				if ( $ari.hasOwnProperty( 'wrapCaption' ) || $ari.hasOwnProperty( 'fullscreen' ) ) {
					$( this ).parent().off( 'appear' );
				}
				else $( this ).parent().off( 'appear' ).replaceWith( $( this ) )
				/*.addClass( 'ari-loaded' );
				 $( this ).parent().css({width:'auto',height:'auto'});*/
				$( this ).show();
			} ).on( 'error', function () {
				var bg = $( this ).parent().css( 'background-image' ).replace( 'url(', '' ).replace( ')', '' ).replace( /\"/gi, "" );
				$( this ).attr( 'src', bg );
				$( this ).show();
			} );
		} );
	},
	mResize: function ( path, opt ) {
		if (path.match(/^(https?:)?\/\//m)) {
			return path;
		}
		return jw_cdn_url + 'contents/cache/images/' + opt + '/uploads/' + path;
	},
	ratio: function ( want, by, value ) {
		return Math.floor( (want / by) * value );
	},
	gallery:function($ob,$ari){
		var id = 'gal'+$ari.id.toString()+(this.galid++).toString();
		var width = $ari.width?($ari.width>$ob.parent().width()*0.70?$ob.parent().width():$ari.width):$ob.parent().width();
		var height = this.ratio(9,16,width);
		var $wrap = $('<span>' ).attr('id',id ).addClass('swiper-container content-gal' ).addClass($ari.align).css({width:width,height:height}).css('overflow','hidden');
		$ob.replaceWith($wrap);
		var $main = $('<span>' ).addClass('swiper-wrapper' ).css('overflow','visible');
		$wrap.append($main);
		for(var i in $ari.gallery){
			var each = $('<span>' ).addClass('swiper-slide pop-each' );
			var photo = $('<span>' ).addClass('photo' );
			var span = $('<span>' ).addClass('ari-gal').data('ari',$.extend($ari.gallery[i],{width:width,height:height}));
			each.append(photo ).append(this.caption($ari.gallery[i].name,$ari.gallery[i].caption));photo.append(span);
			$main.append(each);
		}
		$wrap.append('<span class="swiper-button-next"></span><span class="swiper-button-prev"></span>');
		var swiper = new Swiper('#'+id, {
			width:width,height:height,
			onSlideChangeStart:function(swiper){
				$.force_appear();
			},
			onInit:function(s){
				//var container = s.container;
				$('#'+id).find('.ari-gal' ).each(function(){
					jwARI.fetch($(this));
				});
			},
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev'
		});
		var $link = $('<span>' ).data('ari',$ari ).css({overflow:'visible',textAlign:'right',background:'#fff'} ).addClass('content-gal-wrap' ).data('viewport_width',$($ari.viewPort ).width());;
		$wrap.wrap($link);
		if($ari.detail_url)$('<a href="'+$ari.detail_url+'">আরও ছবি&nbsp;</a>' ).insertAfter($wrap);
	},
	fetch: function ( $ob ) {
		var $this = this;
		var $ari = $ob.data( 'ari' );
		if($ari.hasOwnProperty('type') && $ari.type=='gallery'){
			this.gallery($ob,$ari);
			return;
		}
		if ( ! $ari.hasOwnProperty( 'width' ) || ! $ari.width )  $ari['width'] = $ob.parent().width();
		else if($ari.width>$ob.parent().width()){
			if($ari.hasOwnProperty('height')) {
				//console.log($ob.data( 'ari' ));
				//console.log($ari.width+'x'+$ari.height);
				$ari.height = this.ratio($ari.height,$ari.width,$ob.parent().width());
				//console.log($ob.parent().width()+'x'+$ari.height);
			}
			$ari.width = $ob.parent().width();
		}
		if ( $ari.hasOwnProperty( 'ratio' ) ) {
			/*$ari['width'] = '100%';
			 $ari['padding'] = $this.ratio($ari['ratio'][1], $ari['ratio'][0], 100);*/
			$ari['height'] = $this.ratio( $ari['ratio'][1], $ari['ratio'][0], $ari['width'] );
		}
		var $tmp = $( '<img>' ); //need modifiation for tall images
		var $wrap = $( '<span class="jw-ari">' ).data( 'ari', $ari ).width( $ari['width'] );
		$wrap.append( $tmp );
		$( '[data-id="' + $ob.attr( 'id' ) + '"]' ).remove();
		$ob.replaceWith( $wrap );
		this.otherFeatures( $wrap );
		/*Beginning the fake image load*/
		if ( ! $ari.hasOwnProperty( 'height' ) || ! $ari.height ) {
			$ari['before'] = $this.mResize( $ari['path'], '24x0x0xcx15' )
			//console.log($ari);
			//Working with low res file
			$tmp.hide();
			$tmp.on( 'load', function () {
				var $w = $( this ).width();
				var $h = $( this ).height();
				$( this ).parent().height( $this.ratio( $h, $w, $( this ).parent().width() ) );
				$this.fix($wrap);
				$this.main_image( $wrap );
				$tmp.off( 'load' );
			} );
			$this.calculate( $ari, $tmp, 'before' );
		}
		//End of the Fake image load
		else {
			if ( $ari.hasOwnProperty( 'padding' ) ) {
				$wrap.css( 'padding-bottom', $ari['padding'] + '%' );
				$ari['height'] = $wrap.outerWidth();
			} else {
				$wrap.height( $ari['height'] );
			}
			$this.main_image( $wrap );
		}
	}
}
$( window ).resize( jwARI.fix );
$(function(){
	$.force_appear();
});