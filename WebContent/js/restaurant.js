/**
 * @author Fei Wang
 * @author Jun Chen
 *
 */

var order = {};
var total_price = 0;
var total_num = 0;
var delivery_fee = 0;
var orders = new Array();

/*to be fixed*/
var userId = 1;
var restaurantId;
var restaurantName;


var allOrdersQuantity = 0;
var allOrdersPrice = 0;

/**
 * Append restaurant's information into the page.
 * @param restaurant: a restaurant object.
 */
function shopAppend(restaurant) {
    $('#shops').append(
        "<a href='restaurant.html?shopId=" + restaurant.id + "'>" + "<div class='shop col-xs-4 " + restaurant.country + " " +
        restaurant.type + "' data-status='open'>" +
        "<div class='shop_img col-xs-6'>" + "<img src='" + PICTURE_HOST +
        "/img/logo/" + restaurant.logo + "' class='img-responsive' alt='...'>" +
        "<div class='open_time'>" + "Open Time:" +
        "<li class='fa fa-clock-o'> 11:00 am - 02:00 pm</li>" +
        "<li class='fa fa-clock-o'> 04:00 pm - 09:00 pm</li>" + "</div>" +
        "</div>" + "<div class='shop_info col-xs-6'>" + "<div class='shop_name'>" +
        restaurant.name + "</div>" + "<div class='star'>" +
        "<span class='glyphicon glyphicon-star'></span>" +
        "<span class='glyphicon glyphicon-star'></span>" +
        "<span class='glyphicon glyphicon-star'></span>" +
        "<span class='glyphicon glyphicon-star-empty'></span>" +
        "<span class='glyphicon glyphicon-star-empty'></span>" +
        "<span >(23)</span>" + "</div>" +
        "<div class='minimal_spend'>Min. Delivery: $30</div>" +
        "<div class='deliver_fee'>Deliver Fee: $5</div>" +
        "<div class='pay_method'>" + "<i class='fa fa-cc-visa'></i>" +
        "<i class='fa fa-cc-mastercard'></i>" + "<i class='fa fa-cc-paypal'></i>" +
        "</div>" + "<div class='address'>34 Mary Gungahlin, ACT</div>" + "</div>" +
        "</div>" + "</a>"
    );
}

/**
 * Append dish's information into the page.
 * @param dish: a dish object.
 */
function dishAppend(dish) {
    $("#dishes").append(
        "<div class='col-xs-3 dish_detail' id='dish_id1'>" +
        "<div class='thumbnail'>" +
        "<img src='" + PICTURE_HOST +
        "/img/photo/" + dish.photo + "'  alt='...'>" +
        "<div class='caption'>" +
        "<div class='dish_name'>" + dish.name + "</div>" +
        "<div class='star'>" +
        "<span class='glyphicon glyphicon-star'></span>" +
        "<span class='glyphicon glyphicon-star'></span>" +
        "<span class='glyphicon glyphicon-star'></span>" +
        "<span class='glyphicon glyphicon-star-empty'></span>" +
        "<span class='glyphicon glyphicon-star-empty'></span>" +
        "<span >(23)</span>" +
        "</div>" +
        "<div class='ingredient'>" +
        "<bold class=''>Ingredient: </bold> " + dish.ingredient +
        "<i class='show_dish_detail' data-status='open'>Show More</i>" +
        "</div>" +
        "<div class='dish_desc'>" + dish.description +
        "</div>" +
        "<div class='add_cart'>" +
        "<a href='#' class='btn btn-default btn-sm pull-left disabled' role='button'>" +

        "<i>65</li> Saled</a>" +
        // "<a href='#' class='btn btn-success btn-sm pull-right' role='button'>" +
        "<a href='#' class='btn btn-success btn-sm pull-right' role='button'" +
        " onclick='addToCart(" + '"' + dish.name.trim() + '"' + ", " + dish.id + ", " + dish.price + ")'>"  +
        "<i class='fa fa-cart-plus'>&nbsp;</i>" +
        "<i class='fa fa-usd'></i>" + dish.price + "</a>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
    );
}




function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
        vars[key] = value;
    });
    return vars;
}

/**
 * Get and append all types of dishes to the left sub-nav bar one by one.
 * @param type: one type of dishes.
 */
function dishTypeAppend(type, id) {
    $("#dishTypeList").append(
        '<a href="#"><li class="sub-sub-nav" data-type=' + type + ' id=' + id +
        ' class=dishType' + 
        ' onclick=setCurrentDishType(type)' +
        ' data-status="open">' +
        type  +
        '<span class="icon"></span></li></a>'
    );
}


/**
 * Insert the information of current restaurant into the page.
 * @param restaurant: the current restaurant.
 */
