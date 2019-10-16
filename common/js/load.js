function updateHead(json) {
    document.title = json.title;

    $('meta[name=contentid]').attr("content", json.contentid);
    $('meta[name=description').attr("content", json.description);
    $('meta[name=partnumber').attr("content", json.partnumber);
    $('meta[name=publisheddate').attr("content", json.publisheddate);
}

function wrapImgWithFigure(tmpElement) {
    $(tmpElement).find("img").each(function () {
        if ($(this).attr("title") !== undefined) {
            $(this).wrap("<figure></figure>");
            var filename = $(this).attr("src").split("/").pop().split('.').shift();
            $(this).parent().append('<figcaption><a href="files/' + filename + '.txt">Description of illustration [' + filename + ']</figcaption>');
        }
    });
}

function movePreInsideLi(tmpElement) {
    $(tmpElement).find('pre').each(function () {
        $(this).appendTo($(this).prev());
    });
}

function addH2Image(tmpElement) {
    $(tmpElement).find('h2>img').addClass('num_circ');
    $(tmpElement).find('h2>img').attr('height', '32');
    $(tmpElement).find('h2>img').attr('width', '32');
}
function replaceH1Title(tmpElement) {
    $("#content>h1").html($("#content>h1").html().replace($("#content>h1").text(), $(tmpElement).find('h1').text()));
    $(tmpElement).find('h1').remove();
}

function selectMdFile(json) {
    var query = window.location.search.split('?')[1];
    var labs = json.labs;
    for (var i = 0; i < labs.length; i++) {
        if (labs[i].shortname == query) {
            return labs[i];
        }
    }
    return labs[0];
}
//used for populating side navigation
function dropDown(json) {
    var labs = json.labs;
    if (labs.length > 1) { //means it is LP
        var query = window.location.search.split('?')[1];
        //adding open button
        var openbtn = document.createElement('span');
        $(openbtn).attr("class", "openbtn");
        $(openbtn).click(function() {
            if($('#mySidenav').width() > 0)
                closeNav();
            else
                openNav();
        });
        $(openbtn).html("&#9776;");
        $(openbtn).appendTo('header>.w1024');

        //populating side navigation content
        var div = document.createElement('div');
        $(div).attr({
            id: "mySidenav",
            class: "sidenav"
        });

        //creating close button
        var closebtn = document.createElement('a');
        $(closebtn).attr({
            href: "javascript:void(0)",
            class: "closebtn"
        });
        $(closebtn).click(closeNav);
        $(closebtn).html("&times;");
        $(closebtn).appendTo(div);

        //adding labs from JSON
        for (var i = 0; i < labs.length; i++) {
            var entry = document.createElement('a');
            entry.href = "?" + labs[i].shortname;
            $(entry).attr("class", "labs_nav");
            $(entry).text(labs[i].title);
            $(entry).appendTo(div);
            var hr = document.createElement('hr');
            $(hr).appendTo(div);
            if (query === labs[i].shortname)
                $(entry).attr("class", "selected");
        }
        if(!$(div).find('a').hasClass("selected")) {
            $(div).find('.labs_nav').first('a').addClass("selected");
        }
        $(div).appendTo('header');
    }
}

/*the following function changes the relative path of images to the absolute path of the MD file,
so that the images and MD file can be in a different location that the manifest and still get displayed.
*/
function applyImageUrl(tmpElement, myUrl) {
    var pattern = /^https?:\/\/|^\/\//i;

	if (myUrl.indexOf("/") >= 0) { //checking if url is relative path is used
        myUrl = myUrl.replace(/\/[^\/]+$/, "/"); //removing filename from the url        
        $(tmpElement).find('img').each(function () {
            if (!pattern.test($(this).attr("src"))) {//changing src only if path is relative                
                $(this).attr("src", myUrl + $(this).attr("src"));
            }

        });
    }
}

$(function () {
    $.getJSON("manifest.json", function (json) {
        dropDown(json);
        var jsonEntry = selectMdFile(json); //selects with MD file to display
        var myUrl = jsonEntry.filename;
        var tmpElement;
        $.get(myUrl, function (markdown) {
            tmpElement = document.createElement('article');
            $(tmpElement).html(new showdown.Converter().makeHtml(markdown));

            replaceH1Title(tmpElement); //replacing the h1 title in the OBE
            addH2Image(tmpElement); //Adding class, width, and height to the h2 title
            wrapImgWithFigure(tmpElement); //Wrapping with figure, adding figcaption to all those images that have title in the MD
            movePreInsideLi(tmpElement); //moving the pre elements a layer up for stylesheet matching
            applyImageUrl(tmpElement, myUrl); //adds the path for the image based on the filename in JSON

            updateHead(jsonEntry); //changing document head based on the manifest
        }).done(function () {
            $("#bookContainer").html(tmpElement);
            $.getScript("https://docs.oracle.com/en/cloud/paas/nosql-cloud/gsans/js/leftnav.js");
        });
    });
});

//for side navigation
function openNav() {
    $('#mySidenav').attr("style", "width: 250px;");
}

function closeNav() {
    $('#mySidenav').attr("style", "width: 0px;");
}