var udf = "undefined";
var isIE9 = false;
var Global = {};
var StringBuilder = function () { this.value = ""; };
Global.isLoaderActive = false;
Date.prototype.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/* --------String Builder functions begin--------- */
StringBuilder.prototype.append = function (value) { this.value += value; }; //Function to append given value to stringBuilder object
StringBuilder.prototype.toString = function () { return this.value; }; //Converts the given object to string
StringBuilder.prototype.empty = function () { this.value = ""; return this; }; //Empties the stringBuilder object 
/* -----String Builder functions end------------ */


/*---------Date functions begin ----------- */
Date.prototype.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Date.prototype.getMonthName = function () { return this.monthNames[this.getMonth()]; };
Date.prototype.getShortMonthName = function () { return this.getMonthName().substr(0, 3); };
Date.prototype.getYear = function () { return this.getFullYear().toString().substr(2, 2); };
Date.prototype.addDays = function (days) { var dat = new Date(this.valueOf()); dat.setDate(dat.getDate() + days); return dat; };
Date.prototype.addMonths = function (months) { var dat = new Date(this.valueOf()); dat.setMonth(dat.getMonth() + months); return dat; };
/*---------Date functions end ----------- */

//funtion to get the position of given object
function GetPosXY(obj) { return { "eWidth": obj.width(), "eHeight": obj.height(), "x": obj.offset().left, "y": obj.offset().top, "scrollX": obj.scrollLeft(), "scrollY": obj.scrollTop(), "windowWidth": $(window).width(), "windowHeight": $(window).height(), "eOuterWidth": obj.outerWidth(true), "eOuterHeight": obj.outerHeight(true) }; };

//Check if given object is null
Global.IsNullOrEmpty = function (obj) { return typeof (obj) == udf || obj == null || obj.toString().trim() == ""; };

//Ajax call method
Global.AjaxCall = function (options) {
    Global.showBusyLoader(true);
    var settings = $.extend({
        //default settings for ajax call
        type: "POST",
        data: "",
        url: "",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: true,
        onsuccess: "",
        loaderId: ""
    }, options);

    $.ajax({
        type: settings.type,
        url: settings.url,
        data: settings.data,
        dataType: settings.dataType,
        contentType: settings.contentType,
        async: settings.async,
        success: function (value) {
            var msg = "";
            if ((value) != "error") {
                try {
                    settings.onsuccess(value);
                    Global.showBusyLoader(false);
                }
                catch (ex) {
                    console.log(ex);
                    Global.showBusyLoader(false);
                }
            }
            else {
                Global.showBusyLoader(false);
                Global.ShowErrorMessag(msg)
            }
        },
        error: function (jqXHR, exception) {
            Global.showBusyLoader(false);
            Global.ShowErrorMessage("")
        }
    });
};

//Displays or Hides loader
Global.showBusyLoader = function (isShow, currentID, useConstantOpacity) {
    if (isShow == true) {
        Global.isLoaderActive = true;
        var useConstantOpacityColor = Global.IsNullOrEmpty(useConstantOpacity) ? "" : "style='background-color:rgba(0,0,0,0.4)'";
        var sb = new StringBuilder();
        sb.append("<div class=\"cl-overlay-loader cl-" + currentID + "\" " + useConstantOpacityColor + "></div>");
        sb.append("<div id=\"divLoader\" class=\"divLoaderGlobal margin-auto cl-" + currentID + "\">");
        sb.append("<div id=\"divPopUp\">");
        sb.append("<div class='cl-loder-img' ></div>");
        sb.append("</div>");
        sb.append("</div>");

        if ($(".cl-overlay-loader.cl-" + currentID).length > 0)
            $(".cl-overlay-loader.cl-" + currentID).remove();
        if ($("#divLoader.cl-" + currentID).length > 0)
            $("#divLoader.cl-" + currentID).remove();

        $('body').append(sb.toString());
        $(".cl-overlay-loader.cl-" + currentID).show();
        $("#divLoader.cl-" + currentID).show();
    }
    else {

        if (Global.IsNullOrEmpty(currentID)) {
            $(".cl-overlay-loader").remove();
            $(".divLoaderGlobal").remove();
        }
        else {
            $(".cl-overlay-loader.cl-" + currentID).remove();
            $("#divLoader.cl-" + currentID).remove();
        }
        Global.isLoaderActive = false;
    }
}


/* ------Array and Objects functions begin -------------------------------*/
//Get distinct object by passing object name and property
function getDistinctItemsFromObjectArray(obj, property) {
    var tempArray = [];
    var distinctProperty = getUniquePropertyFromObjectArray(obj, property);
    distinctProperty.forEach(function (d) {
        tempArray.push(filterObjectArrayWithProperty(obj, property, d)[0]);
    });
    return tempArray;
}

//Get unique objects based on given propery from  given object array
function getUniquePropertyFromObjectArray(obj, property) {
    var tempArray = [];
    obj.forEach(function (d) {
        if (tempArray.indexOf(d[property]) === -1) {
            tempArray.push(d[property]);
        }
    });
    return tempArray;
}

//Get objects that has specific val for given propery from given object array
function filterObjectArrayWithProperty(obj, property, val) { 
    return obj.filter(function (d) {
        if (typeof (d[property]) === "string") {
            if ((d[property] != undefined) && (val != undefined))
                return d[property].toLowerCase() === val.toLowerCase();
        }
        else
            return d[property] === val;
    });
}

