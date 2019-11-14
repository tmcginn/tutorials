var testval;
var shortcutbtn_click = [
    { id: '#btn_h1', placeholder1: '# Enter h1 title here\n', placeholder2: '# ', placeholder3: undefined },
    { id: '#btn_h2', placeholder1: '## Enter h2 title here\n', placeholder2: '## ', placeholder3: undefined },
    { id: '#btn_h3', placeholder1: '### Enter h3 title here\n', placeholder2: '### ', placeholder3: undefined },
    { id: '#btn_icon', placeholder1: '![alt text](img/img_name.png)', placeholder2: '![', placeholder3: '](img/img_name.png)' },
    { id: '#btn_image', placeholder1: '![alt text](img/img_name.png "Description of image follows")', placeholder2: '![', placeholder3: '](img/img_name.png "image title")' },
    { id: '#btn_link', placeholder1: '[Text to display](https://www.example.com)', placeholder2: '[', placeholder3: '](https://www.example.com)' },
    { id: '#btn_bold', placeholder1: '**Enter text here**', placeholder2: '**', placeholder3: '**' },
    { id: '#btn_italics', placeholder1: '_Enter text here_', placeholder2: '_', placeholder3: '_' },
    { id: '#btn_ul', placeholder1: '* Unordered List 1\n', placeholder2: '* ', placeholder3: undefined },
    { id: '#btn_ol', placeholder1: '1. Ordered List Item 1\n', placeholder2: '1. ', placeholder3: undefined },
    { id: '#btn_indent', placeholder1: '    ', placeholder2: '    ', placeholder3: undefined },
    { id: '#btn_code', placeholder1: '`Enter one line code here`', placeholder2: '`', placeholder3: '`' },
    { id: '#btn_codeblock', placeholder1: '```\nEnter multiple line\ncode here\n```', placeholder2: '```\n', placeholder3: '\n```' },
];

var nav_pages = [
    { id: '#btn_home', html: 'home.html' },
    { id: '#btn_manifest', html: 'manifest.html' },
    { id: '#btn_templates', html: 'templates.html' }
];

