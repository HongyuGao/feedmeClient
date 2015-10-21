var order = JSON.parse(sessionStorage.getItem("order"));
var restid2Name = JSON.parse(sessionStorage.getItem("restid2Name"));
var totalPrice = 0;

/**
 *
 * @param order (global)
 * @param restid2Name (global)
 */
function displayOrder() {
    var orderContent = $(".confirm");
    var isFirstOrder = true;

    console.log(order);
    console.log(restid2Name);
    for(var restId in order) {
        if(isFirstOrder == false) {
            var newOrderContent = orderContent.clone();
            newOrderContent.find(".cart_dishes").empty();
            newOrderContent.insertAfter(orderContent);
            orderContent = newOrderContent;
        }

        var restName = restid2Name[restId];
        console.log(restName);
        orderContent.find(".shop_name span").text(restName);
        
        var dishes = order[restId];
        
        var cartDishes = orderContent.find(".cart_dishes");
        console.log(cartDishes);

        for(var dishName in dishes) {
            var dishId = dishes[dishName]["id"];
            var dishPrice = dishes[dishName]["price"];
            var dishQty = dishes[dishName]["count"];
            totalPrice += Number(dishPrice) * Number(dishQty);
            cartDishes.append(
                    '<div class="numbers_row">' +
                    '<div class="dish_name">' + dishName + '</div>' +

                    '<div class="inc_dec">'+ 
                    '<button type="button" onclick="updateOrder(' + '\'' + dishName + '\', ' + dishes[dishName]["id"] + ", " + dishes[dishName]["price"] + ', ' + (-1) + ', ' + (1) + ', ' +(restId) + ')"' +
                    '> - </button>'+
                    //'</div>' +

                    ' <span id=' + '"' + dishes[dishName]["id"] + '"' + '>' + dishes[dishName]["count"] + '</span>' +

                    //'<div class="inc_dec">'+ 
                    '<button type="button" onclick="updateOrder(' + '\'' + dishName + '\', ' + dishes[dishName]["id"] + ", " + dishes[dishName]["price"] + ', ' + (1) + ', ' + (1) + ',' + (restId) +  ')"' +
                    '> + </button>'+
                    '</div>' +
                    
                    '<div class="price">' + dishes[dishName]["price"] + '</div>' +
                    '</div>' 
            );
        }

        // TODO!
        // delivery fee.

        isFirstOrder = false;
    }

    // summary:
    $(".total .fee").text("A$" + totalPrice);


}



function updateOrder(name, id, price, quantity, flag, restId) {
    if(Number(document.getElementById(id).innerHTML) + quantity >= 0) {
        // update total price of the current order:
        totalPrice += price * quantity;

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
    restSet(TEXT_HOST + "/shoppingCart/saveCart", POST_METHOD, postData, "", "");
    
}


function generateOrder(restId, userId, dishes, totalPrice) {
    var Order = new Object();

    order.userId = userId;
    order.restId = restId;
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