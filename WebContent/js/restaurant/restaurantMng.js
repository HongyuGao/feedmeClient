/**
 * @author Danyang Li
 */
var restaurantIndex;
var restaurantId;
var editSave=0;
/**Restaurant List**/
function loadRestaurants(){
	restGet(TEXT_HOST+"/restaurants/restaurantList",GET_METHOD,renderLoadRestaurants,"#resultDiv1");
}

function renderLoadRestaurants(data){
	var list=data.rList;
	if(list==null || list.length==0){
		jQuery("#resultDiv1").html("No restuarant found.");
	}else{
		jQuery.each(list, function(i, object){
			var line="<li id='rdx"+i+"' onclick=displayRestaurant("+ object.id+","+i+")>"+object.name+"</li>";
			jQuery("#rsrList").append(line);
		})
	}
}

/** General Restaurant Information Management**/
function displayRestaurant(id,i){
	jQuery("#apkFile").removeAttr("disabled");
	jQuery("#phFile").removeAttr("disabled");
	restaurantIndex="rdx"+i;
	restaurantId=id;
	restGet(TEXT_HOST+"/restaurants/query?id="+id, GET_METHOD, renderDisplayRestaurant, "#resultDiv2");
	displayMenu(id);
}

function renderDisplayRestaurant(data){
	jQuery("#name").val(data.name);
	jQuery("#type").val(data.type);
	jQuery("#phone").val(data.phone);
	jQuery("#email").val(data.email);
	jQuery("#description").val(data.description);
	jQuery("#om").val(data.openTimeMorning);
	jQuery("#oa").val(data.openTimeAfternoon)
	jQuery("#logo").attr("src",PICTURE_HOST+"/img/logo/"+data.logo);
}

function editRestaurant(param){
	if(restaurantId!=null&&restaurantIndex!=null){
		var Eid=param.name;
		jQuery("#"+Eid).removeAttr("readonly");
		jQuery("#CRR").html("Change hasn't be saved");
	}
}

function closeEdit(){
	jQuery("#name").attr("readonly","readonly");
	jQuery("#type").attr("readonly","readonly");
	jQuery("#phone").attr("readonly","readonly");
	jQuery("#email").attr("readonly","readonly");
	jQuery("#description").attr("readonly","readonly");
	jQuery("#logo").attr("disabled","disabled");
	jQuery("#om").attr("readonly","readonly");
	jQuery("#oa").attr("readonly","readonly");
}


function updateRestaurant(){
	if(restaurantId!=null&&restaurantIndex!=null){
		closeEdit();
		var restaurant=new Object();
		restaurant.id=restaurantId;
		restaurant.name=jQuery.trim(jQuery("#name").val());
		restaurant.type=jQuery.trim(jQuery("#type").val());
		restaurant.email=jQuery.trim(jQuery("#email").val());
		restaurant.phone=jQuery.trim(jQuery("#phone").val());
		restaurant.description=jQuery.trim(jQuery("#description").val());
		restaurant.openTimeMorning=jQuery.trim(jQuery("#om").val());
		restaurant.openTimeAfternoon=jQuery.trim(jQuery("#oa").val());
		var url=TEXT_HOST+'/restaurants/update';
		var putData=restaurant;
		if(checkPic("apkFile")){
			ajaxFileUpload(url, restaurant, "apkFile", renderUpdateRestaurant);
		}else{
			var src=jQuery("#logo")[0].src;
			restaurant.logo=src.substring(src.lastIndexOf("/")+1,src.length);
			ajaxFileUpload(url, restaurant, "", renderUpdateRestaurant);
		}
	}
	else{
		alert("no restaurant selected!");
	}
}

function renderUpdateRestaurant(data){
	jQuery("#CRR").html("");
	jQuery("#"+restaurantIndex).html(jQuery.trim(jQuery("#name").val()));
	//jQuery("#resultDiv2").html("success");
}

/**Add New Dish**/
function addDish(){
	if (restaurantId!=null){
		var name=jQuery.trim(jQuery("#dName").val());
		var price=jQuery.trim(jQuery("#dPrice").val());
		var discount=jQuery.trim(jQuery("#dDiscount").val());
		var type=jQuery.trim(jQuery("#dType option:selected").val());
		if(name==""||price==""||type==""){
			jQuery("#resultDiv3").html("Name, type and price can't be empty");
		}else if(isNaN(price)||(discount!=""&&isNaN(discount))){
			jQuery("#resultDiv3").html("price and discount must be numeric");
		}else{
			var ingredient=jQuery.trim(jQuery("#dIngredient").val());
			var description=jQuery.trim(jQuery("#dDescription").val());
			var flavor=jQuery.trim(jQuery("#dFlavor").val());
			var dish=new Object();
			dish.shopId=restaurantId;
			dish.name=name;
			dish.type=type;
			dish.price=price;
			dish.discount=discount;
			dish.ingredient=ingredient;
			dish.description=description;
			dish.flavor=flavor;
			var url=TEXT_HOST+"/dishes/newdish";
			if(checkPic("phFile")){
				ajaxFileUpload(url, dish, "phFile", renderAddDish);
			}
			else{
				ajaxFileUpload(url, dish, "", renderAddDish);
			}
		}
	}
	else{
		alert("no restaurant selected!");
	}
}

