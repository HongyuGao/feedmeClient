function shopAppend(restaurant) {
  $('#shops').append(
    "<a href=''>" + "<div class='shop col-xs-4 " + restaurant.country + " " +
    restaurant.type + "' data-status='open'>" +
    "<div class='shop_img col-xs-6'>" + "<img src='" + PICTURE_HOST +
    "/data/img/" + restaurant.logo + "' class='img-responsive' alt='...'>" +
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

function dishAppend(dish) {
  $("#dishes").append(
    "<div class='col-xs-3 dish_detail' id='dish_id1'>" +
    "<div class='thumbnail'>" +
    "<img src='" + PICTURE_HOST +
    "/data/img/" + dish.photo + "'  alt='...'>" +
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
    "<a href='#' class='btn btn-success btn-sm pull-right' role='button'>" +
    "<i class='fa fa-cart-plus'>&nbsp;</i>" +
    "<i class='fa fa-usd'></i>" + dish.price + "</a>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>"

  );
}
