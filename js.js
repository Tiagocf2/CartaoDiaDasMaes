const RAW = 0;
const FADE = 1;
const SLIDE = 2;
const NEXT = true;
const PREV = false;
var isFlyerLocked = true;
var backTilt = false;
var bodyBgActive = false;
var e = null;
var currentPage = 0;
var cursorY = 0;
var cursorX = 0;

//1366 x 663

document.onmousemove = getCursorXY;

function getCursorXY(e) {
	cursorX = e.pageX;
	cursorY = e.pageY;
}

function open(){
	console.log("openning..");
	var time = 0;
	if(isFlyerLocked){
		isFlyerLocked = false;
		time += 1000;
		hideElement(document.getElementById("title1"), FADE);
		setTimeout(showElement, time, document.getElementById("title2"), SLIDE);
		time += 1150;
		setTimeout(showElement, time, document.getElementById("title-underline"), FADE);
		curveText("title2",550,3);
	}
	
	time += 350;
	var delay = setTimeout(childDisplay, time, "feathers", true, 250, true);
	time += delay + 750;
	setTimeout(childDisplay, time, "spears", true, 0, false);
	setTimeout(toggleBodyBg, time+1000);
	


	if(!backTilt){
		document.getElementById("card-back").classList.add("tilt");
		backTilt = true;
	}

	return time;
}

function close(){
	console.log("closing..");
	var time = 0;
	var delay = 0;
	setTimeout(toggleBodyBg, time+500);
	time += childDisplay("feathers", false, delay, true);
	delay = 0
	time += childDisplay("spears", false, delay, false);

	time += 900;
	if(backTilt){
		setTimeout(function(){document.getElementById("card-back").classList.remove("tilt")},time);
		backTilt = false;
	}

	return delay;
}

function flip(nextOrPrev, sheet){ //NEXT = true | PREV = false
	var time = 0;
	var page = sheet.children;

	if((currentPage == 0) || (currentPage == 2)){
		time = open();
	}
	if (currentPage == 1){
		time = close();
	}
	
	if(time < 1020){
		time = 1020;
	}

	time += 500;
	toggleButtons();
	setTimeout(toggleButtons, time);
	setTimeout(toggleEnabled, 500, page[0]);
	setTimeout(toggleEnabled, 520, page[1]);
	if(currentPage == 1 && !nextOrPrev){
		zindex = 100;
	} else {
		zindex = (currentPage)*10 + 20;
	}
	setTimeout(function(){sheet.style.zIndex = zindex;},500);

	if(nextOrPrev){ //NEXT
		sheet.classList.remove("flip-prev");
		sheet.classList.add("flip-next");
		currentPage++;
	} else if (!nextOrPrev){ //PREV
		sheet.classList.remove("flip-next");
		sheet.classList.add("flip-prev");
		currentPage--;
	}
	//setTimeout(toggleEnabled, time, sheet);

	/*switch(currentPage){
		case 0:
			setTimeout(toggleEnabled, time, document.getElementById("card-back"));
			break;
		case 2:
			setTimeout(toggleEnabled, time, document.getElementById("card-front"));
			break;
	}*/
	console.log(currentPage);
}

function toggleEnabled(element){
	if(element.classList.contains("hidden")){	
		showElement(element, RAW);
	} else {
		hideElement(element, RAW);
	}
}

function toggleButtons(){

	btns = document.getElementsByName("btn");
	for(i = 0; i < btns.length; i++){
		btns[i].disabled = !btns[i].disabled;
	}

	/*element = element.children.btn;
	if(element == undefined){
		return;
	}

	if(element.disabled){
		element.disabled = false;
	} else {
		element.disabled = true;
	}*/
}

function hideElement(el_hide, mode){
	switch(mode){
		case FADE:
			el_hide.classList.add("fade-out");
			setTimeout(hideElement, 1000, el_hide, RAW);
			break;
		case RAW:
			el_hide.classList.add("hidden");
			break;
	}
}

function showElement(el_show, mode){
	el_show.classList.remove("fade-out");
	el_show.classList.remove("hidden");
	switch(mode){
		case FADE:
			el_show.classList.add("fade-in");
			break;
		case SLIDE:
			el_show.classList.add("slide-in");
			break;
	}
}

function curveText(parent_id, radius, factor){
	var parent = document.getElementById(parent_id);
	var lw = 40;
	var cont = 0
	var childs = parent.children;
	var rot = childs.length * factor / 2 + (factor / 2);
	var dispX = childs.length * lw / 2 - lw;

	for (cont = 0; cont < childs.length; cont++){
		childs[cont].className = "curve-letter";
		childs[cont].style.height = radius + "px";
		var rotation = (cont+1) * factor;
		childs[cont].style.transform = "rotateZ(" + rotation + "deg)";
	}	
	parent.style.transform = "rotateZ("+ -rot +"deg)";
	parent.style.transform += "translateX(-" + dispX + "px)";
	parent.classList.add("curved-text");
}

function childDisplay(parent_id, onOff, delay, reverse){
	var cs = document.getElementById(parent_id).children;
	parent_id = parent_id.substring(0, parent_id.length - 1);

	if(onOff){
		delayed_in(cs, parent_id, delay, (reverse)?cs.length-1:0, reverse);	
	} else {
		delayed_out(cs, parent_id, delay, (reverse)?cs.length-1:0, reverse);	
	}
	return cs.length * delay;
}
// parent_id + "-in"

function delayed_in(arr, value, delay, cont, reverse){
	if(reverse && cont < 0){
		return;
	}
	else if(cont >= arr.length){
		return;
	}
	
	arr[cont].classList.add(value + "-in");
	showElement(arr[cont], RAW);
	var sum = (reverse)?-1:1;
	cont += sum
	setTimeout(delayed_in, delay, arr, value, delay, cont, reverse);
}

function delayed_out(arr, value, delay, cont, reverse){
	if(reverse && cont < 0){
		return;
	}
	if(cont >= arr.length){
		return;
	}

	hideElement(arr[cont], FADE);
	var sum = (reverse)?-1:1;
	cont += sum
	setTimeout(delayed_out, delay, arr, value, delay, cont, reverse);
}

function hide_cover(){
	cover = document.getElementById("cover");
	cover.classList.add("cover-hide");
	setTimeout(hideElement, 2000, cover, RAW);
}

function enableButton(){
	document.getElementById("card-next").disabled = false;
}

function toggleBodyBg(){
	if(bodyBgActive){
		document.getElementById("background").classList.remove("fade");
		document.getElementById("title2").classList.remove("white");
	}else{
		document.getElementById("background").classList.add("fade");
		document.getElementById("title2").classList.add("white");
	}
	bodyBgActive = !bodyBgActive;
}