function setRestaurantInfo(restaurant) {
    /** add the logo of the restaurant */
    $("#res_photo").append(
        "<img src='" + PICTURE_HOST + "/img/logo/" + restaurant.logo + ">"
    );

    $("#restaurantInfo").append(
        "<li" + ' style="text-align: left" ' + "> " + "Name: " + restaurant.name + "</li>" + "<br>" +
        "<li" + ' style="text-align: left" ' + "> " + "Phone: " + restaurant.phone + "</li>" + "<br>"
    );

    restaurantId = restaurant.id;
    restaurantName = restaurant.name;

    $("#rest_info").text(restaurantName);

    getCart();
}


//
function getCart() {
    var items = "";
    var url = TEXT_HOST+"/shoppingCart/queryCart?userId=" + localStorage.getItem("userId");
    restGet(url, GET_METHOD, function(data){
        items = data["items"];
        if(items.trim().length != 0) {
            // order, totoal_num, total_price, delivery_fee
            parseCart(items);
        }
    });
}

//
function parseCart(items) {
    var items_arr = items.split(" ");
    for(var i = 0; i < items_arr.length; i++) {
        if(items_arr[i].trim().length != 0) {
            var pos = items_arr[i].search(",");
            var restId = Number(items_arr[i].substring(0, pos));

            console.log("restId = " + restId + ", restaurantId = " + restaurantId);

            if(restId == restaurantId){
                console.log("euqal ids");
                var dish_arr = items_arr[i].substring(pos+1).trim().split(",");
                console.log(dish_arr);
                var j = 0;
                for(j = 0; j < dish_arr.length - 3; j += 4) {
                    console.log("dish:" + dish_arr[j]);
                    order[dish_arr[j]] = {};
                    order[dish_arr[j]]["id"] = dish_arr[j+1];
                    order[dish_arr[j]]["price"] = Number(dish_arr[j+2]);
                    order[dish_arr[j]]["count"] = Number(dish_arr[j+3]);
                    total_num += Number(dish_arr[j+3]);
                    console.log(total_num);
                    total_price += Number(dish_arr[j+2]) * Number(dish_arr[j+3]);
                    console.log(total_price);
                }
            } 

            // store other shops' order as a variable
            // add to shopping cart later in the sidebar
            // TOOD!
            else {
                orders.push(items_arr[i]);
                console.log("orders: " + orders);
                console.log("orders.length = " + orders.length);
            }
        }    
    }

    allOrdersQuantity += total_num;
    allOrdersPrice += total_price;
    $("#all_sum_num").text(allOrdersQuantity);
    $("#all_sum_price").text(allOrdersPrice);

    setCart();
}

//
function setCart() {
    // first add cart info of current restaurant:
    for(var dish_name in order) {
        var name = dish_name;
        var id = order[name]["id"];
        var price = Number(order[name]["price"]);
        var quantity = Number(order[name]["count"]);
        //var
        $("#dish_info").append(
        '<li class="dish_item"> ' +
        name + 
        '<button type="button" onclick="updateOrder(' + 1 + ", '" + name + "', " + id + ', ' + (-1.0*price) + ')"' +
        '> - </button> <span id=' + '"' + id + '"' + '>'+ quantity +'</span>' + 
        '<button type="button" onclick="updateOrder(' + 1 + ", '" + name + "', " + id + ', ' + price + ')"' +
        '> + </button> ' + 
        '<span id="' + id + 'price">' + price + '</span>' +
        '<button type="button" onclick="clearDishItem(' + id + ",'" + name.trim() + "', " + (-1.0*price*quantity) + ')"' + '>' +
        ' X </button>' +
        ' </li>' 
        );
    }

    // then add carts info of other restaurants:
    var order_no = orders.length;
    console.log("order_no: " + order_no);
    var i = 0;
    while(i < order_no) {  
        $("<hr>").insertBefore($("#place_order"));
        var tmp_order = orders[i];
        console.log("tmp_order: " + tmp_order);

        var pos = tmp_order.search(",");
        var restId = Number(tmp_order.substring(0, pos));

        restGet(TEXT_HOST + "/restaurants/query/?id=" + restId, GET_METHOD, function(data) {
            
            var restName = data.name;

            console.log("restName: " + restName);
            console.log("restId: " + restId);

            $("<div class=\"carts\"> <b> <a href=\"restaurant.html?shopId=" + restId + "\">" + restName + "</a></b></div>").insertBefore($("#place_order"));

            var itemsArr = tmp_order.substring(pos+1).trim().split(",");
            var j = 0;
            var totalQuantity = 0;
            var totalPrice = 0;

            for(j = 0; j < itemsArr.length - 3; j += 4) {
                var dishName = itemsArr[j];
                var dishId = itemsArr[j+1];
                var dishUnitPrice = Number(itemsArr[j+2]);
                var dishQuantity = Number(itemsArr[j+3]);
                totalQuantity += dishQuantity;
                totalPrice += dishUnitPrice*dishQuantity;

                console.log("totalPrice: " + totalPrice);

                

                $("<p>" + dishName + "  Qty: " + dishQuantity + "  Price: " + dishUnitPrice*dishQuantity  +"</p>").insertBefore($("#place_order"));

                $("<hr>").insertBefore($("#place_order"));
                $("<p class=\"cart_sum_q\">" + "Total Items: " + totalQuantity + "</p>").insertBefore($("#place_order"));
                $("<p class=\"cart_sum_p\">" + "Total Price: " + totalPrice + "</p>").insertBefore($("#place_order"));
            }

            // to be fixed!
            allOrdersQuantity += totalQuantity;
            allOrdersPrice += totalPrice;

            console.log("allOrdersQuantity: " + allOrdersQuantity);
            console.log("allOrdersPrice: " + allOrdersPrice);

            $("#all_sum_num").text(allOrdersQuantity);
            $("#all_sum_price").text(allOrdersPrice);

        }); 
        i++;   
    }
    

    
    // update dishes count:
    $("#cart_sum_num").empty();
    $("#cart_sum_num").append(total_num);

    // update dishes total price:
    $("#cart_sum_price").empty();
    $("#cart_sum_price").append(total_price);


    // TODO!
    // add all carts together:
    // var allOrdersQuantity = 0;
    // var allOrdersPrice = 0;
    // $(".cart_sum_q").each(function(data){
    //     console.log("test: " + $(this).text());
    // });
    

}




