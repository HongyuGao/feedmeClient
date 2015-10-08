var testOrder = 
	{
		"id": 1,
		"userId": 1,
		"restaurantId": 1,
		"deliverId": 1,
		"totalPrice": 70.0,
		"deliveryFee": 10.0,
		"paymentStatus": true,
		"state": 1,
		"creatTime": null,
		"deliverTime": null,
		"finishTime": null,

		"dishes" : 
		[
			{"id": 1, "orderId": 1, "dishId": 1, "amount": 3, "price": 70.0}
		]

	};

function payInfo() {
    $("#payInfo").append(localStorage.getItem("order"));
}

function pay() {
	alert("not implemented yet(:");
	// send order to server:
	

	// go to the payment page:
}