$(function () {
    $('#lastmodified').text(document.lastModified);
    loadFile(nav_pages[0].html);

    $('#main').on('change', '#show_images, #simple_view', function() {
        setTimeout(showMdInHtml, 0)
    });


    // The following event listeners are for shortcut buttons
    $.each(shortcutbtn_click, function (index, value) {
        $('#main').on('click', value.id, function () {
            shortcutClick(value.placeholder1, value.placeholder2, value.placeholder3);
        });
    });

    $('#main').on('click', '#btn_template', getTemplate);

    $('#main').on('click', '#preview_from_manifest', function () {
        var data = JSON.parse(window.localStorage.getItem("manifestValue"));
        var flag = false;
        var titles = [];
        data = JSON.parse(data).tutorials;

        $(data).each(function (i) {
            if (!flag) {
                var title = $.trim(data[i].title);
                var filename = $.trim(data[i].filename);
                if (title.length === 0 && filename.length === 0) {
                    alert('Enter both Title and MD File Path in the manifest tab to preview in HTML.');
                    flag = true;
                }
                else if (title.length === 0) {
                    alert('Enter Title in the manifest tab to preview in HTML.');
                    flag = true;
                }
                else if (filename.length === 0) {
                    alert('Enter MD File Path in the manifest tab to preview in HTML.');
                    flag = true;
                }
                else if ($.inArray(title, titles) !== -1) {
                    console.log($.inArray(title, titles));
                    alert('Tutorial Titles cannot be same. Please ensure that the titles are unique and try again.');
                    flag = true;
                }
                if (flag) {
                    $('#tabs-container .nav-link:eq(' + i + ')').tab('show');
                }
                titles.push(title);
            }
        });

        if (!flag) {
            window.localStorage.setItem('preview', 'manifest');
            window.open("./preview/index.html", "_preview");
        }
    });

    $('#main').on('click', '#preview_from_home', function () {
        window.localStorage.setItem('preview', 'home');
        window.open("./preview/index.html", "_preview");
    });

    $('#main').on('click', '#download_md', function () {
        var temp = new showdown.Converter().makeHtml($.trim($('#mdBox').val()));
        temp = $.trim(new showdown.Converter().makeMarkdown(temp));
        temp = $.trim(temp.replace(/\n\n<!-- -->\n/g, '\n'));
        temp = $.trim(temp.replace(/\n<!-- -->\n/g, '\n'));
        temp = $.trim(temp.replace(/\<!-- -->/g, ''));
        temp = $.trim(temp.replace(/\n\n<!-- Downloaded from Tutorial Creator on.*-->/g, ''));
        temp += "\n\n<!-- Downloaded from Tutorial Creator on " + new Date($.now()) + " -->";
        download("content.md", temp);
    });

    $('#main').on('click', '#import', function () {
        alert("Work in progress. Coming soon!");
    });

    $('#main').on('click', '#download_manifest', function () {
        download('manifest.json', $.trim(JSON.stringify(getFormData(), null, "\t")));
    });

    $('#main').on('click', '#download_html', function () {
        $.get("https://raw.githubusercontent.com/ashwin-agarwal/tutorials/master/template/index.html", function (content) {
            alert("The tutorial HTML file will download now. Place this file in the same location as the manifest.json file and upload it to GitHub or Jarvis.");
            download("index.html", content);
        });

    });

    $.each(nav_pages, function (index, value) {
        $('nav').on('click', value.id, function () {
            $('nav .nav-item').children().removeClass('active');
            $(value.id).addClass('active');
            loadFile(value.html);
        });
    });

    $('#main').on('click', '#add-tutorial', function () {
        var newtutorial = document.createElement('li');
        var link = document.createElement('a');
        var newtab = document.createElement('div');
        var close = document.createElement('span');
        var tutorialsno = $('#tutorials-nav .nav-item').length;


        while ($('#tab-content #tutorial' + tutorialsno).length === 1) {
            tutorialsno++;
        }


        if ($('#tutorials-nav .nav-link').length >= 2) {
            if ($('#tutorials-nav .nav-link:eq(0) > .close').length == 0) {
                var close_firsttab = document.createElement('span');
                $(close_firsttab).html('&times;');
                $(close_firsttab).attr('class', 'close');
                $('#tutorials-nav .nav-link:eq(0)').append(close_firsttab);
            }
        }

        $(newtab).attr({
            class: 'tab-pane container fade',
            id: 'tutorial' + tutorialsno
        });
        $(newtab).html($('#tab-content .tab-pane:eq(0)').html());
        $(newtutorial).attr('class', 'nav-item');
        $(link).attr({
            class: 'nav-link',
            "data-toggle": 'tab',
            href: '#tutorial' + tutorialsno
        });
        $(link).text("Tutorial " + tutorialsno);
        $(close).html('&times;');
        $(close).attr('class', 'close');

        $(close).appendTo(link);
        $(link).appendTo(newtutorial);
        $(newtutorial).appendTo('#tutorials-nav');
        $('#add-tutorial').parent().appendTo('#tutorials-nav');
        $(newtab).appendTo('#tab-content');

        $('#tab-content .tab-pane').each(function () {
            if ($(this).hasClass('active show'))
                $(this).removeClass('active show');
        });
        $('#tabs-container .nav-link:not(#add-tutorial):last').tab('show');
        getFormData();
    });

    $('#main').on('click', '#tabs-container .nav-link .close', function () {
        var href = $(this).parent().attr("href");
        $(href).remove();
        $('#tabs-container a[href="' + $(this).parent().parent().prev().children().attr("href") + '"]').tab('show');
        $(this).parent().parent().remove();

        if ($('#tutorials-nav .nav-link').length <= 2) {
            if ($('#tutorials-nav .nav-link:eq(0) > .close').length == 1) {
                $('#tutorials-nav .nav-link:eq(0) > .close').remove();
            }
        }

        getFormData();
    });

    $('#main').bind('input propertychange', '#mdBox', function (e) {
        if ($('#mdBox').length !== 0) {
            showMdInHtml();
        }
    });

    $('#main').bind('input propertychange', '#manifestForm input', function () {
        if ($('#manifestForm').length !== 0) {
            getFormData();
        }
    });

    $('#main').on('click', '#reset_manifest', function () {
        $('#manifestForm').find("input[type=text], input[type=date], textarea").val("");
        while ($('#tabs-container .nav-link .close').length > 0) {
            $('#tabs-container .nav-link .close:last').click();
        }
        $('#upload_json').val("");
        getFormData();
    });

    $('#main').on('change', '#image_files', readImageContent);
    $('#main').on('click', '#btn_image_files', function () {
        $('#image_files')[0].click();
    });
    $('#main').on('click', '#download_zip', function () {
        var flag = false;
        var titles = [];
        var data = JSON.parse(window.localStorage.getItem("manifestValue"));
        data = JSON.parse(data).tutorials;

        $(data).each(function (i) {
            if (!flag) {
                var title = $.trim(data[i].title);
                var filename = $.trim(data[i].filename);
                if (title.length === 0 && filename.length === 0) {
                    alert('Enter both Title and MD File Path in the manifest tab to download ZIP file.');
                    flag = true;
                }
                else if (title.length === 0) {
                    alert('Enter Title in the manifest tab to download ZIP file.');
                    flag = true;
                }
                else if (filename.length === 0) {
                    alert('Enter MD File Path in the manifest tab to download ZIP file.');
                    flag = true;
                }
                else if ($.inArray(title, titles) !== -1) {
                    console.log($.inArray(title, titles));
                    alert('Tutorial Titles cannot be same. Please ensure that the titles are unique and try again.');
                    flag = true;
                }
                if (flag) {
                    $('#tabs-container .nav-link:eq(' + i + ')').tab('show');
                }
                titles.push(title);
            }
        });

        if (!flag) {
            downloadZip();
        }
    });
    $('#main').on('change', '#upload_json', enterJsonData);
    $('#main').on('click', '#enter_json', function () {
        $('#upload_json').click();
    });
    $('#main').on('click', '#view_md_template', function() {
        var template_window = window.open('template.md', 'template');

    });
    $('#main').on('click', '#import_md', function() {
        $('#upload_md').click();
    });
    $('#main').on('change', '#upload_md', enterMdData);
});

