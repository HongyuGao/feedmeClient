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
	console.log(data);
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
	console.log("Show logo from database");
}

function editRestaurant(param){
	if(restaurantId!=null&&restaurantIndex!=null){
		var Eid=param.name;
		jQuery("#"+Eid).removeAttr("readonly");
		jQuery("#CR").html("Change hasn't be saved");
	}	
}

function closeEdit(){
	jQuery("#name").attr("readonly","readonly");
	jQuery("#type").attr("readonly","readonly");
	jQuery("#phone").attr("readonly","readonly");
	jQuery("#email").attr("readonly","readonly");
	jQuery("#description").attr("readonly","readonly");
	jQuery("#logo").attr("disabled","disabled");
}

function PreviewImage(upload){
	if (checkPic("apkFile")) {
		try {
			var imgPath;
			if(window.navigator.userAgent.indexOf("MSIE")>=1){
				upload.select();
				jQuery("#logo").attr("src",imgPath);
			}else{
				var reader = new FileReader();
				reader.onload = function (event) {
				    document.getElementById("logo").src = event.target.result;
				};
				reader.readAsDataURL(document.getElementById("apkFile").files[0]);
			}
         } catch (e) {
             console.log(e);
         }
	}
}

function checkPic(paramId) {
	var picPath=jQuery("#"+paramId).val();
    var type = picPath.substring(picPath.lastIndexOf(".") + 1, picPath.length).toLowerCase();
    if (type == "jpg" || type == "bmp" || type == "png") {
        return true;
    }
    alert("Invalid picture formate");
    return false;
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
		if(checkPic("apkFile")){
			var url=TEXT_HOST+'/restaurants/update';
			var putData=restaurant;
			ajaxFileUpload(url, putData, "apkFile");
		}else{
			var putData = JSON.stringify(restaurant);
			restSet(TEXT_HOST+"/restaurants/update", PUT_METHOD, putData, renderUpdateRestaurant,"#resultDiv2");
		}		
	}else{
		alert("no restaurant selected!");
	}	
}

function renderUpdateRestaurant(data){
	jQuery("#resultDiv2").html("success");	
	jQuery("#CR1").html("");
	jQuery("#"+restaurantIndex).html(jQuery.trim(jQuery("#name").val()));
}

/**Add New Dish**/
function addDish(){
	if (restaurantId!=null){
		var name=jQuery.trim(jQuery("#dName").val());
		var price=jQuery.trim(jQuery("#dPrice").val());
		var discount=jQuery.trim(jQuery("#dDiscount").val());
		if(name==""||price==""){
			jQuery("#resultDiv3").html("Name, type and price can't be empty");
		}else if(isNaN(price)||(discount!=""&&isNaN(discount))){
			jQuery("#resultDiv3").html("price and discount must be numeric");
		}else{
			var type=jQuery.trim(jQuery("#dType option:selected").val());
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
			var putData=JSON.stringify(dish);
			restSet("TEXT_HOST+/dishes/newdish", POST_METHOD, putData, renderAddDish,"#resultDiv3");
		}
	}else{
		alert("no restaurant selected!");
	}		
}

function renderAddDish(data){
	jQuery("#resultDiv3").html("Success");
	var dishId=data.id;
	var name=jQuery.trim(jQuery("#dName").val());
	var type=jQuery("#dType option:selected").val();
	var price=jQuery("#dPrice").val();
	var discount=jQuery("#dDiscount").val();
	var ingredient=jQuery.trim(jQuery("#dIngredient").val());
	var description=jQuery.trim(jQuery("#dDescription").val());
	var flavor=jQuery.trim(jQuery("#dFlavor").val());
	var line=dishTemplate(dishId,name,type,price,discount,flavor,ingredient,description);
	jQuery("#"+jQuery("#dType option:selected").val()).append(line);
	clean();
}

function clean(){
	jQuery("#dName").val("");
	jQuery("#dType").val("");
	jQuery("#dPrice").val("");
	jQuery("#dDiscount").val("");
	jQuery("#dIngredient").val("");
	jQuery("#dDescription").val("");
}

/**Menu Management**/
function displayMenu(id){
	jQuery("#Soup").empty();
	jQuery("#Dessert").empty();
	jQuery("#Staple").empty();
	jQuery("#Drinks").empty();
	jQuery("#Others").empty();
	if(id!=null){
		restGet(TEXT_HOST+"/dishes/query?shopId="+id, GET_METHOD, renderDisplayMenu,"#resultDiv4")
	}else{
		jQuery("#resultDiv4").html("Restaurant Id is null");
	}
}

