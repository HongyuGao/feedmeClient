var restaurantId;
var restaurantName;

var order = Object();
var totalNum = 0;
var totalPrice = 0;

var restid2Name = Object();

//
function parseCart(items) {
    var items_arr = items.split("#");
    for(var i = 0; i < items_arr.length; i++) {
        if(items_arr[i].trim().length != 0) {
            var pos = items_arr[i].search(",");
            var restId = items_arr[i].substring(0, pos);


            var tmp = items_arr[i].substring(pos+1);
            pos = tmp.search(",");
            var restName = tmp.substring(0, pos);
            restid2Name[restId] = restName;

            var dishes = Object();
            var dish_arr = tmp.substring(pos+1).trim().split(",");
            

            var j = 0;
            for(j = 0; j < dish_arr.length - 3; j += 4) {
            	var dish_name = dish_arr[j];
                var dish = Object();

                dish["id"] = dish_arr[j+1];
                dish["price"] = Number(dish_arr[j+2]);
                dish["count"] = Number(dish_arr[j+3]);

                totalNum += dish["count"];
                totalPrice += dish["price"] * dish["count"];

                dishes[dish_name] = dish;
            }

            order[restId] = dishes;
            
        }    
    }
    
    setCart();
}

function setCart() {
	// current shop:
    if(restaurantName != undefined) {
        $(".cart_shops").append(
            '<div class="shop_name">' +
            restaurantName + 
            '</div>' +
            '<hr>'  
        );
        $(".cart_shops").append('<div class="cart_dishes">');
        if(order[restaurantId] != undefined) {
            var dishes = order[restaurantId];
            for(var dishName in dishes) {
                $(".cart_shops").append(

                    '<div class="numbers_row">' +
                    '<div class="dish_name">' + dishName + '</div>' +

                    '<div class="inc_dec">'+ 
                    '<button type="button" onclick="updateOrder(' + '\'' + dishName + '\', ' + dishes[dishName]["id"] + ", " + dishes[dishName]["price"] + ', ' + (-1) + ', ' + (1) + ', ' +(restaurantId) + ')"' +
                    '> - </button>'+
                    ' <span id=' + '"' + dishes[dishName]["id"] + '"' + '>' + dishes[dishName]["count"] + '</span>' +
                    '<button type="button" onclick="updateOrder(' + '\'' + dishName + '\', ' + dishes[dishName]["id"] + ", " + dishes[dishName]["price"] + ', ' + (1) + ', ' + (1) + ',' + (restaurantId) +  ')"' +
                    '> + </button>'+
                    '</div>' +
                    
                    '<div class="price">' + dishes[dishName]["price"] + '</div>' +
                    '</div>' 

                    );
            }
        }
        
        $(".cart_shops").append(
            '<div class="delivery_fee">' +
            '<div class="delivery_info">' +
            'Delivery Fee' +
            '</div>' +
            '<div class="fee">' +
            'A$10' +
            '</div>' +
            '</div>'
        );

        $(".cart_shops").append('</div>');
    }
	

	// other shops:
	for(var restId in order) {
		if(restId == restaurantId) {
			continue;
		}

		$(".cart_shops").append(
			'<hr>' +
			'<div class="shop_name">' +
          	restid2Name[restId] + 
        	'</div>' +
        	'<hr>'	
		);
		$(".cart_shops").append('<div class="cart_dishes">');
		var dishes = order[restId];
		for(var dishName in dishes) {
			$(".cart_shops").append(

				'<div class="numbers_row">' +
            	'<div class="dish_name">' + dishName + '</div>' +

            	'<div class="inc_dec">'+ 
            	'<button type="button" onclick="updateOrder(' + '\'' + dishName + '\', ' + dishes[dishName]["id"] + ", " + dishes[dishName]["price"] + ', ' + (-1) + ', ' + (1) + ', ' + restId + ')"' +
        		'> - </button>'+
        		' <span id=' + '"' + dishes[dishName]["id"] + '"' + '>' + dishes[dishName]["count"] + '</span>' +
        		'<button type="button" onclick="updateOrder(' + '\'' + dishName + '\', ' + dishes[dishName]["id"] + ", " + dishes[dishName]["price"] + ', ' + (1) + ', ' + (1) + ', ' + restId + ')"' +
        		'> + </button>'+
            	'</div>' +
            	
              	'<div class="price">' + dishes[dishName]["price"] + '</div>' +
            	'</div>' 

				);
		}
	}

    $(".cart_shops").append(
            '<div class="delivery_fee">' +
            '<div class="delivery_info">' +
            'Delivery Fee' +
            '</div>' +
            '<div class="fee">' +
            'A$10' +
            '</div>' +
            '</div>'
        );

	$(".cart_shops").append('</div>');

	$(".total .fee").text("A$" + totalPrice);

	$("#cart_info .cart-top-sum").text("A$" + totalPrice + " / " + totalNum + " Item(s)");

}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
        vars[key] = value;
    });
    return vars;
}

