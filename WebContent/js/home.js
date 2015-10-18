var restaurantTypes = Object();

function appendShop(restaurant) {
	var firstShop = $(".shops .shop").first();
	var newShop;

	if(firstShop.find("a").attr("href") == "#") {
		newShop = firstShop;
	} else {
		newShop = firstShop.clone();
		newShop.appendTo(".shops");	
	}

	newShop.find("a").attr("href", "new_restaurant.html?shopId=" + restaurant.id);	
	newShop.find("img").attr("src", PICTURE_HOST + "/img/logo/" + restaurant.logo);	
	newShop.find(".shop_name").text(restaurant.name);	
	newShop.find(".morning").text(restaurant.openTimeMorning);	
	newShop.find(".afternoon").text(restaurant.openTimeAfternoon);	
	newShop.appendTo(".shops");	
}

function addTypesInfo(restaurantName, restaurantType) {
	restaurantTypes[restaurantName] = restaurantType;
}

function applyFilter(currentType) {
	$(".shop").each(function() {
		if(restaurantTypes[$(this).find(".shop_name").text()] == currentType) {
			$(this).show();
		} else {
			$(this).hide();
		}
	});
}