function renderAddDish(data){
	jQuery("#resultDiv3").html("Success");
	var dishId=data.id;
	var photo=PICTURE_HOST+"/img/photo/"+data.photo;
	var name=jQuery.trim(jQuery("#dName").val());
	var type=jQuery("#dType option:selected").val();
	var price=jQuery("#dPrice").val();
	var discount=jQuery("#dDiscount").val();
	var ingredient=jQuery.trim(jQuery("#dIngredient").val());
	var description=jQuery.trim(jQuery("#dDescription").val());
	var flavor=jQuery.trim(jQuery("#dFlavor").val());
	var line=dishTemplate(dishId,photo,name,type,price,discount,flavor,ingredient,description);
	jQuery("#"+jQuery("#dType option:selected").val()).append(line);
	CleanAddDish();
	dishTypeNumber();
}

function CleanAddDish(){
	jQuery("#dName").val("");
	jQuery("#dType").val("");
	jQuery("#dPrice").val("");
	jQuery("#dDiscount").val("");
	jQuery("#dIngredient").val("");
	jQuery("#dDescription").val("");
	jQuery("#dPhoto").attr("src","empt");
	jQuery("#phFile").val("");
}

/**Menu Management**/
function displayMenu(id){
	jQuery("#Soup").empty();
	jQuery("#Dessert").empty();
	jQuery("#Staple").empty();
	jQuery("#Drinks").empty();
	jQuery("#Others").empty();
	dishTypeNumber();
	if(id!=null){
		restGet(TEXT_HOST+"/dishes/query?shopId="+id, GET_METHOD, renderDisplayMenu,"#resultDiv4")
	}else{
		jQuery("#resultDiv4").html("Restaurant Id is null");
	}
}

function renderDisplayMenu(data){
	var photo;
	var line;
	jQuery.each(data,function(i,object){
		photo=PICTURE_HOST+"/img/photo/"+object.photo;
		line=dishTemplate(object.id,photo,object.name,object.type,object.price,object.discount,object.flavor,object.ingredient,object.description);
		jQuery("#"+object.type).append(line);
	})
	dishTypeNumber();
}

function editDish(dishId){
	var select=jQuery("#dish"+dishId).find("select");
	select.removeAttr("disabled");
	if(select.val()=="Soup"){
		select.empty();
		select.append("<option>Soup</option><option>Dessert</option><option>Staple</option><option>Drinks</option><option>Others</option>");
	}
	else if(select.val()=="Dessert"){
		select.empty();
		select.append("<option>Dessert</option><option>Soup</option><option>Staple</option><option>Drinks</option><option>Others</option>");
	}
	else if(select.val()=="Staple"){
		select.empty();
		select.append("<option>Staple</option><option>Soup</option><option>Dessert</option><option>Drinks</option><option>Others</option>");
	}
	else if(select.val()=="Drinks"){
		select.empty();
		select.append("<option>Drinks</option><option>Soup</option><option>Dessert</option><option>Staple</option><option>Others</option>");
	}
	else{
		select.empty();
		select.append("<option>Others</option><option>Soup</option><option>Dessert</option><option>Staple</option><option>Drinks</option>");
	}
	jQuery("#dish"+dishId).find("input").removeAttr("disabled");
	jQuery("#dish"+dishId).find("textarea").removeAttr("disabled");
	jQuery("#CR"+dishId).html("Change hasn't be saved");
}

