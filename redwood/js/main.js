"use strict";
var manifestFileName = "manifest.json";
var expandText = "Expand All Parts";
var collapseText = "Collapse All Parts";
var anchorOffset = 70;
var copyButtonText = "Copy";

$(document).ready(function () {
    /* The following code is for Google Analytics tracking */
    $.getScript("https://www.googletagmanager.com/gtag/js?id=UA-153767729-1");
    window.dataLayer = window.dataLayer || [];
    gtag('js', new Date());
    gtag('config', 'UA-153767729-1');
    /* Google Analytics code ends here */

    var manifestFileContent;
    $.when(
        $.getScript("https://ashwin-agarwal.github.io/tutorials/redwood/js/showdown.min.js", function () {
            console.log("Showdown library loaded!");
        }),
        $.getJSON(manifestFileName, function (manifestFile) {
            manifestFileContent = manifestFile; //reading the manifest file and storing content in manifestFileContent variable
            console.log("Manifest file loaded!");
        }).fail(function () {
            alert("manifest.json file not found. The manifest file should be co-located with the index.html file.");
        })
    ).done(function () {
        var selectedTutorial = setupRightNav(manifestFileContent); //populate side navigation based on content in the manifestFile
        var articleElement = document.createElement('article'); //creating an article that would contain MD to HTML converted content
        $.get(selectedTutorial.filename, function (markdownContent) { //reading MD file in the manifest and storing content in markdownContent variable
            console.log(selectedTutorial.filename + " loaded!");
            $(articleElement).html(new showdown.Converter({ tables: true }).makeHtml(markdownContent)); //converting markdownContent to HTML by using showndown plugin
            articleElement = addPathToImageSrc(articleElement, selectedTutorial.filename); //adding the path for the image based on the filename in manifest
            articleElement = updateH1Title(articleElement); //adding the h1 title in the Tutorial before the container div and removing it from the articleElement
            articleElement = wrapSectionTagAndAddHorizonatalLine(articleElement); //adding each section within section tag and adding HR line
            articleElement = wrapImgWithFigure(articleElement); //Wrapping images with figure, adding figcaption to all those images that have title in the MD
            articleElement = addPathToAllRelativeHref(articleElement, selectedTutorial.filename); //adding the path for all HREFs that are relative based on the filename in manifest
            articleElement = makeAnchorLinksWork(articleElement); //if there are links to anchors (for example: #hash-name), this function will enable it work
            articleElement = addTargetBlank(articleElement); //setting target for all ahrefs to _blank
            articleElement = allowCodeCopy(articleElement); //adds functionality to copy code from codeblocks
            updateHeadContent(selectedTutorial); //changing document head based on the manifest
        }).done(function () {
            $("main").html(articleElement); //placing the article element inside the main tag of the Tutorial template                        
            setTimeout(setupContentNav, 0); //sets up the collapse/expand button and open/close section feature
            collapseSection($("#module-content h2:not(:eq(0))"), "hide"); //collapses all sections by default
            $('#openNav').click(); //open the right side nav by default
            setupLeftNav();
        }).fail(function () {
            alert(selectedTutorial.filename + ' not found! Please check that the file is available in the location provided in the manifest file.');
        });
    });
});
/* The following function is used for Google Analytics */
function gtag() {
    dataLayer.push(arguments);
}
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
    } else if (allTutorials.length > 1) { //means it is a workshop           
        $('.rightNav').show();
        //adding tutorials from JSON and linking them with ?shortnames
        $(allTutorials).each(function (i, tutorial) {
            var shortTitle = createShortNameFromTitle(tutorial.title);
            var li = $(document.createElement('li')).click(function () {
                location.href = "?" + shortTitle;
            });
            $(li).text(tutorial.title); //The title specified in the manifest appears in the side nav as navigation                    
            if (window.location.search.split('?')[1] === shortTitle) { //the selected class is added if the title is currently selected
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
    } else {
        return selectedTutorial;
    }
}
/* The following function creates shortname from title */
function createShortNameFromTitle(title) {
    if (!title) {
        alert("The title in the manifest file cannot be blank!");
        return "ErrorTitle";
    }
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
    if (myUrl.indexOf("http") >= 0) { //checking if url is absolute path
        myUrl = myUrl.replace(/\/[^\/]+$/, "/"); //removing filename from the url        
        $(articleElement).find('img').each(function () {
            if ($(this).attr("src").indexOf("http") == -1) {
                $(this).attr("src", myUrl + $(this).attr("src"));
            }
        });
    }
    return articleElement;
}
/* The following function adds the h1 title before the container div. It picks up the h1 value from the MD file. */
function updateH1Title(articleElement) {
    var h1 = document.createElement('h1');
    $('#container').before($(h1).text($(articleElement).find('h1').text()));
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
            if ($.trim($(this).attr("title"))) {
                var imgFileNameWithoutExtn = $(this).attr("src").split("/").pop().split('.').shift(); //extracting the image filename without extension
                $(this).parent().append('<figcaption><a href="files/' + imgFileNameWithoutExtn + '.txt">Description of illustration [' + imgFileNameWithoutExtn + ']</figcaption>');
            } else {
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
    if (myUrl.indexOf("http") >= 0) { //checking if url is absolute path
        myUrl = myUrl.replace(/\/[^\/]+$/, "/"); //removing filename from the url        
        $(articleElement).find('a').each(function () {
            if ($(this).attr("href").indexOf("http") == -1 && $(this).attr("href").indexOf("?") !== 0 && $(this).attr("href").indexOf("#") !== 0) {
                $(this).attr("href", myUrl + $(this).attr("href"));
            }
        });
    }
    return articleElement;
}
/* the following function makes anchor links work by adding an event to all href="#...." */
function makeAnchorLinksWork(articleElement) {
    $(articleElement).find('a[href^="#"]').each(function () {
        var href = $(this).attr('href');
        if (href !== "#") { //eliminating all plain # links
            $(this).click(function () {
                expandSectionBasedOnHash(href.split('#')[1]);
            });
        }
    });
    return articleElement;
}
/*the following function sets target for all HREFs to _blank */
function addTargetBlank(articleElement) {
    $(articleElement).find('a').each(function () {
        if ($(this).attr('href').indexOf("http") === 0) //ignoring # hrefs
            $(this).attr('target', '_blank'); //setting target for ahrefs to _blank
    });
    return articleElement;
}
/* Sets the title, contentid, description, partnumber, and publisheddate attributes in the HTML page. 
The content is picked up from the manifest file entry*/
function updateHeadContent(tutorialEntryInManifest) {
    document.title = tutorialEntryInManifest.title;
    var metaProperties = [{
        name: "contentid",
        content: tutorialEntryInManifest.contentid
    },
    {
        name: "description",
        content: tutorialEntryInManifest.description
    },
    {
        name: "partnumber",
        content: tutorialEntryInManifest.partnumber
    },
    {
        name: "publisheddate",
        content: tutorialEntryInManifest.publisheddate
    }
    ];
    $(metaProperties).each(function (i, metaProp) {
        if (metaProp.content) {
            var metaTag = document.createElement('meta');
            $(metaTag).attr(metaProp).prependTo('head');
        }
    });
}
/* Setup left navigation and tocify */
function setupLeftNav() {
    var toc = $("#toc").tocify({
        selectors: "h2, h3, h4"
    }).data("toc-tocify");
    //scrollHistory: true
    toc.setOptions({ extendPage: false, smoothScroll: false, scrollTo: anchorOffset, highlightDefault: true, showEffect: "fadeIn" });

    $('.tocify-item').each(function () {
        var itemName = $(this).attr('data-unique');
        if ($(this) !== $('.tocify-item:eq(0)')) { //as the first section is not expandable or collapsible            
            $(this).click(function () { //if left nav item is clicked, the corresponding section expands
                expandSectionBasedOnHash(itemName);
            });
        }
        if (itemName === location.hash.slice(1)) { //if the hash value matches, it clicks it after some time.
            let click = $(this);
            setTimeout(function () {
                $(click).click();
            }, 1000)
        }
    });
}
/* Enables collapse/expand feature for the steps */
function setupContentNav() {
    //adds the expand collapse button before the second h2 element
    $("#module-content h2:eq(1)")
        .before('<button id="btn_toggle" class="hol-ToggleRegions plus">' + expandText + '</button>')
        .prev().on('click', function (e) {
            ($(this).text() === expandText) ? expandSection($("#module-content h2:not(:eq(0))"), "show") : collapseSection($("#module-content h2:not(:eq(0))"), "hide");
            changeButtonState(); //enables the expand all parts and collapse all parts button
        });
    //enables the feature that allows expand collapse of sections
    $("#module-content h2:not(:eq(0))").click(function (e) {
        ($(this).hasClass('plus')) ? expandSection(this, "fade") : collapseSection(this, "fade");
        changeButtonState();
    });
    window.scrollTo(0, 0);
}
/* Manage contentBox height */
function heightAdjust() {
    $('#contentBox').height('100%');
    if ($('#contentBox').height() < $('#leftNav').height()) {
        $('#contentBox').height($('#leftNav').height());
    }
}
/* Expands the section */
function expandSection(anchorElement, effect) {
    if (effect === "show") {
        $(anchorElement).nextUntil("#module-content h1, #module-content h2").show(heightAdjust); //expand the section incase it is collapsed
    } else if (effect === "fade") {
        $(anchorElement).nextUntil("#module-content h1, #module-content h2").fadeIn(heightAdjust);
    }
    if ($(anchorElement).hasClass('plus') || $(anchorElement).hasClass('minus')) {
        $(anchorElement).addClass("minus");
        $(anchorElement).removeClass("plus");
    }
}
/* Collapses the section */
function collapseSection(anchorElement, effect) {
    if (effect === "hide") {
        $(anchorElement).nextUntil("#module-content h1, #module-content h2").hide(heightAdjust); //collapses the section incase it is expanded
    } else if (effect === "fade") {
        $(anchorElement).nextUntil("#module-content h1, #module-content h2").fadeOut(heightAdjust);
    }
    $(anchorElement).addClass('plus');
    $(anchorElement).removeClass('minus');
}
/* Detects the state of the collapse/expand button and changes it if required */
function changeButtonState() {
    if ($("#module-content h2.minus").length <= $("#module-content h2.plus").length) { //if all sections are expanded, it changes text to expandText
        $('#btn_toggle').text(expandText);
        $("#btn_toggle").addClass('plus');
        $("#btn_toggle").removeClass('minus');
    } else {
        $('#btn_toggle').text(collapseText);
        $("#btn_toggle").addClass('minus');
        $("#btn_toggle").removeClass('plus');
    }
}
/* Expands section on page load based on the hash. Expands section when the leftnav item is clicked */
function expandSectionBasedOnHash(itemName) {
    var anchorElement = $('div[name="' + itemName + '"]').next(); //anchor element is always the next of div (eg. h2 or h3)

    if ($(anchorElement).hasClass('hol-ToggleRegions')) //if the next element is the collpase/expand button
        anchorElement = $(anchorElement).next();
    expandSection(anchorElement, "fade");
    if ($(anchorElement)[0].tagName !== 'H2') {
        $(anchorElement).siblings('h2').nextUntil("#module-content h1, #module-content h2").show(); //expand the section incase it is collapsed                                                          
    }
    $(anchorElement)[0].scrollIntoView();
    window.scrollTo(0, window.scrollY - anchorOffset);
    changeButtonState();
}
/* adds code copy functionality in codeblocks. The code that needs to be copied needs to be wrapped in <copy> </copy> tag */
function allowCodeCopy(articleElement) {
    $(articleElement).find('pre code').each(function () {
        var code = $(document.createElement('code')).html($(this).text());
        if ($(code).has('copy').length) {
            $(code).find('copy').contents().unwrap().wrap('<span class="copy-code">');
            $(this).html($(code).html());
            // $(this).parent().wrap('<div>').before('<button class="copy-button" title="Copy text to clipboard">' + copyButtonText + '</button>');
            $(this).before('<button class="copy-button" title="Copy text to clipboard">' + copyButtonText + '</button>');
        }
    });
    $(articleElement).find('.copy-button').click(function () {
        var copyText = $(this).next().find('.copy-code').text().trim();
        var dummy = $('<textarea>').val(copyText).appendTo(this).select();
        document.execCommand('copy');
        $(dummy).remove();
        $(this).parent().animate({ opacity: 0.2 }).animate({ opacity: 1 });
    });
    return articleElement;
}