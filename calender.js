//calender creation section Table and insert content

var days = ["Sun ", "Mon ", "Tue ", "Wed ", "Thu ", "Fri ", "Sat "];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var htmlCalender = $(".calender");
// var monthYear = document.querySelector(".update");
var forfunyear;
function createcalender(year, month) {
    var monthYear = $('<h1>');
    var componentmonth = document.createTextNode(months[month]);
    var componentyear = document.createTextNode(year);
    monthYear.append(componentmonth);
    monthYear.append(document.createTextNode (" "));
    monthYear.append(componentyear);
    forfunyear = year + "-" + month;
    htmlCalender.append(monthYear);
    var firstDay = new Date(year, month, 01).getDay();
    var dayHas = 32 - (new Date(year, month, 32).getDate());
    var table = document.createElement("table");
    var tablehead = document.createElement("thead");
    var tablerow = document.createElement("tr");
    for (var d = 0; d < days.length; d++) {
        var th = document.createElement("th");
        var content = document.createTextNode(days[d]);
        th.append(content);
        tablerow.append(th);
    }
    tablehead.append(tablerow);
    table.append(tablehead);
    var tablebody = document.createElement("tbody");
    var currentdate = 1;
    for (var week = 0; week < 5; week++) {
        var row = document.createElement("tr");
        for (var wday = 0; wday <= 6; wday++) {
            var body = document.createElement("td");
            if (currentdate > dayHas) {

            }
            else if (week == 0 && wday < firstDay) {

            }
            else {
                var contentbody = document.createTextNode(currentdate);
                body.append(contentbody);

                body.setAttribute("id", forfunyear + "-" + currentdate);
                currentdate++;
            }
            row.append(body);
        }
        tablebody.append(row);
    }

    table.append(tablebody);
    htmlCalender.append(table);

    function show(fuly2) {
        firebase.database().ref('Year/' + fuly2).on('value', function (snapshot) {
            if (snapshot.exists()) {
                var t = fuly2.split("-")[2];
                var tb = document.getElementById(fuly2);
                tb.lastChild.innerHTML =" ";
                var div = document.createElement('div');
                div.id = 'container';
                snapshot.forEach(function (ChildSnapshot) {
                    var data = ChildSnapshot.val().Description;
                    var tit = ChildSnapshot.val().Title;
                    var d = tit;
                    var div1 = document.createElement("div");
                    div1.id = "childdiv"
                    div1.append(d);
                    div.append(div1);
                    tb.append(div);
                });
            }
        });
    }
    diss(show);
    function diss(callback) {
        for (var k = 0; k <= 31; k++) {
            var fuly2 = forfunyear + "-" + k;
            callback(fuly2);
        }

    }
}

createcalender(year, month);

//for forward and backward for the calender
function getplus() {
    month++;
    if (month == 12) {
        year++;
        month = 0;
    }
    htmlCalender.innerHTML = "";
    createcalender(year, month);
}
function getminus() {
    month--;
    if (month < 0) {
        year--;
        month = 11;
    }
    htmlCalender.innerHTML = "";
    createcalender(year, month);
}



var viewdatacontent = $("#view-data-content");
var membercontent=document.querySelector("#member-content");
var updatefrm = document.querySelector("#update-frm");


// create node and add to the update content to the table 


// update and show about title description to from section
function show3(fuly2) {
    firebase.database().ref('Year/' + fuly2).on('value', function (snapshot) {
        viewdatacontent.html(" ");
        if (snapshot.exists()) {
            
            var t = fuly2.split("-")[2];
            var div = document.createElement('div');
            div.id = 'container3';
            div.className = fuly2;
            snapshot.forEach(function (ChildSnapshot) {
                var data = ChildSnapshot.val().Description;
                var tit = ChildSnapshot.val().Title;
                var fro = ChildSnapshot.val().From;
                var to = ChildSnapshot.val().To;
                var d = `Title:${tit}, Description:${data}, From:${fro}, To:${to}`;

                var div1 = document.createElement("div");
                div1.className = "childdiv3";
                div1.id = `${ChildSnapshot.key}`;
                div1.append(d);
                div.append(div1);
                viewdatacontent.append(div);
            });
        }
    });
}
//update and attach the node to the page for show name and email
function show4(dAte){
    firebase.database().ref('Email/' +dAte).on('value',function(snapshot){
        membercontent.innerHTML=" ";
        if(snapshot.exists()) {
            
            var div = document.createElement('div');
            div.id = 'container6';
            div.className = dAte;
            snapshot.forEach(function (ChildSnapshot) {
                var Name = ChildSnapshot.val().Name;
                var Email = ChildSnapshot.val().Email;
                var d = `Name:${Name}, Email:${Email}`;

                var div1 = document.createElement("div");
                div1.className = "childdiv6";
                div1.id = `${ChildSnapshot.key}`;
                div1.append(d);
                div.append(div1);
                membercontent.append(div);
            });

        }
    });

}






//Add delete update section

