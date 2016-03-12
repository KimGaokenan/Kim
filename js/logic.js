//商品信息    
	var goodsDetails ={
			ITEM000003:{name:"苹果",unitPrice:5.50,favorable:["95%"],remark:"斤"},
			ITEM000001:{name:"羽毛球",unitPrice:1.00,favorable:["95%","2+1"],remark:"个"},
			ITEM000005:{name:"可口可乐",unitPrice:3.00,favorable:["2+1"],remark:"瓶"}
		};
	// //测试输入数据
	// var inputVal = [
	// 				     'ITEM000001',
	// 				     'ITEM000001',
	// 				     'ITEM000001',
	// 				     'ITEM000001',
	// 				     'ITEM000001',
	// 				     'ITEM000003-2',
	// 				     'ITEM000005',
	// 				     'ITEM000005',
	// 				     'ITEM000005'
	// 				 ];

	//收集商品数量
	function collection(inputVal){

		var tempMap = {};

		var index = 1;

		if(!(inputVal instanceof Array)){
			return "输入无效";
		}

		for(var i = 0 ; i < inputVal.length; i++){

			if(inputVal[i].indexOf("-") == -1){
				if(!!tempMap[inputVal[i]]){
					tempMap[inputVal[i]]++;
				}else{
					tempMap[inputVal[i]] = 1;;
				}
			}else{
				var tempkey = inputVal[i];
				tempkey = tempkey.substring(0,inputVal[i].indexOf("-"));

				tempMap[tempkey] = Number(inputVal[i].substr(inputVal[i].indexOf("-")+1,1));
			}
		}
		console.info(tempMap);
		return tempMap;
	}
	//根据商品信息计算总价格

	function calculate(inputMap,goodsDetails){

		var tempInfo = goodsDetails;
		

		for(var key in inputMap){
			//处理输入数据中如果包含"-"
			if(key.indexOf("-") != -1){
				key = key.substring(0,key.indexOf("-"));
			}

			tempInfo[key]["num"] = inputMap[key];

			tempInfo[key]["totalPrice"] = tempInfo[key].unitPrice * inputMap[key];

			var fArr = tempInfo[key].favorable;
			//不等于0，说明商品有优惠
			if(fArr.length != 0){
				if(fArr.length == 1){//享有一项优惠
					if(fArr[0] === "95%") {
						//享受95折优惠后
						tempInfo[key]["freePrice"] = (tempInfo[key].unitPrice * 0.05) * inputMap[key];
					}else{
						//享受买2送1后
						if((inputMap[key]/2) > 0){
							tempInfo[key]["freePrice"] = Math.floor(inputMap[key]/2) * tempInfo[key].unitPrice;
						}
						
					}
				}else if(fArr.length == 2){//享受两项优惠
				   if((inputMap[key]/2) > 0){
						tempInfo[key]["freePrice"] = Math.floor(inputMap[key]/2) * tempInfo[key].unitPrice;
					}
				}
			}
			
		}

		return tempInfo;
		
	}

	function showReslut(information){
		
		var tempDom = "<div>***<没钱赚商店>购物清单***</div>"

		var ttotalPrice = 0;

		var tfreePrice = 0;

		
		var addtional = [];
		for(var key in information){
			
			var name = information[key].name;
			var num = information[key].num;
			var unitPrice = information[key].unitPrice;
			var totalPrice = information[key].totalPrice;
			var freePrice = information[key].freePrice;
			var remark =  information[key].remark;

			if(freePrice){
				tempDom += "<p>名称:"+name+" ,数量:"+ num+""+remark+",单价:"+unitPrice+"（元）"
				+",小计："+totalPrice+"（元），节省："+freePrice+"（元）</p>"
			}else{
				tempDom += "<p>名称:"+name+" ,数量:"+ num+""+remark+",单价:"+unitPrice+"（元）"
				+",小计："+totalPrice+"（元）</p>"
			}

			ttotalPrice  += totalPrice?totalPrice:0;
			tfreePrice   += freePrice?freePrice:0;

			 if($.inArray("2+1",information[key].favorable) != -1){
				//享受买2送1后
				addtional.push({"name":name,"number":num,"remark":remark});
				
			 }

		}

		 var adationalDom = "";
		 for(var i = 0; i < addtional.length; i++ ){
			 	adationalDom+="<p>名称:"+addtional[i].name+"，数量："+addtional[i].number+""+addtional[i].remark+"</p>"
			 }

		tempDom += "<div>------------------------------------</div>";
		if(adationalDom){
			tempDom +="<p>买二赠一的商品：</p>";
			tempDom += adationalDom;
			tempDom += "<div>------------------------------------</div>";
		}
		tempDom += "<p>总计:"+ttotalPrice+"（元）<p>";
		tempDom += "<p>节省:"+tfreePrice+"（元）<p>";
		tempDom += "<div>************************************</div>";
		$("#target").html();
		$("#target").html(tempDom);
	}


	$(document).ready(function(){
		$("#calBtn").on("click",function(){

			var inputVal = [];
			var numOfAPP = Number($("#appleVal").val());
			var numOfBadmin = Number($("#badmintenVal").val());
			var numOfCC = Number($("#cocaVal").val());
			
			if(numOfAPP && numOfBadmin && numOfCC ){

				for(var i = 0; i<numOfBadmin; i++){
					inputVal.push("ITEM000001");
				}
				for(var i =0; i<numOfCC;i++){
					inputVal.push("ITEM000005");
				}
				inputVal.push("ITEM000003"+"-"+numOfAPP);


				var mapParam = collection(inputVal);
				var newMap  = calculate(mapParam,goodsDetails)
				showReslut(newMap);
			}else{
				alert("输入值无效");
			}
			
		})

	});