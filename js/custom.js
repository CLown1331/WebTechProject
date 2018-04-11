var dayOffset = 3;
var month_names = {
	'bn':{
		1:'জানুয়ারি',
		2:'ফেব্রুয়ারি',
		3:'মার্চ',
		4:'এপ্রিল',
		5:'মে',
		6:'জুন',
		7:'জুলাই',
		8:'আগস্ট',
		9:'সেপ্টেম্বর',
		10:'অক্টোবর',
		11:'নভেম্বর',
		12:'ডিসেম্বর'
		},
	'en':{
		1:'January',
		2:'February',
		3:'March',
		4:'April',
		5:'May',
		6:'June',
		7:'July',
		8:'August',
		9:'September',
		10:'October',
		11:'November',
		12:'December'
		}
	};
	
var mDays = new Array(13);
	mDays[1] = 31;
	mDays[2] = 29;
	mDays[3] = 31;
	mDays[4] = 30;
	mDays[5] = 31;
	mDays[6] = 30;
	mDays[7] = 31;
	mDays[8] = 31;
	mDays[9] = 30;
	mDays[10] = 31;
	mDays[11] = 30;
	mDays[12] = 31;

var bDays = new Array(11);
	bDays[0] = '০';
	bDays[1] = '১';
	bDays[2] = '২';
	bDays[3] = '৩';
	bDays[4] = '৪';
	bDays[5] = '৫';
	bDays[6] = '৬';
	bDays[7] = '৭';
	bDays[8] = '৮';
	bDays[9] = '৯';

function banglaNumber(v){
	//IE7 FIX, IE7 does not index string
	v = v.toString();
	v = v.split("");
	var bangla = "";
	$(v).each(function(index, element) {
		if(parseInt(element)>=0 && parseInt(element)<=9)
			bangla += bDays[element];
		else
			bangla += element;
		});
	return bangla;
	}

function languageNumber(v,l){
	if( l == 'bn' ){
		return banglaNumber(v);
		}
	else{
		return v;
		}
	}
	
	
var jw_inputs_init = function(parent_selector){
	/*fancy inputs*/
	var parent_container = $(parent_selector);
	$("div.option", parent_container).each(function(index, element) {
		$(element).find("div.text").html( $(this).find("select:first option[value='"+ $(this).find("select:first").val() +"']").html() );
		$("select:first",element).change(function(){
			$(this).parent().find("div.text").html($(this).find("option[value='"+ $(this).val() +"']").html());
			});
	});

	$("div.file", parent_container).find("input:first").change(function(){
		$(this).css("top","-18px");
		var a=$(this).val().replace(/^.*\\/,"").substr(0,24);
		$(this).parent().find("div.text").html(a);
		});

	$(".datetimepicker", parent_container).datetimepicker({dateFormat: 'yy-mm-dd',timeFormat: "HH:mm"});
	$(".datepicker", parent_container).datepicker({dateFormat: 'yy-mm-dd'});

	$("div.date", parent_container).each(function(index, element) {
		$("input:first",element).change(function(){
			/*if(BrowserDetect.browser!="Explorer"){
				$(this).css("top","-21px");
				}
			else{
				if(BrowserDetect.version>7){
					$(this).css("top","-21px");
				}else{
					$(this).css("top","-10px");
					}
				}*/
			$("div.text",$(this).parent()).html($(this).val());
			});
		$("div.text",this).html($("input:first",this).val());
	});
	}


$(function(){
	$("table.global tbody tr").mouseenter(function(){
		$(this).css("background","#f9f9f9");
		});
	
	$("table.global tbody tr").mouseleave(function(){
		$(this).css("background","#ffffff");
		});
	
	$(".notifications").click(function(){
		$(this).fadeOut("slow");
		});
		
	
	//initialize the inputs on document load
	jw_inputs_init('body');
	
});

/*cookie controler*/
function setCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
		}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
	}

function setCookieSeconds(name,value,sec) {
	if( sec ){
		var date = new Date();
		date.setTime(date.getTime()+(sec*1000));
		var expires = "; expires="+date.toGMTString();
		}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
	}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i < ca.length; i++){
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
	return null;
	}
