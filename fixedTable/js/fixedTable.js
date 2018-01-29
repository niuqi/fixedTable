		/*
		 	*作者：牛奇
			*时间：2018-1
			*描述：固定表格组件
			*参数：	id:String,			 	(表格id）
				  	fixedLeftColumn:Number, (从左往右计算固定列数，默认1）
				  	fixedLeft:Boolean,		(可选，是否固定列，默认true）
					fixedThead:Boolean,		(可选，是否固定表头，默认false）
					tbodyHeight:String 		(可选，固定表头时，设置tbody高度，单位：px，默认是100px）
		*/
			function FixedTable(opt){
				/*默认参数*/
				this.opt = {
					table:null,
					wrapper:null,
					tableWrapper:null,
					fixedHeadWrapper:null,
					fixedLeftWrapper:null,
					fixedConnectWrapper:null,
					fixedLeftColumn:1,
					fixedThead:false,
					fixedLeft:true,
					fixedLeftWidth:0
				};
				/*初始化*/
				this.init(opt);
			}
			FixedTable.prototype = {
				init:function(opt){
					var _this = this;
					_this.opt = $.extend({},this.opt,opt);							
					_this.opt.table = $('#'+_this.opt.id);
					_this.opt.table.wrap('<div id="'+_this.opt.id+'_wrapper"><div id="'+_this.opt.id+'_tableWrapper"></div></div>');
					_this.opt.wrapper = $('#'+_this.opt.id+'_wrapper');
					_this.opt.wrapper.css(_this.styleObj.wrapper);
					_this.opt.tableWrapper = $('#'+_this.opt.id+'_tableWrapper');
					_this.opt.tableWrapper.css(_this.styleObj.tableWrapper);
					/*判断是否固定表头*/
					if(_this.opt.fixedThead){
						_this.opt.tableWrapper.css('height',_this.opt.tbodyHeight);
						_this.creatFixedHeadWrapper();
					};
					/*判断是否固定列*/
					if(_this.opt.fixedLeft){
						_this.creatFixedLeftWrapper();
					};
					/*判断是否同时固定表头和列*/
					if(_this.opt.fixedThead && _this.opt.fixedLeft){
						_this.creatConnectWrapper();
					};
					_this.opt.tableWrapper.on('scroll',{_this:_this},_this.listenScroll);
				},
				styleObj:{
					commonStyle:{'position':'absolute','top':0,'left':0,'overflow':'hidden'},
					wrapper:{'position':'relative','overflow':'hidden'},
					tableWrapper:{'width':'100%','overflow':'auto'},
					fixedHeadWrapper:{},
					fixedLeftWrapper:{},
					fixedConnectWrapper:{}
				},
				creatFixedHeadWrapper:function(){
					var _this = this,
						trI = 0,
						thI = 0,
						thWidth = 0,
						html = '',
						thead = _this.opt.table.find('thead'),
						theadTrLength = thead.find('tr').length,
						theadThLength = 0;
					for(trI;trI<theadTrLength;trI++){
						thI = 0;
						theadThLength = thead.find('tr').eq(trI).find('th').length;
						html += '<tr>';
						for(thI;thI<theadThLength;thI++){
							thWidth = thead.find('tr').eq(trI).find('th').eq(thI).outerWidth();
							html += '<th style="width:'+thWidth+'px;">'+thead.find('tr').eq(trI).find('th').eq(thI).html()+'</th>';
						};
						html += '</tr>';
					};
					/*html填充给fixedHeadWrapper*/
					_this.opt.fixedHeadWrapper = $('<div id="'+_this.opt.id+'_fixedHeadWrapper"><table style="position:relative;table-layout:fixed"><thead>'+html+'</thead></table></div>');
					_this.opt.fixedHeadWrapper.appendTo(_this.opt.wrapper);
					_this.opt.fixedHeadWrapper.css(_this.styleObj.commonStyle);
					_this.opt.fixedHeadWrapper.css('width',(_this.opt.tableWrapper.outerWidth()-17)+'px');
				},
				creatFixedLeftWrapper:function(){
					var _this = this,
						_thiswidth = 0,
						width = 0,
						widthI = 0,
						thI = 0,
						tdI = 0,
						theadTrI = 0,
						tbodyTrI = 0,
						theadHtml = '<thead>',
						tbodyHtml = '<tbody>',
						thead = _this.opt.table.find('thead'),
						tbody = _this.opt.table.find('tbody'),
						ColumnLength = _this.opt.fixedLeftColumn.length,
						theadTrLength = thead.find('tr').length,
						tbodyTrLength = tbody.find('tr').length;
					/*拼写thead*/
					for(theadTrI;theadTrI<theadTrLength;theadTrI++){
						thI = 0;
						theadHtml += '<tr>';
						for(thI;thI<_this.opt.fixedLeftColumn;thI++){
							theadHtml += '<th>'+thead.find('tr').eq(theadTrI).find('th').eq(thI).text()+'</th>';
						};
						theadHtml += '</tr>';
					};
					theadHtml += '</thead>';
					/*拼写tbody*/
					for(tbodyTrI;tbodyTrI<tbodyTrLength;tbodyTrI++){
						tdI = 0;
						tbodyHtml += '<tr>';
						for(tdI;tdI<_this.opt.fixedLeftColumn;tdI++){
							tbodyHtml += '<td>'+tbody.find('tr').eq(tbodyTrI).find('td').eq(tdI).text()+'</td>';
						};
						tbodyHtml += '</tr>';
					};
					tbodyHtml += '</tbody>';
					/*html填充给fixedLeftWrapper*/
					_this.opt.fixedLeftWrapper = $('<div id="'+_this.opt.id+'_fixedLeftWrapper"><table style="position:relative;table-layout:fixed">'+theadHtml+tbodyHtml+'</table></div>');
					_this.opt.fixedLeftWrapper.appendTo(_this.opt.wrapper);
					_this.opt.fixedLeftWrapper.css(_this.styleObj.commonStyle);
					/*判断是否固定表头*/
					if(_this.opt.fixedThead){
						_this.opt.fixedLeftWrapper.css('height',(parseFloat(_this.opt.tbodyHeight)-17)+'px');
					}
					/*计算宽度*/
					for(widthI;widthI<_this.opt.fixedLeftColumn;widthI++){
						_thiswidth = thead.find('tr').eq(0).find('th').eq(widthI).outerWidth();
						width += _thiswidth;
						_this.opt.fixedLeftWrapper.find('thead tr th').eq(widthI).css('width',_thiswidth+'px');
						_this.opt.fixedLeftWrapper.find('tbody tr td').eq(widthI).css('width',_thiswidth+'px');
					};
					_this.opt.fixedLeftWrapper.find('table').css('width','+'+width+'px');
				},
				creatConnectWrapper:function(){
					var _this = this,
						html = _this.opt.fixedLeftWrapper.html();
					_this.opt.fixedConnectWrapper = $('<div id="'+_this.opt.id+'_fixedConnectWrapper">'+html+'</div>');
					_this.opt.fixedConnectWrapper.find('tbody').remove();
					_this.opt.fixedConnectWrapper.appendTo(_this.opt.wrapper);
					_this.opt.fixedConnectWrapper.css(_this.styleObj.commonStyle);
				},
				listenScroll:function(data){
					var _this = data.data._this,
						sTop = _this.opt.tableWrapper.scrollTop(),
						sLeft = _this.opt.tableWrapper.scrollLeft();
					if(_this.opt.fixedThead){
						_this.opt.fixedHeadWrapper.find('table').css('left',-sLeft);
					};
					if(_this.opt.fixedLeft){
						_this.opt.fixedLeftWrapper.find('table').css('top',-sTop);
					};
				}
			};