/** 
 * Update the dish display according to the applied filter (selected type).
 * @param current_type: the selected type.
 */
function update(current_type) {
    $("#dishes").empty();
    restGet(TEXT_HOST+'/dishes/query/?shopId=1',GET_METHOD, function(data){
            $.each(data, function(i, dish){
                if(current_type == "All" || dish.type == current_type) {
                    dishAppend(dish); 
                }
            });
    }, '#info');
}

/**
 * Add an item to shopping cart.
 *
 * @param name: the name of the dish.
 * @param id: the id of the dish.
 * @param price: the price of the dish.
 */
function addToCart(name, id, price) {
    // a flag variable denotes whether the dish to be added to cart
    // is already in the cart (flag=1) or not (flag=0).
    var flag = 0;

    if(order[name] == undefined) {
        order[name] = {};
        order[name]["count"] = 1;
        order[name]["price"] = price;        
    } else {
        flag = 1;
    }

    // update the current order:
    updateOrder(flag, name, id, price);
}



/**
 * Update shoppingCart in database.
 */
function updateDBCart(userId) {
    // items = restaurantId,dish_name,dish_unit_price,dish_quantity [restaurantId,dish_name, dish_unit_price,dish_quantity [...]]
    var cart = new Object();
    cart.userId = localStorage.getItem("userId");
    console.log("userId = " + userId);

    var info = "";
    var flag = true;

    console.log("in updateDBCart: total_price = " + total_price);

    if(total_price != 0) {
        var url=TEXT_HOST+"/shoppingCart/queryCart?userId=" + userId;
        restGet(url, GET_METHOD, function(data){
            //TODO: if data is empty.
            var items = data["items"];
            console.log(data["items"]);
            var items_arr = items.split(" ");
            for(var i = 0; i < items_arr.length; i++) {
                if(items_arr[i].trim().length != 0) {
                    var pos = items_arr[i].search(",");
                    var restId = Number(items_arr[i].substring(0, pos));

                    console.log("restId = " + restId + ", restaurantId = " + restaurantId);

                    if(restId == restaurantId) {
                        flag = false;                        
                    } else {
                        info += (items_arr[i] + " ");
                    }
                }    
            }

            // if the restaurant is already in the shopping cart:
            //if(flag == true) {
                if(info != "") {
                    info += " ";
                }
                info += restaurantId;
                for(var dish_name in order) {
                    if(order[dish_name] != undefined) {
                        info += ("," + dish_name);
                        info += ("," + order[dish_name]["id"]);
                        info += ("," + order[dish_name]["price"]);
                        info += ("," + order[dish_name]["count"]);
                    }
                }
                info += " ";
            //}

            cart.items = info;

            var postData = JSON.stringify(cart);
            console.log(postData);

            restSet(TEXT_HOST + "/shoppingCart/saveCart", POST_METHOD, postData, renderTestFunction(), "");

        });
    }

    else {
            cart.items = info;

            var postData = JSON.stringify(cart);
            console.log(postData);

            restSet(TEXT_HOST + "/shoppingCart/saveCart", POST_METHOD, postData, renderTestFunction(), "");
    }
    
}

function renderTestFunction(){
    console.log("update shopping cart successful!");
}