function deleteCookie(name) { createCookie(name,"",-1); }
/*cookie controller*/
function login_expire_refresh(){ 
	if( !getCookie('jw_session') && !getCookie('PHPSESSID') && !getCookie('jadewits_cross_cookie') && !getCookie('jadewits_no_login_expire_check') ){
		setCookieSeconds( 'jadewits_no_login_expire_check', 'yes', 0 );
		window.location.href += ''; 
		}
	}
	

var jw_bn_convert = function(n,ln){
	if( !ln || ln == 'en' ) return n;
	var bn = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
	var str = String(n);
	var ret = '';
	for( i in str ){
		ret += bn[str[i]];
		}
	return ret;
	}
	
var jw_limit_text_chars = function(o){
	var ths = new Object();
	ths.element = o.element?o.element:'';
	ths.char_limit = o.char_limit?o.char_limit:160;
	ths.language = o.language?o.language:'en';
	if( !ths.element ) return false;
	
	ths.char_counter = function(){
		var comment_char_counter = $(this).parent().find('.comment_char_count');
		if( !comment_char_counter.length ){
			$(this).before('<div class="comment_char_count p10" align="left"></div>');
			comment_char_counter = $(this).parent().find('.comment_char_count');
			}
		
		if( ths.char_limit < $(this).val().length ){
			$(this).val($(this).val().substring(0,ths.char_limit-1));
			}
		
		comment_char_counter.html(jw_bn_convert($(this).val().length,ths.language) + ' / ' + jw_bn_convert(ths.char_limit,ths.language));
		}

	$(ths.element).live('keypress',ths.char_counter).live('change',ths.char_counter).live('keyup',ths.char_counter);
	}

var jadewits_horizontal_hover_menu = function(o){
	var ths = o;
	ths.waittime = ths.waittime?ths.waittime:500;
	ths.timer = null;
	ths.hides = null;
	ths.shows = null;
	ths.oldone = null;
	ths.oldone2 = null;
	ths.nextone = null;
	ths.mousein = false;

	ths.applicable_lis = $(ths.container + ' li').has('ul');

	ths.hide_show = function(){
		clearInterval(ths.timer);
		$(ths.hides).hide();
		if( ths.shows ) ths.shows.show();
		else if( ths.nextone && ths.oldone != ths.oldone2 ){
			ths.oldone = ths.oldone2;
			if( ths.mousein ) ths.nextone.show();
			else ths.oldone = null;
			}
		else{
			ths.oldone = null;
			}
		
		if( !ths.oldone ){
			$(ths.container + ' li').not('.active').find('>ul').hide();
			//also restore show of the selected item
			//$(ths.container + ' li.active > ul').show();
			}
		}

	ths.applicable_lis.hover(function(){
		
		ths.mousein = true;
		
		if( this == ths.oldone ) clearInterval(ths.timer); //same item so clear hide timer

		if( !ths.oldone ){
			ths.hides = ths.applicable_lis.not(this).find('>ul');
			ths.shows = $('>ul',this);
			ths.oldone = this;
			ths.hide_show();
			}
		else{
			ths.nextone = $('>ul',this);
			ths.oldone2 = this;
			}
		},function(){
		
		ths.mousein = false;
		//try to clear after one second
		ths.hides = ths.applicable_lis.find('>ul');
		ths.shows = null;
		clearInterval(ths.timer);
		ths.timer = setInterval(ths.hide_show,ths.waittime);
		});
	};

