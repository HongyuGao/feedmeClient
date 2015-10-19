//Shopping cart slid in and slide out code
var slided = false;

function slideOut(e) {
  var elem = document.getElementById(e);
  elem.style.transition = "right 0.3s linear 0s";
  elem.style.right = "-300px";
  slided = false;
}

function slideIn(e) {
  var elem = document.getElementById(e);
  elem.style.transition = "right 0.3s linear 0s";
  elem.style.right = "0px";
  slided = true;
}

function slide(e) {
  if (slided) {
    slideOut(e);
  } else {
    slideIn(e);
  }
}

$(document).ready(function() {
  //Navigation Menu Slider
  $('#cart_info').on('click', function(e) {
    e.preventDefault();
    $('#cart').toggleClass('slide_right');
  });
  $('#nav-close').on('click', function(e) {
    e.preventDefault();
    $('#cart').removeClass('slide_right');
  });
});


//Div pop out and close code
function pop(photo, name, id, price) {
  setPopInfo(photo, name, id, price);
  document.getElementById('popDiv').style.display = 'block';
  document.getElementById("dish_popup").style.display = 'block';
}

function setPopInfo(photo, name, id, price) {
  $(".pop_dish .dish_photo img").attr("src", photo);
  $(".pop_dish .dish_name").text(name);
  $(".pop_dish_info .dish_name").data("dishId", id);
  $(".pop_dish .dish_price").text("A$" + price);
}


function hide() {
  document.getElementById('popDiv').style.display = 'none';
  document.getElementById("dish_popup").style.display = 'none';
}
//To detect escape button
document.onkeydown = function(evt) {
  evt = evt || window.event;
  if (evt.keyCode == 27) {
    hide('popDiv');
  }
};

function empty_input() {
  $('#search_field').val('');
}

//Dropdown plugin data
var ddData = [{
  text: "ACT",
  value: 1,
  selected: true,
}, {
  text: "NWS",
  value: 2,
  selected: false,
}, {
  text: "Other",
  value: 3,
  selected: false,

}];

function location_slick(id, w, text) {
  $(id).ddslick({
    data: ddData,
    width: w,
    imagePosition: "left",
    selectText: text,
    background: '#d05b54',
    border: 'none',
    onSelected: function(data) {
      console.log(data);
    }
  });

}
