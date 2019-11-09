var templateImagePath = "https://ashwin-agarwal.github.io/tutorials/obe_template/img/"; //path for all template images
var rightSideNavTitle = "Contents";

/* Sets the title, contentid, description, partnumber, and publisheddate attributes in the HTML page. 
The content is picked up from the manifest file entry*/
function updateHeadContent(tutorialEntryInManifest) {
    document.title = tutorialEntryInManifest.title;
    $('meta[name=contentid]').attr("content", tutorialEntryInManifest.contentid);
    $('meta[name=description').attr("content", tutorialEntryInManifest.description);
    $('meta[name=partnumber').attr("content", tutorialEntryInManifest.partnumber);
    $('meta[name=publisheddate').attr("content", tutorialEntryInManifest.publisheddate);
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
}
/* When MD file is converted to HTML, the pre tags (all codeblocks) are usually outside the li tag due to which the output 
of the pre tag doesn't have the correct indentation. The following function moves the pre tags inside the li.*/
function movePreInsideLi(articleElement) {
    $(articleElement).find('pre').each(function () {
        $(this).appendTo($(this).prev());
    });
}
/* The following function adds numbering icons before the h2 tag*/
function addH2ImageIcons(articleElement) {
    var lastH2;
    $(articleElement).find('h2').prepend(document.createElement('img')); //adding img tags before h2
    $(articleElement).find('h2>img').each(function (i) {
        $(this).attr({
            class: 'num_circ',
            height: '32',
            width: '32',
            src: templateImagePath + "32_" + i + '.png',
            alt: 'section ' + i
        });
        lastH2 = $(this);
    });
    //the last image src is in different format (32_more) while the others are in the format (32_n)
    $(lastH2).attr({
        src: templateImagePath + "32_more.png",
        alt: 'more information'
    });
}
/* The following function replaces the h1 title boiler plate in the HTML template with the h1 value in the MD file.
Then it removes the h1 title from the HTML file generated from the MD. */
function updateH1Title(articleElement) {
    var templateH1Title = $("#content>h1").text();
    var articleH1Title = $(articleElement).find('h1').text();
    var replacedH1Html = $("#content>h1").html().replace(templateH1Title, articleH1Title);
    $("#content>h1").html(replacedH1Html);
    $(articleElement).find('h1').remove(); //Removing h1 from the articleElement as it has been added to the HTML file already
}
/* The following function selects the correct MD file based on what is specified in the query parameter of the URL.
The query parameter is the parameter after the ? in the URL. The short name of the tutorial that matches with the query
parameter is selected for display. If none of the short names are matching, then the 1st shortname is selected. */
function selectMdFileToDisplay(manifestFileContent) {
    var queryParam = window.location.search.split('?')[1];
    var allTutorials = manifestFileContent.tutorials;
    for (var i = 0; i < allTutorials.length; i++) {
        if (createShortNameFromTitle(allTutorials[i].title) == queryParam) { //if query parameter matches the short name specified in the manifest
            return allTutorials[i]; //returning the tutorial entry in the manifest file
        }
    }
    return allTutorials[0]; //returning the first tutorial entry in the manifest file
}
/* The following functions creates and populates the right side navigation including the open button that appears in the header.
The navigation appears only when the manifest file has more than 1 tutorial. The title that appears in the side navigation 
is picked up from the manifest file. */
function populateRightSideNav(manifestFileContent) {
    var allTutorials = manifestFileContent.tutorials;
    if (allTutorials.length > 1) { //means it is a workshop            
        //adding open button
        var openbtn_div = $(document.createElement('div')).attr("id", "openbtn_div");
        var openbtn = $(document.createElement('span')).attr("class", "openbtn");
        $(openbtn).click(function () { //if right side navigation is open, then it closes it.
            if ($('#mySidenav').width() > 0)
                closeRightSideNav();
            else
                openRightSideNav();
        });
        $(openbtn).html("&#9776;"); //this add the hamburger icon
        $(openbtn).appendTo(openbtn_div);
        $(openbtn_div).appendTo('header');
        //creating right side nav div
        var sideNavDiv = $(document.createElement('div')).attr({
            id: "mySidenav",
            class: "sidenav"
        });
        //adding title for sidenav
        var sideNavHeaderDiv = $(document.createElement('div')).attr("id", "nav_header");
        var nav_title = $(document.createElement('h3')).text(rightSideNavTitle);
        $(nav_title).appendTo(sideNavHeaderDiv);
        //creating close button
        var closebtn = $(document.createElement('a')).attr({
            href: "javascript:void(0)",
            class: "closebtn"
        });
        $(closebtn).click(closeRightSideNav);
        $(closebtn).html("&times;"); //adds a cross icon to the header
        $(closebtn).appendTo(sideNavHeaderDiv);
        $(sideNavHeaderDiv).appendTo(sideNavDiv);
        //adding tutorials from JSON and linking them with ?shortnames
        for (var i = 0; i < allTutorials.length; i++) {
            var sideNavEntry = $(document.createElement('a')).attr({
                href: '?' + createShortNameFromTitle(allTutorials[i].title),
                class: 'tutorials_nav'
            });
            $(sideNavEntry).text(allTutorials[i].title); //The title specified in the manifest appears in the side nav as navigation
            $(sideNavEntry).appendTo(sideNavDiv);
            $(document.createElement('hr')).appendTo(sideNavDiv);
            if (window.location.search.split('?')[1] === createShortNameFromTitle(allTutorials[i].title)) //the selected class is added if the title is currently selected
                $(sideNavEntry).attr("class", "selected");
        }
        if (!$(sideNavDiv).find('a').hasClass("selected")) { //if no title has selected class, selected class is added to the first class
            $(sideNavDiv).find('.tutorials_nav').first('a').addClass("selected");
        }
        $(sideNavDiv).appendTo('header'); //sideNavDiv is added to the HTML template header
    }
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
    $(articleElement).find('section').append(document.createElement('hr'));
}
/* The following function increases the width of the side navigation div to open it. */
function openRightSideNav() {
    $('#mySidenav').attr("style", "width: 250px; overflow-y: auto;");
}
/* The following function decreases the width of the side navigation div to close it. */
function closeRightSideNav() {
    $('#mySidenav').attr("style", "width: 0px; overflow-y: hidden;");
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
/* The following function selects the toc item in the left if it has hash ID */
function selectTocItemBasedOnHash() {
    $('.tocify-item').each(function () {
        if ($(this).attr('data-unique') === location.hash.slice(1))
            $(this).click();
    });
}