//Get distinct objects based on given property from given object array
function getUniqueArrayObjectsBasedOnProperty(objAry, property) {
    var flags = [], output = [], l = objAry.length, i;
    for (i = 0; i < l; i++) {
        if (flags[objAry[i][property]]) continue;
        flags[objAry[i][property]] = true;
        output.push(objAry[i]);
    }
    return output;
}

// Function For sorting Array
function sortArrayObjectByProperty(array, property, order) {
    function compare(a, b) {
        if (a[property] < b[property])
            return -1;
        else if (a[property] > b[property])
            return 1;
        else
            return 0;
    }
    if (order === "desc") {
        return array.sort(compare).reverse();
    }
    else {
        return array.sort(compare);
    }

}

// Function For sorting Array by ignoring case
function sortArrayObjectByPropertyIgnoreCase(array, property, order) {
    function compare(a, b) {
        if ((a[property].toLowerCase()) < (b[property].toLowerCase()))
            return -1;
        else if ((a[property].toLowerCase()) > (b[property].toLowerCase()))
            return 1;
        else
            return 0;
    }
    if (order === "desc") {
        return array.sort(compare).reverse();
    }
    else {
        return array.sort(compare);
    }
}

//Get distinct items from an array
function getUniqueListFromArray(arr) {
    var unique = arr.filter(function (itm, i, arr) {
        return i == arr.indexOf(itm);
    });

    return unique;
}

//Get unique list from an array
Array.prototype.uniq = function () {
    return this.filter(
        function (a) { return !this[a] ? this[a] = true : false; }, {}
    );
}

//Check if an object is empty
function IsEmptyObject(obj) {
    return jQuery.isEmptyObject(obj);
}

//Get distinct list from an object based on given filter
function getUniqueList(data, mainFilter) {
    var Rows = data.filter(function (e) {
        return (!IsNullOrEmpty(e[mainFilter]));
    });
    var fieldArray = Rows.map(function (e) {
        return (e[mainFilter]);
    }).uniq();
    return fieldArray;
};
/* ------Array and Objects functions end -------------------------------*/


//Invokes error message popup function depending on response codes
function RedirectOnError(msg, text) {
    Global.showBusyLoader(false);
    if (msg.status == "401" || msg.status == "12030")
        ShowSessionExpireMessage();
    else {
        //Popup for showing something went wrong
        Global.ShowErrorMessage(text)
    }
}

//Display alert on session timeout
function ShowSessionExpireMessage() {
    alert("sessionExpiryMessage");
};

//Display error message
Global.ShowErrorMessage = function (msg) {
    alert("An error occured while processing your request. Please try again later.")
}

//Handles keydown events for an window object
$(window).keydown(function (event) {
    if (event.keyCode == 27) { // escape key maps to keycode `27`
        $(".cl-popup").empty();
        $(".pc").remove();
    }
    if (event.keyCode == 13 || event.keyCode == 27) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
});

//removes the custom scrollbar
Global.destroyCustomScrollbar = function (selection) {
    selection = $(selection);
    if (selection.hasClass("mCustomScrollbar"))
        selection.mCustomScrollbar("destroy");
}


//Adds custom scrollbar
Global.CustomScrollbar = function (selection, position, direction) {
    selection = $(selection);
    Global.destroyCustomScrollbar(selection);
    selection.mCustomScrollbar({
        axis: Global.IsNullOrEmpty(direction) ? "xy" : direction,
        scrollbarPosition: Global.IsNullOrEmpty(position) ? "inside" : position,
        mouseWheel: {
            enable: true,
            preventDefault: true
        },
        autoDraggerLength: true,
        advanced: {
            autoScrollOnFocus: false,
            updateOnContentResize: true,
            updateOnBrowserResize: true
        },
        scrollInertia: 0,
        keyboard: { enable: true }
    });
}; 


//destroys the tooltip for the given object
Global.destroyCustomTooltip = function (obj) {
    if (obj.hasClass('tooltipstered')) {
         obj.tooltipster('destroy');
    }
}

//adds the custom tooltip for the given object
Global.custom_tooltip = function (obj) {
    Global.destroyCustomTooltip(obj);
    obj.tooltipster({
        contentAsHTML: true,
        arrow: false,
        functionBefore: function (instance, helper) {
            $.each($.tooltipster.instances(), function (i, instance) {
                instance.close();
            });
        }
    });
}

//rounds of the given value for the specified number of places
Global.roundOff = function (val, places) {
    places = (Global.IsNullOrEmpty(places)) ? 0 : places;
    val = parseFloat(parseFloat(val).toFixed(15));
    return (val.toFixed(places));
}

//function will return query string
Global.getQueryString = function () {
    var url = location.href;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for (var i = 0, result = {}; i < qs.length; i++) {
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}

//Captures the dimension of screen
Global.captureScreenResolution = function () {
    $.ajax({
        type: "POST",
        url: baseUrl + "Login/trackScreenResolution",
        data: "{'width':'" + screen.width + "','height':'" + screen.height + "'}",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: true,
        success: function (msg) {
        },
        error: function (msg) {
        }
    });
}


//Adds custom scrollbar and disable click events
Global.AddCustomScrollbarAndDisableClickEvents = function (obj, position, axis) {
    let customScrollOptions = {};
    customScrollOptions.axis = (axis == undefined) ? "xy" : axis;
    customScrollOptions.position = (position == undefined) ? "outside" : position;
    Global.destroyCustomScrollbar(obj);
    obj.mCustomScrollbar(customScrollOptions);
    obj.find(".mCSB_scrollTools_vertical").off("click").on("click", function (e) { e.stopPropagation() })  
}; 

Global.IsEmptyObject = function (obj) {
    return jQuery.isEmptyObject(obj);
}