function homeInit() {
    $('#mdBox').val(window.localStorage.getItem("mdValue"));
    if (window.localStorage.getItem("mdValue") === null) { //template is set only if you open the tool for the first time
        getTemplate();
    }
    showMdInHtml();
}

function manifestInit() {
    if (window.localStorage.getItem("manifestValue") !== null) { //template is set only if you open the tool for the first time
        setFormData();
        getFormData();
    }
    $('#manifestForm input').trigger('input');
}
function loadFile(filename) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', filename, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            $('#main').html(xhr.responseText);
            if (filename === nav_pages[0].html)
                homeInit();
            else if (filename === nav_pages[1].html)
                manifestInit();
        }
    }
    xhr.send();
}

function getFormData() {  //display the details in the form on the right side and saves to local storage
    let indexed_array = {};
    let tutorials_array = [];
    var json;

    $.each($('#manifestForm').serializeArray(), function (i, value) {
        indexed_array[value['name']] = value['value'];
        if ((i + 1) % 6 == 0) {
            tutorials_array.push(indexed_array);
            indexed_array = {};
        }
    });
    json = "{\"tutorials\":" + JSON.stringify(tutorials_array) + "}";
    window.localStorage.setItem("manifestValue", JSON.stringify(json));
    $('#manifestBox pre').html(JSON.stringify(JSON.parse(json), null, "\t"));
    return JSON.parse(json, null, "\t");
}

//sets the form data based on what is available in the local storage
function setFormData() {
    var data = JSON.parse(window.localStorage.getItem("manifestValue"));
    data = JSON.parse(data).tutorials;

    //creating tabs automatically based on the length of data
    for (var i = 0; i < data.length - 1; i++) {
        $('#add-tutorial').trigger('click');
    }

    $.each(data, function (i) {
        for (key in data[i]) {
            $('input[name="' + key + '"]:eq(' + i + '), textarea[name="' + key + '"]:eq(' + i + ')').val($.trim(data[i][key]));
        }
    });
}

function readImageContent(evt) {
    var files = evt.target.files; // FileList object
    var uploaded_images = [];
    var total = 0, loaded = 0, failed = 0;
    $.each(files, function () {
        var file = $(this)[0];
        if (file.type.match('image.*')) {
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                total++;
                return function (e) {
                    var obj = {};
                    obj['filename'] = escape(theFile.name);
                    obj['src'] = e.target.result;
                    uploaded_images.push(obj)
                };
            })(file);
            reader.onloadend = function () {
                try {
                    window.localStorage.setItem("imagesValue", JSON.stringify(uploaded_images));
                    loadImages();
                    loaded++;
                } catch(e) {                    
                    failed++;
                }
                if(total == loaded) {
                    alert(total + " image(s) successfully uploaded for preview.");                    
                }
                else if(total == loaded + failed) {
                    alert("Failed to load " + failed + " image(s) out of " + total + " as browser's local storage is full.");
                }                
            };
            reader.readAsDataURL(file);
        }
    });
}

