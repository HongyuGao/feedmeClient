/**
 * @author Danyang Li
 */
var emailValidate=false;

/**Information Validation**/
function emptyVal(param){
	var value=jQuery.trim(param.value);
	if(value==""){
		validationInfo(param.name,"It can't be blank");
		return false;
	}
	else{
		validationInfo(param.name,"");
		return true;
	}
}

function emailVal(email){
	var emailStr=jQuery.trim(email.value);
	if(emailStr==""){
		validationInfo(email.name,"Email can't be blank");
		emailValidate=false;
	}
	else{
		reg=/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/gi;
		if(!reg.test(emailStr)){
			validationInfo(email.name,"Email is invalid");		
			emailValidate=false;
		}
		else{
			var restUrl="users/checkEmail?email="+emailStr;
			restGet(restUrl, "GET", renderEmailCheck,"#eVal")
		}
	}
}	

function pwdVal(cpwd){
	if(cpwd.value!=jQuery("#pwd").val()){
		validationInfo(cpwd.name,"Password doesn't match the confirmation");
		return false;
	}
	else{
		validationInfo(cpwd.name,"");
		return true;
	}	
}

function validationInfo(disDiv,disInfo){
	document.getElementById(disDiv).style.display="block";
	document.getElementById(disDiv).innerHTML=disInfo; //jQuery("#"+disDiv).html(disInfo);		
}

/**POST**/
function signUp() {
	var titleValue=jQuery("#title option:selected").val();
	var bodValue=jQuery("#bod").val();
	var plValue=jQuery("#pl option:selected").val();	
	var fname=document.getElementById("fname");
	var lname=document.getElementById("lname");
	var email=document.getElementById("email");
	var pwd=document.getElementById("pwd");
	var cpwd=document.getElementById("cpwd");
	var tel=document.getElementById("tel");	
	emailVal(email);
	if(emailValidate==true&&emptyVal(fname)&&emptyVal(lname)&&emptyVal(pwd)&&emptyVal(tel)&&pwdVal(cpwd)){
		var hashpwd=md5(pwd.value);
		var user=new Object();
		user.email=jQuery.trim(email.value);
		user.firstname=jQuery.trim(fname.value);
		user.lastname=jQuery.trim(lname.value);
		user.title=titleValue;
		user.birthday=bodValue;
		user.password=hashpwd;
		user.phoneNumber= jQuery.trim(tel.value);
		user.preferedLanguage=plValue;
		var postData = JSON.stringify(user);
		restSet("/users/register", POST_METHOD, postData, renderSignUp,"#signInfo");
	}
	else{
		var errorInfo="There were problems creating your account";
		validationInfo("signInfo",errorInfo);
	}    
}

/**GET**/
function signIn() {
    var userEmail = jQuery.trim(jQuery("#inputEmail").val());
    var password = jQuery.trim(jQuery("#inputPassword").val());
    if(userEmail!=""&&password!=""){
    	console.log(userEmail);   	
    	var hashPassword = md5(password);
    	console.log(hashPassword);
        //var url = ATUP_USER_URI + SIGNIN_PATH + "?user=" + userName + "&password=" + hashPassword;
        restGet("/users/login?email=" + userEmail + "&pwd=" + hashPassword, GET_METHOD, renderSignIn,"#resultDiv");
    }
    else{
    	validationInfo("resultDiv","Username and password can't be empty");
    }
    
}

/*PUT*/
function updateUser() {
    var userName = jQuery.trim(jQuery("#userName").val());
    var password = jQuery("#password").val();
    var hashPassword = md5(password);
    var userRole = jQuery("#role").val();
    var putData = JSON.stringify({userName: userName, passWord: hashPassword, userRole: userRole});
    restSet(ATUP_USER_URI + USER_PATH, PUT_METHOD, putData, renderUpdate);
}

/*RENDER*/
function renderEmailCheck(data){
	if(data.statusInfo=="N"){
		emailValidate=false;
		validationInfo(email.name,"Email is already token");
	}else if(data.statusInfo=="Y"){
		emailValidate=true;
		validationInfo(email.name,"");
	}else{
		emailValidate=false;
		validationInfo(email.name,"Unkown Error");
	}	
}

function renderSignUp(data) {
    jQuery("#signInfo").html(data.statusInfo);
    window.location.href = "signUp.html";
}

function renderSignIn(data) {
	console.log("enter renderSignIn");
    if (data.statusInfo=="Y") {
    	validationInfo("resultDiv","Success");
    	console.log("enter renderSignIn If branch");
        storage.setItem("userId", data.id);
        storage.setItem("userName", data.firstname);
        storage.setItem("userRole", data.lastname);
        window.location.href = "index.html";
    }else if(data.statusInfo=="N"){
    	validationInfo("resultDiv","Incorrect email address or password"); 
    }else{
    	//need error page
    }
}

function renderUpdate(data) {
    var usersDiv = jQuery("#usersDiv");
    usersDiv.html("<div><span style='width:100px;display:inline-block;'>User ID</span>");
    usersDiv.append("<span style='width:100px;display:inline-block;'>User Name</span>");
    usersDiv.append("<span style='width:100px;display:inline-block;'>User Role</span></div>");
    usersDiv.append("<div><span style='width:100px;display:inline-block;'>");
    usersDiv.append(data.userId);
    usersDiv.append("</span><span style='width:100px;display:inline-block;'>");
    usersDiv.append(data.userName);
    usersDiv.append("</span><span style='width:100px;display:inline-block;'>");
    usersDiv.append(data.userRole);
    usersDiv.append("</span></div>");
}