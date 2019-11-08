var leftnavJsFile = "https://ashwin-agarwal.github.io/tutorials/obe_template/js/leftnav.js";
var defaultManifestFileName = "content.md";
$(function () {
	var localStorageMarkDown = window.localStorage.getItem("mdValue");
	var previewType = window.localStorage.getItem("preview");
	var localStorageManifest = JSON.parse(window.localStorage.getItem("manifestValue"));
	var tutorialEntryInManifest;
	var articleElement = document.createElement('article'); //creating an article that would contain MD to HTML converted content	
	if (previewType === "manifest") {
		populateRightSideNav(JSON.parse(localStorageManifest)); //populate side navigation based on content in the localstorage manifest
		tutorialEntryInManifest = selectMdFileToDisplay(JSON.parse(localStorageManifest)); //selects which MD file to display			
		$.get(tutorialEntryInManifest.filename, function (markdownContent) { //reading MD file in the manifest and storing content in markdownContent variable
			prepareMd(markdownContent, tutorialEntryInManifest, articleElement);
		}).done(function () { //do the following after all the above operations are complete
			showMd(articleElement);
		}).fail(function () {
			alert("File does not exist at location: " + tutorialEntryInManifest.filename);
		});
	}
	else {
		prepareMd(localStorageMarkDown, tutorialEntryInManifest, articleElement);
		showMd(articleElement);
	}
});

function prepareMd(markdownContent, tutorialEntryInManifest, articleElement) {
	var previewType = window.localStorage.getItem("preview");
	$(articleElement).html(new showdown.Converter().makeHtml(markdownContent)); //converting markdownContent to HTML by using showndown plugin	
	if (previewType === "home") {
		loadImages(articleElement); //updates the images if it was uploaded using the Tutorial Creator (only if MD in Tutorial creator is being previewed)
	}
	else if (previewType === "manifest")
		addPathToImageSrc(articleElement, tutorialEntryInManifest.filename); //adds the path for the image based on the filename in manifest				
	updateH1Title(articleElement); //replacing the h1 title in the Tutorial and removing it from the article Element
	wrapSectionTagAndAddHorizonatalLine(articleElement); //adding each section within section tag and adding HR line
	addH2ImageIcons(articleElement); //Adding image, class, width, and height to the h2 title img
	wrapImgWithFigure(articleElement); //Wrapping images with figure, adding figcaption to all those images that have title in the MD
	if (previewType === "home") {
		fixFigCaptions(articleElement); //Fixing figcaptions for those images that were loaded from the localstorage as the src of the localstorage is like a junk value
	}
	else if (previewType === "manifest") {
		addPathToAllRelativeHref(articleElement, tutorialEntryInManifest.filename); //adding the path for all HREFs that are relative based on the filename in manifest
		updateHeadContent(tutorialEntryInManifest); //changing document head based on the manifest
	}

	movePreInsideLi(articleElement); //moving the pre elements a layer up for stylesheet matching
	$(articleElement).find('a').attr('target', '_blank'); //setting target for all ahrefs to _blank	
	$(articleElement).find('ul li p:first-child').contents().unwrap(); //removing the p tag from first li child as CSS changes the formatting				
	document.title = "Preview: " + document.title; //adding Preview in the title
}

function showMd(articleElement) {
	$("#bookContainer").html(articleElement); //placing the article element inside the bookContainer div of the Tutorial template
	$.getScript(leftnavJsFile); //invoking the left navigation creation script
	openRightSideNav(); //opening the right navigation
}

function loadImages(articleElement) {
	var uploaded_images = JSON.parse(window.localStorage.getItem("imagesValue")); //gets the image filename and src from the local storage
	if (uploaded_images !== null) { //only goes through if the images were uploaded using Tutorial creator 
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

function fixFigCaptions(articleElement) {
	var uploaded_images = JSON.parse(window.localStorage.getItem("imagesValue")); //gets the image filename and src from the local storage
	if (uploaded_images !== null) { //only goes through if the images were uploaded using Tutorial creator
		$(articleElement).find('img[src*="data:"]').each(function (i, imageFile) { //finds all images that were replaced by the localstorage images
			for (var i = 0; i < uploaded_images.length; i++) { //matches with all uploaded_images				
				if ($(imageFile).attr('src').indexOf(uploaded_images[i].src) >= 0) { //if the image filename matches, it replaces the figcaption
					var imgFileNameWithoutExtn = uploaded_images[i].filename.split("/").pop().split('.').shift(); //removing extension and path from the image name
					if ($(imageFile).next().is('figcaption')) {
						$(imageFile).next().find('a').text('Description of illustration [' + imgFileNameWithoutExtn + ']');
						$(imageFile).next().find('a').attr('href', 'files/' + imgFileNameWithoutExtn + '.txt');
					}
				}
			}

		});
	}
}