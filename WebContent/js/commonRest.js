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
    rest(restUrl, httpMethod, entity, "application/json", "json", callback, resultDiv);
}

function rest(restUrl, httpMethod, entity, contentType, dataType, callback, resultDiv) {
	if (resultLine!=""){
		var resultLine = jQuery(resultDiv);
	}
    resultLine.html(LOADING);
    var request = jQuery.ajax({type: httpMethod, url: restUrl, data: entity, contentType: contentType, dataType: dataType});
    request.done(function (data) {
        try {
            if (data === null || data === undefined) {
            	if(resultLine!=null)
            		resultLine.html(NO_RESULT);
            } else if (data.statusCode && data.statusCode != NORMAL_STATUS) {
            	if(resultLine!=null)
            		resultLine.html("StatusCode:"+data.statusCode+"  " + data.statusInfo);
            } else if (callback != null) {
            	if(resultLine!=null)
            		resultLine.html("");
                callback(data);
            }
        } catch (e) {
            resultLine.html(e);
        }
    });
    request.fail(function (textStatus, errorThrown) {
        resultLine.html(errorThrown + " status=" + textStatus.status + " text=" + textStatus.statusText);
    });
}

function ajaxFileUpload(urlPath, putData, fileId) {
	 $.ajaxFileUpload({
		 url: urlPath, 
		 secureuri: false, 
		 fileElementId: fileId,
		 data: putData,
		 dataType: 'text', 
		 success: function (data, status){  
			 			console.log("Yes!!!!!!");
			 			console.log(data);
                     },
       error: function (data, status, e){
       		  alert(e);}
   })
   return false;
}

function checkSignIn() {
    var storageUserId = storage.getItem("userId");
    if (storageUserId == null) {
       window.location.href = ATUP_PAGE_URI + "signIn.html";
    } else {
        var user = storage.getItem("userName");
        jQuery('#topDiv').html("Welcome " + user);
    }
}
