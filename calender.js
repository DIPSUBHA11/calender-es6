//calender creation section Table and insert content

var days = ["Sun ", "Mon ", "Tue ", "Wed ", "Thu ", "Fri ", "Sat "];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var htmlCalender = $(".calender");
// var monthYear = document.querySelector(".update");
var forfunyear;
async function createcalender(year, month) {
    var monthYear = $('<h1>');
    var componentmonth = document.createTextNode(months[month]);
    var componentyear = document.createTextNode(year);
    monthYear.append(componentmonth);
    monthYear.append(document.createTextNode(" "));
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
                var h3=document.createElement("h5");
                var divholi=document.createElement("p");
                divholi.className=forfunyear + "-" + currentdate+"-h";
                var contentbody = document.createTextNode(currentdate);
                h3.append(contentbody);

                body.append(h3);
                body.append(divholi);

                body.setAttribute("id", forfunyear + "-" + currentdate);
                currentdate++;
            }
            row.append(body);
        }
        tablebody.append(row);
    }

    table.append(tablebody);
    htmlCalender.append(table);

    function show1(fuly2) {
        firebase.database().ref('Year/' + fuly2).on('value', function (snapshot) {
            if (snapshot.exists()) {
                var t = fuly2.split("-")[2];
                $(`#${fuly2} div:last-child`).html("");
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
                    $(`#${fuly2}`).append(div);
                });
            }
        });


        
    }
    diss(show1);
    function diss(callback) {
        for (var k = 0; k <= 31; k++) {
            var fuly2 = forfunyear + "-" + k;
            callback(fuly2);
        }

    }
    //viewing current Date with color
    var nowdate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    $(`#${nowdate}`).css("background-color", "#FFEDDA");




     await fetch(`https://calendarific.com/api/v2/holidays?&api_key=4b7a01f42d03492a4e612ab338b54ba2e16be086&country=in&year=${year}`)
        .then(res => res.json())
        .then(data => {
            var holiday = data.response.holidays;

            var thismonth = (holiday.filter(h => { return h.date.iso.split("-")[1] == month+1 }));
            thismonth.map(h => {
                var string=h.date.iso;
                var middle=h.date.iso.split("-")[1];
                var laststring=string.split("-")[2];
                if(laststring.charAt(0)=='0')
                {
                    
                    string=string.split("-")[0]+"-"+string.split("-")[1]+"-"+laststring.charAt(1);
                }
                else if(middle.charAt(0)=='0')
                    {
                        string=string.split("-")[0]+"-"+middle.charAt(1)+"-"+laststring.substring(0,2);
                    }

                var inte=parseInt(string.split("-")[1]);
                inte=inte-1;
                var mide=inte.toString();
                string=string.split("-")[0]+"-"+mide+"-"+string.split("-")[2];
                console.log(h.name+" "+ string);

                var holiname=document.createTextNode(h.name);
                
                $(`.${string}-h`).append(h.name);
            });
        });

}

createcalender(year, month);

//for forward and backward for the calender
function getplus() {
    month++;
    if (month == 12) {
        year++;
        month = 0;
    }
    htmlCalender.html("");
    createcalender(year, month);
}
function getminus() {
    month--;
    if (month < 0) {
        year--;
        month = 11;
    }
    htmlCalender.html("");
    createcalender(year, month);
}



