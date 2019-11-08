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
		}).fail(function() {
			alert("File does not exist at location: " + tutorialEntryInManifest.filename);
		});
	}
	else {
		prepareMd(localStorageMarkDown, tutorialEntryInManifest, articleElement);
		showMd(articleElement);
	}
});

function downloadZip() {
	var previewType = window.localStorage.getItem("preview");
	if (previewType !== "manifest") { return; }
	var localStorageManifest = JSON.parse(window.localStorage.getItem("manifestValue"));
	var allTutorials = JSON.parse(localStorageManifest).tutorials;
	var tutorialHtml = [];

	$.get("https://raw.githubusercontent.com/ashwin-agarwal/tutorials/master/template/download.html", function (htmlTemplate) {
		$(allTutorials).each(function (i, tutorialEntryInManifest) {
			$.get(tutorialEntryInManifest.filename, function (markdownContent) { //reading MD file in the manifest and storing content in markdownContent variable
				var articleElement = document.createElement('article');
				$(articleElement).html(new showdown.Converter().makeHtml(markdownContent)); //converting markdownContent to HTML by using showndown plugin				
				addPathToImageSrc(articleElement, tutorialEntryInManifest.filename); //adds the path for the image based on the filename in manifest				
				wrapSectionTagAndAddHorizonatalLine(articleElement); //adding each section within section tag and adding HR line
				addH2ImageIcons(articleElement); //Adding image, class, width, and height to the h2 title img
				wrapImgWithFigure(articleElement); //Wrapping images with figure, adding figcaption to all those images that have title in the MD
				fixFigCaptions(articleElement, tutorialEntryInManifest.filename); //Fixing figcaptions for those images that were loaded from the localstorage as the src of the localstorage is like a junk value
				addPathToAllRelativeHref(articleElement, tutorialEntryInManifest.filename); //adding the path for all HREFs that are relative based on the filename in manifest
				movePreInsideLi(articleElement); //moving the pre elements a layer up for stylesheet matching
				$(articleElement).find('a').attr('target', '_blank'); //setting target for all ahrefs to _blank	
				$(articleElement).find('ul li p:first-child').contents().unwrap(); //removing the p tag from first li child as CSS changes the formatting											

				tutorialHtml.push(document.implementation.createHTMLDocument());				
				var tmpElement = document.createElement('html');
				tmpElement.innerHTML = htmlTemplate;				
				tutorialHtml[i].head.innerHTML = $($(tmpElement).find('head')[0]).html();
				tutorialHtml[i].body.innerHTML = $($(tmpElement).find('body')[0]).html();
				console.log(tutorialHtml[i]);
				//$(tutorialHtml[i]).attr('lang', 'en');
				$(tutorialHtml[i]).find('#bookContainer').html(articleElement);
			}).done(function () { //do the following after all the above operations are complete
				//updateh1Title function
				var articleH1Title = $(tutorialHtml[i]).find('article>h1').text();
				var templateH1Title = $(tutorialHtml[i]).find("#content>h1").text();
				var replacedH1Html = $(tutorialHtml[i]).find("#content>h1").html().replace(templateH1Title, articleH1Title);
				$(tutorialHtml[i]).find("#content>h1").html(replacedH1Html);
				$(tutorialHtml[i]).find('article>h1').remove();

				//update head content
				$(tutorialHtml[i]).find('title').text(tutorialEntryInManifest.title);
				$(tutorialHtml[i]).find('meta[name=contentid]').attr("content", tutorialEntryInManifest.contentid);
				$(tutorialHtml[i]).find('meta[name=description]').attr("content", tutorialEntryInManifest.description);
				$(tutorialHtml[i]).find('meta[name=partnumber]').attr("content", tutorialEntryInManifest.partnumber);
				$(tutorialHtml[i]).find('meta[name=publisheddate]').attr("content", tutorialEntryInManifest.publisheddate);

				download("index.html", "<!DOCTYPE html>" + tutorialHtml[i].documentElement.outerHTML);
			});
		});
	});
}

function download(filename, text) {
	var pom = document.createElement('a');
	pom.setAttribute('href', 'data:html/plain;charset=utf-8,' + encodeURIComponent(text));
	pom.setAttribute('download', filename);
	if (document.createEvent) {
		var event = document.createEvent('MouseEvents');
		event.initEvent('click', true, true);
		pom.dispatchEvent(event);
	} else {
		pom.click();
	}
}

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