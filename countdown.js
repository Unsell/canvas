var Window_width = 1024;
var Window_height = 568;
var Radius = 6;
var Margin_top = 60;
var Margin_left = 30;

//倒计时结束时间
// var endTime = new Date();
// endTime.setTime( endTime.getTime()+5400*1000 );
var curShowTimeSecond = 0;

//存储小球
var balls = [];
//小球颜色
const colors = ["red","green","yellow","pink","black","orange","blue","pansy","purple","violet"];


window.onload = function () {

	Window_width = document.body.clientWidth;
	Window_height = document.body.clientHeight;
	Margin_left = Math.round(Window_width/10);
	Margin_top = Math.round(Window_height/5);
	Radius = Math.round(Window_width*4/5/110)-1;


	var canvas = document.getElementById('canvas');
	var context = canvas.getContext("2d");

	canvas.width = Window_width;
	canvas.height = Window_height;

	curShowTimeSecond = getCurrentShowTimeSeconds();
	// render (context);
	setInterval(
		function () {
			render( context );
			update();
		}, 50
	);

}

function getCurrentShowTimeSeconds() {

	var curTime = new Date();
	//返回距离倒计时剩余多少时间，来实现倒计时效果
	// var ret = endTime.getTime() - curTime.getTime();
	// ret = Math.round( ret/1000 );
	// return ret >= 0? ret : 0;

	//返回今天过去了多长时间，来实现时钟效果
	var ret = curTime.getHours()*3600 + curTime.getMinutes()*60 + curTime.getSeconds();
	return ret;
	

}

function update () {

	var nextShowTimeSecond = getCurrentShowTimeSeconds();
	var nexthours = parseInt( nextShowTimeSecond/3600 );
	var nextminutes = parseInt( (nextShowTimeSecond - nexthours*3600)/60 );
	var nextsecond =  nextShowTimeSecond % 60;

	var curhours = parseInt( curShowTimeSecond/3600 );
	var curminutes = parseInt( (curShowTimeSecond - curhours*3600)/60 );
	var cursecond =  curShowTimeSecond % 60;
	if( nextsecond != cursecond){
		//判断哪些数字要发生变化
		if( parseInt(curhours/10) != parseInt(nexthours/10) ){
			addBalls( Margin_left+0, Margin_top, parseInt(curhours/10) );
		}
		if( parseInt(curhours%10) != parseInt(nexthours%10) ){
			addBalls( Margin_left+15*(Radius+1), Margin_top, parseInt(curhours/10) );
		}

		if( parseInt(curminutes/10) != parseInt(nextminutes/10) ){
			addBalls( Margin_left+40*(Radius+1), Margin_top, parseInt(curhours/10) );
		}
		if( parseInt(curminutes%10) != parseInt(nextminutes%10) ){
			addBalls( Margin_left+55*(Radius+1), Margin_top, parseInt(curhours%10) );
		}

		if( parseInt(cursecond/10) != parseInt(nextsecond/10) ){
			addBalls( Margin_left+80*(Radius+1), Margin_top, parseInt(curhours/10) );
		}
		if( parseInt(cursecond%10) != parseInt(nextsecond%10) ){
			addBalls( Margin_left+95*(Radius+1), Margin_top, parseInt(curhours%10) );
		}
		curShowTimeSecond = nextShowTimeSecond;

	}
	updateBalls();
	// console.log(balls.length);

}

function updateBalls() {
	for( var i=0; i<balls.length; i++ ){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if(balls[i].y >= Window_height-Radius){
			balls[i].y = Window_height-Radius;
			balls[i].vy = -balls[i].vy*0.5;
		}
	}

	var cnt = 0;
	for( var i=0; i<balls.length; i++ ){
		if(balls[i].x+Radius > 0 && balls[i].x-Radius < Window_width){
			balls[cnt++] = balls[i];
		}
		
	}
	while( balls.length > Math.min(300, cnt) ){
		balls.pop();
	}
}

function addBalls( x, y, num ) {
	for( var i=0; i<digit[num].length; i++){
		for( var j=0; j<digit[num][i].length; j++ ){
			if(digit[num][i][j] == 1){
				var aBall = {
					x:x+j*2*(Radius+1)+(Radius+1),
					y:y+i*2*(Radius+1)+(Radius+1),
					g:1.5+Math.random(),
					vx:Math.pow( -1, Math.ceil( Math.random()*1000 ) )*4,
					vy:-8,
					color: colors[ Math.floor( Math.random()*colors.length ) ]
				}

				balls.push( aBall );
			}
		}
	}
}

function render (cxt) {

	cxt.clearRect( 0, 0, Window_width, Window_height);
	var hours = parseInt( curShowTimeSecond/3600 );
	var minutes = parseInt( (curShowTimeSecond - hours*3600)/60 );
	var second =  curShowTimeSecond % 60;

	//绘制数字
	renderDigit ( Margin_left, Margin_top, parseInt(hours/10), cxt);
	renderDigit ( Margin_left+15*(Radius+1), Margin_top, parseInt(hours%10), cxt);
	renderDigit ( Margin_left+30*(Radius+1), Margin_top, 10, cxt); //冒号
	renderDigit ( Margin_left+40*(Radius+1), Margin_top, parseInt(minutes/10), cxt);
	renderDigit ( Margin_left+55*(Radius+1), Margin_top, parseInt(minutes%10), cxt);
	renderDigit ( Margin_left+70*(Radius+1), Margin_top, 10, cxt);
	renderDigit ( Margin_left+80*(Radius+1), Margin_top, parseInt(second/10), cxt);
	renderDigit ( Margin_left+95*(Radius+1), Margin_top, parseInt(second%10), cxt);

	for( var i=0; i<balls.length; i++ ){
		cxt.fillStyle = balls[i].color;
		cxt.beginPath();
		cxt.arc( balls[i].x, balls[i].y, Radius, 0, 2*Math.PI, true );
		cxt.closePath();

		cxt.fill();
	}
}

//绘制数字
function renderDigit ( x, y, num, cxt) {

	cxt.fillStyle = "rgb(0, 102, 153)";

	for( var i = 0; i < digit[num].length; i++) {
		for( var j = 0; j < digit[num][i].length; j++) {
			if(digit[num][i][j] == 1){
				cxt.beginPath();
				cxt.arc( x+j*2*(Radius+1)+(Radius+1), y+i*2*(Radius+1)+(Radius+1), Radius, 0, 2*Math.PI);
				cxt.closePath();

				cxt.fill();
			}
		}
	}
}