// add the title description and from to to the firebase
function submitform(data, e) {

    e.preventDefault();

    var formdata = {};
    for (var i = 0; i < data.length - 1; i++) {

        formdata[data[i].name] = data[i].value;
    }

    // console.log(formdata);
    var Array = formdata.date.split('-');
    var fireYear = Array[0];//2021
    var fireMonth = Array[1];//07
    var formdata2={};
    var flag=false;
    if(formdata.title.length==0)
    {
        alert(`Please fill up Title`);
        flag=false;
        return false;
    }
    else{
        var str=capitalize(formdata.title);
        formdata2.Title=str;
        var frm = document.querySelector("#frm-id");
        frm.elements["title"].value=str;
        flag=true;
    }
    if(formdata.from =="" || formdata.to=="")
    {
        alert('Please fillup the form');
        flag=false;
        return false;
    }
    else if (formdata.from <= formdata.to) {
        formdata2.From=formdata.from;
        formdata2.To=formdata.to;
        flag=true;
    }
    else {
        alert("Check the time properly");
        flag=false;
        return false;
    }
    if(formdata.description.length==0)
    {
        alert("please write something in description");
        flag=true;
        return false;
    }
    else{
        flag=true;
        formdata2.description=formdata.description;

    }
    console.log(formdata2);
    if(flag){
    firebase.database().ref('Year/' + formdata.date).push({
        Title: formdata2.Title,
        From: formdata2.From,
        To: formdata2.To,
        Description: formdata2.description
    });
    }
    e.submitform;
    var clear1 = document.querySelector(".clear1");
    setTimeout(function () {
        clear1.click();
        modal.style.display = "none";
    }, 1000);

}
//add for name and email in the firebase
function addnew(data2, e) {
    e.preventDefault();
    var addnew = {};
    for (var i = 0; i < data2.length - 1; i++) {

        addnew[data2[i].name] = data2[i].value;
    }
    let email = addnew.newattendee;
    if (validateEmail(email)) {
        var frm = document.querySelector("#frm-id");
        firebase.database().ref('Email/' + frm['date'].value).push({
            Email: addnew.newattendee,
            Name:addnew.name
        });
    }
    else {
        alert("please select corrct mail");
    }
    e.submitform;
    var clear2 = document.querySelector(".clear2");
    setTimeout(function () {
        clear2.click();
        modal.style.display = "none";
    }, 1000);


}

//validation for mail
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
//capitalize first word of letter
function capitalize(input) {
    var CapitalizeWords = input[0].toUpperCase();
    for (var i = 1; i <= input.length - 1; i++) {
        let currentCharacter,
            previousCharacter = input[i - 1];
        if (previousCharacter && previousCharacter == ' ') {
            currentCharacter = input[i].toUpperCase();
        } else {
            currentCharacter = input[i];
        }
        CapitalizeWords = CapitalizeWords + currentCharacter;
    }
    return CapitalizeWords;
}

//for refresh the view before the update and delete 
function fillup(updateid) {
    updatefrm.elements['date'].value = updateid.path[1].className;
    firebase.database().ref('Year/' + `${updateid.path[1].className}/` + updateid.target.id).on('value', function (snapshot) {
        updatefrm.elements['title'].value = snapshot.val().Title;
        updatefrm.elements['from'].value = snapshot.val().From;
        updatefrm.elements['to'].value = snapshot.val().To;
        updatefrm.elements['description'].value = snapshot.val().Description;
    });
    show3(updateid.path[1].className);
}
//for delete the existing data title description from and to using button on click
function dlbtn(){
       alert("Are you Sure");
        show3(cheating.path[1].className);
        firebase.database().ref('Year/' + `${cheating.path[1].className}/` + cheating.target.id).remove();
        updatedata.style.display = "none";

    show3(cheating.path[1].className);
}
//for update the existing data title description from and to using button on click
function upbtn(){
        show3(cheating.path[1].className);
            // document.getElementById(`${updateid.path[1].className}`).lastChild.innerHTML = " ";
            firebase.database().ref('Year/' + `${cheating.path[1].className}/` + `${cheating.target.id}`).update({
                Title: updatefrm.elements['title'].value,
                From: updatefrm.elements['from'].value,
                To: updatefrm.elements['to'].value,
                Description: updatefrm.elements['description'].value
            });
            updatedata.style.display = "none";
            show3(cheating.path[1].className);
        
}
//delete for the name and emails
membercontent.addEventListener("click", function(e) {
             console.log(e);
             firebase.database().ref('Email/'+`${e.path[1].className}/`+e.path[0].id).remove();
             show4(e.path[1].className);
             member.style.display="none";
});







// popup showing  and display section 
var modal = $("#myModal");
var span = $(".close").first();
var viewdata = $("#view-data");
var updatedata = $("#update-data");
var cheating;
var member=$("#member");
var forfunctiondate;
// display the form
htmlCalender.on("click", function (e) {
    forfunctiondate = e.target.id;
    if (e.target.id == "childdiv") {
        var checkdiv = e.target.offsetParent.id;
        viewdata.show();
        $('span').click(function () {
            viewdata.hide();
        });
        $(window).click(function (event) {
            if (event.target.id == "view-data") {
                viewdata.hide();
            }
        });
        show3(checkdiv);
    }
    else {
        modal.show();
        var frmid = document.querySelector('input[name="date"]');
        frmid.value = e.target.id;
        $('span').click(function () {
            modal.hide();
        });
        $(window).click(function (event) {
            if (event.target.className == "modal") {
                modal.hide();
            }
        });
    }
});

//for display the content of title description from and to ViewData
viewdatacontent.on("click", function (e) {
    updatedata.show();
    $('span').click(function () {
        updatedata.hide();
    });
    $(window).click(function (event) {
        if (event.target.id == "update-data") {
            updatedata.hide();
        }
        if (event.target.id == "view-data") {
            viewdata.hide();
        }
    });
    fillup(e);
    cheating=e;  
});

//for display the name and email
function viewmembers(e)
{
    e.preventDefault;
    member.show();
    $('span').click(function () {
        member.hide();
    });
    $(window).click(function (event) {
         
        if (event.target.id == "member") {
            member.hide();
        }
        if(event.target.className=="modal") {
            modal.hide();
        }
    });
    var frm=$("#frm-id input[name=date]").val();
    show4(frm);
}

//viewing current Date with color
var nowdate=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
$(`#${nowdate}`).css("background-color","#FFEDDA");