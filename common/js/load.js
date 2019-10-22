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

function addH2ImageIcons(tmpElement) {
	var path = "https://ashwin-agarwal.github.io/tutorials/obe_template/img/32_";
	var last;
	$(tmpElement).find('h2').prepend(document.createElement('img'));
	
	$(tmpElement).find('h2>img').each(function(i) {				
		$(this).attr({
			class: 'num_circ',
			height: '32',
			width: '32',
			src: path + i + '.png',
			alt: 'section ' + i
		});
		last = $(this);
	});
	$(last).attr({
		src: path + "more.png",
		alt: 'more information'
	});
	    
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

		
        //creating side nav div
        var div = document.createElement('div');
        $(div).attr({
            id: "mySidenav",
            class: "sidenav"
        });
		
		//adding title for sidenav
		var header = document.createElement('div');
		$(header).attr("id", "nav_header");
		var nav_title = document.createElement('h3');
		$(nav_title).text("Menu");
		$(nav_title).appendTo(header);
		
        //creating close button
        var closebtn = document.createElement('a');
        $(closebtn).attr({
            href: "javascript:void(0)",
            class: "closebtn"
        });
        $(closebtn).click(closeNav);
        $(closebtn).html("&times;");
        $(closebtn).appendTo(header);
		$(header).appendTo(div);
		
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

function addSectionTag(tmpElement) {
	var pattern = /<h2.*>/g;
	var h2s = $(tmpElement).html().match(pattern);
	var index = [];
	var substr = [];

	//get index of each h2
	for(var i=0; i<h2s.length; i++) {
		index.push($(tmpElement).html().indexOf(h2s[i]));
	}
	index.push($(tmpElement).html().length);

	//get all substring as per the index
	for(var i=0; i<index.length-1; i++) {	
		substr.push($(tmpElement).html().substr(index[i], (index[i+1]-index[i])));		
	}

	//wrap substrings with section tag
	for(var i=0; i<substr.length; i++) {
		$(tmpElement).html($(tmpElement).html().replace(substr[i], "<section>" + substr[i] + "</section>"));				
	}
}

function addHorizontalLine(tmpElement) {
	$(tmpElement).find('section').append(document.createElement('hr'));	
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
			applyImageUrl(tmpElement, myUrl); //adds the path for the image based on the filename in JSON

            replaceH1Title(tmpElement); //replacing the h1 title in the OBE
			addSectionTag(tmpElement); //putting each section in section tag
			addHorizontalLine(tmpElement); //add horizontal line after each section
            addH2ImageIcons(tmpElement); //Adding image, class, width, and height to the h2 title img
            wrapImgWithFigure(tmpElement); //Wrapping with figure, adding figcaption to all those images that have title in the MD
            movePreInsideLi(tmpElement); //moving the pre elements a layer up for stylesheet matching          
			$(tmpElement).find('ul li p:first-child').contents().unwrap(); //remove the p tag from first li child as CSS changes the formatting
			
            updateHead(jsonEntry); //changing document head based on the manifest
        }).done(function () {
            $("#bookContainer").html(tmpElement);
            $.getScript("https://ashwin-agarwal.github.io/tutorials/obe_template/js/leftnav.js");
			openNav();
        });
    });
});

//for side navigation
function openNav() {
    $('#mySidenav').attr("style", "width: 280px;");
}

function closeNav() {
    $('#mySidenav').attr("style", "width: 0px;");
}