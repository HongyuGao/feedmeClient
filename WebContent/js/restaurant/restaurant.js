var restaurantId;
var restaurantName;

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
        vars[key] = value;
    });
    return vars;
}

function appendDish(dish) {
	$(".dishes").append(
		'<div class="dish" onclick="pop()">' +
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

