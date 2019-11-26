"use strict";
var manifestFileName = "manifest.json";

$(document).ready(function () {
    $.getJSON(manifestFileName, function (manifestFileContent) { //reading the manifest file and storing content in manifestFileContent variable
        var selectedTutorial = setupRightNav(manifestFileContent); //populate side navigation based on content in the manifestFile
        var articleElement = document.createElement('article'); //creating an article that would contain MD to HTML converted content
        $.get(selectedTutorial.filename, function (markdownContent) { //reading MD file in the manifest and storing content in markdownContent variable
            $(articleElement).html(new showdown.Converter({ tables: true }).makeHtml(markdownContent)); //converting markdownContent to HTML by using showndown plugin
            articleElement = addPathToImageSrc(articleElement, selectedTutorial.filename); //adding the path for the image based on the filename in manifest
            articleElement = updateH1Title(articleElement); //replacing the h1 title in the Tutorial and removing it from the article Element
            articleElement = wrapSectionTagAndAddHorizonatalLine(articleElement); //adding each section within section tag and adding HR line
            articleElement = wrapImgWithFigure(articleElement); //Wrapping images with figure, adding figcaption to all those images that have title in the MD
            articleElement = addPathToAllRelativeHref(articleElement, selectedTutorial.filename); //adding the path for all HREFs that are relative based on the filename in manifest
            articleElement = addTargetBlank(articleElement); //setting target for all ahrefs to _blank
            updateHeadContent(selectedTutorial); //changing document head based on the manifest
        }).done(function () {
            $("main").html(articleElement); //placing the article element inside the main tag of the Tutorial template                        
            setupContentNav();
            $('#openNav').click();
            setupLeftNav();
        });
    });
});