function loadImages() {
    var uploaded_images = JSON.parse(window.localStorage.getItem("imagesValue"));
    var titles = "";
    $.each(uploaded_images, function (i, value) {
        titles += (i + 1) + ": " + value.filename + "\n";
    });

    if (uploaded_images !== null) {
        if (uploaded_images.length > 1) {
            $('#btn_image_files').text('[' + uploaded_images.length + ' images uploaded for preview]');
            $('#btn_image_files').attr('title', titles + "\nClick here to upload images");
        }
        else if (uploaded_images.length == 1) {
            $('#btn_image_files').text('[' + uploaded_images.length + ' image uploaded for preview]');
            $('#btn_image_files').attr('title', titles + "\nClick here to upload images");
        }
    }


    $('#btn_image_files').show();
    if (uploaded_images !== null) {
        $('#htmlBox').find('img').each(function (i, imageFile) {
            for (var i = 0; i < uploaded_images.length; i++) {
                if ($(imageFile).attr('src').indexOf(uploaded_images[i].filename) >= 0) {
                    $(imageFile).attr('src', uploaded_images[i].src);
                }
            }
        });
    }
}

function showMdInHtml() {
    window.localStorage.setItem("mdValue", $('#mdBox').val());
    if ($('#simple_view').is(":checked")) {
        var htmlElement = document.createElement("div");
        $(htmlElement).attr('id', 'htmlElement');
        $(htmlElement).html(new showdown.Converter().makeHtml($('#mdBox').val()));

        if (!$('#show_images').is(":checked")) {
            $('#btn_image_files').hide();
            $(htmlElement).find('img').removeAttr("src");
            $(htmlElement).find('img').remove();
        }

        if ($('#htmlBox').length === 0) {
            var htmlBox = document.createElement('div');
            $(htmlBox).attr({ id: 'htmlBox', class: 'card-body' });
            $(htmlBox).appendTo('#rightBox');
        }

        $('#htmlBox').html(htmlElement);
        $('#previewIframe').remove();
        $('#previewBox').remove();

        if ($('#show_images').is(":checked")) {
            loadImages();
        }
    }
    else {
        window.localStorage.setItem('preview', 'home');
        if ($('#previewBox').length === 0) {
            var previewBox = document.createElement('div');
            $(previewBox).attr({ id: 'previewBox', class: 'card-body' });

            var previewIframe = document.createElement('iframe');
            $(previewIframe).attr({
                id: 'previewIframe',
                src: 'preview/index.html',
                style: 'height: 1000px;',
                frameborder: '0'
            });
            $(previewIframe).on('load', function () {
                if (!$('#show_images').is(":checked")) {
                    $('#btn_image_files').hide();
                    $(this).contents().find('img').removeAttr("src");
                    $(this).contents().find('img').remove();
                }
                else {
                    $('#btn_image_files').show();
                }
                $(this).height(this.contentWindow.document.body.scrollHeight + 'px');
            });

            $(previewIframe).appendTo(previewBox);
            $(previewBox).appendTo('#rightBox');
        }
        else {
            $('#previewIframe').attr('src', function (i, val) { return val; });
        }
        $('#htmlBox').remove();
    }
}

