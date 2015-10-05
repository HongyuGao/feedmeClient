/**
 * @author Danyang Li
 */

function addRestaurant(){
	var name=jQuery("#name").val();
	var phone=jQuery("#phone").val();
	var email=jQuery("#email").val();
	var type=jQuery("#type").val();
	if(name==""||phone==""||email==""||type==""){
		jQuery("#resultDiv").html("Name, phone and email can't be empty.");
	}
	else{
		var url=TEXT_HOST+"/restaurants/newrestaurant";
		var restaurant=new Object();
		restaurant.name=name;
		restaurant.type=type;
		restaurant.phone=phone;
		restaurant.email=email;
		restaurant.description=jQuery.trim(jQuery("#description").val());
		restaurant.openTimeMorning=jQuery.trim(jQuery("#om").val());
		restaurant.openTimeAfternoon=jQuery.trim(jQuery("#oa").val());	
		if(checkPic("logoFile")){
			ajaxFileUpload(url, restaurant, "logoFile", renderAddRestaurant);
		}
		else{
			ajaxFileUpload(url, restaurant, "", renderAddRestaurant);
		}
	}
}

function renderAddRestaurant(data){
	jQuery("#resultDiv").html("Success! reataurant id="+data.id);
	cancelAdd();
}

function cancelAdd(){
	jQuery("#logo").attr("src","empt");
	jQuery("#logoFile").val("");
	jQuery("#name").val("");
	jQuery("#type").val("");
	jQuery("#phone").val("");
	jQuery("#email").val("");
	jQuery("#om").val("");
	jQuery("#oa").val("");
}