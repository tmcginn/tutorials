var manifestFileName = "manifest.json";
var leftnavJsFile = "https://ashwin-agarwal.github.io/tutorials/obe_template/js/leftnav.js";
$(function () {
    $.getJSON(manifestFileName, function (manifestFileContent) { //reading the manifest file and storing content in manifestFileContent variable
        populateRightSideNav(manifestFileContent); //populate side navigation based on content in the manifestFile
        var labEntryInManifest = selectMdFileToDisplay(manifestFileContent); //selects which MD file to display
        var articleElement = document.createElement('article'); //creating an article that would contain MD to HTML converted content
        $.get(labEntryInManifest.filename, function (markdownContent) { //reading MD file in the manifest and storing content in markdownContent variable
            $(articleElement).html(new showdown.Converter().makeHtml(markdownContent)); //converting markdownContent to HTML by using showndown plugin
			addPathToImageSrc(articleElement, labEntryInManifest.filename); //adds the path for the image based on the filename in manifest
            updateH1Title(articleElement); //replacing the h1 title in the OBE and removing it from the article Element
			wrapSectionTagAndAddHorizonatalLine(articleElement); //adding each section within section tag and adding HR line
            addH2ImageIcons(articleElement); //Adding image, class, width, and height to the h2 title img
            wrapImgWithFigure(articleElement); //Wrapping images with figure, adding figcaption to all those images that have title in the MD
            movePreInsideLi(articleElement); //moving the pre elements a layer up for stylesheet matching          
			$(articleElement).find('ul li p:first-child').contents().unwrap(); //removing the p tag from first li child as CSS changes the formatting			
            updateHeadContent(labEntryInManifest); //changing document head based on the manifest
        }).done(function () { //do the following after all the above operations are complete
            $("#bookContainer").html(articleElement); //placing the article element inside the bookContainer div of the OBE template
            $.getScript(leftnavJsFile); //invoking the left navigation creation script
			openRightSideNav(); //opening the right navigation
        });
    });
});