function appendDish(dish) {
	$(".dishes").append(
		'<div class="dish" onclick="pop(\'' + PICTURE_HOST + '/img/photo/' + dish.photo + '\', \'' + dish.name + '\', ' + dish.id + ', ' + dish.price 
		 	+ ')">' 
			+
          '<div class="dish_photo">' +
            '<img src="' + PICTURE_HOST + '/img/photo/' + dish.photo + '" alt="" />' +
          '</div>' +
          '<div class="dish_info">' +
            '<div class="dish_name">' +
              dish.name +
            '</div>' +
            '<div class="dish_price">' +
              'A$' + dish.price +
            '</div>' +
            '<div class="dish_stars">' +
              "<span class='glyphicon glyphicon-star'></span>" +
              "<span class='glyphicon glyphicon-star'></span>		" +
              "<span class='glyphicon glyphicon-star'></span>" +
              "<span class='glyphicon glyphicon-star-empty'></span>" +
              "<span class='glyphicon glyphicon-star-empty'></span>" +
            '</div>' +
            '<div class="sold">' +
              '<i>' + dish.sold + '</i> sold this week' +
            '</div>' +
          '</div>' +
        '</div>'
	);
}


/**
 * Insert the information of current restaurant into the page.
 * @param restaurant: the current restaurant.
 */
function setRestaurantInfo(restaurant) {
    restaurantId = restaurant.id;
    restaurantName = restaurant.name;
}

/** 
 * Update the dish display according to the applied filter (selected type).
 *
 * @param current_type: the selected type.
 */
function applyFilter(currentType) {
    $(".dishes").empty();
    restGet(TEXT_HOST + '/dishes/query/?shopId=' + restaurantId, GET_METHOD, function(data){
            $.each(data, function(i, dish){
                if(currentType == "All" || dish.type == currentType) {
                    appendDish(dish); 
                }
            });
    }, '.dishes');
}



function addFromPop() {
    var name = $(".pop_dish .dish_name").text();
    var id = $(".pop_dish_info .dish_name").data("dishId");
    var price = Number($(".pop_dish .dish_price").text().substring(2));
    var quantity = Number(document.getElementById("select").value);

    addToCart(name, id, price, quantity);
    hide();
}

/**
 * Add an item to shopping cart.
 *
 * @param name: the name of the dish.
 * @param id: the id of the dish.
 * @param price: the price of the dish.
 */
function addToCart(name, id, price, quantity) {
    // a flag variable denotes whether the dish to be added to cart
    // is already in the cart (flag=1) or not (flag=0).
    var flag = 0;

    if(order[restaurantId] == undefined) {
    	order[restaurantId] = Object();
    } else if (order[restaurantId][name] == undefined) {
    	order[restaurantId][name] = Object();
    } else {
    	flag = 1;
    }

    if(flag == 0) {
    	order[restaurantId][name]["id"] = id;
    	order[restaurantId][name]["price"] = price;
    	order[restaurantId][name]["count"] = quantity;

        var dishes = order[restaurantId];
        var dishName = name;
        var restId = restaurantId;

        $(".cart_shops .cart_dishes").first().append(
            '<div class="numbers_row">' +
            '<div class="dish_name">' + dishName + '</div>' +

            '<div class="inc_dec">'+ 
            '<button type="button" onclick="updateOrder(' + '\'' + dishName + '\', ' + dishes[dishName]["id"] + ", " + dishes[dishName]["price"] + ', ' + (-1) + ', ' + (1) + ', ' + restId + ')"' +
            '> - </button>'+
            ' <span id=' + '"' + dishes[dishName]["id"] + '"' + '>' + dishes[dishName]["count"] + '</span>' +
            '<button type="button" onclick="updateOrder(' + '\'' + dishName + '\', ' + dishes[dishName]["id"] + ", " + dishes[dishName]["price"] + ', ' + (1) + ', ' + (1) + ', ' + restId + ')"' +
            '> + </button>'+
            '</div>' +
            
            '<div class="price">' + dishes[dishName]["price"] + '</div>' +
            '</div>' 
        );

    } else {
    	order[restaurantId][name]["count"]  = Number(order[restaurantId][name]["count"]) + quantity;
        document.getElementById(id).innerHTML = order[restaurantId][name]["count"];
    }

    // update the current order:

    totalNum += quantity;
    totalPrice += price * quantity;
    updateSummary();
}

