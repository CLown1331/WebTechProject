/*
version 2.4
Jamil Ahmed
www.aunqur.com

20130209 - slider is now responsive for all possible mood

20130204 - bug fix loader hung with no image. (fixed)

20130110 - previous next button problem for fade effect. same slide on previous and next. (fixed)
			- new: flag to stop cycle
			- now supports image preloader and other events
			- customaization of image pre loader
20110818 - event added to stop and resume on window focus lost and on focus
         - hoverPause = (true/false) automatically pause if mouse over on slider. false it if you want to run it as continuous background slider. [default:true]
20101104 - start auto play on hover after pause (fixed)
20140422 - syncheight added to sync with image height

*must load jQuery and its effects core ui to work
*elements can be supplied by jQuery selector

waitTime = number of seconds to wait before each transition
fadeTime = number of seconds for the transition
isRandom = (true/false) is randomly choose selected / active item [default:false]
transition = (slide/fade) transition effects [default:fade]
container = the container holds the slides
slide = each slide class / tag inside the container
paginContainer = container that holds the slide indexes
paginElem = elements / each index of slides
topBottom = (true/false) is the transition direction top to bottom [default:false]
diagonal = (true/false) is the transition moves diagonally ( prototype, special effect ) [default:false]
noAutoSlide = (true/false) automatic transition on/off [default:false]
hideController = (true/false) automatically hide controller if there is only one slide [default:true]
hoverPause = (true/false) automatically pause if mouse over on slider. false it if you want to run it as continuous background slider. [default:true]
stopCycle = (true/false) stop sycle at first and end . [default:false]

syncheight = (true,false) sync slideshow height with image height [default:false]


progressBarHeight = height in px
progressBarColor = color code of the progressbar
progressBarTextColor = color code of progressbar the text
progressBarBackgroundColor = color code of the background

next = element that triggers next
previous = element that triggers previous
pauseToggle = element that toggle auto transition [ pause class when paused, play class while playing ]

//event handler
onInitialized = callback function after onInitialized the slider
onPause = callback function on pause
onPlay = callback function on play
onChange = callback function on change must recieve an argument as index number of the current item
onComplete = callback function on change complete must recieve an argument as index number of the currently changed item
onNext = callback function on next must recieve an argument as index number of the currently changed item
onPrevious = callback function on previous must recieve an argument as index number of the currently changed item

example: new fadeAppear({
	container:'#jContainer',
	slide:'.slide',
	paginContainer:'#paging',
	paginElem:'li',
	fadeTime:0.5,
	waitTime:5.0,
	next:'#next',
	previous:'#prev',
	isRandom:true,
	transition:'slide',
	hoverPause:true,
	onChange:function(index){alert(index);},
	onComplete:function(index){alert(index);}
	});
*/
var fadeAppear = function(o){
	var ths = new Object;
	ths.container = o.container;
	ths.slide = o.slide;
	ths.paginContainer = o.paginContainer;
	ths.paginElem = o.paginElem;
	ths.waitTime = (o.waitTime?o.waitTime:5.0)*1000;
	ths.fadeTime = (o.fadeTime?o.fadeTime:0.5)*1000;
	ths.isRandom = o.isRandom?o.isRandom:false;
	ths.transition = o.transition?o.transition:'fade';
	ths.topBottom = o.topBottom?o.topBottom:false;
	ths.diagonal = o.diagonal?o.diagonal:false;
	ths.noAutoSlide = o.noAutoSlide?o.noAutoSlide:false;
	ths.hideController = o.hideController?o.hideController:true;
	ths.hoverPause = o.hoverPause == false?false:true;
	ths.stopCycle = o.stopCycle?o.stopCycle:false;
	
	ths.progressBarHeight = o.progressBarHeight?o.progressBarHeight:'auto';
	ths.progressBarColor = o.progressBarColor?o.progressBarColor:'#09F';
	ths.progressBarTextColor = o.progressBarTextColor?o.progressBarTextColor:'#000';
	ths.progressBarBackgroundColor = o.progressBarBackgroundColor?o.progressBarBackgroundColor:'#fff';
	
	ths.syncheight = o.syncheight?o.syncheight:false;
	
	ths.nextId = o.next?o.next:'';
	ths.previousId = o.previous?o.previous:'';
	ths.pauseToggle = o.pauseToggle?o.pauseToggle:'';
	//event handler
	ths.onInitialized = o.onInitialized?o.onInitialized:function(){};
	ths.onPause = o.onPause?o.onPause:function(){};
	ths.onPlay = o.onPlay?o.onPlay:function(){};
	ths.onChange = o.onChange?o.onChange:function(index){};
	ths.onComplete = o.onComplete?o.onComplete:function(index){};
	ths.onNext = o.onNext?o.onNext:function(index){};
	ths.onPrevious = o.onPrevious?o.onPrevious:function(index){};
	
	
	//initialize
	ths.init = function(){
		ths.elems = $(ths.container + ' ' + ths.slide);
		
		//hide the elems before fully loaded
		//change opacity before preload
		ths.elems.css({
			opacity:'0.01',
			position:'absolute',
			left:0,
			top:0,
			overflow:'hidden',
			width:'100%',//$(ths.container).width(),
			height:'100%'//$(ths.container).height(),
			});
		
		ths.paging = $(ths.paginContainer + ' ' + ths.paginElem);
		
		//new trick only put javascript or prevent default to paging elements count matched with ths.elems
		
		ths.elems.each(function(index, element) {
			//$(ths.paginContainer + ' a').eq(index).attr('href','javascript:');
			$(ths.paginContainer + ' a').eq(index).click(function(e){
				e.preventDefault();
				});
			
			});
		
		
		if( ths.transition == 'slide' ){
			ths.eachWidth = $(ths.container).width();
			ths.eachHeight = $(ths.container).height();
			}
		if( ths.isRandom ) ths.hide = Math.round(Math.random() * (ths.elems.length-1));
		else ths.hide = ths.elems.length-1;
		ths.lastShowed = ths.show = ths.hide+1;
		if( ths.show > ths.elems.length-1 ) ths.show = 0;
		if( ths.hide > ths.elems.length-1 ) ths.hide = 0;
		ths.interval = null;
		ths.isPrev = false;
		ths.transitionInterval = null;
		ths.onCompleteFireInterval = null;
		
		//pre process and initialize if there is more than one slide
		if( ths.elems.length > 1 ){
			//initialize controllers
			if( ths.nextId ) $(ths.nextId).click(ths.next).attr('href','javascript:');
			if( ths.previousId ) $(ths.previousId).click(ths.prev).attr('href','javascript:');
			if( ths.pauseToggle ) $(ths.pauseToggle).toggle(
				function(){
					$(ths.pauseToggle).addClass('pause').removeClass('play');
					ths.pause();
					},
				function(){
					$(ths.pauseToggle).addClass('play').removeClass('pause');
					ths.play();
					}).attr('href','javascript:');
			for( i = 0; i < ths.elems.length; i++ ){
				e = ths.elems[i];
				if( ths.hoverPause ) $(e).mouseover(ths.pause2).mouseout(ths.play2);
				if(ths.paging.length) $(ths.paging[i]).click(ths.directGo);
				if( ths.transition == 'slide' ){
					//if( ths.topBottom ) $(e).css({height:ths.eachHeight+'px'});
					//else $(e).css({width:ths.eachWidth+'px'});
					}
				if( ths.hide != i ){
					if( ths.transition == 'fade' ){
						//$(e).fadeOut(20);
						}
					else if( ths.topBottom ) $(e).css({top:'-'+ths.eachHeight+'px'});
					else $(e).css({left:'-'+ths.eachWidth+'px'});
					}
				}
			$(ths.paging[ths.hide]).addClass('active');
			
			
			//stop al transition while not in focus and resume if found focus
			if( !ths.noAutoSlide ) $(window).focus(ths.play).blur(ths.pause);
			}
		else if( ths.hideController ){
			//hide controllers
			$(ths.paging).css({visibility:'hidden'});
			$(ths.nextId).css({visibility:'hidden'});
			$(ths.previousId).css({visibility:'hidden'});
			$(ths.pauseToggle).css({visibility:'hidden'});
			}
		//trigger on resize event
		$(window).resize(ths.fixposition);
		//trigger preload
		ths.preLoadImages();
		}
	
	
	//preloader
	ths.fullyInitialized = function(){
		clearInterval(ths.fullyInitializedInterval);
		//restore opacity after pre load
		ths.elems.animate({opacity:'1.0'},500);
		ths.onInitialized();
		}
	ths.preLoadComplete = function(){
		//set fast initialization
		var __tmp_init_time = 1;
		var __tmp = ths.fadeTime;
		ths.fadeTime = __tmp_init_time;
		if( ths.elems.length > 1 ){
			ths.fade();
			}
		ths.fadeTime = __tmp;
		ths.fullyInitializedInterval = setInterval(ths.fullyInitialized,__tmp_init_time);
		}
	ths.preLoaded = function(){
		if( ++ths.totalLoaded >= ths.totalImagesToLoad ){
			ths.loadProgressContainer.remove();
			ths.preLoadComplete();
			}
		ths.loadProgressBar.css({width:Math.round(ths.totalLoaded/ths.totalImagesToLoad*100)+'%'});
		ths.loadProgressText.html('loaded: '+ths.totalLoaded+'\/'+ths.totalImagesToLoad);
		
		}
	ths.preLoadImages = function(){
		
		var images = $(ths.container).find('img');
		if( !images.length ){
			ths.preLoadComplete();
			return;
			}
		
		$(ths.container).append('<div class="iLoadProgress"><div class="iProgressBar"></div><div class="iProgressText">Loading Please Wait...</div></div>');
		
		ths.loadProgressContainer = $(ths.container).find('.iLoadProgress');
		ths.loadProgressBar = $(ths.container).find('.iProgressBar');
		ths.loadProgressText = $(ths.container).find('.iProgressText');
		
		//design the progress bar
		ths.loadProgressContainer.css({
			position:'absolute',
			left:0,
			top:0,
			right:0,
			bottom:0,
			margin:'0px auto',
			//width:'100%',
			height:ths.progressBarHeight,
			//border:'1px solid #dfdfdf',
			overflow:'hidden',
			background:ths.progressBarBackgroundColor,
			opacity:'0.2'
			});
		ths.loadProgressBar.css({
			height:ths.loadProgressContainer.height(),
			width:'0%',
			//margin:'0px auto',
			background:ths.progressBarColor
			});
		ths.loadProgressText.css({
			textAlign:'center',
			fontSize:'75%',
			height: '100%',
			lineHeight:ths.loadProgressContainer.height()+'px',
			color:ths.progressBarTextColor,
			fontWeight:'bold',
			position:'absolute',
			left:'0px',
			top:'0px',
			width:'100%',
			display:'block'
			});
		
		
		var images = $(ths.container).find('img');
		ths.totalImagesToLoad = images.length;
		ths.totalLoaded  = 0;
		images.each(function(index, element) {
			$(new Image()).load(ths.preLoaded).error(ths.preLoaded).attr('src',$(element).attr('src'));
		});
		}
	
	//easy swap function
	ths.swap = function(){
		ths.tmp = ths.hide;
		ths.hide = ths.show;
		ths.show = ths.tmp;
		}
		
	ths.onCompleteFire = function(){
		clearInterval(ths.onCompleteFireInterval);
		ths.onComplete(ths.lastShowed);
		}
		
	//main effect function
	ths.fade = function(){
		if( ths.interval )
			clearInterval(ths.interval);
		
		
		
		if( ths.isPrev && !ths.goingDirect ){
			ths.show-=2
			}
			
		//stop cycle navigation
		if( ths.stopCycle ){
			if( ths.show > 0 ){
				$(ths.previousId).show();
				}
			else{
				$(ths.previousId).hide();
				}
			
			if( ths.show < ths.elems.length-1 ){
				$(ths.nextId).show();
				}
			else{
				$(ths.nextId).hide();
				}
			}
		
		if( ths.show > ths.elems.length-1 ) ths.show = 0;
		else if( ths.show < 0 ) ths.show = ths.elems.length-1;
		if( ths.hide > ths.elems.length-1 ) ths.hide = 0;
		else if( ths.hide < 0 ) ths.hide = ths.elems.length-1;
		
		ths.lastShowed = ths.show;
		//fire the onChange event
		ths.onChange(ths.show);
		//fire the onComplete event after the transition ends
		ths.onCompleteFireInterval = setInterval(ths.onCompleteFire,ths.fadeTime);
		
		ths.fixposition();
		
		if( ths.transition == 'fade' ){
			//$(ths.elems[ths.hide]).stop().fadeOut(ths.fadeTime); //fix on previous event for fade lets fade out all item without the showing item
			$(ths.elems).not(ths.elems[ths.show]).not(':hidden').stop().fadeOut(ths.fadeTime);
			$(ths.elems[ths.show]).stop().fadeIn(ths.fadeTime);
			}
		else{
			if( ths.topBottom ){
				if( ths.isPrev ){
					$(ths.elems[ths.show]).css({top:'-'+ths.eachHeight+'px'});
					$(ths.elems[ths.hide]).css({top:'0px'});
					$(ths.elems[ths.hide]).stop().animate({top:'+'+ths.eachHeight+'px'},ths.fadeTime);
					$(ths.elems[ths.show]).stop().animate({top:'0px'},ths.fadeTime);
					}
				else{
					$(ths.elems[ths.show]).css({top:'+'+ths.eachHeight+'px'});
					$(ths.elems[ths.hide]).css({top:'0px'});
					$(ths.elems[ths.hide]).stop().animate({top:'-'+(ths.eachHeight+1)+'px'},ths.fadeTime);
					$(ths.elems[ths.show]).stop().animate({top:'0px'},ths.fadeTime);
					}
				}
			else if( ths.diagonal ){
				if( ths.isPrev ){
					$(ths.elems[ths.show]).css({left:'+'+ths.eachWidth+'px',top:'-'+ths.eachHeight+'px'});
					$(ths.elems[ths.hide]).css({left:'0px',top:'0px'});
					$(ths.elems[ths.hide]).stop().animate({left:'-'+ths.eachWidth+'px',top:'-'+ths.eachHeight+'px'},ths.fadeTime);
					$(ths.elems[ths.show]).stop().animate({left:'0px',top:'0px'},ths.fadeTime);
					}
				else{
					$(ths.elems[ths.show]).css({left:'+'+ths.eachWidth+'px',top:'-'+ths.eachHeight+'px'});
					$(ths.elems[ths.hide]).css({left:'0px',top:'0px'});
					$(ths.elems[ths.hide]).stop().animate({left:'-'+(ths.eachWidth+1)+'px',top:'-'+ths.eachHeight+'px'},ths.fadeTime);
					$(ths.elems[ths.show]).stop().animate({left:'0px',top:'0px'},ths.fadeTime);
					}
				}
			else{
				if( ths.isPrev ){
					$(ths.elems[ths.show]).css({left:'-'+ths.eachWidth+'px'});
					$(ths.elems[ths.hide]).css({left:'0px'});
					$(ths.elems[ths.hide]).stop().animate({left:'+'+ths.eachWidth+'px'},ths.fadeTime);
					$(ths.elems[ths.show]).stop().animate({left:'0px'},ths.fadeTime);
					}
				else{
					$(ths.elems[ths.show]).css({left:'+'+ths.eachWidth+'px'});
					$(ths.elems[ths.hide]).css({left:'0px'});
					$(ths.elems[ths.hide]).stop().animate({left:'-'+(ths.eachWidth+1)+'px'},ths.fadeTime);
					$(ths.elems[ths.show]).stop().animate({left:'0px'},ths.fadeTime);
					}
				}
			}
		
		$(ths.paging[ths.hide]).removeClass('active');
		$(ths.paging[ths.show]).addClass('active');
		
		
		//lets ready for next slide
		ths.hide = ths.show++;
		
		ths.isPrev = false;
		ths.goingDirect = false;
		if( !ths.noAutoSlide ) ths.interval = setInterval(ths.fade,ths.waitTime);
		
		}
	
	ths.fixposition = function(){
		//before begin transisions calculate latest width height for responsiveness
		ths.eachWidth = $(ths.container).width();
		if( $(ths.elems[ths.show]).find('img').eq(0).height() && ths.syncheight )
			$(ths.container).height($(ths.elems[ths.show]).find('img').eq(0).height());
		ths.eachHeight = $(ths.container).height();
		
		//fix z-index
		ths.fixers = $(ths.elems).not(ths.elems[ths.hide]);
		ths.fixers.not(ths.elems[ths.show]).css({'z-index':0});
		$(ths.elems[ths.hide]).css({'z-index':1});
		$(ths.elems[ths.show]).css({'z-index':2});
		if( ths.transition == 'fade' ){
			//nothing to adjust
			}
		else{
			if( ths.topBottom ){
				ths.fixers.css({top:'-' + ths.eachHeight + 'px'});
				}
			else if( ths.diagonal ){
				ths.fixers.css({top:'-' + ths.eachHeight + 'px',left:'-' + ths.eachWidth + 'px'});
				}
			else{ //right to left
				ths.fixers.css({left:'-' + ths.eachWidth + 'px'});
				}
			}
		}	
	
	//pause
	ths.pause = function(){
		clearInterval(ths.interval);
		ths.noAutoSlide = true;
		ths.onPause();
		}
	//for mouseover
	ths.pause2 = function(){
		clearInterval(ths.interval);
		ths.onPause();
		}
	//play
	ths.play = function(){
		clearInterval(ths.interval);
		ths.noAutoSlide = false;
		if( !ths.noAutoSlide ) ths.interval = setInterval(ths.fade,ths.waitTime);
		ths.onPlay();
		}
	//for mouseout
	ths.play2 = function(){
		clearInterval(ths.interval);
		if( !ths.noAutoSlide ) ths.interval = setInterval(ths.fade,ths.waitTime);
		ths.onPlay();
		}
	//next
	ths.next = function(){
		if( ths.transitionInterval ) return;
		ths.transitionInterval = setInterval(ths.clearTransition,ths.fadeTime);
		clearInterval(ths.interval);
		ths.fade();
		ths.onNext(ths.show);
		}
	ths.prev = function(){
		if( ths.transitionInterval ) return;
		ths.transitionInterval = setInterval(ths.clearTransition,ths.fadeTime);
		clearInterval(ths.interval);
		ths.isPrev = true;
		ths.fade();
		ths.onPrevious(ths.show);
		}
	//reset / clear transition
	ths.clearTransition = function(){
		clearInterval(ths.transitionInterval);
		ths.transitionInterval = null;
		}
	//external callback to go to specific index
	this.directGo2 = function(index){
		if( ths.transitionInterval ) return;
		ths.havToGo = index;
		if( ths.havToGo == ths.hide ) return; // same slide don't need to go
		ths.goingDirect = true;
		if( ths.havToGo < ths.show ) ths.isPrev = true;
		ths.show = ths.havToGo;
		ths.transitionInterval = setInterval(ths.clearTransition,ths.fadeTime);
		ths.fade();
		}
	//callback to go to index on click of paginator
	ths.directGo = function(){
		if( ths.transitionInterval ) return;
		for( i=0; i<ths.paging.length;i++)
			if( ths.paging[i] == this ) ths.havToGo = i;
		//ths.havToGo = $(this.tagName,$(this).parent()).index(this,$(this).parent());
		if( ths.havToGo == ths.hide ) return; // same slide don't need to go
		ths.goingDirect = true;
		if( ths.havToGo < ths.show ) ths.isPrev = true;
		ths.show = ths.havToGo;
		ths.transitionInterval = setInterval(ths.clearTransition,ths.fadeTime);
		ths.fade();
		}
	
	ths.init();
	
	this.stopAutoSliding = function(){
		clearInterval(ths.interval);
		ths.noAutoSlide = true;
		}
	this.startAutoSliding = function(){
		ths.noAutoSlide = false;
		clearInterval(ths.interval);
		$(ths.container).html($(ths.container).html());
		ths.init();
		}
	
	this.reInitialize = function(){
		clearInterval(ths.interval);
		$(ths.container).html($(ths.container).html());
		ths.init();
		}
	}