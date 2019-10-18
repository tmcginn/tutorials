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
	var markdown = window.localStorage.getItem("mdValue");
    
	var tmpElement = document.createElement('article');
	$(tmpElement).html(new showdown.Converter().makeHtml(markdown));

	document.title = "Preview: " + $(tmpElement).find('h1').text();
	replaceH1Title(tmpElement); //replacing the h1 title in the OBE
	addSectionTag(tmpElement); //putting each section in section tag
	addHorizontalLine(tmpElement); //add horizontal line after each section
	addH2ImageIcons(tmpElement); //Adding image, class, width, and height to the h2 title img
	wrapImgWithFigure(tmpElement); //Wrapping with figure, adding figcaption to all those images that have title in the MD
	movePreInsideLi(tmpElement); //moving the pre elements a layer up for stylesheet matching	
	$(tmpElement).find('ul li p:first-child').contents().unwrap(); //remove the p tag from first li child as CSS changes the formatting
			
	$("#bookContainer").html(tmpElement);
	$.getScript("https://docs.oracle.com/en/cloud/paas/nosql-cloud/gsans/js/leftnav.js");		
});