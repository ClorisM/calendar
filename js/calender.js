// JavaScript Document
//要用到的函数
General={
	//获取元素
	$:function(arg,context){
		context=context||document;
		var sub=arg.substring(1),eles=[];
		if(typeof arg=='string'){
			switch(arg.charAt(0)){
			  case '#':return document.getElementById(sub);
			            break;
			  case '.':if(context.getElementsByClassName) return context.getElementsByClassName(sub);
			           else{var ele=General.$('*',context);
					        for(var i=0;i<ele.length;i++){
								if(ele[i].className==sub)
								  eles.push(ele[i]);
								}
							return eles;
						}
		      default:return context.getElementsByTagName(arg);
			}
			}
		},
	 //获取位置坐标
	 getPos:function(ele){                                                                                                                                                                                                                                                            
		 var windowScrX=document.documentElement.scrollLeft||document.body.scrollLeft;
		 var windowScrY=document.documentElement.scrollTop||document.body.scrollTop;
		 var pos=ele.getBoundingClientRect();
		 return{left:pos.left+windowScrX,top:pos.top+windowScrY,bottom:pos.bottom+windowScrY}
		 },
	//绑定事件
	bind:function(ele,type,handler){
		if(ele.addEventListener){ele.addEventListener(type,handler,false);}
		else if(ele.attachEvent){ele.attachEvent('on'+type,handler)}
		else{ele['on'+type]=handler;}
		},
	//阻止冒泡事件
	stopPropagation:function(event){
		event=event||window.event;
		event.stopPropagation?event.stopPropagation():event.cancelBubble;
		},
	//添加类名
	addClass:function(ele,cls){
		ele.className+=' '+cls;
		},
	//删除类名
	removeClass:function(ele,cls){
		var reg=new RegExp("(^|\\s)"+cls+"(\\s|$)","g");
		ele.className=ele.className.replace(reg, '');
		
		}
	}//General结束
function Calender(){
	 var init={
		isSelect:true
		}
	 this.inputEvent();
	
	}
	
