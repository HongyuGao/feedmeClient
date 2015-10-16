function generateOrder(restId, userId, dishes, totalPrice) {
	var Order = new Object();

	order.userId = userId;
    order.restaurantId = restId;
    order.addressId = 1;
    order.totalPrice = totalPrice;

    var order2dishes = new Object();

    order2dishes.order = order;
    order2dishes.dishes = dishes;

    var postData = JSON.stringify(order2dishes);
    var url = TEXT_HOST + "/orders/create";

    console.log(postData);

    restSet(url, POST_METHOD, postData, renderSendOrder(),"");
}


function renderSendOrder() {
	console.log("success");
}
