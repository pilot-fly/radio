$(function(){
	//跳转详情页
	$("#zhu").on("touchend",function(){
		$(this).css("display","none");
		$("#back").css("display","block");
	});
	$(".back").on("touchend",function(){
		$("#zhu").css("display","block");
		$("#back").css("display","none");
	});
	//列表页
	$("#back-1").on("touchmove",function(){
		$(this).css("display","none");
		$("#yin").css("display","block");
	});
	$("#yin").on("touchmove",function(){
		$(this).css("display","none");
		$("#back-1").css("display","block");
	});
	$("#add").on("touchend",function(){
		$(".yin").removeClass('xian').css("display","none");
		$("#back-1").css("display","none");
		$("#yin").css("display","block");
	});
	//详情页
	var $audio=$("#audio");
	var audio=$audio.get(0);
	//列表和切换歌曲
	var currentIndex=0;
	var musics=[
	  {name:'卡农',src:'music/卡农.mp3',author:'理查',pic:'<img src="img/qu.jpg"/>',u:'img/qu.jpg'},
	  {name:'Lonely',src:'music/Lonely.mp3',author:'NANA',pic:'<img src="img/qu2.jpg"/>',u:'img/qu2.jpg'},
	  {name:'卡门组曲',src:'music/卡门组曲.mp3',author:'众音乐家',pic:'<img src="img/qu1.jpg"/>',u:'img/qu1.jpg'}
	];
	function render(){
		$('#mu-list').empty();
		$.each(musics,function(i,v){
			var c=(i===currentIndex)?'active':'';
			$('<li class="'+c+'"><span class="name">'+v.name+'</span><span class="author">—'+v.author+'</span><span class="dele"><img src="img/jiaochacross80.png"/></span><span class="love"><img src="img/icon4.png"/></span></li>').appendTo('#mu-list');
		});
	}
	render();
	//添加歌曲
	$(".ge-box").on('touchend',function(){
		console.log(1)
		var d=$(this).attr('data-m');
		musics.push(JSON.parse(d));
		render();
	});
	//列表的删除
	$("#mu-list").on('touchend','.dele',function(){
		var li=$(this).closest('li');
		var index=li.index();
		musics.splice(index,1);
		if(index===currentIndex){
			if(musics[currentIndex]){
				audio.src=musics[currentIndex].src;
			}else{
				audio.src='';
			}
		}else if(index>currentIndex){
			//不操心
		}else if(index<currentIndex){
			currentIndex-=1;
		}
		render();
		return false;
	});
	//切换歌曲
	//下一首
	function next(){
		currentIndex+=1;
		if(currentIndex===musics.length){
			currentIndex=0;
		}
		audio.src=musics[currentIndex].src;
		render();
	}
	$("#next").on('touchend',next);
	//上一首
	function pre(){
		currentIndex-=1;
		if(currentIndex===-1){
			currentIndex=musics.length-1;
		}
		audio.src=musics[currentIndex].src;
		render();
	}
	$("#pre").on('touchend',pre);
	//列表页
	$('#list').on('touchend',function(){
		$('.yin').css("display","block").addClass('xian');
	});
	$('#close').on('touchend',function(){
		$('.yin').removeClass('xian').css("display","none");
	});
	//点击切换
	$("#mu-list").on("touchend","li",function(){
		var index=$(this).index();
		currentIndex=index;
		audio.src=musics[currentIndex].src;
		render();
	});
	//播放暂停
	var play=$('#play');
	play.on('touchend',function(){
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
	});
	//时间自动
		var current=$('#current');
		var duration=$('#duration');
		var pi=$('#pi');
		var pi_box=$('#pi-box');
		//转换时间
		function huan(t){
			var m=Math.floor(t/60);
			var s=(t+(-Math.floor(t/60)*60)).toFixed(0);
			s=(s<10)?"0"+s:s;
			return m+":"+s;
		}
		//调进度
		pi_box.on('touchend',function(e){
			console.log(1);
			var offsetX=e.originalEvent.changedTouches[0].clientX;
			audio.currentTime=offsetX/$(this).width()*audio.duration;
		});
		pi.on('touchend',false);//阻止冒泡
		//进度条的拖拽
		pi.on('touchstart',function(e){
//			var r=pi.width()/2;
//			var offsetX=e.originalEvent.changedTouches[0].clientX;
//			var start=r-offsetX;
			$(document).on('touchmove',function(e){
//				console.log(4)
				var m=e.originalEvent.changedTouches[0].clientX;;
				var l=m-pi_box.offset().left;
				var yin=m/$(this).width()*audio.duration;
				if(yin>audio.duration||yin<0){
					return;
				}
				console.log(l);
				audio.currentTime=yin;
			});
			return false;
		});
		$(document).on('touchend',function(){
			$(document).off('touchmove');
		});
		//调节音量
		var di_box=$('#di-box');
		var di=$('#di');
		di_box.on('touchend',function(e){
			var offsetX=e.originalEvent.changedTouches[0].clientX;
			audio.volume=offsetX/$(this).width();
			// var left=e.offsetX-di.width()/2
			di.css("left",""+offsetX+"px");
			mune.attr('data-v');
		});
		di.on('touchend',false);//阻止冒泡
		var mune=$('#mune');
		mune.on('touchend',function(){
			if($(this).attr('data-v')){
				audio.volume=$(this).attr('data-v');
				$(this).removeAttr('data-v');
			}else{
				$(this).attr('data-v',audio.volume);
				audio.volume=0;
				di.css("left","0px");
			}
		});
		// audio.onvolumechange =function(){
		// 	var left=audio.volume*di_box.width()-di.width()/2;
		// 	di.css("left",""+left+"px");
			
		// }
		//音量条拖拽
		di.on("touchstart",function(e){
			// var r=di.width()/2;
			// var start=r-e.offsetX;
			$(document).on("touchmove",function(e){
				var m=e.originalEvent.changedTouches[0].clientX;;
				var l=m-pi_box.offset().left;
				var yin=l/di_box.width();
				if(yin>=1||yin<=0){
					return;
				}
				audio.volume=yin;
			});
			return false;
		});
		$(document).on("touchend",function(){
			$(document).off('touchmove');
		});
	//////////////////////////////////////////////////////////所有事件
	$audio.on('volumechange',function(){
		var left=audio.volume*di_box.width()-di.width()/2;
		di.css("left",""+left+"px");
	});
	$audio.on('loadstart',function(){
		$("#name").html(musics[currentIndex].name);
		$("#au").html(musics[currentIndex].author);
		$('#pic').html(musics[currentIndex].pic);
		$('#back').css('background-image','url('+musics[currentIndex].u+')');
	});
	$audio.on('progress',function(){
		
	});
	$audio.on('canplay',function(){
		// audio.play();
		duration.html(huan(audio.duration));
	});
	$audio.on('play',function(){
		play.html('<img src="img/pause-outline.png" id="play"/>');
		$("#pic").addClass("zhuan");
	});
	$audio.on('pause',function(){
		play.html('<img src="img/bofang.png" id="play"/>');
		$("#pic").removeClass("zhuan");
	});
	$audio.on('ended',next);

	$audio.on('timeupdate',function(){
		current.html(huan(audio.currentTime));
		var left=pi_box.width()*audio.currentTime/audio.duration-pi.width()/2;
		pi.css("left",""+left+"px");
	});
});
