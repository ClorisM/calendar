	function Calendar(mainContainer,isSelect,isperiod,min,max,date,callback){
		this.mainContainer=mainContainer;
		this.isSelect=isSelect;
		this.isperiod=isperiod;
		this.min=min;
		this.max=max;
		this.date=date;
		this.callback=callback;
		this.index1=0;

		this.chosedDate=new Date();
		this.chosedDates=[];

		this.createCalendar();
		this.renderCalendar(this.date);
		this.selectEvent();
	}
	Calendar.prototype={
		//产生日历框架
		createCalendar:function(){
			var self=this;
			var container=$('<div>').addClass('container').appendTo(self.mainContainer);
			//设置input框
			var input=$('<input id="input">').appendTo(container).click(function(){
				calendarFrame.toggle();
			});
			//设置日历框架
			var calendarFrame=$('<div>').addClass('calendarFrame').appendTo(container);
			//头部
			var header=$('<div>').addClass('header').appendTo(calendarFrame);
			var prevyear=$('<span>').addClass('prevyear').appendTo(header).click(function(){self.prevyearEvent()});
			var prevmonth=$('<span>').addClass('prevmonth').appendTo(header).click(function(){self.prevmonthEvent()});
			var nextyear=$('<span>').addClass('nextyear').appendTo(header).click(function(){self.nextyearEvent()});
			var nextmonth=$('<span>').addClass('nextmonth').appendTo(header).click(function(){self.nextmonthEvent()});
			var datetitle=$('<span>').addClass('datetitle').appendTo(header);
			if(this.isSelect){
				datetitle.html('<select class="selyear"></select>'+'年'+'<select class="selmonth"></select>'+'月');
				for(i=1997;i<2022;i++){
					if(this.date.getFullYear()==i){
						$('<option selected>').html(i).appendTo($('select')[0]);
					}else{
						$('<option>').html(i).appendTo($('select')[0]);
					}
				}
				for(i=1;i<12;i++){
					if((this.date.getMonth()+1)==i){
						$('<option selected>').html(i).appendTo($('select')[1]);
					}else{
						$('<option>').html(i).appendTo($('select')[1]);
						
					}
				}

			}
			//内容部分
			var content=$('<div>').addClass('content').click(function(e){self.choseEvent(e)}).appendTo(calendarFrame);
			// for(var i=0;i<42;i++){
			// 	$('<span>').appendTo(content);
			// }
			//底部按钮区
			var footer=$('<div>').addClass('footer').appendTo(calendarFrame);
			
			var sureBtn=$('<input type="button" value="确定">').addClass('sureBtn').appendTo(footer).click(function(){
				calendarFrame.hide();
				self.outputEvent($('#input'));
				self.callback();
			});
			var cancelBtn=$('<input type="button" value="取消">').addClass('cancelBtn').appendTo(footer).click(function(){
				calendarFrame.hide();
			});
		},
		//渲染日期
		renderCalendar:function(date){

			var weeks=['日','一','二','三','四','五','六']
			//var spans=$('.content>span');
			var content=$('.content');
			content.html('');
				//首先把前面的星期渲染出来
			for(var i=0;i<7;i++){
				//$(spans[i]).html(weeks[i]);
				$('<span>').html(weeks[i]).appendTo(content)
			}	
             
			//找到第一个日期
			var odate=new Date(date);
			odate.setDate(odate-date+1);
			odate.setDate(odate.getDate()-odate.getDay())

			for(var i=7;i<49;i++){
				//$(spans[i]).html(odate.getDate());
				var item=$('<span>').html(odate.getDate())
				//不是同月样式不一样
				if(odate.getMonth()!=date.getMonth()){
					//$(spans[i]).css('color','#CCC');
					item.css('color','#CCC')
				}
				//周六周日样式不一样
				if(odate.getDay()==0||odate.getDay()==6){
					//$(spans[i]).css('color','#C91B02');
					item.css('color','#C91B02')
				}
				if(odate.getTime()==this.date.getTime()){
					this.index1=i;
				}
				//选择日期段
				if(this.isperiod){
					var date1=this.chosedDates[0];
					var date2=this.chosedDates[1];

					if(date1&&date2){
							if(odate.getTime()==date1.getTime()||odate.getTime()==date2.getTime()){
							item.css('background-color','#FF0000');	
							}
						 	if(odate.getTime()>date1.getTime()&&odate.getTime()<date2.getTime()||odate.getTime()<date1.getTime()&&odate.getTime()>date2.getTime()){
							item.css('background-color','#EBF4F9')
							}					
					}
					}
				//点击选择单个日期
				if(odate.getTime()==this.chosedDate.getTime()){
					//$(spans[i]).css('background-color','#FF0000');
					item.css('background-color','#FF0000')
				}
				if(!this.isSelect){
					$('.datetitle').html(date.getFullYear()+'年'+(parseInt(date.getMonth())+1)+'月');
				}
				item.appendTo(content)
				odate.setDate(odate.getDate()+1);
			}
		},//renderCalendar完
		prevyearEvent:function(){
			this.date.setFullYear(this.date.getFullYear()-1);
	        this.renderCalendar(this.date);  
		},
		prevmonthEvent:function(){
			this.date.setMonth(this.date.getMonth()-1);
	        this.renderCalendar(this.date);  
		},
		nextyearEvent:function(){
			this.date.setFullYear(this.date.getFullYear()+1);
	        this.renderCalendar(this.date);  
		},
		nextmonthEvent:function(){
			this.date.setMonth(this.date.getMonth()+1);
	        this.renderCalendar(this.date);  
		},
		//点选事件
		choseEvent:function(event){
			event=event||window.event;
			var chosedEle=$(event.target)
			var spans=$('.content span');
			var index2=spans.index(chosedEle);
			this.chosedDate=new Date(this.date);
			this.chosedDate.setDate(this.date.getDate()+(index2-this.index1));
			if(this.isperiod){
				if(this.chosedDates.length>=1){
				var predate=this.chosedDates[this.chosedDates.length-1];
				var days=(Math.abs(this.chosedDate.getTime()-predate.getTime()))/1000/60/60/24;
				}
				if(this.chosedDates.length>1){
					this.chosedDates.shift();
				}
				if(days&&(days<this.min||days>this.max)){
					alert('不在时间跨度范围内，请重新选择')
				}else{
					this.chosedDates.push(this.chosedDate);
					this.renderCalendar(this.chosedDate);
				}
				
			}else{
				this.renderCalendar(this.chosedDate);
			}
					
		},
		//输出事件
		outputEvent:function(obj){
			var date1=this.chosedDates[0];
			var date2=this.chosedDates[1];
			obj.html();
			if(this.isperiod){
				if(date1&&date2){
					if(date2.getTime()>date1.getTime()){
						obj.val(date1.getFullYear()+'年'+(parseInt(date1.getMonth())+1)+'月'+date1.getDate()+'号'+'-'+date2.getFullYear()+'年'+date2.getMonth()+'月'+date2.getDate()+'号');
					}else{
						obj.val(date2.getFullYear()+'年'+(parseInt(date2.getMonth())+1)+'月'+date2.getDate()+'号'+'-'+date1.getFullYear()+'年'+date1.getMonth()+'月'+date1.getDate()+'号');

					}
				}
			}else{
				obj.val(this.chosedDate.getFullYear()+'年'+(parseInt(this.chosedDate.getMonth())+1)+'月'+this.chosedDate.getDate()+'号');
			}
		},
		selectEvent:function(){
			var selyear=$('.selyear');
			var selmonth=$('.selmonth');
			var self=this;
			selyear.change(function(){
				self.date.setFullYear(selyear.val());
				self.renderCalendar(self.date);
			})
			selmonth.change(function(){
				self.date.setMonth(selmonth.val()-1);
				self.renderCalendar(self.date);
			})
			
		}
	}
