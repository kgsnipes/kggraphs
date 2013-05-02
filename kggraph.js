/*
author: kaushik ganguly
email; kgsnipes@gmail.com

*/

//this is a utility to have Object.create() work on browsers that do not support
if(typeof Object.create !=='function'){
	Object.create=function(obj){
		function F(){};
		f.prototype=obj;
		return new F();
	};
}


(function( $ ,window, document,undefined){

var kgg={

	init:function(options,elem)
	{
		self=this;
		self.obj=self;
		self.$elem=$(elem);
		self.$elem.css({'padding':'10px'});
		self.options=$.extend({},$.fn.kggraph.options,options);

		self.clear();

		self.$canvas=document.createElement("canvas");

		self.$elem.width(self.options.width);
		self.$elem.height(self.options.height);

		$(self.$canvas).appendTo(self.$elem);

		$(self.$canvas).css({'border':'1px solid #e1e8f8','margin-top':'10px','margin-bottom':'10px'});
		self.$elem.css({'border':'3px dashed #eee','margin':'10px','overflow':'auto'});
		
		$(self.$canvas).attr('width',self.options.width);
		$(self.$canvas).attr('height',self.options.height);
		
		if(self.options.type=='pie chart')
		{

			
			self.drawPieChart(self.options.data);
		}
		else if(self.options.type=='point chart' && !self.options.hasTrends)
		{

			
			self.drawPointChart(self.options.data);
		}
		else if(self.options.type=='point chart' && self.options.hasTrends)
		{

			
			self.drawPointChartWithTrends(self.options.data);
		} 


	   

	},
	clearCanvas:function()
	{
		self=this;

		

		//console.log("hello");
		$(self.$canvas).css({'border':'1px solid green'});
		self.$canvas.getContext('2d').clearRect(0, 0, self.options.width, self.options.height);

	},
	clear:function()
	{
		self=this;
		self.$elem.empty();

	},
	randomColor:function(){


		return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);


		/*var r = function () { return Math.floor(Math.random()*256) };
    return "rgba(" + r() + "," + r() + "," + r() + ",1.0)";
*/


	 


	},
	colorShades:function(constantPart,len)
	{
		var retVal=new Array();
		//var rgba_arr=self.replace(self.replace(self.replace(rgba,"rgba",""),"(",""),")","").split(",");
		var increment=16;
		var opacity=1.0;
		var level=64;
		 var temp='rgba(0,0,0,1.0)';
		for(i=0;i<len;i++)
		{
			
			if(level<=256)
			{
				var rgba_arr=self.replace(self.replace(self.replace(temp,"rgba",""),"(",""),")","").split(",");
				if(constantPart==1)
				{
					temp="rgba("+(parseFloat(rgba_arr[0])+level)+",0,0,1.0)";
					//temp="rgba("+parseFloat(rgba_arr[0])+","+parseFloat(rgba_arr[1])+","+parseFloat(rgba_arr[2])+","+opacity.toFixed(1)+")";
				}
				else if(constantPart==2)
				{
					temp="rgba(0,"+(parseFloat(rgba_arr[1])+level)+",0,1.0)";	
				//	temp="rgba("+parseFloat(rgba_arr[0])+",0.0,0.0,"+opacity+")";
				}
				else if(constantPart==3)
				{
					temp="rgba(0,0,"+(parseFloat(rgba_arr[2])+level)+",1.0)";
				//	temp="rgba("+parseFloat(rgba_arr[0])+",0.0,0.0,"+opacity+")";
				}
				level+=32;
			}
			else
			{

				var rgba_arr=self.replace(self.replace(self.replace(temp,"rgba",""),"(",""),")","").split(",");
			if(constantPart==1)
			{
				temp="rgba("+parseFloat(rgba_arr[0])+","+(parseFloat(rgba_arr[1])+increment)+","+(parseFloat(rgba_arr[2])+increment)+",1.0)";
				//temp="rgba("+parseFloat(rgba_arr[0])+","+parseFloat(rgba_arr[1])+","+parseFloat(rgba_arr[2])+","+opacity.toFixed(1)+")";
			}
			else if(constantPart==2)
			{
				temp="rgba("+parseFloat(rgba_arr[0]+increment)+","+(parseFloat(rgba_arr[1]))+","+(parseFloat(rgba_arr[2])+increment)+",1.0)";	
			//	temp="rgba("+parseFloat(rgba_arr[0])+",0.0,0.0,"+opacity+")";
			}
			else if(constantPart==3)
			{
				temp="rgba("+parseFloat(rgba_arr[0]+increment)+","+(parseFloat(rgba_arr[1])+increment)+","+(parseFloat(rgba_arr[2]))+",1.0)";
			//	temp="rgba("+parseFloat(rgba_arr[0])+",0.0,0.0,"+opacity+")";
			}

			//opacity-=0.20;
			increment+=32;
			}

			retVal.push(temp);
		}
		
		//console.log(retVal);
		
		return retVal;
	},
	trim:function(s){

		var l=0; var r=s.length -1;
		while(l < s.length && s[l] == ' ')
		{	l++; }
		while(r > l && s[r] == ' ')
		{	r-=1;	}
		return s.substring(l, r+1);
	},
	replace:function(str,replace_this,replace_with){
	while(str.indexOf(replace_this) > -1){
	str = str.replace(replace_this,replace_with);
	}
	return str;
	},
	sum:function(vals)
	{
		var s=0.0;
		$.each(vals,function()
		{
			s+=this;

		});

		return s;

	},
	max:function(vals)
	{
		var v=vals[0];
		for(i=0;i<vals.length;i++)
		{	
			if(vals[i]>v)
			{
				v=vals[i];
			}
		}
		return v;	
	},
	min:function(vals)
	{
		var v=vals[0];
		for(i=0;i<vals.length;i++)
		{	
			if(vals[i]<v)
			{
				v=vals[i];
			}
		}
		return v;	

	},
	vfd:function(val)//value for drawing
	{
		return Math.floor(val);
		//return val;
	},
	percent:function(val,percent,isvfd)
	{
		var v=0;
		if(val>0)
		{
			v=val*(percent/100.0);
		}

		if(isvfd)
		{
			v=self.vfd(v);
		}
		return v;
	},
	percentage:function(sum,val,isvfd){
		var v=0;
		if(sum>0 && sum>=val)
		{
			if(val==0)
			{
				return 0;
			}
			else
			{
				v=(val*100)/sum;
				if(isvfd)
				{
					v=self.vfd(v);
				}
				return v;
			}

		}
		else
		{
			return 0;
		}
	},
	XYForCanvas:function(percentage)
	{
		self=this;
		var X=0;
		var Y=0;
		if(self.options.width>0 && self.options.height>0)
		{
			X=self.vfd(self.options.width*(percentage/100.0));
			Y=self.vfd(self.options.height*(percentage/100.0));
		}
		

		return {'x':X,'y':Y};
	},
	containsElement:function (arr, ele) {
                var found = false, index = 0;
                while(!found && index < arr.length)
                if(arr[index] == ele)
                found = true;
                else
                index++;
                return found;
            },
    getColors:function(length)
    {
    	var arr=new Array();
    	for(i=0;i<length;i++)
    	{

    			var color='';
    			do
    			{
    				color=self.randomColor();
    				if(color=="#ffffff")
    				{
    					continue;
    				}
    			}while(self.containsElement(arr,color));

    			arr.push(color);
    	}

    	return arr;

    },
    componentToHex:function(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	},

	rgbToHex:function (r, g, b) {
	    return "#" + self.componentToHex(r) + self.componentToHex(g) + self.componentToHex(b);
	},
	drawPieChart:function(data) {

		//console.log("drawing it");

		if(self.options.width>self.options.height)
		{
			self.options.width=self.options.height;

			self.$elem.width(self.options.width);
			self.$elem.height(self.options.height);

		$(self.$canvas).attr('width',self.options.width);
		$(self.$canvas).attr('height',self.options.height);
  			
		}
		
		var canvas=self.$canvas;
		var ctx = canvas.getContext('2d');
		var midPoint=self.XYForCanvas(50);
		var onePercentDegree=self.percent(360,1,false);
		
		var valArr=new Array();
		var dataCopy=new Array();
		for(i=0;i<data.length;i++)
		{
			valArr.push(data[i][1]);
			dataCopy.push(data[i]);
		}
	
		var sum=self.sum(valArr);
		//console.log(sum);
		var piBy180 = 3.14 / 180;

		var startDegree=0;
		var endDegree=0;

		var colors;

		if(self.options.colors && self.options.colors.length>0)
		{
			colors=self.options.colors;
		}
		else
		{
			//colors=self.getColors(valArr.length);
			if(self.options.useRGBAColorScheme)
			{
				colors=self.colorShades(3,valArr.length);
			}
			else
			{
				colors=self.getColors(valArr.length);
			}
			
		}
		

		
		
				for (i = 0; i < valArr.length; i++) {

				if(valArr[i]>0)
				{
					
							endDegree = startDegree + self.percentage(sum,valArr[i],false)* onePercentDegree;
			       		 ctx.strokeStyle = colors[i];
			       		 ctx.lineWidth = 5;
						var radius = self.vfd(self.percent(self.options.width,90,true)*0.5);
			 			while (radius >= 0) {
							ctx.beginPath();
				            ctx.arc(midPoint.x, midPoint.y, radius, startDegree * piBy180, endDegree * piBy180, false);
				            ctx.stroke();
				            ctx.closePath();
				            radius -= 1;
				        	
				        }
						startDegree = endDegree;
				}
				 

			}


		
		self.$canvas.addEventListener('mousemove', function(evt){self.canvasMouseMoveForPieChart(evt,self,colors,dataCopy);}, false);
		

		
			self.drawLegendForPieChart(colors);
		
    
	},
	drawLegendForPieChart:function(colors)
	{
		self=this;
		
		$("<label>"+self.options.title+"</label>").insertBefore(self.$elem.children("canvas")[0]);

		var htmlStr="<table>";
		var data=self.options.data;
		htmlStr+="<tr>";
		
		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{
			htmlStr+="<td>&nbsp;&nbsp;&nbsp;";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+self.options.columnTitles[0];
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+self.options.columnTitles[1];
			htmlStr+="</td>";

		}
		/*else
		{
			htmlStr+="<td>(X - axis)";
			htmlStr+="</td>";
			htmlStr+="<td>(Y - axis)";
			htmlStr+="</td>";
		}*/
			

		

		htmlStr+="</tr>";

		for(i=0;i<data.length;i++)
		{
			htmlStr+="<tr>";
			htmlStr+="<td style=\"background-color:"+colors[i]+"\">&nbsp;&nbsp;&nbsp;";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;<a class=\"graph_section_"+i+"\">"+data[i][0];
			htmlStr+="</a></td>";
			htmlStr+="<td>("+data[i][1]+")";
			htmlStr+="</td>";
			htmlStr+="</tr>";

		}



		htmlStr+="</table>";

		$(htmlStr).appendTo(self.$elem);
		
		//self.$elem.children("table").css({'margin':'0 auto'});
		self.$elem.children("table").css({'margin':'10px'});
		self.$elem.children("label").css({'margin':'10px'});
		self.$elem.width();
		self.$elem.height(self.$elem.height()+self.$elem.children("table").height()+(self.$elem.children("label").height()*2));

	},
	drawPointChart:function(data)
	{
		var canvas=self.$canvas;
		var ctx = canvas.getContext('2d');

		var xvals=new Array();
		var yvals=new Array();

		for(i=0;i<data.length;i++)
		{
			xvals.push(data[i][0]);
			yvals.push(data[i][1]);
		}

		//xvals=xvals.reverse();
		//yvals=yvals.reverse();

		var xmax=self.max(xvals);
		xmax=xmax+self.percent(xmax,10,false);
		var ymax=self.max(yvals);
		ymax=ymax+self.percent(ymax,10,false);

		var xorigin=self.vfd(self.options.width*0.20);
	    var yorigin=self.vfd(self.options.height*0.80);
	   // console.log("xorigin :"+xorigin+" yorigin:"+yorigin);

	    var ylength=self.vfd(self.options.height*0.80)-self.vfd(self.options.height*0.20);
	    var xlength=self.vfd(self.options.width*0.80)-self.vfd(self.options.width*0.20);


	   // console.log("xlength :"+xlength+" ylength:"+ylength);
	   // console.log("xmax :"+xmax+" ymax:"+ymax);

		// drawing the axes
		ctx.strokeStyle = '#396bd5';
	    ctx.beginPath();
	    ctx.moveTo(self.vfd(self.options.width*0.20), self.vfd(self.options.height*0.80));
	    ctx.lineTo(self.vfd(self.options.width*0.80), self.vfd(self.options.height*0.80));
	    ctx.moveTo(self.vfd(self.options.width*0.20), self.vfd(self.options.height*0.80));
	    ctx.lineTo(self.vfd(self.options.width*0.20), self.vfd(self.options.height*0.20));
	    ctx.stroke();
	    ctx.closePath();
	    // drawing the axes

	    //paint origin
	    ctx.beginPath();
	    ctx.fillText('0', xorigin - 10, yorigin+10);
	    ctx.stroke();
	    ctx.closePath();


	    if(self.options.colors && self.options.colors.length>0)
		{
			colors=self.options.colors;
		}
		else
		{
			
			if(self.options.useRGBAColorScheme)
			{
				colors=self.colorShades(3,data.length);
			}
			else
			{
				colors=self.getColors(data.length);
			}
			
		}

		//draw grids if requested
		if(self.options.useGrids)
		{
			var labelx=xorigin+self.percent(xlength,10,true);
			var labely=yorigin-self.percent(ylength,10,true);
			var count=0;
			for(i=self.percent(xmax,10,false);i<=xmax;i+=self.percent(xmax,10,false))
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(labelx, yorigin);
			    ctx.lineTo(labelx, self.vfd(self.options.height*0.20));
			    ctx.stroke();
			    ctx.closePath();
			    labelx+=self.percent(xlength,10,true);
			    count++;
			}

			if(count<10)
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(labelx, yorigin);
			    ctx.lineTo(labelx, self.vfd(self.options.height*0.20));
			    ctx.stroke();
			    ctx.closePath();
			}

			count=0;

			for(i=self.percent(ymax,10,false);i<=ymax;i+=self.percent(ymax,10,false))
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(xorigin, labely);
			    ctx.lineTo(self.vfd(self.options.width*0.80), labely);
			    ctx.stroke();
			    ctx.closePath();
			    labely-=self.percent(ylength,10,true);
			    count++;
			}

			if(count<10)
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(xorigin, labely);
			    ctx.lineTo(self.vfd(self.options.width*0.80), labely);
			    ctx.stroke();
			    ctx.closePath();
			}
		}



		//label the axes
		var labelx=xorigin+self.percent(xlength,10,true);
		var labely=yorigin-self.percent(ylength,10,true);
		var count=0;
		for(i=self.percent(xmax,10,false);i<=xmax;i+=self.percent(xmax,10,false))
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(i.toFixed(2).toString(), labelx, yorigin+15);
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(labelx-2, yorigin-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		    labelx+=self.percent(xlength,10,true);
		    count++;
		}
		
		if(count<10)
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(xmax.toFixed(2).toString(), labelx, yorigin+15);
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(labelx-2, yorigin-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		}
		count=0;
		var yaxisSpacing=new Array();
		for(i=self.percent(ymax,10,false);i<=ymax;i+=self.percent(ymax,10,false))
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(i.toFixed(2).toString(), xorigin-(i.toFixed(2).toString().length*6), labely+5);
		    yaxisSpacing.push(xorigin-(i.toFixed(2).toString().length*6));
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(xorigin-2, labely-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		    labely-=self.percent(ylength,10,true);
		    ++count;
		}

		if(count<10)
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(ymax.toFixed(2).toString(), xorigin-(i.toFixed(2).toString().length*6), labely+5);
		     yaxisSpacing.push(xorigin-(i.toFixed(2).toString().length*6));
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(xorigin-2, labely-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		}


		//labelling the axes with axes names
		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{

			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(self.options.columnTitles[0], self.vfd(self.options.width*0.30), self.vfd(self.options.height*0.90));
		    ctx.stroke();
		    ctx.closePath();


		   

		    ctx.save();
		    ctx.translate(self.max(yaxisSpacing)-self.vfd(self.options.height*0.05), self.vfd(self.options.height*0.70));
			ctx.rotate(-Math.PI/2);
		    ctx.fillText(self.options.columnTitles[1], 0, 0);
		    ctx.restore();
		}
		
		
		var plotxy=new Array();
		var plotxyN=new Array();
		
		if(self.options.connectPointsWithOrigin)
		{
			plotxy.push(xorigin+","+yorigin);
		}
		//plot points
	     for (i = 0; i < data.length; i++) {
		        ctx.fillStyle = colors[i];

		        var xvalPercentage=self.percentage(xmax,xvals[i],false);
		        var yvalPercentage=self.percentage(ymax,yvals[i],false);
		        
		        var xper=self.percent(xlength,xvalPercentage,true);
		        var yper=self.percent(ylength,yvalPercentage,true);

		        var x=xorigin+xper ;
		        var y=yorigin-yper;
		        ctx.beginPath();
		        ctx.fillRect(x, y, 10, 10);
		        //console.log(x+","+y)

		        plotxy.push(x+","+y);
		        plotxyN.push([x,y]);
		        ctx.closePath();
        
   		 }


   		 
   		 //connect the points

   		 if(self.options.connectPoints)
		{
			var connectColor=self.getColors(1)[0];
			if(plotxy.length==1)
			{

			}
			else if(plotxy.length==2)
			{
				var coor=plotxy[0].split(",");
				var coor1=plotxy[1].split(",");
				ctx.strokeStyle = connectColor;
			    ctx.beginPath();
			    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
			    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
			    ctx.stroke();
			    ctx.closePath();
			}
			else if(plotxy.length>=3)
			{
				for (i = 0; i <(plotxy.length-1); i++) {
				//console.log(plotxy[i]+" "+plotxy[i+1]);
				var coor=plotxy[i].split(",");
				var coor1=plotxy[i+1].split(",");
				ctx.strokeStyle = connectColor;
			    ctx.beginPath();
			    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
			    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
			    ctx.stroke();
			    ctx.closePath();
			    
				}

				var coor=plotxy[plotxy.length-2].split(",");
				var coor1=plotxy[plotxy.length-1].split(",");
				ctx.strokeStyle =connectColor;
			    ctx.beginPath();
			    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
			    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
			    ctx.stroke();
			    ctx.closePath();
			}
			
		}


		//self.options.plotPoints=plotxy;

		
		//console.log("these are plot points "+JSON.stringify(self.options.plotPoints));
   		 self.drawLegendForPointChart(colors);

   		 self.$canvas.addEventListener('mousemove', function(evt){self.canvasMouseMove(evt,plotxyN,self,xvals,yvals);}, false);
   		 
   		 

	},
	canvasMouseDown:function(evt,points)
	{

		 var mousePos = self.getMousePos(evt.target, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);
        console.log("these are plot points "+JSON.stringify(points));
	},
	canvasMouseMove:function(evt,points,obj,xvals,yvals)
	{
		 var mousePos = self.getMousePos(evt.target, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
       
      
       var index=self.containsPos(points,[mousePos.x ,mousePos.y]);
        if(index>-1)
        {
        	//console.log(index);
        	if(!obj.options.tooltip)
        	{
        		obj.options.tooltip=document.createElement("label");
        		$(obj.options.tooltip).appendTo(obj.$elem);
        		$(obj.options.tooltip).css({'position': 'fixed','background-color':'#ffffff','border':'1px solid #396bd5'});
        	}
        	$(obj.options.tooltip).text("( "+xvals[index]+" , "+yvals[index]+" )");
        	$(obj.options.tooltip).show();
        	$(obj.options.tooltip).css({'top': evt.clientY+'px','left': evt.clientX+'px'});
        }
        else
        {
        	if(obj.options.tooltip)
        	{
        		$(obj.options.tooltip).hide();
        	}
        }


	},
	canvasMouseMoveForPieChart:function(evt,obj,colors,data)
	{
		 var mousePos = self.getMousePos(evt.target, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
       
       var c = evt.target.getContext('2d').getImageData(mousePos.x, mousePos.y, 1, 1).data;
       //console.log(c);
       //var colorStr="rgba("+c[0].toString()+c[1].toString()+c[2].toString()+")";
       var index=self.containsVal(colors,self.rgbToHex(c[0],c[1],c[2]));
       if(index>-1)
        {
        	//console.log(index);
        	if(!obj.options.tooltip)
        	{
        		obj.options.tooltip=document.createElement("label");
        		$(obj.options.tooltip).appendTo(obj.$elem);
        		$(obj.options.tooltip).css({'position': 'fixed','background-color':'#ffffff','border':'1px solid #396bd5'});
        	}
        	$(obj.options.tooltip).text("( "+data[index][0]+" - "+data[index][1]+" )");
        	$(obj.options.tooltip).show();
        	$(obj.options.tooltip).css({'top': evt.clientY+'px','left': evt.clientX+'px'});
        }
        else
        {
        	if(obj.options.tooltip)
        	{
        		$(obj.options.tooltip).hide();
        	}
        }

	},
	containsVal:function(arr,val)
	{
		var retVal=-1;
		
		for(i=0;i<arr.length;i++)
		{
			if(arr[i]==val)
			{

				retVal=i;
				break;
			}
		}

		return retVal;	
	},
	containsPos:function(arr,pos)
	{
		var retVal=-1;
		
		for(i=0;i<arr.length;i++)
		{
			if(((arr[i][0]==pos[0] && arr[i][1]==pos[1])) || ((pos[0]>=arr[i][0] && pos[0]<=arr[i][0]+10) && (pos[1]>=arr[i][1] && pos[1]<=arr[i][1]+10)) )
			{

				retVal=i;
				break;
			}
		}

		return retVal;	
	},
	getMousePos:function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      },
	drawLegendForPointChart:function(colors)
	{
		self=this;
		//self.$elem.css({'border':'1px solid #ccc','margin':'10px','overflow':'auto'});
		$("<label>"+self.options.title+"</label>").insertBefore(self.$elem.children("canvas")[0]);

		var htmlStr="<table>";
		var data=self.options.data;

		htmlStr+="<tr>";
		htmlStr+="<td>&nbsp;&nbsp;&nbsp;";
		htmlStr+="</td>";
		

		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{
			htmlStr+="<td>(X - axis)</br>"+self.options.columnTitles[0];
			htmlStr+="</td>";
			htmlStr+="<td>(Y - axis)</br>"+self.options.columnTitles[1];
			htmlStr+="</td>";

		}
		else
		{
			htmlStr+="<td>(X - axis)";
			htmlStr+="</td>";
			htmlStr+="<td>(Y - axis)";
			htmlStr+="</td>";
		}
			

		htmlStr+="</tr>";


		for(i=0;i<data.length;i++)
		{
			htmlStr+="<tr>";
			htmlStr+="<td style=\"background-color:"+colors[i]+"\">&nbsp;&nbsp;&nbsp;";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+data[i][0]+"";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+data[i][1]+"";
			htmlStr+="</td>";
			htmlStr+="</tr>";

		}



		htmlStr+="</table>";

		$(htmlStr).appendTo(self.$elem);
		
		//self.$elem.children("table").css({'margin':'0 auto'});

		self.$elem.children("table").css({'margin':'10px'});
		self.$elem.children("label").css({'margin':'10px'});
		self.$elem.width();
		self.$elem.height(self.$elem.height()+self.$elem.children("table").height()+(self.$elem.children("label").height()*2));

	},
	drawPointChartWithTrends:function(data)
	{
		var canvas=self.$canvas;
		var ctx = canvas.getContext('2d');

		var xvals=new Array();
		var yvals=new Array();

		for(i=0;i<data.length;i++)
		{
			for(j=0;j<data[i].length;j++)
			{
				xvals.push(data[i][j][0]);
				yvals.push(data[i][j][1]);
			}
			
		}


		

		var xmax=self.max(xvals);
		xmax=xmax+self.percent(xmax,10,false);
		var ymax=self.max(yvals);
		ymax=ymax+self.percent(ymax,10,false);

		//console.log("xmax :"+xmax+" ymax :"+ymax);

		var xorigin=self.vfd(self.options.width*0.20);
	    var yorigin=self.vfd(self.options.height*0.80);
	   // console.log("xorigin :"+xorigin+" yorigin:"+yorigin);

	    var ylength=self.vfd(self.options.height*0.80)-self.vfd(self.options.height*0.20);
	    var xlength=self.vfd(self.options.width*0.80)-self.vfd(self.options.width*0.20);


	   // console.log("xlength :"+xlength+" ylength:"+ylength);
	   // console.log("xmax :"+xmax+" ymax:"+ymax);

		// drawing the axes
		ctx.strokeStyle = '#396bd5';
	    ctx.beginPath();
	    ctx.moveTo(self.vfd(self.options.width*0.20), self.vfd(self.options.height*0.80));
	    ctx.lineTo(self.vfd(self.options.width*0.80), self.vfd(self.options.height*0.80));
	    ctx.moveTo(self.vfd(self.options.width*0.20), self.vfd(self.options.height*0.80));
	    ctx.lineTo(self.vfd(self.options.width*0.20), self.vfd(self.options.height*0.20));
	    ctx.stroke();
	    ctx.closePath();
	    // drawing the axes

	    //paint origin
	    ctx.beginPath();
	    ctx.fillText('0', xorigin - 10, yorigin+10);
	    ctx.stroke();
	    ctx.closePath();


	    if(self.options.colors && self.options.colors.length>0)
		{
			colors=self.options.colors;
		}
		else
		{
			//colors=self.getColors(valArr.length);
			if(self.options.useRGBAColorScheme)
			{
				colors=self.colorShades(3,xvals.length);
			}
			else
			{
				colors=self.getColors(xvals.length);
			}
			
		}

		//draw grids if requested
		if(self.options.useGrids)
		{
			var labelx=xorigin+self.percent(xlength,10,true);
			var labely=yorigin-self.percent(ylength,10,true);
			var count=0;
			for(i=self.percent(xmax,10,false);i<=xmax;i+=self.percent(xmax,10,false))
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(labelx, yorigin);
			    ctx.lineTo(labelx, self.vfd(self.options.height*0.20));
			    ctx.stroke();
			    ctx.closePath();
			    labelx+=self.percent(xlength,10,true);
			    count++;
			}

			if(count<10)
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(labelx, yorigin);
			    ctx.lineTo(labelx, self.vfd(self.options.height*0.20));
			    ctx.stroke();
			    ctx.closePath();
			}

			count=0;

			for(i=self.percent(ymax,10,false);i<=ymax;i+=self.percent(ymax,10,false))
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(xorigin, labely);
			    ctx.lineTo(self.vfd(self.options.width*0.80), labely);
			    ctx.stroke();
			    ctx.closePath();
			    labely-=self.percent(ylength,10,true);
			    count++;
			}

			if(count<10)
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(xorigin, labely);
			    ctx.lineTo(self.vfd(self.options.width*0.80), labely);
			    ctx.stroke();
			    ctx.closePath();
			}
		}



		//label the axes
		var labelx=xorigin+self.percent(xlength,10,true);
		var labely=yorigin-self.percent(ylength,10,true);
		var count=0;
		for(i=self.percent(xmax,10,false);i<=xmax;i+=self.percent(xmax,10,false))
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(i.toFixed(2).toString(), labelx, yorigin+15);
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(labelx-2, yorigin-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		    labelx+=self.percent(xlength,10,true);
		    count++;
		}
		
		if(count<10)
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(xmax.toFixed(2).toString(), labelx, yorigin+15);
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(labelx-2, yorigin-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		}
		count=0;

		var yaxisSpacing=new Array();
		for(i=self.percent(ymax,10,false);i<=ymax;i+=self.percent(ymax,10,false))
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(i.toFixed(2).toString(), xorigin-(i.toFixed(2).toString().length*6), labely+5);
		    yaxisSpacing.push(xorigin-(i.toFixed(2).toString().length*6));
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(xorigin-2, labely-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		    labely-=self.percent(ylength,10,true);
		    ++count;
		}

		if(count<10)
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(ymax.toFixed(2).toString(), xorigin-(i.toFixed(2).toString().length*6), labely+5);
		    yaxisSpacing.push(xorigin-(i.toFixed(2).toString().length*6));
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(xorigin-2, labely-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		}

		
		//labelling the axes with axes names
		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{

			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(self.options.columnTitles[0], self.vfd(self.options.width*0.30), self.vfd(self.options.height*0.90));
		    ctx.stroke();
		    ctx.closePath();


		   

		    ctx.save();
		    ctx.translate(self.max(yaxisSpacing)-self.vfd(self.options.height*0.05), self.vfd(self.options.height*0.70));
			ctx.rotate(-Math.PI/2);
		    ctx.fillText(self.options.columnTitles[1], 0, 0);
		    ctx.restore();
		}
		

		
		var plotxy=new Array();
		var plotxyN=new Array();
		
		
		//plot points
	     for (i = 0; i < data.length; i++) {

	     	var plotthis=new Array();
	     	if(self.options.connectPointsWithOrigin)
			{
				plotthis.push(xorigin+","+yorigin);


			}
	     	for (j = 0; j < data[i].length; j++) {

	     		ctx.fillStyle = colors[(i*2)+j];

		        var xvalPercentage=self.percentage(xmax,data[i][j][0],false);
		        var yvalPercentage=self.percentage(ymax,data[i][j][1],false);
		        
		        var xper=self.percent(xlength,xvalPercentage,true);
		        var yper=self.percent(ylength,yvalPercentage,true);

		        var x=xorigin+xper ;
		        var y=yorigin-yper;
		        ctx.beginPath();
		        ctx.fillRect(x, y, 10, 10);
		        //console.log(x+","+y)

		        plotthis.push(x+","+y);
		        plotxyN.push([x,y]);
		        ctx.closePath();


	     	}

	     	
		        
        	plotxy.push(plotthis);
   		 }


   		 var trendColors=new Array();
   		 for (k = 0; k<plotxy.length; k++)
		 {
		 	//console.log(plotxy[k]);

		 	if(self.options.connectPoints)
			{
				var connectColor=self.getColors(1)[0];
				trendColors.push(connectColor);
				if(plotxy[k].length==1)
				{

				}
				else if(plotxy[k].length==2)
				{
					var coor=plotxy[k][0].split(",");
					var coor1=plotxy[k][1].split(",");
					ctx.strokeStyle = connectColor;
				    ctx.beginPath();
				    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
				    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
				    ctx.stroke();
				    ctx.closePath();
				}
				else if(plotxy[k].length>=3)
				{
					for (j = 0; j <(plotxy[k].length-1); j++) {
					//console.log(plotxy[i]+" "+plotxy[i+1]);
					var coor=plotxy[k][j].split(",");
					var coor1=plotxy[k][j+1].split(",");
					ctx.strokeStyle = connectColor;
				    ctx.beginPath();
				    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
				    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
				    ctx.stroke();
				    ctx.closePath();
				    
					}

					var coor=plotxy[k][plotxy[k].length-2].split(",");
					var coor1=plotxy[k][plotxy[k].length-1].split(",");
					ctx.strokeStyle =connectColor;
				    ctx.beginPath();
				    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
				    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
				    ctx.stroke();
				    ctx.closePath();
				}
			
			}

		 }
   		
   		 


   		 self.drawLegendForPointChartWithTrends(colors,trendColors);

   		  self.$canvas.addEventListener('mousemove', function(evt){self.canvasMouseMove(evt,plotxyN,self,xvals,yvals);}, false);




	},
	drawLegendForPointChartWithTrends:function(colors,trendColors)
	{
		self=this;
		//self.$elem.css({'border':'1px solid #ccc','margin':'10px','overflow':'auto'});
		$("<label>"+self.options.title+"</label>").insertBefore(self.$elem.children("canvas")[0]);

		
		var data=self.options.data;


		



		for(i=0;i<data.length;i++)
		{
			var htmlStr="<table>";

			if(self.options.trendTitles && self.options.trendTitles.length>0 && self.options.trendTitles[i])
			{
				htmlStr+="<tr>";
				htmlStr+="<td colspan=\"2\"><label style=\"color:"+trendColors[i]+"\">"+self.options.trendTitles[i];
				htmlStr+="</label></td>";
				htmlStr+="</tr>";
			}
				

				htmlStr+="<tr>";
				htmlStr+="<td>&nbsp;&nbsp;&nbsp;";
				htmlStr+="</td>";
				

				if(self.options.columnTitles && self.options.columnTitles.length==2)
				{
					htmlStr+="<td>(X - axis)</br>"+self.options.columnTitles[0];
					htmlStr+="</td>";
					htmlStr+="<td>(Y - axis)</br>"+self.options.columnTitles[1];
					htmlStr+="</td>";

				}
				else
				{
					htmlStr+="<td>(X - axis)";
					htmlStr+="</td>";
					htmlStr+="<td>(Y - axis)";
					htmlStr+="</td>";
				}
					

				htmlStr+="</tr>";


			for(j=0;j<data[i].length;j++)
			{
				

			htmlStr+="<tr>";
			htmlStr+="<td style=\"background-color:"+colors[(i*2)+j]+"\">&nbsp;&nbsp;&nbsp;";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+data[i][j][0]+"";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+data[i][j][1]+"";
			htmlStr+="</td>";
			htmlStr+="</tr>";

				
			}
			htmlStr+="</table>";
			$(htmlStr).appendTo(self.$elem);
		}

		q=0;
		for(p=0;p<self.$elem.children("table").length;p++)
		{
			q+=$(self.$elem.children("table")[p]).height();
		}
		

		
		
		//self.$elem.children("table").css({'margin':'0 auto'});
		self.$elem.children("table").css({'margin':'10px'});
		self.$elem.children("label").css({'margin':'10px'});
		self.$elem.width();
		self.$elem.height(self.$elem.height()+q+10+(self.$elem.children("label").height()*2));

	}

};

$.fn.kggraph = function( options ) {
    
    return this.each(function(){

    	var graph=Object.create(kgg);
    	
    	
    	graph.init(options,this);
    });
  
 };

$.fn.kggraph.options={
	width:100,
	height:100,
	type:'pie chart',
	title:'sample  chart',
	data:[],
	columnTitles:[],
	trendTitles:[],
	colors:[],
	useRGBAColorScheme:true,
	useGrids:false,
	connectPoints:false,
	connectPointsWithOrigin:false,
	hasTrends:false,
	plotPoints:[],
	tooltip:null
};





})( jQuery ,window,document);



