(function (Holism) {
    Holism.Upload = {};
    doUploadPageSettings = function () {
        Holism.Upload = new Upload();
        Holism.Upload.LoadMasterData();


    }
    function Upload() {
        this.SelectionData = {
            PnC: { id: null, value: null },
            Petitioner: { id: null, value: null },
            RnC: [],
            Date: "",
            Project: "",
            SPL: ""

        };
        this.MasterData = [];
        this.UploadFileData = [];
        this.ActiveModule = ""
    }

    Upload.prototype.LoadMasterData = function () {
        var self = this;
        var param = {};
        param.Input = "";
        param.Action = -1;
        var option = {
            url: "Upload/LoadMasterData", async: true, data: JSON.stringify(param), onsuccess: function (data) {
                if (Global.IsEmptyObject(data)) {
                    $(".closeButton").click();
                    modalPopup.PopupError("Error message", "An error occurred. Please try again later.");
                } else {
                    self.MasterData = data;
                    self.BindtabsClick();
                    if (Global.IsNullOrEmpty(sessionStorage.Module))
                        $("#uploadtab").click();
                    else {
                        $("#" + sessionStorage.Module).click();
                    }
                    self.BindUploadClickEvents();
                    self.BindbottomiconClick();
                    self.BindUpdateClickEvents();
                    self.BindDeleteClickEvents();
                }
            }
        }

        Global.AjaxCall(option);
    }

    Upload.prototype.BindUploadClickEvents = function () {
        var self = this;
        self.BindPnCData();
        self.BindPetitionerData();
        self.BindRnCData();
        self.bindDrpClickEvents();
        self.ddoutsideClick();
        self.BindDatePicker();
        self.BindUploadiconClick();
        self.BindDownloadiconClick();
    }

    Upload.prototype.bindDrpClickEvents = function () {
        $(".divdatamaincontainer .divcommondropdowncontainer").off('click').on('click', function () {

            var thisVar = $(this).find(".divDropDownContainer");
            var currentDropDown = thisVar.closest(".divDropDownOuterContainer").find(".divDropdownlist");

            if (currentDropDown.hasClass("DN") && $(this).hasClass('CP')) {
                currentDropDown.removeClass("DN");
            }
        });
    }

    Upload.prototype.ddoutsideClick = function () {
        $(document).mouseup(function (e) {
            e.stopPropagation();
            e.preventDefault();
            var divLeftPanel = $(".divDropDownOuterContainer").find(".divDropdownlist");
            var bottombutton = $(".divmainbutton ");
            var arrowDiv = $(".divDropDownOuterContainer").find(".divDropDownArrow");
            if ((!divLeftPanel.is(e.target) && divLeftPanel.has(e.target).length === 0)) {//&& !drpdown.is(e.target)
                //&& (!topdd.is(e.target) && topdd.has(e.target).length === 0) 
                arrowDiv.removeClass("arrow-up");
                divLeftPanel.addClass("DN");
                $(".divSearchVal").val("");
                $(".divDrpOption").show();
                e.stopPropagation();
                e.preventDefault();
               

            }
            if ((!bottombutton.is(e.target) && bottombutton.has(e.target).length === 0)) {
                $(".divuploadbuttonscontainer").addClass("DNI");
                e.stopPropagation();
                e.preventDefault();
                return;

            }
        });
    }

    Upload.prototype.BindPnCData = function () {
        var self = this;
        var sb = "";
        var obj = self.MasterData.Table;
        sb += "<div class=\"divListArea VAlign\">";
        sb += "<div class=\'divDPList\'>";
        for (var i = 0; i < obj.length; i++) {
            sb += " <div class=\"divDrpOption CP \"  data-val=\"" + obj[i].ProductCategory + "\" data-id=\"" + obj[i].ProductCategoryID + "\">";
            sb += "<div class=\"divradiobtn FL\"></div>";
            sb += "<div class=\"drpoptionlbl VAlign ellipsis tooltip \"  title=\"" + obj[i].ProductCategory + "\">" + obj[i].ProductCategory + "</div>";
            sb += "</div>";
        }
        sb += "</div></div>";

        $("#PncList").empty().append(sb.toString());
        Global.CustomScrollbar($("#PncList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#PncList .divListArea .divDrpOption .tooltip"));
        self.bindPnCClick();
    }

    Upload.prototype.bindPnCClick = function () {

        $("#PncList .divDrpOption").off('click').on('click', function () {
            if (!$(this).find(".divradiobtn").hasClass('activeradiobtn')) {
                $(this).siblings().find(".divradiobtn").removeClass('activeradiobtn');
                $(this).find(".divradiobtn").siblings().removeClass("activeradiobtn");
                $(this).siblings().removeClass('drpOptionselected');
                $(this).find(".divradiobtn").addClass('activeradiobtn');
                $(this).addClass("drpOptionselected");
                Holism.Upload.SelectionData.PnC.id = parseInt($(this).attr("data-id"));
                Holism.Upload.SelectionData.PnC.value = $(this).attr("data-val");
                $(this).closest(".divDropDownOuterContainer").find(".divDropdownlist").addClass('DN');
                $("#PnCOptionSelected>span").text(Holism.Upload.SelectionData.PnC.value);
                $("#PnCOptionSelected>span").attr('title', (Holism.Upload.SelectionData.PnC.value));
                Global.custom_tooltip($("#PnCOptionSelected .tooltip"));
            }
        })
    }

    Upload.prototype.BindPetitionerData = function () {
        var self = this;
        var sb = "";
        var obj = self.MasterData.Table1;
        sb += "<div class=\"divListArea \">";
        sb += "<div class=\"searchContainer\" type=\"Petitionersearch\">";
        sb += "<div class=\"searchBox\">";
        sb += "<input type=\"text\" class=\"divSearchVal\" id=\"divSearchBoxPetitionersearch\" placeholder=\"Search\" />";
        //  sb += "<span class=\"searchClose DNI\">X</span>";
        sb += "</div>";
        sb += "</div>";
        sb += "<div class=\'divDPList\'>";
        for (var i = 0; i < obj.length; i++) {
            sb += " <div class=\"divDrpOption CP \"  data-val=\"" + obj[i].Petitioner + "\" data-id=\"" + obj[i].PetitionerID + "\">";
            sb += "<div class=\"divradiobtn FL\"></div>";
            sb += "<div class=\"drpoptionlbl VAlign ellipsis tooltip \"  title=\"" + obj[i].Petitioner + "\">" + obj[i].Petitioner + "</div>";
            sb += "</div>";
        }
        sb += "</div></div>";
        sb += "<div class=\"divAddnewDrpOption CP FR\"><div class=\"divaddbtn FL\"></div><div class=\"drpoptionlbl VAlign\">Add Petitioner</div></div>";
        $("#PetitionerList").empty().append(sb.toString());
        Holism.Upload.Search("Petitionersearch");
        Global.CustomScrollbar($("#PetitionerList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#PetitionerList .divListArea .divDrpOption .tooltip"));
        self.bindPetitionerClick();
        self.bindAddPetitionerClick();
    }

    Upload.prototype.bindPetitionerClick = function () {

        $("#PetitionerList .divDrpOption").off('click').on('click', function () {
            if (!$(this).find(".divradiobtn").hasClass('activeradiobtn')) {
                $(this).siblings().find(".divradiobtn").removeClass('activeradiobtn');
                $(this).find(".divradiobtn").siblings().removeClass("activeradiobtn");
                $(this).siblings().removeClass('drpOptionselected');
                $(this).find(".divradiobtn").addClass('activeradiobtn');
                $(this).addClass("drpOptionselected");
                Holism.Upload.SelectionData.Petitioner.id = parseInt($(this).attr("data-id"));
                Holism.Upload.SelectionData.Petitioner.value = $(this).attr("data-val");
                $(this).closest(".divDropDownOuterContainer").find(".divDropdownlist").addClass('DN');
                $("#PetitionerOptionSelected>span").text(Holism.Upload.SelectionData.Petitioner.value);
                $("#PetitionerOptionSelected>span").attr('title', (Holism.Upload.SelectionData.Petitioner.value));
                Global.custom_tooltip($("#PetitionerOptionSelected .tooltip"));
            }
        })
    }

    Upload.prototype.bindAddPetitionerClick = function () {
        var self = this;
        $(".divAddnewDrpOption").off('click').on('click', function () {
            modalPopup.AddPetitionerpopup();
            self.BindAddbtnclick();
        });
    }

    Upload.prototype.BindAddbtnclick = function () {
        var self = this;
        $(".btn__save").off("click").on("click", function () {
            var value = $("#AddPetitioner").val();
            if (value == "") {
                $(".popup__error").text("Please enter Petitioner to Proceed");
            }
            else {
                var param = {};
                param.Input = value;
                param.Action = 1;

                // var Petitionerlist = _.uniqBy(_.orderBy(self.MasterData.Table1, "Petitioner"), "Petitioner");
                if ((_.map(self.MasterData.Table1, "Petitioner")).indexOf(value) == -1) {
                    var option = {
                        url: "Upload/LoadMasterData", async: true, data: JSON.stringify(param), onsuccess: function (data) {
                            if (Global.IsEmptyObject(data)) {
                                $(".closeButton").click();
                                modalPopup.PopupError("Error message", "An error occurred. Please try again later.");
                            } else {
                                modalPopup.showPopupMsg("Message", "Petitioner added successfully");
                                self.MasterData.Table1 = data.Table;
                                self.BindPetitionerData();
                                $("#PetitionerList").find(".divDrpOption[data-val=\"" + value + "\"]").click();
                            }
                        }
                    }

                    Global.AjaxCall(option);
                }
                else {
                    $(".popup__error").text("Petitioner Already Exists");
                }
            }
        })
    }

    Upload.prototype.Search = function (type) {
        $("#divSearchBox" + type).keyup(function () {

            $("#divSearchBox" + type).closest(".divDropDownOuterContainer").find(".divDropdownlist").find(".divDPList").find(".divDrpOption").each(function () {
                var value = $(this).attr("data-val").toUpperCase().trim();
                if (value.indexOf($("#divSearchBox" + type).val().toUpperCase().trim()) != -1) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            });
        });
    }

    Upload.prototype.BindRnCData = function () {
        var self = this;
        var sb = "";
        var obj = self.MasterData.Table2;
        sb += "<div class=\"divListArea VAlign\">";
        sb += "<div class=\"searchContainer\" type=\"RnCsearch\">";
        sb += "<div class=\"searchBox\">";
        sb += "<input type=\"text\" class=\"divSearchVal\" id=\"divSearchBoxRnCsearch\" placeholder=\"Search\" />";
        sb += "</div>";
        sb += "</div>";
        sb += "<div class=\'divDPList\'>";
        for (var i = 0; i < obj.length; i++) {
            sb += " <div class=\"divDrpOption CP \"  data-val=\"" + obj[i].Country + "\" data-id=\"" + obj[i].CountryID + "\">";
            sb += "<div class=\"divcheckboxbtn FL\"></div>";
            sb += "<div class=\"drpoptionlbl VAlign ellipsis tooltip \"  title=\"" + obj[i].Country + "\">" + obj[i].Country + "</div>";
            sb += "</div>";
        }
        sb += "</div></div>";

        $("#RnCList").empty().append(sb.toString());
        self.Search("RnCsearch");
        Global.CustomScrollbar($("#RnCList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#RnCList .divListArea .divDrpOption .tooltip"));
        self.bindRnCClick();
    }

    Upload.prototype.bindRnCClick = function () {
        var self = this;
        $("#RnCList .divDrpOption").off('click').on('click', function () {
            var obj = _.uniqBy(_.filter(self.MasterData.Table2, "CountryID"), "CountryID");
            if ($(this).find(".divcheckboxbtn").hasClass('divactivecheckboxbtn')) {
                $(this).find(".divcheckboxbtn").removeClass('divactivecheckboxbtn');

                if ($(this).attr("data-val") == "Select All") {
                    $("#RnCList").find('.divDrpOption').each(function () {
                        if ($(this).attr("data-val") != "Select All") {
                            if ($(this).find(".divcheckboxbtn").hasClass('divactivecheckboxbtn')) {
                                $(this).click();
                            }
                        }
                    })
                } else {
                    var removeIdIndex = self.SelectionData.RnC.map(function (x) { return x.id; }).indexOf(parseInt($(this).attr("data-id")));
                    self.SelectionData.RnC.splice(removeIdIndex, 1);

                }
            } else {
                $(this).find(".divcheckboxbtn").addClass('divactivecheckboxbtn');

                if ($(this).attr("data-val") == "Select All") {
                    $("#RnCList").find('.divDrpOption').each(function () {
                        if ($(this).attr("data-val") != "Select All") {
                            if (!$(this).find(".divcheckboxbtn").hasClass('divactivecheckboxbtn')) {
                                $(this).click();
                            }
                        }

                    })
                } else {
                    self.SelectionData.RnC.push({ id: parseInt($(this).attr("data-id")), value: $(this).attr("data-val") });

                }

            }
            if (self.SelectionData.RnC.length == obj.length) {
                $('#RnCList .divDrpOption[data-val="Select All"]').find(".divcheckboxbtn").addClass('divactivecheckboxbtn');
            } else {
                $('#RnCList .divDrpOption[data-val="Select All"]').find(".divcheckboxbtn").removeClass('divactivecheckboxbtn');
            }
            var container = $("#RnCOptionSelected>span");
            if (self.SelectionData.RnC.length == obj.length) {
                Holism.Upload.updateDrpdownTxt([{ id: 0, value: "Select All" }], container);
            } else {
                Holism.Upload.updateDrpdownTxt(self.SelectionData.RnC, container);
            }
            // self.updateDrpdownTxt(self.SelectionData.country, container);
            Global.destroyCustomTooltip($("#RnCOptionSelected .tooltip"));
            Global.custom_tooltip($("#RnCOptionSelected .tooltip"));

        });

    }

    Upload.prototype.updateDrpdownTxt = function (obj, objContainer) {
        if (obj.length > 0) {
            var lstItems = [];
            $.each(obj, function (idx, val) {
                lstItems.push(val.value);
            });
            var selectedList = lstItems.join(", ");
            objContainer.html(selectedList).attr('title', selectedList);
        }
        else {
            objContainer.html("Select").attr('title', "");
            objContainer.removeAttr("title");
        }

    }

    Upload.prototype.BindDatePicker = function () {
        $("#datepicker").datepicker({ dateFormat: 'dd-mm-yy' });
    }

    Upload.prototype.BindUploadiconClick = function () {
        $("#UploadData .divcommondropdowncontainer").off('click').on('click', function (event) {
            event.stopPropagation();
            event.preventDefault();
            $("#fileuploadbtn").trigger("click");
        });
        $("#fileuploadbtn").off("click").on('click', function (event) {
            event.stopPropagation();

        });
    }


    PrepareUploadFile = function (event) {

        if (event.target.files.length > 0) {
            Holism.Upload.UploadFileData = event.target.files;
            var file = Holism.Upload.UploadFileData[0];
            $(".uploadfilename").attr("title", file.name);
            $(".uploadfilename").text(file.name);
            Global.custom_tooltip($(".uploadfilename .tooltip"));
        }
    }

    Upload.prototype.BindbottomiconClick = function () {
        var self = this;
        $(".divmainbutton").off("click").on("click", function () {
            if ($(".divuploadbuttonscontainer").hasClass("DNI")) {
                $(".divuploadbuttonscontainer").removeClass("DNI");
                self.BindUploadokbtnClick();
                self.BindUploadcancelbtnClick();
            }
            else {
                $(".divuploadbuttonscontainer").addClass("DNI");
            }
        })
    }

    Upload.prototype.BindUploadokbtnClick = function () {
        var self = this;
        $(".divuploadokbutton").off("click").on("click", function (e) {
            if ($("#uploadtab").hasClass("uploadtabactive")) {
                var lstItems = [];
                $.each(self.SelectionData.RnC, function (idx, val) {
                    lstItems.push(val.id);
                });
                var selectedList = lstItems.join(", ");
                if (validateUpload(e, self)) {
                    var formData = new FormData();
                    var file = self.UploadFileData[0];
                    formData.append("uploadedfile", file);
                    formData.append("PC", self.SelectionData.PnC.id);
                    formData.append("Petitioner", self.SelectionData.Petitioner.id);
                    formData.append("RC", selectedList);
                    formData.append("Date", self.SelectionData.Date);
                    formData.append("Project", self.SelectionData.Project);
                    formData.append("SPL", self.SelectionData.SPL);
                    Global.showBusyLoader(true);
                    $.ajax({
                        type: "POST",
                        url: baseUrl + "Upload/UploadFile",
                        data: formData,
                        dataType: 'json',
                        contentType: false,
                        async: 'false',
                        processData: false,
                        success: function (response) {
                            Global.showBusyLoader(false);
                            // $(".closeBtn").click();
                            if (Global.IsEmptyObject(response)) {
                                modalPopup.UploadErrorpopup("divErrorImage", "Error!!!", "An error occurred. Please try again later.", "");
                            }
                            else {
                                if (response.Table[0].Message == "Uploaded Successfully") {
                                    modalPopup.UploadErrorpopup("divUploadImage", "uploaded", "successfully", "Data has been");
                                    $(".divUploadImage").css({ "background-size": "70%" });
                                    $(".PopupContainer").css({ "min-width": "17.5rem" });
                                    $(".divImageContainer").css({ "width": "50%" });
                                    $(".btnOK,.closeBtn").off('click').on('click', function () {
                                        location.reload();
                                    });
                                }
                                else {
                                    modalPopup.UploadErrorpopup("divErrorImage", "Error!!!", response.Table[0].Message, "")
                                    $(".btnOK,.closeBtn").off('click').on('click', function () {
                                        location.reload();
                                    });
                                }
                            }
                        },
                        error: function (error) {
                            Global.showBusyLoader(false);
                            $(".closeBtn").click();
                            modalPopup.UploadErrorpopup("divErrorImage", "Error!!!", "An error occurred. Please try again later.", "");
                        }
                    });
                }
            }
            else if ($("#updatetab").hasClass("updatetabactive")) {
                if (validateUpdate(e, Holism.Update)) {
                    var formData = new FormData();
                    if (Holism.Update.UploadFileData.length > 0) {
                        var file = Holism.Update.UploadFileData[0];
                        formData.append("uploadedfile", file);
                    }
                    formData.append("Project", Holism.Update.SelectionData.Project.value);
                    formData.append("SPL", Holism.Update.SelectionData.SPL);
                    Global.showBusyLoader(true);
                    $.ajax({
                        type: "POST",
                        url: baseUrl + "Upload/UpdateFile",
                        data: formData,
                        dataType: 'json',
                        contentType: false,
                        async: 'false',
                        processData: false,
                        success: function (response) {
                            Global.showBusyLoader(false);
                            // $(".closeBtn").click();
                            if (Global.IsEmptyObject(response)) {
                                modalPopup.UploadErrorpopup("divErrorImage", "Error!!!", "An error occurred. Please try again later.", "");
                            }
                            else {
                                if (response.Table[0].Message == "Updated Successfully") {
                                    modalPopup.UploadErrorpopup("divUploadImage", "updated", "successfully", "Data has been");
                                    $(".divUploadImage").css({ "background-size": "70%" });
                                    $(".PopupContainer").css({ "min-width": "17.5rem" });
                                    $(".divImageContainer").css({ "width": "50%" });
                                    $(".btnOK,.closeBtn").off('click').on('click', function () {
                                        location.reload();
                                    });
                                }
                                else {
                                    modalPopup.UploadErrorpopup("divErrorImage", "Error!!!", response.Table[0].Message, "");
                                    $(".btnOK,.closeBtn").off('click').on('click', function () {
                                        location.reload();
                                    });
                                }
                            }
                        },
                        error: function (error) {
                            Global.showBusyLoader(false);
                            $(".closeBtn").click();
                            modalPopup.UploadErrorpopup("divErrorImage", "Error!!!", "An error occurred. Please try again later.", "");
                        }
                    });
                }
            }
            else if ($("#deletetab").hasClass("deletetabactive")) {
                if (validateDelete(e, Holism.Delete)) {
                    modalPopup.DeleteAlertpopup("divDeleteAlertImage", "Are you sure you want to delete the project?", "");
                    $(".btn__save").off("click").on("click", function () {
                        var param = {};
                        param.Project = Holism.Delete.SelectionData.Project.value;
                        Global.showBusyLoader(true);
                        $.ajax({
                            type: "POST",
                            url: baseUrl + "Upload/DeleteFile",
                            async: true,
                            data: JSON.stringify(param),
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            success: function (response) {
                                Global.showBusyLoader(false);
                                // $(".closeBtn").click();
                                if (Global.IsEmptyObject(response)) {
                                    modalPopup.UploadErrorpopup("divErrorImage", "Error!!!", "An error occurred. Please try again later.", "");
                                }
                                else {
                                    if (response.Table[0].Message == "Deleted Successfully") {
                                        modalPopup.UploadErrorpopup("divDeleteSuccessImage", "Success!!!", "Project Deleted Successfully", "");
                                        $(".bluetext").css({ "margin-top": "4%" });
                                        $(".btnOK,.closeBtn").off('click').on('click', function () {
                                            location.reload();
                                        });
                                    }
                                    else {
                                        modalPopup.UploadErrorpopup("divErrorImage", "Error!!!", "An error occurred. Please try again later.", "");
                                        $(".btnOK,.closeBtn").off('click').on('click', function () {
                                            location.reload();
                                        });
                                    }
                                }
                            },
                            error: function (error) {
                                Global.showBusyLoader(false);
                                $(".closeBtn").click();
                                modalPopup.UploadErrorpopup("divErrorImage", "Error!!!", "An error occurred. Please try again later.", "");
                            }
                        });
                    });

                }
            }

        })
    }

    Upload.prototype.BindUploadcancelbtnClick = function () {
        var self = this;
        $(".divuploadcancelbutton").off("click").on("click", function (e) {
            if (!$("#uploadtab").hasClass("uploadtabactive"))
                location.reload();
            $(".divuploadbuttonscontainer").addClass("DNI");
        })
    }

    validateUpload = function (e, self) {
        var validate = true;
        self.SelectionData.Date = $("#datepicker").val();
        self.SelectionData.Project = $("#ProjectName").val();
        self.SelectionData.SPL = $("#SPLinput").val();
        if (self.SelectionData.PnC.id == null) {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#Pnc .divcommondropdowncontainer"), "Please select product and category to proceed", true);

        }
        if (self.SelectionData.Petitioner.id == null) {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#Petitioner .divcommondropdowncontainer"), "Please select petitioner to proceed", true);
        }
        if (self.SelectionData.RnC.length == 0) {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#RnC .divcommondropdowncontainer"), "Please select Country to proceed", true);
        }

        if (self.SelectionData.Date == "") {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#DOS .divcommondropdowncontainer"), "Please select Date to proceed", true);
        }
        if (self.SelectionData.Project == "") {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#Project .divcommondropdowncontainer"), "Please input project name to proceed", true);
        }
        if (self.UploadFileData.length == 0) {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#UploadData .divcommondropdowncontainer"), "Please Upload a file to proceed", true);
        }
        if (self.SelectionData.SPL == "") {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#SPL .divcommondropdowncontainer"), "Please input Sharepoint link to proceed", true);
        }

        if ((_.map(self.MasterData.Table3, "ProjectName")).indexOf(self.SelectionData.Project) > -1) {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#Project .divcommondropdowncontainer"), "Project already exists. Please input different name to proceed", true);
        }

        if (self.UploadFileData.length > 0) {
         
            var namearr = (self.UploadFileData[0].name.toLowerCase()).split('.');
            if (!(namearr[namearr.length - 1] == "xls" || namearr[namearr.length - 1]=="xlsx"))
            {
           
                validate = false;
                modalPopup.showErrorCustomPopup(e, $("#UploadData .divcommondropdowncontainer"), "Please Upload only excel file", true);
            }
        }

        return validate;
    }

    Upload.prototype.BindDownloadiconClick = function () {
        $("#DownloadData .divcommondropdowncontainer").off("click").on("click", function () {
            window.location.href = baseUrl + "Templates/Upload Template.xlsx";
        })
    }

    Upload.prototype.BindtabsClick = function () {
        var self = this
        $(".toppaneltabs").off("click").on("click", function () {
            var id = $(this).attr("id");
            $(".divcommontabcontainer").addClass("DN");
            $(".div" + id + "maincontainer").removeClass("DN");
            $(".toppaneltabs").removeClass("uploadtabactive updatetabactive deletetabactive")
            $(this).addClass(id + "active");
            self.ActiveModule = id;
            sessionStorage.setItem('Module', self.ActiveModule);
        })
    }

    Upload.prototype.BindUpdateClickEvents = function () {
        doUpdatepagesettings();
    }

    Upload.prototype.BindDeleteClickEvents = function () {
        doDeletepagesettings();
    }

})(Holism || {})