$(function(){
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
		$('.yin').addClass('xian');
	});
	$('#close').on('touchend',function(){
		$('.yin').removeClass('xian');
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
		pi_box.on('touchend',function(e){
			console.log(1);
			var offsetX=e.originalEvent.changedTouches[0].clientX;
			audio.currentTime=offsetX/$(this).width()*audio.duration;
		});
		pi.on('touchend',false);//阻止冒泡
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
	//////////////////////////////////////////////////////////所有事件
	$audio.on('volumechange',function(){
		
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
		audio.play();
		duration.html(huan(audio.duration));
	});
	$audio.on('play',function(){
		play.html('<img src="img/pause-outline.png" id="play"/>');
	});
	$audio.on('pause',function(){
		play.html('<img src="img/bofang.png" id="play"/>');
	});
	$audio.on('ended',next);

	$audio.on('timeupdate',function(){
		current.html(huan(audio.currentTime));
		var left=pi_box.width()*audio.currentTime/audio.duration-pi.width()/2;
		pi.css("left",""+left+"px");
	});
});