Calender.prototype={
	//日历标准框架
	frame:['<dl>'+
		    '<dt class="date-title">'+
			'<span class="prevyear">prevyear</span><span class="prevmonth">prevmonth</span>'+
			'<span class="nextyear">nextyear</span><span class="nextmonth">nextmonth</span>'+
			'</dt>'+
			'<dt>日</dt>'+
			'<dt>一</dt>'+
			'<dt>二</dt>'+
			'<dt>三</dt>'+
			'<dt>四</dt>'+
			'<dt>五</dt>'+
			'<dt>六</dt>'+
			'<dd></dd>'+
		    '</dl>'
			   ],
	//input点击，日期层出现
	inputEvent:function(event){
		var input=General.$('input')[0];
		var that=this;
		General.bind(input,'click',function(){
											that.createContainer();
											that.renderCalender(new Date());
											input.value='';
											})
		},
 
	//创建日历容器并设置它的位置
	createContainer:function(){
		var prevContainer=General.$('#container');
		this.container=document.createElement('div');
		var input=General.$('input')[0];
		if(prevContainer) prevContainer.parentNode.removeChild(prevContainer);
		this.container.id="container";
		this.container.className="container";
		//获取input的坐标
        var inputPos=General.getPos(input);
		//根据input的位置设置container的位置
		this.container.style.position='absolute';
		this.container.style.left=inputPos.left+'px';

		this.container.style.top=inputPos.bottom+'px';
		//给container绑定点击事件，阻止冒泡，主要是是为了点击其他区域关闭container
		General.bind(this.container,'click',General.stopPropagation);
		document.body.appendChild(this.container);
		},
	//渲染日期
	renderCalender:function(odate){
		
		this.dateWrap=document.createElement('div');
		this.dateWrap.className="dateWrap";
		this.dateWrap.innerHTML=this.frame;
	    //获取日期
		this.year=odate.getFullYear(),this.month=odate.getMonth(),this.day=odate.getDate();
		var currDate=new Date(),currYear=currDate.getFullYear(),currMonth=currDate.getMonth(),currDay=currDate.getDate();
		//获取当月天数
		var days=new Date(this.year,this.month+1,0).getDate();
	    //获取当月第一天是星期几
		var weekday=new Date(this.year,this.month,1).getDay();
		//创建日期字符串
		var daysArray=[];
		//开头显示空白
		for(var i=0;i<weekday;i++){
			daysArray.push('<a>&nbsp;</a>')
			}
		for(var i=1;i<days+1;i++){
			if(this.year<currYear){daysArray.push('<a class="pass">'+i+'</a>');
			}else if(this.year==currYear){
				if(this.month<currMonth){
					daysArray.push('<a class="pass">'+i+'</a>');
					}else if(this.month==currMonth){
						if(i<currDay){
							daysArray.push('<a class="pass">'+i+'</a>');
						}else if(i==currDay){
							daysArray.push('<a class="present">'+i+'</a>');
							}else if(i>currDay){
								daysArray.push('<a class="future">'+i+'</a>');
								}
						}else if(this.month>currMonth){
							daysArray.push('<a class="future">'+i+'</a>');
							}
				}else if(this.year>currYear){
					daysArray.push('<a class="future">'+i+'</a>');
					}
		}
		//获取dd元素
		 this.dd1=General.$('dd',this.dateWrap)[0];
		this.dd1.innerHTML=daysArray.join('');
	

       //获取dateWrap的标题部分,判断是否可以选择日期
	    this.datetitle=General.$('.date-title',this.dateWrap)[0];
		var title=document.createElement('span');
		var yearArr=[],yearStr,monthArr=[],monthStr;
		if(this.init.isSelect){
			 yearArr.push('<select>');
			 monthArr.push('<select>');
			for(var i=1997;i<2022;i++){
				if(i!=this.year)
			  yearArr.push('<option>'+i+'</option>');
			   else yearArr.push('<option selected>'+i+'</option>');
			}
			for(var i=1;i<13;i++){
				if(i!=this.month+1)
				monthArr.push('<option>'+i+'</option>');
				else monthArr.push('<option selected>'+i+'</option>');
				}
			 yearArr.push('</select>');
			 yearStr=yearArr.join('');
			 monthArr.push('</select>');
			 monthStr=monthArr.join('');
			 title.innerHTML=yearStr+'年'+monthStr+'月';
	     	this.datetitle.appendChild(title);	
			this.selectChange();
			}else{
			 title.innerHTML=this.year+'年'+(this.month+1)+'月';
	     	this.datetitle.appendChild(title);	
			}
		var prevDateWrap=General.$('.dateWrap',this.container)[0];
        if(prevDateWrap) prevDateWrap.parentNode.removeChild(prevDateWrap);
		this.container.appendChild(this.dateWrap);
		this.btnEvent();
		this.outerEvent();
		this.clickEvent();
		},//renderCalender结束
	//选择年份或月份
	selectChange:function(){
		var that=this,sel,yearsel,monthsel,odate;
		sel=General.$('select',this.dateWrap);
		yearsel=sel[0];
		monthsel=sel[1];
		General.bind(yearsel,'change',function(){
											   odate=new Date(yearsel.value,that.month,that.day);
											   that.renderCalender(odate);
											   });
		General.bind(monthsel,'change',function(){
											   odate=new Date(that.year,(monthsel.value-1),that.day);
											   that.renderCalender(odate);
											   });
		
		},
	//鼠标点击日期时间
	clickEvent:function(){
		var that=this;
		var aArr=General.$('a',this.dd);
		for(var i=0;i<aArr.length;i++){
			General.bind(aArr[i],'click',function(event){
												  event=event||window.event;
												  target=event.target||event.srcElement;
												  var bgc=General.$('.bgc',this.dd)[0];
												  var present=General.$('.present',this.dd)[0];
												  if(present)
												  present.style.background='#E8E8E8';
												   if(bgc){
												  if(bgc!=target){
													   General.removeClass(bgc,'bgc');
													   General.addClass(target,'bgc');
												
													  }
												   }else{ General.addClass(target,'bgc');}
											     var input=General.$('input')[0];
												 var val=target.innerHTML;
										       input.value=that.year+'年'+(that.month+1)+'月'+val+'日';
												 });
			}
		},
	//切换年份和月份的按钮事件
   btnEvent:function(event){
	   var that=this;
	       prevyear=General.$('.prevyear')[0],
	       prevmonth=General.$('.prevmonth')[0],
	       nextyear=General.$('.nextyear')[0],
	       nextmonth=General.$('.nextmonth')[0];
	  General.bind(prevyear,'click',function(){
											 var odate=new Date(that.year-1,that.month,that.day);
	                                         that.renderCalender(odate);    
											 });
	  General.bind(prevmonth,'click',function(){
											 var odate=new Date(that.year,that.month-1,that.day);
	                                         that.renderCalender(odate);    
											 });
	  General.bind(nextyear,'click',function(){
											 var odate=new Date(that.year+1,that.month,that.day);
	                                         that.renderCalender(odate);    
											 });
 	  General.bind(nextmonth,'click',function(){
											 var odate=new Date(that.year,that.month+1,that.day);
	                                         that.renderCalender(odate);    
											 });
	   
	  
	   },
    //点击区域外，日期层关闭
       outerEvent:function(){
		//var dateWrap=General.$('.dateWrap',this.container)[0];
		var that=this,input=General.$('input')[0];
		General.bind(document,'click',function(event){
											   event=event||window.event;
											  var target=event.target||event.srcElement;
											  if(target!=that.dateWrap&&target!=input){
											  that.dateWrap.parentNode.remove(that.dateWrap);
											  }
											   });
		
				},
	}//calender.prototype结束
		
	