//menu fixer
function jw_menu_fixer(menu,tiny_label){
	var aas = $('a.archive',$(menu));
	var the_url = window.location.href;
	var home_page = jw_full_url+'home/'+current_archive_time;
	var current_page_url_check = current_page_url.split(jw_full_url)[1] ? current_page_url.split(jw_full_url)[1].split('/')[0] : 'jadewits_not_allowed_root';
	var the_url_check = the_url.split(jw_full_url)[1] ? the_url.split(jw_full_url)[1].split('/')[0] : 'jadewits_not_allowed_root';
	var home_page_url_check = home_page.split(jw_full_url)[1] ? home_page.split(jw_full_url)[1].split('/')[0] : 'jadewits_not_allowed_root';
	
	var ehref = '';
	var usl = '';
	
	
	for( i=0; i< aas.length; i++ ){
	//aas.each(function(index, element) {
		var index = i;
		var element = aas[i];
		
		ehref = $(element).attr('href');
		
		if( ehref.search(jw_full_url) > -1 ){
			usl = ehref.split(jw_full_url)[1];
			}
		else if( ehref.search('//') < 0 ){
			//is the url for this site. not external url
			if( jw_relative_url.length > 1 )
				usl = ehref.split(jw_relative_url)[1];
			else
				usl = ehref.replace(/^\//,'');
			}
		var thisli = $(element).parent();
		var sub_menu = thisli.find('>ul');
		if( sub_menu.length ){
			$(thisli).addClass('haschild');
			}
		if( usl ){
			var sl = usl.split('/');
			var the_link = ehref + '/' + current_archive_time;
			if( !sl[1] ){
				$(element).attr('href',the_link);
				}
			
			var check_link = usl ? usl.split('/')[0] : 'jadewits_not_allowed';
			//active the current page
			if(
				check_link == current_page_url_check 
				//|| ( current_page_url_check == 'home' && check_link == 'jadewits_not_allowed' )
				//|| check_link == home_page_url_check
				|| check_link == the_url_check
				){
				
				$(element).addClass('active') //a active
				.parent().addClass('active').addClass('selected');	//li active
				
				//expand child menu if parent selected
				
				if( sub_menu.length ){
					sub_menu.addClass('expanded');
					$(menu).addClass('child_opened');
					}
				
				if( thisli.parent().parent().prop('tagName').toLowerCase() == 'li' ){
					//expand parent sub menu wich contains this
					var parentli = thisli.parent().addClass('expanded') //ul expanded
					.parent().addClass('active');	//li active
					parentli.find('> a').addClass('active');
					
					$(menu).addClass('child_opened');
					}
				}
			}
		}
		//);
		
	var aas2 = $('a',$(menu)).not('.archive');
	for( i=0; i< aas2.length; i++ ){
	//aas2.each(function(index, element){
		var index = i;
		var element = aas2[i];
		
		ehref = $(element).attr('href');
		if( ehref.search(jw_full_url) > -1 ){
			usl = ehref.split(jw_full_url)[1];
			}
		else if( ehref.search('//') < 0 ){
			//is the url for this site. not external url
			if( jw_relative_url.length > 1 )
				usl = ehref.split(jw_relative_url)[1];
			else
				usl = ehref.replace(/^\//,'');
			}
			
		var thisli = $(element).parent();
		var sub_menu = thisli.find('>ul');
		if( sub_menu.length ){
			$(thisli).addClass('haschild');
			}
		
		var check_link =  usl ? usl : 'jadewits_not_allowed';
		//active the current page
		if( 
			//$(element).attr('href') == the_url
			check_link == current_page_url_check 
			|| ( current_page_url_check == 'home' && check_link == 'jadewits_not_allowed' && $(element).attr('href').search(jw_full_url) > -1 )
			//|| check_link == home_page_url_check
			|| check_link == the_url_check
			){
			
			$(element).addClass('active') //a active
			.parent().addClass('active').addClass('selected');	//li active
			
			//expand child menu if parent selected
			if( sub_menu.length ){
				sub_menu.addClass('expanded');
				$(menu).addClass('child_opened');
				}
			
			if( thisli.parent().parent().prop('tagName').toLowerCase() == 'li' ){
				//expand parent sub menu wich contains this
				var parentli = thisli.parent().addClass('expanded') //ul expanded
				.parent().addClass('active');	//li active
				parentli.find('> a').addClass('active');
				
				$(menu).addClass('child_opened');
				}
			}
		}
		//);
	
	// now initiate tinynav
	 /*$(menu + '>ul').tinyNav({
        active: 'selected',
        label: tiny_label ? tiny_label : ''
      });*/
	}

function jw_fit_slideshow(container){
	var child_img = $(container + ' img');
	child_img.css('width','100%');
	var first_img_width = child_img.eq(0).width();
	var first_img_height = child_img.eq(0).height();
	$(container + '.each').height(first_img_height);
	$(container).height(first_img_height);
	}
	
var jw_content_iframe_fix = function(i,e){
	//iframe fix
	var ths = e;
	ths.jw_ifix = function(){
		var pw = $(ths).parent().width();
		var iw = $(ths).width();
		var ih = $(ths).height();
		if( ths.ow == undefined ){
			ths.ow = iw;
			ths.oh = ih;
			}
		if( pw < ths.ow ){
			$(ths).width(pw);
			$(ths).height(ths.oh/ths.ow*pw);
			}
		}
	ths.jw_ifix();
	$(window).resize(ths.jw_ifix);
	}

//jw content media post render
var jw_media_post_render_uid = 0;
var jwmedia_amp_render = function(i,e){
	var ob = $(e);

	var data = $.parseJSON($(e).data('jadewitsmedia').replace(/'/g, '"'));
	console.log(data);
	ob.remove(); return;
	//console.log(data);
	jw_media_post_render_uid++;
	var a = null;
	console.log(data);
	if(ob.hasClass('image')){
		a = $('<a>' ).addClass('jw_media_holder' ).attr('id','detail-image-'+jw_media_post_render_uid );
		if( data.width) a.css({width:data.width+'px'});
		if( data.align) a.addClass(data.align);
		var title = data.caption?data.caption:(data.title?data.title:(data.alt?data.alt:(data.name?data.name:'')));
		a.append('<img src="'+jw_cdn_url+'contents/cache/images/800x450x0/uploads/'+data.path+'"  alt="'+title+'"></img>');
		a.append('<span class="jw_media_caption"><span class="tt">'+title+'</span></span>');
		a.data('image',jw_cdn_url+'contents/uploads/'+data.path);
		a.data('caption',title);
		a.data('author','');
		a.data('url',current_page_url+'#detail-image-'+jw_media_post_render_uid);
		a.addClass('pop-media-holder');
		ob.wrap(a);
		ob.remove();
	}
	else if(ob.hasClass('gallery')){
		//console.log(data);
	}
}
var jw_media_post_render = function(index, element) {
	var e =  $(element);
	/*console.log(e);
	e.remove(); return;*/
	jw_media_post_render_uid++;
	var base_path = jw_full_url + 'contents/uploads/';
	var image = e.hasClass('image');
	var gallery = e.hasClass('gallery');
	var file = e.hasClass('file');
	e.removeClass('image');
	var data = $.parseJSON(e.attr('data-jadewitsmedia').replace(/'/g, '"'));
	var path = data['path'];
	var ilink = data['link'];
	var target = data['target'];
	var name = data['name'];
	var title = data['title'] && data['title'].length > 1 ? data['title'] : '';
	var alt = /*data['alt'] ? data['alt'] : */ title ? title : ' ';
	var caption = data['caption']?data['caption']:'';
	var width = data['width'] ? data['width'] : (e.width() ? e.width() : '');
	var height = data['height'] ? data['height'] : (e.height() ? e.height() : '');
	var detail_url = data['detail_url'] ? data['detail_url'] : '';
	var big_image_src = data['path'] ? jw_cdn_url + 'contents/cache/images/800x0x1/uploads/' + data['path'] : 'javascript:';
	//var data = new Object();
	
	//image render
	if( image ){
		var dt = '';
		dt += 'data-image="'+e.attr('src')+'" ';
		dt += 'data-caption="'+title+'" ';
		dt += 'data-author="" ';
		dt += 'data-url="'+current_page_url+'#detail-image-'+jw_media_post_render_uid+'" ';
	
		if( ilink ){
			if( ilink.search(/http/g) < 0 ) ilink = base_path + ilink;
			e.after('<a href="'+ilink+'" target="'+target+'" id="media_' + index + '" style="width:' + width + 'px;" class="jw_media_holder media_image ' + e.attr('class') + '" ><img itemprop="image" width="' + width + '"  src="' + e.attr('src') + '" alt="' + alt + '" />'+( title || caption ? ('<span class="jw_media_caption">' + ( title ? '<span class="tt">' + title + '</span>':'') + (caption? '<span class="cc">' + caption + '<span>' :'' ) +'</span>'):'')+'</a>').remove();
			}
		else{
			e.after('<a rel="jw_big_image[gallery]" onClick="return false;" href="'+ big_image_src +'" title="'+ caption +'" id="media_' + index + '" style="width:' + width + 'px;" class="jw_media_holder pop-media-holder media_image ' + e.attr('class') + '" '+dt+' ><img itemprop="image" width="' + width + '"  src="' + e.attr('src') + '" alt="' + alt + '" />'+( title || caption ? ('<span class="jw_media_caption">' + ( title ? '<span class="tt">' + title + '</span>':'') + (caption? '<span class="cc">' + caption + '<span>' :'' ) +'</span>'):'')+'</a>').remove();
			}
		
		/*$('#media_' + index).hover(function(){
			if( $(window).width() >800 ){
				var e = $(this).find('.jw_media_caption');
				if( e.html() ) e.stop().slideDown();
				}
			},
		function(){
			if( $(window).width() >800 ){
				var e = $(this).find('.jw_media_caption');
				if( e.html() ) e.stop().slideUp();
				}
			});*/ 
		}
		
	//gallery render
	if( gallery ){
		var thiid = 'media_' + index + '_' + jw_media_post_render_uid;
		var g_html = '<span id="' + thiid + '" style="width:' + width + 'px; height:' + height + 'px;" class="jw_gallery_holder ' + e.attr('class') + '" >';
		var gd,a,t,c,s;
		for( var k in data['galleryUse'] ){
			gd = data['gallery'][data['galleryUse'][k]];
			a = gd['alt'] ? gd['alt'] : gd['name'];
			t = gd['title'] ? gd['title'] : ( gd['name'] ? gd['name'] : alt );
			c = gd['caption'];
			s = gd['pathResize'];
			
			
			g_html += '<span class="each"><img itemprop="image" width="' + width + '" src="' + s + '" alt="' + a + '" /><span class="jw_mt_mc"><span class="jw_mt">' + t + '</span><span class="jw_mt">' + c + '</span></span></span>';
			}
		g_html += '<a class="prev" href="javascript:">Previous</a><a class="next" href="javascript:">Next</a>';
		
		if( detail_url ) g_html += '<a title="View full gallery" target="_blank" class="full_gallery" href="'+ detail_url +'">আরও ছবি</a>';
			
		g_html += '</span>';
			
		e.after(g_html).remove();
		
		var xthiid = '#'+thiid;
		
		$(xthiid + ' .each').hover(function(){
			if( $(window).outerWidth() > 800 )
				$(this).find(' .jw_mt_mc').stop().slideDown();
			},
		function(){
			if( $(window).outerWidth() > 800 )
				$(this).find(' .jw_mt_mc').stop().slideUp();
			});
			
		/* please replace slideshow with swiper fade.js no longer supported and loaded in this system */
		new fadeAppear({
			container:xthiid,
			//syncheight:true,
			slide:'.each',
			fadeTime:0.5,
			waitTime:3.0,
			next:xthiid + ' .next',
			previous:xthiid + ' .prev',
			isRandom:false,
			noAutoSlide:false,
			transition:'slide',
			hideController:'false',
			onComplete:function(index){
				//$('# .page_list a').not('.active');
				//$('# .page_list a.active');
				},
			onInitialized:function(){							
				jw_fit_slideshow(xthiid);
				$(window).resize(function(){
					jw_fit_slideshow(xthiid);
					});
				},
			});
		return;
		$('#media_' + index).hover(function(){
			if( $(window).width() >800 ){
				var e = $(this).find('.jw_media_caption');
				if( e.html() ) e.stop().slideDown();
				}
			},
		function(){
			if( $(window).width() >800 ){
				var e = $(this).find('.jw_media_caption');
				if( e.html() ) e.stop().slideUp();
				}
			});
		}
		
	//file render
	if( file ){
		e.after('<a target="_blank" id="media_' + index + '" class="jw_media_holder_file ' + e.attr('class') + '" href="' + base_path + path + '" title="' + title + '" >' + name + '</a>').remove();
		}
	
	}

var jw_change_font_size = function(el,step){
	var max_size = 24;
	var min_size = 14;
	var e = $(el);
	var cur_font_size = parseInt(e.css('font-size'),10);
	if( step > 0 && cur_font_size < max_size || step < 0 && cur_font_size > min_size ){
		var font_size = cur_font_size + step;
		e.css({fontSize:font_size+'px',lineHeight:(font_size+10) + 'px'});
		}
	}

$('.jw_content_zoom_out').live('click',function(){
	el = $('.' + $(this).attr('data-container'));
	jw_change_font_size(el,-2);
	});
	
$('.jw_content_zoom_in').live('click',function(){
	el = $('.' + $(this).attr('data-container'));
	jw_change_font_size(el,+2);
	}); 

//custom sharer 

function jadewits_custom_sharer(v){
	var this_title = encodeURIComponent(document.title);
	var this_link = encodeURIComponent(window.location.href);
	var goto_url = '';
	switch(v.platform){
		case 'facebook' :
			goto_url = 'https://www.facebook.com/sharer/sharer.php?u=' + this_link;
			break;
		case 'twitter':
			goto_url = 'https://twitter.com/intent/tweet?text=' + this_title + '&url=' + this_link;
			break;
		case 'google_plus':
			goto_url = 'https://plus.google.com/share?url=' + this_link;
			break;
		case 'pinterest':
			goto_url = 'http://www.pinterest.com/pin/find/?url=' + this_link;
			break;
		case 'email':
			goto_url = 'mailto:?subject=<?php echo $share_title ?>&amp;body=<?php echo $share_url ?>' + this_link;
			break;
		case 'linkedin':
			goto_url = 'http://www.linkedin.com/shareArticle?mini=true&amp;title=<?php echo $share_title ?>&amp;url=<?php echo $share_url ?>' + this_link;
			break;
		case 'whatsapp':
			goto_url = 'whatsapp://send?text=<?php echo $share_title.rawurlencode("  ").$share_url ?>' + this_link;
			break;
		case 'viber':
			goto_url = 'viber://forward?text=<?php echo $share_title.rawurlencode("  ").$share_url ?>' + this_link;
			break;
		case 'print':
			var x = window.location.href.split('#');
			var initial = x[0].replace(/&*print=1/g,'');
			window.open( initial + (initial.search(/\?/g) < 0 ? '?' : '&') + 'print=1#jadewits_print','_blank');
			return;
			break;
		default:
			return false;
			break;
		}
	window.open(goto_url, '_blank','width=500,height=400');
	return false;
	}

$('.jadeshare').live('click',function(){
	$(this).data('platform');
	var v = {platform:'facebook'}
	return jadewits_custom_sharer('facebook');
	});
	
$('.jadeshare_more').live('click',function(){
	$(this).parent().find('.share_group_inner').toggle();
	});

$('.jadeshare_facebook_share').live('click',function(){
	return jadewits_custom_sharer('facebook');
	});
	
$('.jadeshare_twitter_share').live('click',function(){
	//return jadeshare_sendto('twitter');
	return jadewits_custom_sharer('twitter');
	});

$('.jadeshare_google_share').live('click',function(){
	return jadewits_custom_sharer('google_plus');
	});

$('.jadeshare_print').live('click',function(){
	return jadewits_custom_sharer('print');
	});
	
var jadewits_delay_print_timer = null;
var jadewits_delay_print = function(){
	clearInterval(jadewits_delay_print_timer);
	$('body').append('<a class="print_now_button" onClick="$(this).hide();window.print();">Print Now</a>');
	}
$(document).ready(function(e) {
	var x = window.location.href.split('#');
	if( x[1] && x[1] == 'jadewits_print' || window.location.href.search('print=') > 0 ){
		$('head link').each(function(index, element) {
			if( $(element).attr('media') == 'print' ){
				$(element).attr('media','all').attr('data-pmedia','print');
				}
			});
		jadewits_delay_print();
		//jadewits_delay_print_timer = setInterval(jadewits_delay_print,1000);
		}
	});

$('.jadeshare_share').live('click',function(){
	return jadeshare_sendto('more');
	});

function jadewits_auto_color(jw_color_param){
	jw_color_param = jw_color_param ? jw_color_param : 0;
	//color distributor
	$(document).ready(function(e) {
		var my_color_picker = ['purple','red','blue','orange','green','megenta','ash'];
		var my_color_picker_pointer = 0; 
		
		$('.main_menu > ul > li').each(function(i,e){
			if( ++my_color_picker_pointer >= 6 ) my_color_picker_pointer = 0;
			
			//keep provided color - 2
			if( jw_color_param >= 2 ) my_color_picker_pointer = jw_color_param - 2;
			
			//reset exisiting colors and add cumstom color
			 for( k in my_color_picker ){
				 $(e).removeClass('menu_color_' + my_color_picker[k]);
				 }
			$(e).addClass('menu_color_' + my_color_picker[my_color_picker_pointer]);	 
			
			
			
		  	if( window.location.href.search($(e).find('>a').attr('href')) > -1 ){
			 $('body').addClass('page_color_' + my_color_picker[my_color_picker_pointer]);
			 $('.widget_color_').addClass('widget_color_' + my_color_picker[my_color_picker_pointer]); 
			 $('.color_theme_').addClass('color_theme_' + my_color_picker[my_color_picker_pointer]); 
			 
			 for( k in my_color_picker ){
				$('.widget_color_' + my_color_picker[k]).removeClass('widget_color_' + my_color_picker[k]).addClass('widget_color_' + my_color_picker[my_color_picker_pointer]);
				$('.color_theme_' + my_color_picker[k]).removeClass('color_theme_' + my_color_picker[k]).addClass('color_theme_' + my_color_picker[my_color_picker_pointer]);
				}
		  }
		});
	});
	
	}

if( window.location.href.search('jadewits=') > 0 ){
	var t1 = window.location.href.split('?');
	var jw_color_param = 1;
	if( t1[1] ){
		var t2 = t1[1].split('#')[0].split('&');
		for(i in t2 ){
			var t3 = t2[i].split('=');
			if( t3[0] == 'jadewits' )
				jw_color_param = t3[1];
			}
		}
	jadewits_auto_color(jw_color_param);
	
	//click tracking
	$('a').live('click',function(){
		var e = $(this);
		if( !e.data('jadewits_ready') ){
			e.data('jadewits_ready','yes');
			var h = $(e).attr('href').split('#');
			var x = h[0].split('?');
			var y = '';
			if( h[1] ) y = '#' + h[1];
			if( x[1] ){
				$(e).attr( 'href', h[0] + '?jadewits=' + jw_color_param + '&' + x[1] + y );
				}
			else{
				$(e).attr( 'href', h[0] + '?jadewits=' + jw_color_param + y );
				}
			}
		});
	
	}



function container_all_fixed_height_column(){
	var $max = 0;
	var $need_work = false;
	$('.container_all_fixed_height_column .container_box_shadow .inner' ).each(function(){
		$(this ).height('auto')
	})
	if($(this ).width()<800) return;
	$('.container_all_fixed_height_column .container_box_shadow' ).each(function(){
		if($max<$(this ).innerHeight()) {
			$max = $(this ).innerHeight();
			$need_work  = true;
		}
		//console.log($(this ).height());
	})
	$max = $max - 19;
	if($need_work) {
		$( '.container_all_fixed_height_column .container_box_shadow' ).each( function () {
			if ( $( this ).children().length > 1 ) {
				var $minus = 0;
				$( this ).children( ':not(.inner)' ).each( function () {
					$minus += $( this ).innerHeight();
				} );
				$( this ).children( '.inner' ).innerHeight( $max - $minus +1 );
			}
			else $( this ).children( '.inner' ).innerHeight( $max );
		} );
	}
}
$(window).on('load resize', function () {
	container_all_fixed_height_column();
});

/*Toggeler of the click-free-pop*/
var clickFreePopOutside = function(event){
	var speed = 'fast';
	if( $(event.target).hasClass('banglaBtnActive') ) return; 
	if($(event.target ).closest($(this).data('clickFreePop')).length==0){
		$($(this).data('clickFreePop')).hide(speed ).removeClass('click-free-pop-active');
		$(this).unbind('click',event).data('clickFreePop',null);
	}
}
$(function(){
	$('.click-free-pop' ).each(function(){
		$(this ).click(function(mainEvent){
			var target = $(this ).data('pop');
			var speed = 'fast';
			var oldHtmlTarget = $('html' ).data('clickFreePop');
			if(oldHtmlTarget) {
				if(!$(target ).hasClass('click-free-pop-active')){
					$( '.click-free-pop-active' ).hide( speed ).removeClass( 'click-free-pop-active' );
				}
				$('html').unbind('click',clickFreePopOutside ).data('clickFreePop',null);
			}
			$(target).toggle(speed ).toggleClass('click-free-pop-active');
			mainEvent.stopPropagation();
			$('html').bind('click',clickFreePopOutside).data('clickFreePop',target);
		});
	});
})
/*End Toggeler of the click-free-pop*/