var viewdatacontent = $("#view-data-content");
var membercontent = $("#member-content");


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
                var d = `Title:${tit}\n Description:${data}\n From:${fro}\n To:${to}`;

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
function show4(dAte) {
    firebase.database().ref('Email/' + dAte).on('value', function (snapshot) {
        membercontent.html(" ");
        if (snapshot.exists()) {

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
    var formdata2 = {};
    var flag = false;
    if (formdata.title.length == 0) {
        showerror("#frm-id input[name=title]", "Title shold be fillup");
        flag = false;
        return false;
    }
    else {
        var str = capitalize(formdata.title);
        formdata2.Title = str;
        $("#frm-id input[name=title]").val(str);
        flag = true;
    }
    if (formdata.from == "" || formdata.to == "") {
        showerror("#frm-id input[name=to]", "please fillup the form");
        flag = false;
        return false;
    }
    else if (formdata.from <= formdata.to) {
        formdata2.From = formdata.from;
        formdata2.To = formdata.to;
        flag = true;
    }
    else {
        showerror("#frm-id input[name=to]", "Check time properly");
        flag = false;
        return false;
    }
    if (formdata.description.length == 0) {
        showerror("#frm-id textarea[name=description]", "fillup something");
        flag = true;
        return false;
    }
    else {
        flag = true;
        formdata2.description = formdata.description;
    }
    if (flag) {
        firebase.database().ref('Year/' + formdata.date).push({
            Title: formdata2.Title,
            From: formdata2.From,
            To: formdata2.To,
            Description: formdata2.description
        });
    }
    var clear1 = $(".clear1");
    setTimeout(function () {
        clear1.click();
        modal.hide();
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
        firebase.database().ref('Email/' + $('#frm-id input[name="date"]').val()).push({
            Email: addnew.newattendee,
            Name: addnew.name
        });
    }
    else {
        showerror("#newattendee input[name=newattendee]", "check Mail");
        return false;
    }
    var clear2 = $(".clear2");
    setTimeout(function () {
        clear2.click();
        modal.hide();
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
    $("#update-frm input[name=date]").val(updateid.target.parentElement.className);
    firebase.database().ref('Year/' + `${updateid.target.parentElement.className}/` + updateid.target.id).on('value', function (snapshot) {
        $("#update-frm input[name=title]").val(snapshot.val().Title);
        $("#update-frm input[name=from]").val(snapshot.val().From);
        $("#update-frm input[name=to]").val(snapshot.val().To);
        $("#update-frm textarea[name=description]").val(snapshot.val().Description);
    });
    show3(updateid.target.parentElement.className);
}




//for delete the existing data title description from and to using button on click
function dlbtn() {
    content.show();
    suretab.show();
    var y = $(".Yes");
    y.on("click", function () {
        salertc.html(" ");
        suretab.hide();
        let h1 = document.createElement('h1');
        h1.append(document.createTextNode("Deleted successfully !"));
        salertc.append(h1);
        salert.show();
        salertc.attr("style", "background-color:green");
        setTimeout(function () {
            salertc.hide();
            salert.hide();
        }, 1000);
        show3(cheating.target.parentElement.className);
        firebase.database().ref('Year/' + `${cheating.target.parentElement.className}/` + cheating.target.id).remove();
        updatedata.hide();
        show3(cheating.target.parentElement.className);
        content.hide();
    });
    show3(cheating.target.parentElement.className);
}


//for update the existing data title description from and to using button on click
function upbtn() {
    show3(cheating.target.parentElement.className);
    // document.getElementById(`${updateid.path[1].className}`).lastChild.innerHTML = " ";

    content.show();
    suretab.show();
    var y = $(".Yes");
    y.on("click", function () {
        salertc.html(" ");
        suretab.hide();
        let h1 = document.createElement('h1');
        h1.append(document.createTextNode("Successfully !"));
        salertc.append(h1);
        salert.show();
        salertc.attr("style", "background-color:green");
        setTimeout(function () {
            salertc.hide();
            salert.hide();

        }, 1000);
        firebase.database().ref('Year/' + `${cheating.target.parentElement.className}/` + `${cheating.target.id}`).update({
            Title: $("#update-frm input[name=title]").val(),
            From: $("#update-frm input[name=from]").val(),
            To: $("#update-frm input[name=to]").val(),
            Description: $("#update-frm textarea[name=description]").val()
        });
        updatedata.hide();
        show3(cheating.target.parentElement.className);
        content.hide();

    });
}

var N = $(".No");
N.on("click", function () {
    suretab.hide();
    content.hide();
});
//delete for the name and emails
membercontent.on("click", function (e) {
    firebase.database().ref('Email/' + `${e.target.parentElement.className}/` + e.target.id).remove();
    show4(e.target.parentElement.className);
    member.hide();
});

// popup showing  and display section 
var modal = $("#myModal");
var span = $(".close").first();
var viewdata = $("#view-data");
var updatedata = $("#update-data");
var cheating;
var member = $("#member");
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
        var frmid = $('#frm-id input[name="date"]');
        frmid.val(e.target.id);
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
    cheating = e;
});

//for display the name and email
function viewmembers(e) {
    e.preventDefault;
    member.show();
    $('span').click(function () {
        member.hide();
    });
    $(window).click(function (event) {

        if (event.target.id == "member") {
            member.hide();
        }
        if (event.target.className == "modal") {
            modal.hide();
        }
    });
    var frm = $("#frm-id input[name=date]").val();
    show4(frm);
}
var suretab = $(".sure-tab");
var content = $(".sure-tab-content");
var salert = $(".showalert");
var salertc = $(".showalert-content");

function showerror(parent, error) {
    $(`${parent}`).next().html(error);
    setTimeout(function () {
        $(parent).next().html("");
    }, 5000);
}





// fetch('https://calendarific.com/api/v2/holidays?&api_key=4b7a01f42d03492a4e612ab338b54ba2e16be086&country=in&year=2021')
// .then(res=>res.json())
// .then(data=>{
//     var holiday=data.response.holidays;

//     var thismonth=(holiday.filter(h=>{return h.date.iso.split("-")[1]==4}));
//     thismonth.map(h=>{
//         console.log(h.date.iso+ " "+ h.name);
//     });
// });