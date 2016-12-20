//use diep color palette
//introduction text
//styling selector
//styling buttons
// more examples of each kind
// add instructions for selectors when introducing them in game

var peach = "#EEB790"
var purple = "#BE90D4"
var red = "#FC7677"
var green = "#86C680"
var yellow = "#FFE869"
var blue = "#00B2E1"
var baseUrl = window.location.href
var paramsString = window.location.href
var searchParams = new URLSearchParams(paramsString);

function getGlanceElement() {
    var elementName = $("#glanceSelector").text()
    var object = $(glanceSelector(elementName, {rootElement: $("#level" + getUrlVars()["level"])[0]})).find(">svg")
    return object
}

//on clicking an objects, tests too see if correct and moves to next level if so
function testResult(event) {
    var element = $(event.currentTarget)
    var object = getGlanceElement().find(">")
    //test it the element clicked on is equal to the one found using glance selector
    if (object[0] != element[0]) {

        var color = element.css("fill");
        element.addClass( "wrong");
        element.mouseleave(function () {
            element.removeClass("wrong");
        });
        setTimeout(function () {
            element.removeClass("wrong");
        }, 500)
    } else {
        var color = element.css("fill");
        element.css("fill", green);
        setTimeout(function () {
            var level = $(".container:visible").attr('id');
            $(".container:visible").hide();
            window.history.pushState("add level", "Title", baseUrl.split("?")[0] + "?level=" + (parseInt(getUrlVars()["level"])+1));
            element.css("fill", color);
            $("#glanceSelector").text($("#level" + getUrlVars()["level"]).data("selector"));
            $("#level" +(parseInt(getUrlVars()["level"]))).show();
            //$("#level" + (parseInt(level.slice(-1)) + 1).toString()).show()
        }, 1100)
    }
}


//start button to start level one after reading the intro
function start() {
    console.log(baseUrl.split("?")[0])
    window.history.pushState("add level", "Title", baseUrl.split("?")[0] + "?level=1");
    $("#level0").hide();
    $("#glanceSelector").text($("#level" + getUrlVars()["level"]).data("selector"));

    $("#level1").show();
    $("#start").hide();
}
//resume button to continue after text screens
function resume() {
    var level = $(".container:visible").attr('id');
    $(".container:visible").hide();
    window.history.pushState("add level", "Title", baseUrl.split("?")[0] + "?level=" + (parseInt(getUrlVars()["level"])+1));
    //element.css("fill", color);
    $("#glanceSelector").text($("#level" + getUrlVars()["level"]).data("selector"));
    $("#level" +(parseInt(getUrlVars()["level"]))).show();
}

//function to read variables from url
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

//on back or forward show next level according to the relevent pushstate
window.onpopstate = function (event) {
    var levelNo = getUrlVars(["level"]);
    $('div[id^="level"]').hide();
    $("#level" + levelNo.level).show();
    window.location.reload()
};

//on document load bring up the correct level according to url and make svg inline
$(function () {

    jQuery('.container').each(function (levelcounter) {
        var $div = jQuery(this);
        $div = $div.attr('id', $div.attr('id') + 'level' + (levelcounter+1));
    })
    var paramsString = window.location.href
    var params = paramsString.split("/").length
    if (paramsString.endsWith("/") || baseUrl.toString().endsWith("index.html")){
        $("#level").hide();
        $("#level0").show();
        var currentState = history.state;
        history.pushState(currentState, "title", window.location.href + "?level=0")
    } else {
        $("#level").hide();
        console.log(("#level" + getUrlVars()["level"]))
       // $("#level" + getUrlVars()["level"]).show();
        if (getUrlVars()["level"] != 0)
            $("#start").hide()
    }

        $("#glanceSelector").text($("#level" + getUrlVars()["level"]).data("selector"));


    jQuery('img.svg').each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }

            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);
            $svg.find(">").on("click", testResult);
            //$svg.find(">").attr('class', "blue")
        }, 'xml');
    });
    //show level only after everything is loaded
    var chkReadyState = setInterval(function() {
        if (document.readyState == "complete") {
            // clear the interval
        $("#level" + getUrlVars()["level"]).show();
            clearInterval(chkReadyState);
            // finally your page is loaded.
        }
    }, 100);
});