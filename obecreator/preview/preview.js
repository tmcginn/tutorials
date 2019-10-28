var leftnavJsFile = "https://ashwin-agarwal.github.io/tutorials/obe_template/js/leftnav.js";
var defaultManifestFileName = "content.md";
$(function () {
	var localStorageMarkDown = window.localStorage.getItem("mdValue");
	var localStorageManifest = JSON.parse(window.localStorage.getItem("manifestValue"));
	populateRightSideNav(JSON.parse(localStorageManifest)); //populate side navigation based on content in the localstorage manifest
	var tutorialEntryInManifest = selectMdFileToDisplay(JSON.parse(localStorageManifest)); //selects which MD file to display	
	var articleElement = document.createElement('article'); //creating an article that would contain MD to HTML converted content	
	if (tutorialEntryInManifest.filename === defaultManifestFileName || tutorialEntryInManifest.filename.length == 0) {
		prepareMd(localStorageMarkDown, tutorialEntryInManifest, articleElement);
		showMd(articleElement);
	}
	else {
		$.get(tutorialEntryInManifest.filename, function (markdownContent) { //reading MD file in the manifest and storing content in markdownContent variable
			prepareMd(markdownContent, tutorialEntryInManifest, articleElement);
		}).done(function () { //do the following after all the above operations are complete
			showMd(articleElement);
		});
	}
});

function prepareMd(markdownContent, tutorialEntryInManifest, articleElement) {
	$(articleElement).html(new showdown.Converter().makeHtml(markdownContent)); //converting markdownContent to HTML by using showndown plugin
	loadImages(articleElement, tutorialEntryInManifest.filename); //updates the images if it was uploaded using the Tutorial Creator (only if MD in Tutorial creator is being previewed)
	addPathToImageSrc(articleElement, tutorialEntryInManifest.filename); //adds the path for the image based on the filename in manifest				
	updateH1Title(articleElement); //replacing the h1 title in the Tutorial and removing it from the article Element
	wrapSectionTagAndAddHorizonatalLine(articleElement); //adding each section within section tag and adding HR line
	addH2ImageIcons(articleElement); //Adding image, class, width, and height to the h2 title img
	wrapImgWithFigure(articleElement); //Wrapping images with figure, adding figcaption to all those images that have title in the MD
	fixFigCaptions(articleElement, tutorialEntryInManifest.filename); //Fixing figcaptions for those images that were loaded from the localstorage as the src of the localstorage is like a junk value
	addPathToAllRelativeHref(articleElement, tutorialEntryInManifest.filename); //adding the path for all HREFs that are relative based on the filename in manifest
	movePreInsideLi(articleElement); //moving the pre elements a layer up for stylesheet matching
	$(articleElement).find('a').attr('target', '_blank'); //setting target for all ahrefs to _blank	
	$(articleElement).find('ul li p:first-child').contents().unwrap(); //removing the p tag from first li child as CSS changes the formatting			
	updateHeadContent(tutorialEntryInManifest); //changing document head based on the manifest
	document.title = "Preview: " + document.title; //adding Preview in the title
}

function showMd(articleElement) {
	$("#bookContainer").html(articleElement); //placing the article element inside the bookContainer div of the Tutorial template
	$.getScript(leftnavJsFile); //invoking the left navigation creation script
	openRightSideNav(); //opening the right navigation
}

function loadImages(articleElement, filename) {
	var uploaded_images = JSON.parse(window.localStorage.getItem("imagesValue")); //gets the image filename and src from the local storage
	if (uploaded_images !== null && filename.indexOf("://") === -1) { //only goes through if the images were uploaded using Tutorial creator and manifest doesn't specify a path for the filename
		$(articleElement).find('img').each(function (i, imageFile) { //finds each image in the Tutorial
			for (var i = 0; i < uploaded_images.length; i++) { //matches with all uploaded_images
				if ($(imageFile).attr('src').indexOf(uploaded_images[i].filename) >= 0) { //if the image filename matches, it replaces the SRC
					$(imageFile).attr('src', uploaded_images[i].src);
					continue;
				}
			}
		});
	}
}

function fixFigCaptions(articleElement, filename) {
	var uploaded_images = JSON.parse(window.localStorage.getItem("imagesValue")); //gets the image filename and src from the local storage
	if (uploaded_images !== null && filename.indexOf("://") === -1) { //only goes through if the images were uploaded using Tutorial creator and manifest doesn't specify a path for the filename
		$(articleElement).find('img[src*="data:"]').each(function (i, imageFile) { //finds all images that were replaced by the localstorage images
			for (var i = 0; i < uploaded_images.length; i++) { //matches with all uploaded_images				
				if ($(imageFile).attr('src').indexOf(uploaded_images[i].src) >= 0) { //if the image filename matches, it replaces the figcaption
					var imgFileNameWithoutExtn = uploaded_images[i].filename.split("/").pop().split('.').shift(); //removing extension and path from the image name
					if($(imageFile).next().is('figcaption')) {
						$(imageFile).next().find('a').text('Description of illustration [' + imgFileNameWithoutExtn + ']');
						$(imageFile).next().find('a').attr('href', 'files/' + imgFileNameWithoutExtn + '.txt');
					}
				}
			}
			
		});
	}
}