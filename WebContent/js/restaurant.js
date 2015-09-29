/**
 * @author Fei Wang
 * @author Jun Chen
 *
 */

var order = {};
var total_price = 0;

/**
 * Append restaurant's information into the page.
 * @param restaurant: a restaurant object.
 */
function shopAppend(restaurant) {
  $('#shops').append(
    "<a href='restaurant.html'>" + "<div class='shop col-xs-4 " + restaurant.country + " " +
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
        " id=" + dish.id +  " onclick='addToCart(" + '"' + dish.name.trim() + '"' + ", " + dish.price + ")'>"  +
        "<i class='fa fa-cart-plus'>&nbsp;</i>" +
        "<i class='fa fa-usd'></i>" + dish.price + "</a>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
    );
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
}

function setCurrentDishType(type) {
    current_dish_type = type;
}

function getCurrentDishType() {
    return current_dish_type;
}


/** 
 * Update the dish display according to the applied filter (selected type).
 * @param current_type: the selected type.
 */
function update(current_type) {
    $("#dishes").empty();
    restGet(TEXT_HOST+'/dishes/query/?shopId=2',GET_METHOD, function(data){
            $.each(data, function(i, dish){
                if(dish.type == current_type) {
                    dishAppend(dish); 
                }
            });
    }, '#info');
}

/**
 * Add an item to shopping cart.
 */
function addToCart(name, price) {
    if(order[name] == undefined) {
        order[name] = {};
    }
    if(order[name]["count"] == undefined) {
        order[name]["count"] = 1;
    } else {
        order[name]["count"] += 1;
    }
    total_price += price;
}

/**
 * Display the order to the page.
 */
 function appendOrder() {
    
 }