/**
 * @author Danyang Li
 */
var restaurantIndex;
var restaurantId;
var editSave=0;
/**Restaurant List**/
function loadRestaurants(){
	restGet("/restaurants/restaurantList",GET_METHOD,renderLoadRestaurants,"#resultDiv1");
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
	restaurantIndex="rdx"+i;
	restaurantId=id;
	restGet("/restaurants/query?id="+id, GET_METHOD, renderDisplayRestaurant, "#resultDiv2");
	displayMenu(id);
}

function renderDisplayRestaurant(data){
	jQuery("#name").val(data.name);
	jQuery("#type").val(data.type);
	jQuery("#phone").val(data.phone);
	jQuery("#email").val(data.email);
	jQuery("#description").val(data.description);
}

function editRestaurant(param){
	if(restaurantId!=null&&restaurantIndex!=null){
		var Eid=param.name;
		jQuery("#"+Eid).removeAttr("readonly");
	}	
}

function closeEdit(){
	jQuery("#name").attr("readonly","readonly");
	jQuery("#type").attr("readonly","readonly");
	jQuery("#phone").attr("readonly","readonly");
	jQuery("#email").attr("readonly","readonly");
	jQuery("#description").attr("readonly","readonly");
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
		var putData = JSON.stringify(restaurant);
		console.log(putData);
		restSet("/restaurants/update", PUT_METHOD, putData, renderUpdate,"#resultDiv2");
	}else{
		alert("no restaurant selected!");
	}	
}

function renderUpdate(data){
	jQuery("#resultDiv2").html("success");	
	console.log(restaurantIndex);
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
			var dish=new Object();
			dish.shopId=restaurantId;
			dish.name=name;
			dish.type=type;
			dish.price=price;
			dish.discount=discount;
			dish.ingredient=ingredient;
			dish.description=description;
			var putData=JSON.stringify(dish);
			restSet("/dishes/newdish", POST_METHOD, putData, renderAddDish,"#resultDiv3");
		}
	}else{
		alert("no restaurant selected!");
	}		
}

function renderAddDish(data){
	jQuery("#resultDiv3").html("Success");
	var dishId=data.id;
	var classId=dishId;
	var name=jQuery.trim(jQuery("#dName").val());
	var price=jQuery("#dPrice").val();
	var discount=jQuery("#dDiscount").val();
	var ingredient=jQuery.trim(jQuery("#dIngredient").val());
	var description=jQuery.trim(jQuery("#dDescription").val());
	var line=dishTemplate(dishId,classId,name,price,discount,ingredient,description);
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
		restGet("/dishes/query?shopId="+id, GET_METHOD, renderDisplayMenu,"#resultDiv4")
	}else{
		jQuery("#resultDiv4").html("Restaurant Id is null");
	}
}

function renderDisplayMenu(data){
	var dishes=data.dishes;
	jQuery.each(dishes,function(i,object){
		var line=dishTemplate(object.id,object.id,object.name,object.price,object.discount,object.ingredient,object.description)
		jQuery("#"+object.type).append(line);
	})
}

function editDish(classId){
	console.log("enter editDish");
	jQuery("."+classId).removeAttr("readonly");	
}

function updateDish(classId,dishId){
	console.log();
	if(jQuery("."+classId)[1].readOnly==false){
		jQuery("."+classId).attr("readonly","readonly");
		var updates=[];
		jQuery("."+classId).each(function(i,object){
			updates[i]=jQuery(object).val();
		})
		var dish=new Object();
		dish.id=dishId;
		dish.shopId=restaurantId;
		dish.name=updates[0];
		dish.price=updates[1];
		dish.discount=updates[2];
		if(!isNaN(dish.price)||!isNaN(dish.discount)){
			dish.type="Soup";
			dish.ingredient=updates[3];
			dish.description=updates[4];
			var putData=JSON.stringify(dish);
			alert(putData);
			restSet("dishes/update",PUT_METHOD,putData,renderUpdateDish,"")			
		}else{
			alert("price and discount must be numeric")
			jQuery("."+classId).removeAttr("readonly");
		}
		
	}
}

function renderUpdateDish(data){
	/*if(jQuery("."+data.id)[3].val()!=data.type){
		var dish=jQuery("#dish"+dishId);
		jQuery("#"+dishId).remove();
		jQuery("#"+data.type).append(dish);
	}*/
	alert("Successfully updated");
}

function deleteDish(dishId){
	alert("Are you sure to delete this dish? ");
	restGet("/dishes/delete?dishId="+dishId, DELETE_METHOD,renderDeleteDish,"");	
}

function renderDeleteDish(data){
	console.log("dishID:"+data.id)
	jQuery("#dish"+data.id).remove();
	alert("successfully deleted")
}

function dishTemplate(dishId,classId,name,price,discount,ingredient,description){
	var line="<table id='dish"+dishId+"' style='border:1px solid #ccc; text-align:left'>"
					+"<tr>"
						+"<td rowspan='4'><div style='width:150px; height:120px;border:1px solid #ccc'><img /></div></td>"
						+"<td>Dish name:</td>"
						+"<td><input style='width:145px;' readonly='readonly' class='"+classId+"' value='"+name+"' /></td>"
						+"<td>Price:</td>"
						+"<td><input style='width:40px' readonly='readonly' class='"+classId+"' value='"+price+"' /></td>"
						+"<td>Discount:</td>"
						+"<td><input style='width:40px' readonly='readonly' class='"+classId+"' value='"+discount+"' /></td>"
					+"</tr>"
					+"<tr>"
						+"<td>Ingredient:</td>"
						+"<td colspan='5'><textarea rows='2' cols='56' readonly='readonly' class='"+classId+"'>"+ingredient+"</textarea></td>"
					+"</tr>" 
					+"<tr>"
						+"<td>Description:</td>"
						+"<td colspan='5'><textarea rows='2' cols='56' readonly='readonly' class='"+classId+"'>"+description+"</textarea></td>"
					+"</tr>"
					+"<tr>"
						+"<td><td>"
						+"<td><button onclick='editDish("+classId+")'>Edit</button></td>"
						+"<td><button onclick='updateDish("+classId+","+dishId+")'>Apply</button></td>"
						+"<td><button onclick='deleteDish("+dishId+")'>Delete</button></td>"
					+"</tr>"
				+"</table>";
	return line;
}
