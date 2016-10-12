/**
 * @author Danyang Li
 */
var storage = window.sessionStorage;

const NO_RESULT = "There's no result from the server";

const GET_METHOD = 'GET';
const POST_METHOD = 'POST';
const PUT_METHOD = 'PUT';
const DELETE_METHOD = 'DELETE';

const NORMAL_STATUS = 9200;
const LOADING = "Loading...";

function restGet(restUrl, httpMethod, callback, resultDiv) {
  rest(restUrl, httpMethod, "", "application/json", "json", callback, resultDiv);
}

function restSet(restUrl, httpMethod, entity, callback, resultDiv) {
  rest(restUrl, httpMethod, entity, "application/json", "json", callback,
    resultDiv);
}

function rest(restUrl, httpMethod, entity, contentType, dataType, callback,
  resultDiv) {
  if (resultLine != "") {
    var resultLine = jQuery(resultDiv);
  }
  resultLine.html(LOADING);
  var request = jQuery.ajax({
    type: httpMethod,
    url: restUrl,
    data: entity,
    contentType: contentType,
    dataType: dataType
  });
  request.done(function(data) {
    try {
      if (data === null || data === undefined) {
        if (resultLine != null)
          resultLine.html(NO_RESULT);
      } else if (data.statusCode && data.statusCode != NORMAL_STATUS) {
        if (resultLine != null)
          resultLine.html("StatusCode:" + data.statusCode + "  " + data.statusInfo);
      } else if (callback != null) {
        if (resultLine != null)
          resultLine.html("");
        callback(data);
      }
    } catch (e) {
      resultLine.html(e);
    }
  });
  request.fail(function(textStatus, errorThrown) {
    resultLine.html(errorThrown + " status=" + textStatus.status + " text=" +
      textStatus.statusText);
  });
}

function ajaxFileUpload(urlPath, putData, fileId, callback) {
  $.ajaxFileUpload({
    url: urlPath,
    secureuri: false,
    fileElementId: fileId,
    data: putData,
    //dataType: 'text',
    dataType: 'json',
    success: function(data, status) {
      if (data == null) {

      } else if (callback != null && callback != "") {
        callback(data);
      }
    },
    error: function(data, status, e) {
      alert("File upload error: " + e);
    }
  })
  return false;
}

function PreviewImage(upload, paramId) {
  var fileInput = upload.id;
  if (checkPic(fileInput)) {
    try {
      var imgPath;
      if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
        upload.select();
        jQuery("#" + paramId).attr("src", imgPath);
      } else {
        var reader = new FileReader();
        reader.onload = function(event) {
          document.getElementById(paramId).src = event.target.result;
        };
        reader.readAsDataURL(document.getElementById(fileInput).files[0]);
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    alert("Invalid picture formate");
  }
}

function checkPic(paramId) {
  var picPath = jQuery("#" + paramId).val();
  var type = picPath.substring(picPath.lastIndexOf(".") + 1, picPath.length).toLowerCase();
  if (type == "jpg" || type == "bmp" || type == "png") {
    return true;
  }
  return false;
}
