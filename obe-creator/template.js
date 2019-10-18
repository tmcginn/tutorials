var buttons = ["h1", "h2", "h3", "icon", "image", "link", "bold", "italics", "ul", "ol", "indent", "code", "codeblock", "template"];

$(function () {
    $('#lastmodified').text(document.lastModified);
    var localStorageVal = window.localStorage.getItem("mdValue");
    if (localStorageVal)
        $('#mdBox').val(localStorageVal);
    else
        getTemplate();

    (function () { //displays the shortcut buttons
        $(buttons).each(function (i) {
            var btn_element = document.createElement('button');
            $(btn_element).attr({ type: 'button', class: 'btn btn-primary', id: 'btn_' + buttons[i] });
            $(btn_element).text(buttons[i]);
            $('#shortcuts').append(btn_element);
        });
    })();

    function getFormData() {
        var unindexed_array = $('#manifestForm').serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });
        return JSON.stringify(indexed_array);
    }
    function setFormData() {
        var data = JSON.parse(window.localStorage.getItem("manifestValue"));                    
        $.each(data, function (key, value) {            
            $('[name=' + key + ']', $('#manifestForm')).val(value);
        });                
    }

    function showMdInHtml() {
        window.localStorage.setItem("mdValue", $('#mdBox').val());
        if ($('#simple_view').is(":checked")) {
            $('#show_images_label').show();
            var htmlElement = document.createElement("div");
            $(htmlElement).attr('id', 'htmlElement');
            $(htmlElement).html(new showdown.Converter().makeHtml($('#mdBox').val()));

            if (!$('#show_images').is(":checked")) {
                $(htmlElement).find('img').removeAttr("src");
                $(htmlElement).find('img').removeAttr("alt");
            }

            if ($('#htmlBox').length === 0) {
                var htmlBox = document.createElement('div');
                $(htmlBox).attr({ id: 'htmlBox', class: 'card-body' });
                $(htmlBox).appendTo('#rightBox');
            }

            $('#htmlBox').html(htmlElement);
            $('#previewBox').remove();
        }
        else {
            $('#show_images_label').hide();
            if ($('#previewBox').length === 0) {
                var previewBox = document.createElement('div');
                $(previewBox).attr({ id: 'previewBox', class: 'card-body' });

                var previewIframe = document.createElement('iframe');
                $(previewIframe).attr({ id: 'previewIframe', src: 'preview/index.html' });

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
            if (!document.execCommand('insertText', false, markdown)) {//because execCommand doesn't work in some browsers, if the insert fails, it does manual insert
                $('#mdBox').val(markdown);
                showMdInHtml();
            }
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

    $('#manifestForm input').change(function() {
        $('#manifestForm').attr('data-changed', true);     
    });

    $('#myModal').on('shown.bs.modal', function () { //if modal is open
        $('#myModal input:first').focus();
        var empty = true;
        var data = $('#manifestForm').serializeArray();
        $(data).each(function (i) {
            if($(this)[0].value.length > 0) {
                empty = false;
                console.log($(this)[0].value);
                return;
            }
        });
        if(empty)
            setFormData();
    });

    $('#myModal').on('hidden.bs.modal', function () { //if modal is open        
        if($('#manifestForm').attr('data-changed') === "true") {
            if(confirm('The changes are not saved. Do you want to continue?')) {
                $('#manifestForm').removeAttr('data-changed');
                $('#manifestForm').trigger("reset");
            }
            else {
                $('#myModal').modal('show');
            }
        }
    });

    $('#mdBox').bind('input propertychange', showMdInHtml);

    $('#show_images').change(showMdInHtml);
    $('#simple_view').change(showMdInHtml);

    // The following event listeners are for shortcut buttons
    $('#btn_h1').click(function () {
        shortcutClick("# Enter h1 title here\n", "# ");
    });

    $('#btn_h2').click(function () {
        shortcutClick("## Enter h2 title here\n", "## ");
    });

    $('#btn_h3').click(function () {
        shortcutClick("### Enter h3 title here\n", "### ");
    });

    $('#btn_icon').click(function () {
        shortcutClick("![alt text](img/img_name.png)", "![", "](img/img_name.png)");
    });

    $('#btn_image').click(function () {
        shortcutClick("![alt text](img/img_name.png \"image title\")", "![", "](img/img_name.png \"image title\")");
    });

    $('#btn_link').click(function () {
        shortcutClick("[Text to display](https://www.example.com)", "[", "](https://www.example.com)");
    });

    $('#btn_bold').click(function () {
        shortcutClick("**Enter text here**", "**", "**");
    });

    $('#btn_italics').click(function () {
        shortcutClick("_Enter text here_", "_", "_");
    });

    $('#btn_ul').click(function () {
        shortcutClick("* Unordered List 1\n", "* ");
    });

    $('#btn_ol').click(function () {
        shortcutClick("1. Ordered List Item 1\n", "1. ");
    });

    $('#btn_indent').click(function () {
        shortcutClick("    ", "    ");
    });

    $('#btn_code').click(function () {
        shortcutClick("`Enter one line code here`", "`", "`");
    });

    $('#btn_codeblock').click(function () {
        shortcutClick("```\nEnter multiple line\ncode here\n```", "```\n", "\n```");
    });

    $('#btn_template').click(getTemplate);

    $('#preview').click(function () {
        window.open("./preview/index.html", "preview");
    });

    $('#download_md').click(function () {
        download("content.md", $('#mdBox').val());
    });

    $('#import').click(function () {
        alert("Work in progress. Coming soon!");
    });

    $('#save_manifest').click(function () {
        var json = getFormData();
        if($('#manifestForm').attr('data-changed') === "true") {
            $('#manifestForm').removeAttr('data-changed');
            window.localStorage.setItem("manifestValue", json);
            alert("Changes saved in your browser!");
        }
    });

    $('#download_manifest').click(function () {
        var json = "{\"labs\":[" + getFormData() + "]}";
        console.log(json);
        var manifest_data = JSON.parse(json, null, "\t"); 
        download("manifest.json", JSON.stringify(manifest_data, null, "\t"));
    });

    showMdInHtml();
});