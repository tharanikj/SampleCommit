let modalPopup = {};

modalPopup.showPopupMsg = function (titleText, text) {
    titleText = (titleText.length == 0) ? "MESSAGE" : titleText;
    let popup = "<div class='PopupOverlay pc'>\
                    <div class='PopupContainer  pc'>\
                        <div class='PopupTitle'>\
                            <span class='titleText'>"+ titleText + "</span>\
                            <span class='closeBtn CP'></span>\
                        </div>\
                        <div  class='PopupBody'>\
                            <div class='PopupInnerBody'>"+ text + "</div>\
                        </div>\
                    </div>\
                </div>";

    $("body").append(popup);
    modalPopup.bindPopupEvents();
}
modalPopup.showExpandedPopup = function (titleText, text) {
    titleText = (titleText.length == 0) ? "MESSAGE" : titleText;
    let popup = "<div class='PopupOverlay pc '>\
                    <div class='PopupContainer expandedview pc'>\
                        <div class='PopupTitle'>\
                            <span class='titleText'>"+ titleText + "</span>\
                            <span class='closeBtn CP'></span>\
                        </div>\
                        <div  class='PopupBody'>\
                            <div class='PopupInnerBody'>"+ text + "</div>\
                        </div>\
                    </div>\
                </div>";

    $("body").append(popup);
    modalPopup.bindPopupEvents();
}
modalPopup.bindPopupEvents = function () {
    $(".closeBtn").off("click").on("click", function (e) {
        e.stopPropagation();
        $(".pc").remove();
    });

    $('body').off("keyup").on('keyup', function (e) {
        if (e.keyCode == 27) {
            $(".closeBtn").click();
        }
    })


    $(".Popupnml .submitbtn").click(function (e) {
        e.stopPropagation();
        $(".pc").remove();
    });
    $("#msgOkBtn,#msgCancelBtn").click(function (e) {
        $(".pc").remove();
    });
 
}

modalPopup.AddPetitionerpopup = function () {
    let popup = "<div class=\"PopupOverlay  pc\"><div class=\"Popupnml PopupContainer  pc\" style=\"width:60vh !important;height:30vh;\"><div class=\"PopupTitle\"><span class=\"titleText\">ADD PETITIONER</span><span class=\"closeBtn CP\"></span></div>\<div class=\"PopupBody\" style='height:30vh;'><div class=\"PopupInnerBody\" style='height:70%;'><span class=\"lbl__name\">Petitioner</span><input class=\"popup__input\" id=\"AddPetitioner\" placeholder=\"Enter The Petitioner\"></div><div class=\"popup__error\"></div></div>    <div class='popupFooterContainer' style='height:20vh;'>  <div class='submitbtnpopup'><div class='btn_style btn__save'><div id='msgSaveBtn' class='btnoktxt'>ADD</div> </div ><div class='btn_style btn__cancel'><div id='msgCancelBtn' class='btnoktxt'>CANCEL</div> </div ></div></div> </div></div>";
    $("body").append(popup);
    modalPopup.bindPopupEvents();
}

modalPopup.showErrorCustomPopup = function (event, obj, errText, isTextBox) {
    var parentObj = $(obj);
    //var objToolTipsterList = obj;
    $.each(parentObj, function () {
        if ($(this).hasClass('tooltipstered'))
            $(this).tooltipster('destroy').removeAttr("title");
        else
            $(this).removeAttr("title");
    });
    $(obj).focus();
    parentObj.attr("title", errText);
    parentObj.tooltipster({
        contentAsHTML: true,
        arrow: false,
        //'maxWidth': 400,
        trigger: 'custom',
        triggerOpen: {
            click: true,
        },
    })
    parentObj.tooltipster('show');
    //removing tooltip after 3 second 
    setTimeout(function () {
        if (parentObj.hasClass('tooltipstered'))
            parentObj.tooltipster('destroy').removeAttr("title");
    }, 3000)
}

modalPopup.showHelpDocument = function () {
    let popup = "<div class='PopupOverlay pc'>\
                    <div class='guideDocPopup pc'>\
                        <div class='PopupTitle'>\
                            <span class='titleText'>HELP DOCUMENT</span>\
                            <span class='closeBtn CP'></span>\
                        </div>\
                        <div  class='PopupBody guideDocPopupBody'>\
                            <iframe class='guideDocIframe' src='" + baseUrl + "Help Documents/Holism_Guide_Document.pdf'></iframe>\
                        </div>\
                    </div>\
                </div>";
    $("body").append(popup);
    modalPopup.bindPopupEvents();
}

modalPopup.UploadErrorpopup = function (Imgclass,headertext,msgtext,opttext) {
    let popup = "<div class='PopupOverlay pc'>\
                    <div class='PopupContainer  pc'>\
                        <div class='PopupTitle' style='background:none;'>\
                            <span class='titleText'></span>\
                            <span class='closeBtn CP' style='width:4vh;height:4vh;'></span>\
                        </div>\
                        <div  class='PopupBody'>\
                            <div class='PopupInnerBody'>\
                             <div class='divImageContainer FL'>\
                               <div class=\""+Imgclass+" bgImgSettings\" style=\"background-size:60%;\"></div>\
                             </div >\
                             <div class='divTextContainer FL'>\
                              <div class='msgtxt'>"+ opttext +"</div>\
                              <div class='bluetext'>"+ headertext +"</div>\
                              <div class='msgtxt'>"+ msgtext+"</div>\
                             </div >\
                            </div >\
                        </div>\
                    </div>\
                </div>";
    $("body").append(popup);
    modalPopup.bindPopupEvents();
}

modalPopup.DeleteAlertpopup = function (Imgclass, headertext, msgtext) {
    let popup = "<div class=\"PopupOverlay  pc\"><div class=\"Popupnml PopupContainer  pc\" style=\"width:60vh !important;height:35vh;justify-content:normal;\"><div class=\"PopupTitle\" style='background:none;'><span class=\"titleText\"></span><span class=\"closeBtn CP\" style='width:4vh;height:4vh;'></span></div>\<div class=\"PopupBody\" style='height:calc(100% - 11vh);'><div class=\"PopupInnerBody\" style='justify-content:center;flex-direction:column;align-items:center;'>  <div class='divImageContainer' style='width:100%;height:70%;'>\
                               <div class=\""+ Imgclass + " bgImgSettings\" style=\"background-size:20%;\"></div>\
                             </div >\
                             <div class='divTextContainer' style='width:50%;height:40%;'>\
                              <div class='deletebluetext'>"+ headertext + "</div>\
                              <div class='msgtxt'>"+ msgtext +"</div>\
                             </div >\</div>    <div class='popupFooterContainer'>  <div class='submitbtnpopup'><div class='btn_style btn__save'><div id='msgSaveBtn' class='btnoktxt'>YES</div> </div ><div class='btn_style btn__cancel'><div id='msgCancelBtn' class='btnoktxt'>NO</div> </div ></div></div> </div></div>";
    $("body").append(popup);
    modalPopup.bindPopupEvents();
}