function renderDisplayMenu(data){
	var dishes=data.dishes;
	jQuery.each(dishes,function(i,object){
		var line=dishTemplate(object.id,object.name,object.type,object.price,object.discount,object.flavor,object.ingredient,object.description);
		jQuery("#"+object.type).append(line);
	})
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
	jQuery("#dish"+dishId).find("input").removeAttr("readonly");	
	jQuery("#CR"+dishId).html("Change hasn't be saved");
}

function updateDish(dishId){	
	var select=jQuery("#dish"+dishId).find("select");
	if(select[0].disabled==false){
		select.attr("disabled","disabled");
		jQuery("#dish"+dishId).find("input").attr("readonly","readonly");
		var updates=[];
		jQuery("#dish"+dishId).find("input").each(function(i,object){
			updates[i]=jQuery(object).val();
		})
		var dish=new Object();
		dish.id=dishId;
		dish.shopId=restaurantId;
		dish.name=updates[0];
		dish.discount=updates[2];
		dish.price=updates[3];
		if(dish.name==""||dish.price==""){
			alert("name and price can't be empty");
		}else if(!isNaN(dish.price)||!isNaN(dish.discount)){
			dish.type=select.val();
			dish.flavor=updates[1];
			dish.ingredient=updates[4];
			dish.description=updates[5];
			var putData=JSON.stringify(dish);
			alert(putData);
			restSet(TEXT_HOST+"dishes/update",PUT_METHOD,putData,renderUpdateDish,"")
		}else{
			alert("price and discount must be numeric")
			jQuery("#dish"+dishId).removeAttr("readonly");
		}		
	}
}

function renderUpdateDish(data){
	if(jQuery("#dish"+data.id).find("select").attr("selectedIndex")!=0){
		var line=dishTemplate(data.id,data.name,data.type,data.price,data.discount,data.flavor,data.ingredient,data.description);
		jQuery("#"+data.type).append(line);
		jQuery("#dish"+data.id).remove();		
	}
	alert("Successfully updated");
	jQuery("#CR"+data.id).html("");
}

function deleteDish(dishId){
	alert("Are you sure to delete this dish? ");
	restGet(TEXT_HOST +"/dishes/delete?dishId="+dishId, DELETE_METHOD,renderDeleteDish,"");
}

function renderDeleteDish(data){
	jQuery("#dish"+data.id).remove();
	alert("successfully deleted")
}

function dishTemplate(dishId,name,type,price,discount,flavor,ingredient,description){
	var line="<table id='dish"+dishId+"' style='border:1px solid #ccc; text-align:left'>"
					+"<tr>"
						+"<td rowspan='4'><div style='width:150px; height:130px;border:1px solid #ccc'><img /></div></td>"
						+"<td>Dish name:</td>"
						+"<td colspan='3'><input style='width:215px;' readonly='readonly' value='"+name+"' /></td>"
						+"<td>Type:</td>"
						+"<td><select disabled='disabled'><option>"+type+"</option></select></td>"
					+"</tr>"
					+"<tr>"
						+"<td>Dish favor:</td>"
						+"<td><input style='width:80px' readonly='readonly' value='"+flavor+"' /></td>"
						+"<td>Discount:</td>"
						+"<td><input style='width:40px;' readonly='readonly' value='"+discount+"' /></td>"
						+"<td>Price:</td>"
						+"<td><input style='width:40px;' readonly='readonly' value='"+price+"' /></td>"
					+"<tr>"
					+"<tr>"
						+"<td>Ingredient:</td>"
						+"<td colspan='5'><textarea rows='2' cols='56' readonly='readonly'>"+ingredient+"</textarea></td>"
					+"</tr>" 
					+"<tr>"
						+"<td>Description:</td>"
						+"<td colspan='5'><textarea rows='2' cols='56' readonly='readonly'>"+description+"</textarea></td>"
					+"</tr>"
					+"<tr>"
						+"<td><input type='file'  disabled='disabled'  id=ph'"+dishId+"' name='ph"+dishId+"' onchange=PreviewImage(this)/></td>"
						+"<td colspan='3'><div style='color:red;' id='CR"+dishId+"'></div><td>"
						+"<td><button onclick='editDish("+dishId+")'>Edit</button></td>"
						+"<td><button onclick='updateDish("+dishId+")'>Apply</button></td>"
						+"<td><button onclick='deleteDish("+dishId+")'>Delete</button></td>"
					+"</tr>"
				+"</table>";
	return line;
}