function updateDish(dishId){
	var select=jQuery("#dish"+dishId).find("select");
	if(select[0].disabled==false){
		var updates=[];
		var updates2=[];
		jQuery("#dish"+dishId).find("input").each(function(i,object){
			updates[i]=jQuery(object).val();
		});
		jQuery("#dish"+dishId).find("textarea").each(function(i,object){
			updates2[i]=jQuery(object).val();
		})
		var dish=new Object();
		dish.id=dishId;
		dish.shopId=restaurantId;
		dish.name=updates[0];
		if(updates[2]=="null"){
			dish.discount="";
		}
		else{
			dish.discount=updates[2];
		}
		dish.price=updates[3];
		if(dish.name==""||dish.price==""){
			alert("name and price can't be empty");
		}
		else if(isNaN(dish.price)||(dish.discount!=""&&isNaN(dish.discount))){
			alert("price and discount must be numeric")
		}
		else{
			dish.type=select.val();
			dish.flavor=updates[1];
			dish.ingredient=updates2[0];
			dish.description=updates2[1];
			var url=TEXT_HOST+"/dishes/update";
			var temp="pho"+dishId;
			if(checkPic(temp)){
				ajaxFileUpload(url,dish,temp,renderUpdateDish);
			}
			else{
				var src=jQuery("#dPhoto"+dishId)[0].src;
				dish.photo=src.substring(src.lastIndexOf("/")+1,src.length);
				ajaxFileUpload(url,dish,"",renderUpdateDish);
			}
		}
	}
}

function renderUpdateDish(data){
	jQuery("#dish"+data.id).find("input").attr("disabled","disabled");
	jQuery("#dish"+data.id).find("textarea").attr("disabled","disabled");
	jQuery("#dish"+data.id).find("select").attr("disabled","disabled");
	if(jQuery("#dish"+data.id).parent().attr("id")!=data.type){
		var photo=PICTURE_HOST+"/img/photo/"+data.photo;
		var line=dishTemplate(data.id,photo,data.name,data.type,data.price,data.discount,data.flavor,data.ingredient,data.description);
		jQuery("#dish"+data.id).remove();
		jQuery("#"+data.type).append(line);
		dishTypeNumber();
	}
	jQuery("#CR"+data.id).html("");
}

function deleteDish(dishId){
	alert("Are you sure to delete this dish? ");
	restGet(TEXT_HOST +"/dishes/delete?dishId="+dishId, DELETE_METHOD,renderDeleteDish,"");
}

function renderDeleteDish(data){
	jQuery("#dish"+data.id).remove();
	dishTypeNumber();
	alert("successfully deleted")
}

function dishTypeNumber(){
	var soupNo=jQuery("#Soup").children("table").length;
	var dessertNo=jQuery("#Dessert").children("table").length;
	var stapleNo=jQuery("#Staple").children("table").length;
	var drinksNo=jQuery("#Drinks").children("table").length;
	var othtersNo=jQuery("#Others").children("table").length;
	jQuery("#SoupNo").html("("+soupNo+")");
	jQuery("#DessertNo").html("("+dessertNo+")");
	jQuery("#StapleNo").html("("+stapleNo+")");
	jQuery("#DrinksNo").html("("+drinksNo+")");
	jQuery("#OthtersNo").html("("+othtersNo+")");

}

function dishTemplate(dishId,photo,name,type,price,discount,flavor,ingredient,description){
	var line="<table id='dish"+dishId+"' style='border:1px solid #ccc; text-align:left'>"
					+"<tr>"
						+"<td rowspan='4'><img id='dPhoto"+dishId+"' style='width:150px; height:130px; border:1px solid #cc' src='"+photo+"'/></td>"
						+"<td>Dish name:</td>"
						+"<td colspan='3'><input style='width:215px;' disabled='disabled' value='"+name+"' /></td>"
						+"<td>Type:</td>"
						+"<td><select disabled='disabled'><option>"+type+"</option></select></td>"
					+"</tr>"
					+"<tr>"
						+"<td>Dish favor:</td>"
						+"<td><input style='width:80px' disabled='disabled' value='"+flavor+"' /></td>"
						+"<td>Discount:</td>"
						+"<td><input style='width:40px;' disabled='disabled' value='"+discount+"' /></td>"
						+"<td>Price:</td>"
						+"<td><input style='width:40px;' disabled='disabled' value='"+price+"' /></td>"
					+"</tr>"
					+"<tr>"
						+"<td>Ingredient:</td>"
						+"<td colspan='5'><textarea rows='2' cols='56' disabled='disabled'>"+ingredient+"</textarea></td>"
					+"</tr>"
					+"<tr>"
						+"<td>Description:</td>"
						+"<td colspan='5'><textarea rows='2' cols='56' disabled='disabled'>"+description+"</textarea></td>"
					+"</tr>"
					+"<tr>"
						+"<td colspan='2'><input type='file'  disabled='disabled'  id='pho"+dishId+"' name='pho' onchange='PreviewImage(this,\"dPhoto"+dishId+"\")'/></td>"
						+"<td colspan='2'><div style='color:red;' id='CR"+dishId+"'></div></td>"
						+"<td><button onclick='editDish("+dishId+")'>Edit</button></td>"
						+"<td><button onclick='updateDish("+dishId+")'>Apply</button></td>"
						+"<td><button onclick='deleteDish("+dishId+")'>Delete</button></td>"
					+"</tr>"
				+"</table>";
	return line;
}