/* The following function increases the width of the side navigation div to open it. */
function openRightSideNav() {
    $('#mySidenav').attr("style", "width: 270px; overflow-y: auto; box-shadow: 0 0 48px 24px rgba(0, 0, 0, .3);");
    document.getElementsByClassName('selected')[0].scrollIntoView(false);
}
/* The following function decreases the width of the side navigation div to close it. */
function closeRightSideNav() {
    $('#mySidenav').attr("style", "width: 0px; overflow-y: hidden; box-shadow: 0 0 48px 24px rgba(0, 0, 0, 0);");
}
/* The following functions creates and populates the right side navigation including the open button that appears in the header.
The navigation appears only when the manifest file has more than 1 tutorial. The title that appears in the side navigation 
is picked up from the manifest file. */
function setupRightNav(manifestFileContent) {
    var allTutorials = manifestFileContent.tutorials;
    var selectedTutorial;
    if (allTutorials.length <= 1) {
        $('.rightNav').hide();
    }
    else if (allTutorials.length > 1) { //means it is a workshop           
        $('.rightNav').show();
        //adding tutorials from JSON and linking them with ?shortnames
        $(allTutorials).each(function (i, tutorial) {
            var shortTitle = createShortNameFromTitle(tutorial.title);
            var li = $(document.createElement('li')).click(function () {
                location.href = "?" + shortTitle;
            });
            $(li).text(tutorial.title); //The title specified in the manifest appears in the side nav as navigation                    
            if (window.location.search.split('?')[1] === shortTitle) {//the selected class is added if the title is currently selected
                $(li).attr("class", "selected");
                selectedTutorial = tutorial;
            }
            $(li).appendTo($('#mySidenav ul'));
        });
        if (!$('#mySidenav ul').find('li').hasClass("selected")) { //if no title has selected class, selected class is added to the first class
            $('#mySidenav ul').find('li:eq(0)').addClass("selected");
        }
        $('#openNav').click(openRightSideNav);
        $('#closeNav').click(closeRightSideNav);
    }
    if (selectedTutorial === undefined) {
        return allTutorials[0];
    }
    else {
        return selectedTutorial;
    }
}
/* The following function creates shortname from title */
function createShortNameFromTitle(title) {
    var removeFromTitle = ["-a-", "-in-", "-of-", "-the-", "-to-", "-an-", "-is-", "-your-", "-you-", "-and-", "-from-", "-with-"];
    var folderNameRestriction = ["<", ">", ":", "\"", "/", "\\\\", "|", "\\?", "\\*"];
    var shortname = title.toLowerCase().replace(/ /g, '-').trim().substr(0, 50);
    $.each(folderNameRestriction, function (i, value) {
        shortname = shortname.replace(new RegExp(value, 'g'), '');
    });
    $.each(removeFromTitle, function (i, value) {
        shortname = shortname.replace(new RegExp(value, 'g'), '-');
    });
    if (shortname.length > 40) {
        shortname = shortname.substr(0, shortname.lastIndexOf('-'));
    }
    return shortname;
}
/*the following function changes the relative path of images to the absolute path of the MD file.
This ensures that the images are picked up from the same location as the MD file.
The manifest file can be in any location.*/
function addPathToImageSrc(articleElement, myUrl) {
	/*the following if condition is passed only when a path is specified in the filename of the manifest.
	if "/" is not specified in the filename, it would mean that the index.html file is in the same location as the MD,
	hence there is no need to replace relative images src */
    if (myUrl.indexOf("/") >= 0) { //checking if url is absolute path
        myUrl = myUrl.replace(/\/[^\/]+$/, "/"); //removing filename from the url        
        $(articleElement).find('img').each(function () {
            if ($(this).attr("src").indexOf("://") == -1) {
                $(this).attr("src", myUrl + $(this).attr("src"));
            }
        });
    }
    return articleElement;
}
/* The following function replaces the h1 title boiler plate in the HTML template with the h1 value in the MD file.
Then it removes the h1 title from the HTML file generated from the MD. */
function updateH1Title(articleElement) {
    $('body > h1').text($(articleElement).find('h1').text());
    $(articleElement).find('h1').remove(); //Removing h1 from the articleElement as it has been added to the HTML file already
    return articleElement;
}
/* This function picks up the entire converted content in HTML, break them into sections, and then adds horizontal line in the
end. It uses indexes to break content into sections. */
function wrapSectionTagAndAddHorizonatalLine(articleElement) {
    var pattern = /<h2.*>/g;
    var h2s = $(articleElement).html().match(pattern);
    var index = [];
    var substr = [];
    //get index of each h2
    for (var i = 0; i < h2s.length; i++) {
        index.push($(articleElement).html().indexOf(h2s[i]));
    }
    index.push($(articleElement).html().length); //adding the length of the article Element as the last index
    //get all substring as per the index
    for (var i = 0; i < index.length - 1; i++) {
        substr.push($(articleElement).html().substr(index[i], (index[i + 1] - index[i])));
    }
    //wrap substrings with section tag
    for (var i = 0; i < substr.length; i++) {
        $(articleElement).html($(articleElement).html().replace(substr[i], "<section>" + substr[i] + "</section>"));
    }
    //add horizontal line at the end of each section
    // $(articleElement).find('section').append(document.createElement('hr'));
    return articleElement;
}
/* Wrapping all images in the article element with Title in the MD, with figure tags, and adding figcaption dynamically.
The figcaption is in the format Description of illustration [filename].
The image description files must be added inside the files folder in the same location as the MD file.*/
function wrapImgWithFigure(articleElement) {
    $(articleElement).find("img").each(function () {
        if ($(this).attr("title") !== undefined) { //only images with titles are wrapped with figure tags            
            $(this).wrap("<figure></figure>"); //wrapping image tags with figure tags
            if ($.trim($(this).attr("title")).length > 0) {
                var imgFileNameWithoutExtn = $(this).attr("src").split("/").pop().split('.').shift(); //extracting the image filename without extension
                $(this).parent().append('<figcaption><a href="files/' + imgFileNameWithoutExtn + '.txt">Description of illustration [' + imgFileNameWithoutExtn + ']</figcaption>');
            }
            else {
                $(this).removeAttr('title');
            }
        }
    });
    return articleElement;
}
/*the following function changes the relative path of all relative HREFs to the absolute path of the MD file.
This ensures that the files are linked correctly from the same location as the MD file.
The manifest file can be in any location.*/
function addPathToAllRelativeHref(articleElement, myUrl) {
	/*the following if condition is passed only when a path is specified in the filename of the manifest.
	if "/" is not specified in the filename, it would mean that the index.html file is in the same location as the MD,
	hence there is no need to replace relative hrefs */
    if (myUrl.indexOf("/") >= 0) { //checking if url is absolute path
        myUrl = myUrl.replace(/\/[^\/]+$/, "/"); //removing filename from the url        
        $(articleElement).find('a').each(function () {
            if ($(this).attr("href").indexOf("://") == -1) {
                $(this).attr("href", myUrl + $(this).attr("href"));
            }
        });
    }
    return articleElement;
}
/*the following function sets target for all HREFs to _blank */
function addTargetBlank(articleElement) {
	$(articleElement).find('a').each(function () {
		if($(this).attr('href').indexOf('#') > 1) //ignoring # hrefs
			$(this).attr('target', '_blank'); //setting target for ahrefs to _blank
	});
    return articleElement;
}
/* Sets the title, contentid, description, partnumber, and publisheddate attributes in the HTML page. 
The content is picked up from the manifest file entry*/
function updateHeadContent(tutorialEntryInManifest) {
    document.title = tutorialEntryInManifest.title;
    $('meta[name=contentid]').attr("content", tutorialEntryInManifest.contentid);
    $('meta[name=description').attr("content", tutorialEntryInManifest.description);
    $('meta[name=partnumber').attr("content", tutorialEntryInManifest.partnumber);
    $('meta[name=publisheddate').attr("content", tutorialEntryInManifest.publisheddate);
}
/* Setup left navigation and tocify */
function setupLeftNav() {
    var toc = $("#toc").tocify({
        selectors: "h2,h3,h4,h5"
    }).data("toc-tocify");
    toc.setOptions({ extendPage: false, smoothScroll: false, scrollTo: 70, showEffect: "slideDown" });

    $('.tocify-item').each(function () {
        if ($(this).attr('data-unique') === location.hash.slice(1)) {
            var click = $(this);
            setTimeout(function () {
                $(click).click();
            }, 1000)
        }
    });
}
/* Enables collapse/expand feature for the steps */
function setupContentNav() {
    setTimeout(function () {        
        $("#module-content h2").nextUntil("#module-content h1, #module-content h2").show();
        $("#module-content h2").addClass('minus');        
        $("#module-content h2").click(function (e) {
            if ($(this).hasClass('plus')) {
                fadeInStep($(this));
            }
            else if ($(this).hasClass('minus')) {
                fadeOutStep($(this));
            }
        });
        window.scrollTo(0, 0);
    }, 0);
}
/* Collapses the clicked part */
function fadeOutStep(step) {
    $(step).nextUntil("#module-content h1, #module-content h2").fadeOut(function () {
        if ($('#contentBox').height() < $('#leftNav').height())
            $('#contentBox').height($('#leftNav').height());
    });
    $(step).addClass('plus');
    $(step).removeClass('minus');
}
/* Expands the clicked part */
function fadeInStep(step) {
    $(step).nextUntil("#module-content 3h1, #module-content h2").fadeIn(function () {
        $('#contentBox').height('100%');
        if ($('#contentBox').height() < $('#leftNav').height())
            $('#contentBox').height($('#leftNav').height());
    });
    $(step).addClass('minus');
    $(step).removeClass('plus');
}