/**
 * Update order when the order changes.
 *
 * @param flag: a binary integer denotes whether the item is already 
        in the cart (flag=1) or not (flag=0).
 * @param name: the name of the item to be inserted.
 * @param id: the id of the item to be inserted.
 * @param price: the price of the item to be inserted.
 */
 function updateOrder(flag, name, id, price) {
    console.log("id: " + id);
    // update total price of the current order:
    total_price += price;
    allOrdersPrice += price;

    // update total number of items of the current order:
    if(price < 0) {
        total_num -= 1; 
        allOrdersQuantity -= 1;   
    } else {
        total_num += 1;    
        allOrdersQuantity += 1;
    }
    
    // update dishes list:
    if(flag == 1) { // if the dish is already in the cart:
        // update quantity:
        var quantity = Number(document.getElementById(id).innerHTML);
        var new_quantity = quantity + price / Math.abs(price);

        // process negative values that might occur:
        if(new_quantity >= 0) {
            document.getElementById(id).innerHTML = new_quantity;

            // update total price of a existing dish:
            var dish_total_price = Number(document.getElementById(id+"price").innerHTML);
            document.getElementById(id+"price").innerHTML = dish_total_price + price;

            // update the total count of the dish:
            order[name]["count"] += price / Math.abs(price);
        } else {
            total_price -= price;
            allOrdersPrice -= price;
            if(price < 0) {
                total_num += 1;    
                allOrdersQuantity += 1;
            } else {
                total_num -= 1;
                allOrdersQuantity -= 1;
            }
        }

    } else { // if the dish is the first time to be added to the cart:
        $("#dish_info").append(
        '<li class="dish_item"> ' +
        name + 
        '<button type="button" onclick="updateOrder(' + 1 + ", '" + name + "', " + id + ', ' + (-1.0*price) + ')"' +
        '> - </button> <span id=' + '"' + id + '"' + '>1</span>' + 
        '<button type="button" onclick="updateOrder(' + 1 + ", '" + name + "', " + id + ', ' + price + ')"' +
        '> + </button> ' + 
        '<span id="' + id + 'price">' + price + '</span>' +
        '<button type="button" onclick="clearDishItem(' + id + ",'" + name.trim() + "', " + (-1.0*price*order[name]["count"]) + ')"' + '>' +
        ' X </button>' +
        ' </li>' 
        );
        order[name]["id"] = id;
    }

    updateSummary();
 }


/**
 * Remove a dish item from the shopping cart when click on the "X" button.
 *
 * @param id: the id of the target dish.
 * @param name: the name the target dish.
 * @param price: the price of the target dish.
 */
function clearDishItem(id, name, price) {
    var reduced_price = price * Number(order[name]["count"]);
    var reduced_count = Number(order[name]["count"]);
    total_price += reduced_price;
    total_num -= reduced_count;
    allOrdersPrice += reduced_price;
    allOrdersQuantity -= reduced_count;

    // remove the whole item information from the shopping cart and order:
    order[name]["count"] = 0;
    order[name] = undefined;
    $("#" + id).parent().remove();

    updateSummary();
}

/**
 * Update the summary of the shopping cart.
 */
function updateSummary() {
    updateDBCart(userId);

    // update dishes count:
    $("#cart_sum_num").empty();
    $("#cart_sum_num").append(total_num);

    // update dishes total price:
    $("#cart_sum_price").empty();
    $("#cart_sum_price").append(total_price);

    // update the whole shopping cart summary:
    $("#all_sum_num").text(allOrdersQuantity);
    $("#all_sum_price").text(allOrdersPrice);
}

/* to be fixed */
function sendOrder(){
    var order = new Object();

    order.userId = 1;
    order.restaurantId = 1;
    order.totalPrice = total_price;
    order.deliveryFee = delivery_fee;
    order.deliverId = 1;
    order.paymentStatus = "";
    order.state = "";
    order.creatTime = new Date();
    order.deliverTime = null;
    order.finishTime = null;
    //order.addressId = 1;

    var dishes= Array();
    for(var i=0;i<2;i++){//遍历dish的数量
      var dish=new Object();
      dish.dishId=i+1;
      dish.amount=i;
      dish.price=i;
      dishes.push(dish);
    }
    //
    
    var order2dishes=new Object();
    order2dishes.order=order;
    order2dishes.dishes=dishes;
    var postData = JSON.stringify(order2dishes);
    var url=TEXT_HOST+"/orders/create";
    restSet(url, POST_METHOD, postData, renderSendOrder(),"");
}

function renderSendOrder(){
  alert("sent successful!");
}

function payInfo() {
    var info = "Items: <br>";
    for(var key in order) {
        info += "<li>" + key + ": " + order[key]["count"] + "</li>";
    }

    info += "<br>";
    info += "Total items: " + total_num;
    info += "<br>";
    info += "Total price: " + total_price;

    localStorage.setItem("order", info);
}