var shortcutbtn_click = [
    { id: '#btn_h1', placeholder1: '# Enter h1 title here\n', placeholder2: '# ', placeholder3: undefined },
    { id: '#btn_h2', placeholder1: '## Enter h2 title here\n', placeholder2: '## ', placeholder3: undefined },
    { id: '#btn_h3', placeholder1: '### Enter h3 title here\n', placeholder2: '### ', placeholder3: undefined },
    { id: '#btn_icon', placeholder1: '![alt text](img/img_name.png)', placeholder2: '![', placeholder3: '](img/img_name.png)' },
    { id: '#btn_image', placeholder1: '![alt text](img/img_name.png "image title")', placeholder2: '![', placeholder3: '](img/img_name.png "image title")' },
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

    $('#main').on('change', '#show_images, #simple_view', showMdInHtml);


    // The following event listeners are for shortcut buttons
    $.each(shortcutbtn_click, function (index, value) {
        $('#main').on('click', value.id, function () {
            shortcutClick(value.placeholder1, value.placeholder2, value.placeholder3);
        });
    });

    $('#main').on('click', '#btn_template', getTemplate);

    $('#main').on('click', '#preview', function () {
        if (window.localStorage.getItem('manifestValue') === null) {
            alert('Enter at least Title in the manifest tab to preview in HTML.')
            loadFile(nav_pages[1].html);
        }
        else
            window.open("./preview/index.html", "_preview");
    });

    $('#main').on('click', '#download_md', function () {
        download("content.md", $.trim($('#mdBox').val()));
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


        $(newtab).attr({
            class: 'tab-pane container fade',
            id: 'tutorial' + tutorialsno
        });
        $(newtab).html($('#tutorial1').html());
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
        getFormData();
    });

    $('#main').bind('input propertychange', '#mdBox', function () {
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
        $('#manifestForm').find("input[type=text], textarea").val("");
        while ($('#tabs-container .nav-link .close').length > 0) {
            $('#tabs-container .nav-link .close:last').click();
        }
        getFormData();
    });

    $('#main').on('change', '#image_files', readImageContent);
    $('#main').on('click', '#btn_image_files', function () {
        $('#image_files')[0].click();
    });
});

function homeInit() {
    $('#mdBox').val(window.localStorage.getItem("mdValue"));
    if (window.localStorage.getItem("mdValue") === null) { //template is set only if you open the tool for the first time
        getTemplate();
    }
    if (window.localStorage.getItem("manifestValue") === null) {
        window.localStorage.setItem('manifestValue', JSON.stringify('{\"tutorials\":[{\"title\":\"\",\"description\":\"\",\"filename\":\"\",\"partnumber\":\"\",\"publisheddate\":\"\",\"contentid\":\"\"}]}'));
    }
    showMdInHtml();
}

function manifestInit() {
    setFormData();     
    getFormData();   
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
    $.each(files, function () {
        var file = $(this)[0];
        if (file.type.match('image.*')) {
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    var obj = {};
                    obj['filename'] = escape(theFile.name);
                    obj['src'] = e.target.result;
                    uploaded_images.push(obj)
                };
            })(file);
            reader.onloadend = function () {
                window.localStorage.setItem("imagesValue", JSON.stringify(uploaded_images));
                loadImages();
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
        if (placeholder3 === undefined) {
            if (!document.execCommand('insertText', false, placeholder2 + $('#mdBox').val().substr(start_index, end_index - start_index))) {
                $('#mdBox').val($('#mdBox').val().substr(0, start_index) + placeholder2 + $('#mdBox').val().substr(start_index, $('#mdBox').val().length - end_index));
            }
        }
        else {
            if (!document.execCommand('insertText', false, placeholder2 + $('#mdBox').val().substr(start_index, end_index - start_index) + placeholder3)) {
                $('#mdBox').val($('#mdBox').val().substr(0, start_index) + placeholder2 + $('#mdBox').val().substr(start_index, end_index - start_index) + placeholder3 + $('#mdBox').val().substr(end_index, $('#mdBox').val().length - end_index));
            }
        }
    }
    mdBox.selectionEnd = mdBox.selectionStart = start_index;
    mdBox.focus();
    showMdInHtml();
}