function updateOrder(name, id, price, quantity, flag, restId) {
	if(Number(document.getElementById(id).innerHTML) + quantity >= 0) {
		// update total price of the current order:
	    totalPrice += price * quantity;
	    totalNum += quantity;

	    dishes = order[restId];
        // update quantity:
        var qty = Number(document.getElementById(id).innerHTML);
        var new_quantity = quantity + qty;	       
        document.getElementById(id).innerHTML = new_quantity;
        // update the total count of the dish:
        dishes[name]["count"] += quantity;
	} else {
		$("#" + id).parent().parent().remove();
	}

    updateSummary();
 }


 /**
 * Update the summary of the shopping cart.
 */
function updateSummary() {
    updateDBCart(localStorage.getItem("userId"));

    $(".total .fee").text("A$" + totalPrice);

	$("#cart_info .cart-top-sum").text("A$" + totalPrice + " / " + totalNum + " Item(s)");
}


/**
 * Update shoppingCart in database.
 */
function updateDBCart(userId) {
    var cart = new Object();
    cart.userId = localStorage.getItem("userId");
    

    var info = "";
    var flag = true;

    for(var restId in order) {
    	var item = "";
    	item += restId;
    	item += ("," + restid2Name[restId]);
    	var dishes = order[restId];
    	var emptyItem = true;
    	for(var dishName in dishes) {
    		if(dishes[dishName]["count"] != 0) {
    			emptyItem = false;
	    		item += ("," + dishName + "," + dishes[dishName]["id"] + "," + dishes[dishName]["price"]
	    				+ "," + dishes[dishName]["count"]
	    			);
    		}
    	}
    	item += "#";
    	if(emptyItem == true) {
    		item = "";
    	}
    	info += item;
    }
    

    cart.items = info;
    var postData = JSON.stringify(cart);
    restSet(TEXT_HOST + "/shoppingCart/saveCart", POST_METHOD, postData, renderTestFunction(), "");
    
}

function renderTestFunction(){
    
}


function processOrder() {
    window.sessionStorage.setItem("order", JSON.stringify(order));
    window.sessionStorage.setItem("restid2Name", JSON.stringify(restid2Name));  
}

function sendOrder(){
    for(var restId in order) {
        var newOrder = Object();
        newOrder.userId = localStorage.getItem("userId");
        newOrder.restaurantId = restId;
        newOrder.addressId = 1;
        newOrder.deliverId = 1;
        newOrder.totalPrice = 0;

        var dishes = Array();
        for(var dishObj in order[restId]) {
            var dish = Object();
            dish.dishId = dishObj["id"];
            dish.amount = dishObj["count"];
            dish.price = dishObj["price"];
            newOrder.totalPrice += Number(dish.price) * Number(dish.amount);
            dishes.push(dish);
        }

        var order2dishes = Object();
        order2dishes.order = newOrder;
        order2dishes.dishes = dishes;

        var postData = JSON.stringify(order2dishes);

        var url = TEXT_HOST+"/orders/create";
        restSet(url, POST_METHOD, postData, renderSendOrder(),"");
    }


    // var order = new Object();

    // order.userId = 1;
    // order.restaurantId = 1;
    // order.totalPrice = 1;
    // order.deliveryFee = 1;
    // order.deliverId = 1;
    // order.paymentStatus = "";
    // order.state = "";
    // order.creatTime = new Date();
    // order.deliverTime = null;
    // order.finishTime = null;
    // //order.addressId = 1;

    // var dishes= Array();
    // for(var i=0;i<2;i++){//遍历dish的数量
    //   var dish=new Object();
    //   dish.dishId=i+1;
    //   dish.amount=i;
    //   dish.price=i;
    //   dishes.push(dish);
    // }
    // //
    
    // var order2dishes=new Object();
    // order2dishes.order=order;
    // order2dishes.dishes=dishes;
    // var postData = JSON.stringify(order2dishes);
    // var url=TEXT_HOST+"/orders/create";
    // restSet(url, POST_METHOD, postData, renderSendOrder(),"");
}

function renderSendOrder(){
  alert("sent successful!");
}


