var leftnavJsFile = "https://ashwin-agarwal.github.io/tutorials/obe_template/js/leftnav.js";
var defaultManifestFileName = "content.md";
$(function () {
	var localStorageMarkDown = window.localStorage.getItem("mdValue");
	var localStorageManifest = JSON.parse(window.localStorage.getItem("manifestValue"));
	populateRightSideNav(JSON.parse(localStorageManifest)); //populate side navigation based on content in the localstorage manifest
	var labEntryInManifest = selectMdFileToDisplay(JSON.parse(localStorageManifest)); //selects which MD file to display	
	var articleElement = document.createElement('article'); //creating an article that would contain MD to HTML converted content	
	if (labEntryInManifest.filename === defaultManifestFileName || labEntryInManifest.filename.length == 0) {
		prepareMd(localStorageMarkDown, labEntryInManifest, articleElement);
		showMd(articleElement);
	}
	else {
		$.get(labEntryInManifest.filename, function (markdownContent) { //reading MD file in the manifest and storing content in markdownContent variable
			prepareMd(markdownContent, labEntryInManifest, articleElement);
		}).done(function () { //do the following after all the above operations are complete
			showMd(articleElement);
		});
	}
});

function prepareMd(markdownContent, labEntryInManifest, articleElement) {
	$(articleElement).html(new showdown.Converter().makeHtml(markdownContent)); //converting markdownContent to HTML by using showndown plugin
	$(articleElement).title
	addPathToImageSrc(articleElement, labEntryInManifest.filename); //adds the path for the image based on the filename in manifest			
	updateH1Title(articleElement); //replacing the h1 title in the OBE and removing it from the article Element
	wrapSectionTagAndAddHorizonatalLine(articleElement); //adding each section within section tag and adding HR line
	addH2ImageIcons(articleElement); //Adding image, class, width, and height to the h2 title img
	wrapImgWithFigure(articleElement); //Wrapping images with figure, adding figcaption to all those images that have title in the MD
	addPathToAllRelativeHref(articleElement, labEntryInManifest.filename); //adding the path for all HREFs that are relative based on the filename in manifest
	movePreInsideLi(articleElement); //moving the pre elements a layer up for stylesheet matching          
	$(articleElement).find('ul li p:first-child').contents().unwrap(); //removing the p tag from first li child as CSS changes the formatting			
	updateHeadContent(labEntryInManifest); //changing document head based on the manifest
	document.title = "Preview: " + document.title; //adding Preview in the title
}

function showMd(articleElement) {
	$("#bookContainer").html(articleElement); //placing the article element inside the bookContainer div of the OBE template
	$.getScript(leftnavJsFile); //invoking the left navigation creation script
	openRightSideNav(); //opening the right navigation
}