function getTemplate() {
    $.get("template.md", function (markdown) {
        $('#mdBox').select();
        //if (!document.execCommand('insertText', false, markdown)) {//because execCommand doesn't work in some browsers, if the insert fails, it does manual insert
        $('#mdBox').val(markdown);
        //}
    }).done(function () {
        showMdInHtml();
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

// defines what happens when a shortcut button is clicked
function shortcutClick(placeholder1, placeholder2, placeholder3) {
    var mdBox = $('#mdBox')[0];
    var start_index = mdBox.selectionStart;
    var end_index = mdBox.selectionEnd;

    mdBox.focus();
    if (start_index == end_index) { //no text in selected in the textbox                    
        if (!document.execCommand('insertText', false, placeholder1)) { //because execCommand doesn't work in some browsers, if the insert fails, it does manual insert        
            $('#mdBox').val($('#mdBox').val().substr(0, start_index) + placeholder1 + $('#mdBox').val().substr(start_index, $('#mdBox').val().length - end_index));
        }
    }
    else {
        var substring = $('#mdBox').val().substr(start_index, end_index - start_index);
        if (placeholder3 === undefined) {
            var newlineIndex = [start_index];
            for (var index = substring.indexOf('\n'); index != -1; index = substring.indexOf('\n', index + 1)) {
                newlineIndex.push(index + start_index + 1);
            }
            newlineIndex.sort(function (a, b) { return b - a });

            $(newlineIndex).each(function (i, value) {
                start_index = end_index = mdBox.selectionStart = mdBox.selectionEnd = value;
                if (!document.execCommand('insertText', false, placeholder2)) {
                    $('#mdBox').val($('#mdBox').val().substr(0, start_index) + placeholder2 + $('#mdBox').val().substr(start_index, $('#mdBox').val().length - end_index));
                }
            });
        }
        else {
            if (!document.execCommand('insertText', false, placeholder2 + substring + placeholder3)) {
                $('#mdBox').val($('#mdBox').val().substr(0, start_index) + placeholder2 + substring + placeholder3 + $('#mdBox').val().substr(end_index, $('#mdBox').val().length - end_index));
            }
        }
    }
    mdBox.selectionEnd = mdBox.selectionStart = start_index;
    mdBox.focus();
    showMdInHtml();
}

/* The following functions creates and populates the right side navigation including the open button that appears in the header.
The navigation appears only when the manifest file has more than 1 tutorial. The title that appears in the side navigation 
is picked up from the manifest file. */
function setupRightSideNavForDownload(manifestFileContent, tutorialHtml, tutorialNo) {
    var allTutorials = manifestFileContent.tutorials;
    if (allTutorials.length > 1) { //means it is a workshop            
        //adding open button
        var openbtn_div = $(document.createElement('div')).attr("id", "openbtn_div");
        var openbtn = $(document.createElement('span')).attr({
            class: "openbtn",
            onclick: "openNav();"
        });

        $(openbtn).html("&#9776;"); //this add the hamburger icon
        $(openbtn).appendTo(openbtn_div);
        $(openbtn_div).appendTo($(tutorialHtml).find('header'));
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
            class: "closebtn",
            onclick: "closeNav()"
        });
        $(closebtn).html("&times;"); //adds a cross icon to the header
        $(closebtn).appendTo(sideNavHeaderDiv);
        $(sideNavHeaderDiv).appendTo(sideNavDiv);
        //adding tutorials from JSON and linking them with ?shortnames
        for (var i = 0; i < allTutorials.length; i++) {
            var sideNavEntry = $(document.createElement('a')).attr('class', 'tutorials_nav');
            if (tutorialNo === i) {
                $(sideNavEntry).addClass('selected');
                $(sideNavEntry).attr('href', 'index.html');
            }
            else if (tutorialNo === 0 && i !== 0) {
                $(sideNavEntry).attr('href', './' + createShortNameFromTitle(allTutorials[i].title) + '/index.html');
                $(sideNavEntry).removeClass('selected');
            }
            else if (tutorialNo !== 0 && i === 0) {
                $(sideNavEntry).attr('href', '../index.html');
            }
            else if (tutorialNo !== 0 && i !== 0) {
                $(sideNavEntry).attr('href', '../' + createShortNameFromTitle(allTutorials[i].title) + '/index.html');
            }

            $(sideNavEntry).text(allTutorials[i].title); //The title specified in the manifest appears in the side nav as navigation
            $(sideNavEntry).appendTo(sideNavDiv);
            $(document.createElement('hr')).appendTo(sideNavDiv);
            if (window.location.search.split('?')[1] === createShortNameFromTitle(allTutorials[i].title)) //the selected class is added if the title is currently selected
                $(sideNavEntry).attr("class", "selected");
        }
        $(sideNavDiv).appendTo($(tutorialHtml).find('header')); //sideNavDiv is added to the HTML template header
    }
}

function downloadZip() {
    //disabling download button    
    disableDownloadButton();
    var localStorageManifest = JSON.parse(window.localStorage.getItem("manifestValue"));
    var allTutorials = JSON.parse(localStorageManifest).tutorials;
    var htmlTemplate = document.createElement('html');

    $.when(
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"),
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.2/FileSaver.min.js"),
        $.getScript("https://ashwin-agarwal.github.io/tutorials/common/js/load.js"),
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.8.9/beautifier.min.js"),
        $.get("https://raw.githubusercontent.com/ashwin-agarwal/tutorials/master/template/download.html", function (downloadFile) {
            htmlTemplate.innerHTML = downloadFile;
        })
    ).done(function () {
        var zip = new JSZip();
        var tutorialsDone = 0, tutorialsFailed = 0;
        var imgCount = 0, imgDone = 0, imgFailed = 0;
        var linkCount = 0, linkDone = 0, linkFailed = 0;
        var scriptCount = 0, scriptDone = 0, scriptFailed = 0;
        var fileCount = 0, fileDone = 0, fileFailed = 0;
        var logWindow = window.open("", "log", "width=1100,height=500");
        logWindow.document.title = "Tutorial Creator: Creating zip file";
        logWindow.document.body.innerHTML = "";
        logWindow.document.write('<pre>Packaging files. Please wait...</pre>');
        var log = logWindow.document.getElementsByTagName('pre')[0];

        $(allTutorials).each(function (tutorialNo, tutorialEntryInManifest) {
            $.get(tutorialEntryInManifest.filename, function (markdownContent) { //reading MD file in the manifest and storing content in markdownContent variable
                var articleElement = document.createElement('article');
                $(articleElement).html(new showdown.Converter().makeHtml(markdownContent)); //converting markdownContent to HTML by using showndown plugin				
                addPathToImageSrc(articleElement, tutorialEntryInManifest.filename); //adds the path for the image based on the filename in manifest				
                wrapSectionTagAndAddHorizonatalLine(articleElement); //adding each section within section tag and adding HR line
                addH2ImageIcons(articleElement); //Adding image, class, width, and height to the h2 title img
                wrapImgWithFigure(articleElement); //Wrapping images with figure, adding figcaption to all those images that have title in the MD
                addPathToAllRelativeHref(articleElement, tutorialEntryInManifest.filename); //adding the path for all HREFs that are relative based on the filename in manifest                
                movePreInsideLi(articleElement); //moving the pre elements a layer up for stylesheet matching
                $(articleElement).find('a').attr('target', '_blank'); //setting target for all ahrefs to _blank	
                $(articleElement).find('ul li p:first-child').contents().unwrap(); //removing the p tag from first li child as CSS changes the formatting											                

                var htmlDoc = document.implementation.createHTMLDocument();
                htmlDoc.head.innerHTML = $($(htmlTemplate).find('head')[0]).html();
                htmlDoc.body.innerHTML = $($(htmlTemplate).find('body')[0]).html();
                $(htmlDoc).find('html').attr('lang', 'en');
                $(htmlDoc).find('#bookContainer').html(articleElement);

                //updateh1Title function
                $(htmlDoc).find('#content>h1').append($(htmlDoc).find('article>h1').text());
                $(htmlDoc).find('article>h1').remove();

                //update head content
                $(htmlDoc).find('title').text(tutorialEntryInManifest.title);
                $(htmlDoc).find('meta[name=contentid]').attr("content", tutorialEntryInManifest.contentid);
                $(htmlDoc).find('meta[name=description]').attr("content", tutorialEntryInManifest.description);
                $(htmlDoc).find('meta[name=partnumber]').attr("content", tutorialEntryInManifest.partnumber);
                $(htmlDoc).find('meta[name=publisheddate]').attr("content", tutorialEntryInManifest.publisheddate);

                //add right navigation for contents
                if (allTutorials["length"] > 1) {
                    setupRightSideNavForDownload(JSON.parse(localStorageManifest), htmlDoc, tutorialNo);
                    var sideNavControl = document.createElement('script');
                    $(sideNavControl).append("function openNav() { $('#mySidenav').attr('style', 'width: 250px; overflow-y: auto;'); $('#mySidenav > .selected:eq(0)').focus().blur();}");
                    $(sideNavControl).append("function closeNav() { $('#mySidenav').attr('style', 'width: 0px; overflow-y: hidden;');}");
                    $(sideNavControl).append('openNav();');
                    $(sideNavControl).appendTo($(htmlDoc).find('body'));
                }


                //capture all images used in the tutorial
                var imageSrcs = [];
                $(htmlDoc).find('img').each(function () {
                    imageSrcs.push($(this).attr('src'));
                });
                imgCount += $(imageSrcs).length;

                $(imageSrcs).each(function (i, imgSrc) {
                    var img = new Image();
                    var imgname = imgSrc.split('/').pop();
                    img.crossOrigin = "anonymous";
                    img.onload = function () {
                        var canvas = document.createElement('canvas');
                        $(canvas).attr({
                            height: this.height,
                            width: this.width
                        });
                        canvas.getContext('2d').drawImage(this, 0, 0);
                        var imgContent = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");

                        if (tutorialNo === 0) {
                            zip.folder("html").folder("img").file(decodeURI(imgname), imgContent, { base64: true });
                        }
                        else {
                            zip.folder("html").folder(createShortNameFromTitle(tutorialEntryInManifest.title)).folder("img").file(decodeURI(imgname), imgContent, { base64: true });
                        }
                        imgDone++;
                        $(log).append("\n[img] Added to zip: " + imgSrc);
                    };
                    img.onerror = function () {
                        $(log).append("\n<span style='color:red;'>[img] File doesn't exist: " + imgSrc + "</span>");
                        imgFailed++;
                    };
                    img.src = imgSrc;
                });

                //replace image path with relative path
                $(htmlDoc).find('img').each(function () {
                    var imgRelativeUrl = $(this).attr('src').split('/');
                    imgRelativeUrl = "./" + imgRelativeUrl[imgRelativeUrl.length - 2] + "/" + imgRelativeUrl[imgRelativeUrl.length - 1];
                    $(this).attr('src', imgRelativeUrl);
                });

                //download links, and scripts referenced in the head of the OBE
                //scripts and links are downloaded only for the main tutorial. All other tutorial refer to the same css and scripts.              
                if (tutorialNo === 0) {
                    $(htmlDoc).find('head>link').each(function () {
                        var linkSrc = $(this).attr('href');
                        var location = linkSrc.split('/');
                        var filename = location[$(location).length - 1];
                        var foldername = location[$(location).length - 2];
                        if (foldername === "css") {
                            linkCount++;
                            $.get(linkSrc, function (fileContent) {
                                zip.folder("html").folder(foldername).file(decodeURI(filename), fileContent);
                                linkDone++;
                            }).done(function () {
                                $(log).append("\n[css] Added to zip: " + linkSrc);
                            }).fail(function () {
                                linkFailed++;
                                $(log).append("\n<span style='color:red;'>[css] File doesn't exist: " + linkSrc + "</span>");
                            });
                        }
                    });
                    $(htmlDoc).find('head>script').each(function () {
                        let scriptSrc = $(this).attr('src');
                        var location = scriptSrc.split('/');
                        var filename = location[$(location).length - 1];
                        var foldername = location[$(location).length - 2];
                        if (foldername === "js") {
                            scriptCount++;
                            $.get(scriptSrc, function (fileContent) {
                                zip.folder("html").folder(foldername).file(decodeURI(filename), fileContent);
                                scriptDone++;
                            }).done(function () {
                                $(log).append("\n[js] Added to zip: " + scriptSrc);
                            }).fail(function () {
                                scriptFailed++;
                                $(log).append("\n<span style='color:red;'>[js] File doesn't exist: " + scriptSrc + "</span>");
                            });
                        }
                    });
                }

                //replacing links with relative URL
                $(htmlDoc).find('head>link').each(function () {
                    var location = $(this).attr('href').split('/');
                    var filename = location[$(location).length - 1];
                    var foldername = location[$(location).length - 2];
                    var relativeUrl;
                    if (foldername === "css") {
                        if (tutorialNo === 0) {
                            relativeUrl = "./" + foldername + "/" + filename;
                        }
                        else {
                            relativeUrl = "../" + foldername + "/" + filename;
                        }
                    }

                    $(this).attr('href', relativeUrl);
                });

                //replacing scripts with relative URL
                $(htmlDoc).find('head>script').each(function () {
                    var location = $(this).attr('src').split('/');
                    var filename = location[$(location).length - 1];
                    var foldername = location[$(location).length - 2];
                    var relativeUrl;
                    if (foldername === "js") {
                        if (tutorialNo === 0) {
                            relativeUrl = "./" + foldername + "/" + filename;
                        }
                        else {
                            relativeUrl = "../" + foldername + "/" + filename;
                        }
                    }
                    $(this).attr('src', relativeUrl);
                });

                //download files referenced in the OBE
                $($(htmlDoc).find('#bookContainer')).find('a').each(function () {
                    var fileSrc = $(this).attr('href');
                    var location = fileSrc.split('/');
                    var filename = location[$(location).length - 1];
                    var foldername = location[$(location).length - 2];
                    if (foldername === "files") {
                        fileCount++;
                        $.get(fileSrc, function (fileContent) {
                            if (tutorialNo === 0) {
                                zip.folder("html").folder(foldername).file(decodeURI(filename), fileContent);
                            }
                            else {
                                zip.folder("html").folder(createShortNameFromTitle(tutorialEntryInManifest.title)).folder(foldername).file(decodeURI(filename), fileContent);
                            }
                            fileDone++;
                        }).done(function () {
                            $(log).append("\n[files] Added to zip: " + fileSrc);
                        }).fail(function () {
                            $(log).append("\n<span style='color:red;'>[files] File doesn't exist: " + fileSrc + '</span>');
                            fileFailed++;
                        });
                    }
                });

                //replacing files with relative URL
                $($(htmlDoc).find('#bookContainer')).find('a').each(function () {
                    var location = $(this).attr('href').split('/');
                    var filename = location[$(location).length - 1];
                    var foldername = location[$(location).length - 2];
                    var relativeUrl;
                    if (foldername === "files") {
                        relativeUrl = "./" + foldername + "/" + filename;
                    }
                    $(this).attr('href', relativeUrl);
                });

                //add html files to the zip
                if (tutorialNo === 0) {
                    zip.folder("html").file("index.html", beautifier.html("<!DOCTYPE html>\n" + htmlDoc.documentElement.outerHTML));
                    $(log).append("\n[html] Added to zip: index.html");
                    zip.folder("html").file("manifest.json", JSON.stringify(JSON.parse(localStorageManifest), null, "\t"));
                    $(log).append("\n[manifest] Added to zip: manifest.json");
                }
                else {
                    var folder = zip.folder("html").folder(createShortNameFromTitle(tutorialEntryInManifest.title));
                    folder.file("index.html", beautifier.html("<!DOCTYPE html>\n" + htmlDoc.documentElement.outerHTML));
                    $(log).append("\n[html] Added to zip: " + createShortNameFromTitle(tutorialEntryInManifest.title) + "/index.html");
                }
            }).done(function () {
                tutorialsDone++;
            }).fail(function () {
                tutorialsFailed++;
                $(log).append("\n<span style='color:red;'>[html] File doesn't exist: " + tutorialEntryInManifest.filename + '</span>');
            });
        });

        var completionCheck = setInterval(function () {
            if (tutorialsDone === allTutorials["length"] && imgCount === imgDone && linkCount === linkDone && scriptCount === scriptDone && fileCount === fileDone) {
                zip.generateAsync({
                    type: "blob"
                }).then(function (content) {
                    // see FileSaver.js 
                    saveAs(content, allTutorials[0].partnumber + ".zip");
                });
                enableDownloadButton();
                $(log).append("\n\nDownloading zip file...");
                clearInterval(completionCheck);
            }
            else if (tutorialsDone + tutorialsFailed === allTutorials["length"] && imgCount === imgDone + imgFailed && linkCount === linkDone + linkFailed && scriptCount === scriptDone + scriptFailed && fileCount === fileDone + fileFailed) {
                $(log).append("\n\nFailed to generate ZIP file. Please check log and retry.");
                if (tutorialsFailed !== 0) {
                    $(log).append("\nTutorials Failed: " + tutorialsFailed + " / " + allTutorials["length"]);
                }
                if (imgFailed !== 0) {
                    $(log).append("\nImages Failed: " + imgFailed + " / " + imgCount);
                }
                if (linkFailed !== 0) {
                    $(log).append("\nCSS Failed: " + linkFailed + " / " + linkCount);
                }
                if (scriptFailed !== 0) {
                    $(log).append("\nJS Failed: " + scriptFailed + " / " + scriptCount);
                }
                if (fileFailed !== 0) {
                    $(log).append("\nFiles Failed: " + fileFailed + " / " + fileCount);
                }
                clearInterval(completionCheck);
                setTimeout(function () {
                    enableDownloadButton();
                }, 2000);
            }
        }, 3000);
    });
}

function enableDownloadButton() {
    $('#download_zip').removeAttr('disabled');
    $('#downlad_zip > span').remove();
    $('#download_zip').text('Download ZIP');
}

function disableDownloadButton() {
    var spinner = document.createElement('span');
    $(spinner).attr('class', 'spinner-grow spinner-grow-sm');
    $('#download_zip').html(spinner);
    $('#download_zip').append(" Downloading...");
    $('#download_zip').attr('disabled', 'true');
}

function enterJsonData(evt) {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    var json;
    var valid = true;
    reader.onload = (function (theFile) {
        return function (e) {
            try {
                
                json = JSON.parse(e.target.result);
            }
            catch (exception) {
                alert("Invalid JSON file");
                valid = false;
            }
        };
    })(file);
    reader.onloadend = function () {
        if (valid) {
            $('#reset_manifest').click();
            window.localStorage.setItem("manifestValue", JSON.stringify(JSON.stringify(json)));
            manifestInit();
        }

    }
    reader.readAsText(file);
}

function enterMdData(evt) {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    var md;
    reader.onload = (function (theFile) {
        return function (e) {
            md = e.target.result;
        };
    })(file);
    reader.onloadend = function () {
        $('#mdBox').val(md);
        $('#mdBox').trigger('input');     
    }
    $('#upload_md').val("");
    reader.readAsText(file);
}