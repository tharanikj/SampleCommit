(function (Holism) {
    Holism.Update = new Update();
    doUpdatepagesettings = function () {
        Holism.Update.BindClickEvents();

    }

    function Update() {
        this.SelectionData = {
            PnC: { id: null, value: null },
            Petitioner: { id: null, value: null },
            RnC: [],
            Date: "",
            Project: { id: null, value: null },
            SPL: ""

        };
        this.UploadFileData = [];
        this.TempMasterData = [];
       
    }

    Update.prototype.BindClickEvents = function () {
        var self = this;
        self.BindPnCData(Holism.Upload.MasterData.Table3);
        self.BindPetitionerData(Holism.Upload.MasterData.Table3);
        self.BindRnCData(Holism.Upload.MasterData.Table3);
        self.BindProjectData(Holism.Upload.MasterData.Table3);
        self.BindDateData(Holism.Upload.MasterData.Table3);
        self.TempMasterData = Holism.Upload.MasterData.Table3;
        self.BindDownloadiconClick();
        self.BindUpdateiconClick();
       
       
    }

    Update.prototype.BindPnCData = function (dataobj) {
        var self = this;
        var sb = "";
        var pncfilterobj = _.map(_.uniqBy(_.filter(dataobj, "ProductCategoryID"), "ProductCategoryID"), "ProductCategoryID");
        var obj = _.filter(Holism.Upload.MasterData.Table, function (o) { return pncfilterobj.indexOf(o.ProductCategoryID) > -1 });
        sb += "<div class=\"divListArea VAlign\">";
        sb += "<div class=\'divDPList\'>";
        for (var i = 0; i < obj.length; i++) {
            sb += " <div class=\"divDrpOption CP \"  data-val=\"" + obj[i].ProductCategory + "\" data-id=\"" + obj[i].ProductCategoryID + "\">";
            sb += "<div class=\"divradiobtn FL\"></div>";
            sb += "<div class=\"drpoptionlbl VAlign ellipsis tooltip \"  title=\"" + obj[i].ProductCategory + "\">" + obj[i].ProductCategory + "</div>";
            sb += "</div>";
        }
        sb += "</div></div>";

        $("#UpdatePncList").empty().append(sb.toString());
        Global.CustomScrollbar($("#UpdatePncList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#UpdatePncList .divListArea .divDrpOption .tooltip"));
        self.bindPnCClick();
    }

    Update.prototype.bindPnCClick = function () {
        var self = this;
        $("#UpdatePncList .divDrpOption").off('click').on('click', function () {
            if (!$(this).find(".divradiobtn").hasClass('activeradiobtn')) {
                $(this).siblings().find(".divradiobtn").removeClass('activeradiobtn');
                $(this).find(".divradiobtn").siblings().removeClass("activeradiobtn");
                $(this).siblings().removeClass('drpOptionselected');
                $(this).find(".divradiobtn").addClass('activeradiobtn');
                $(this).addClass("drpOptionselected");
                Holism.Update.SelectionData.PnC.id = parseInt($(this).attr("data-id"));
                Holism.Update.SelectionData.PnC.value = $(this).attr("data-val");
                $(this).closest(".divDropDownOuterContainer").find(".divDropdownlist").addClass('DN');
                $("#UpdatePnCOptionSelected>span").text(Holism.Update.SelectionData.PnC.value);
                $("#UpdatePnCOptionSelected>span").attr('title', (Holism.Update.SelectionData.PnC.value));
                Global.custom_tooltip($("#UpdatePnCOptionSelected .tooltip"));
                self.UpdateAllDropdowndata();
            }
        })
    }

    Update.prototype.BindPetitionerData = function (dataobj) {
        var self = this;
        var sb = "";

        var petitionerfilterobj = _.map(_.uniqBy(_.filter(dataobj, "PetitionerID"), "PetitionerID"), "PetitionerID");
        var obj = _.filter(Holism.Upload.MasterData.Table1, function (o) { return petitionerfilterobj.indexOf(o.PetitionerID) > -1 });
        sb += "<div class=\"divListArea \">";
        sb += "<div class=\"searchContainer\" type=\"UpdatePetitionersearch\">";
        sb += "<div class=\"searchBox\">";
        sb += "<input type=\"text\" class=\"divSearchVal\" id=\"divSearchBoxUpdatePetitionersearch\" placeholder=\"Search\" />";
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
        //  sb += "<div class=\"divAddnewDrpOption CP FR\"><div class=\"divaddbtn FL\"></div><div class=\"drpoptionlbl VAlign\">Add Petitioner</div></div>";
        $("#UpdatePetitionerList").empty().append(sb.toString());
        Holism.Upload.Search("UpdatePetitionersearch");
        Global.CustomScrollbar($("#UpdatePetitionerList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#UpdatePetitionerList .divListArea .divDrpOption .tooltip"));
        self.bindPetitionerClick();
        //  self.bindAddPetitionerClick();
    }

    Update.prototype.bindPetitionerClick = function () {
        var self = this;
        $("#UpdatePetitionerList .divDrpOption").off('click').on('click', function () {
            if (!$(this).find(".divradiobtn").hasClass('activeradiobtn')) {
                $(this).siblings().find(".divradiobtn").removeClass('activeradiobtn');
                $(this).find(".divradiobtn").siblings().removeClass("activeradiobtn");
                $(this).siblings().removeClass('drpOptionselected');
                $(this).find(".divradiobtn").addClass('activeradiobtn');
                $(this).addClass("drpOptionselected");
                Holism.Update.SelectionData.Petitioner.id = parseInt($(this).attr("data-id"));
                Holism.Update.SelectionData.Petitioner.value = $(this).attr("data-val");
                $(this).closest(".divDropDownOuterContainer").find(".divDropdownlist").addClass('DN');
                $("#UpdatePetitionerOptionSelected>span").text(Holism.Update.SelectionData.Petitioner.value);
                $("#UpdatePetitionerOptionSelected>span").attr('title', (Holism.Update.SelectionData.Petitioner.value));
                Global.custom_tooltip($("#UpdatePetitionerOptionSelected .tooltip"));
                self.UpdateAllDropdowndata();
            }
        })
    }

    Update.prototype.BindRnCData = function (dataobj) {
        var self = this;
        var sb = "";
        // var dataobj = Holism.Upload.MasterData.Table3;
        var rncfilterobj = _.map(_.uniqBy(_.filter(dataobj, "Country"), "Country"), "Country");
        var countrylist = "";
        for (var rnc = 0; rnc < rncfilterobj.length; rnc++) {
            countrylist += (rncfilterobj[rnc] + ", ");
        }
        countrylist = countrylist.split(", ");
        var obj = _.filter(Holism.Upload.MasterData.Table2, function (o) { return countrylist.indexOf((o.CountryID).toString()) > -1 });
        //  var obj = self.MasterData.Table2;
        sb += "<div class=\"divListArea VAlign\">";
        sb += "<div class=\"searchContainer\" type=\"UpdateRnCsearch\">";
        sb += "<div class=\"searchBox\">";
        sb += "<input type=\"text\" class=\"divSearchVal\" id=\"divSearchBoxUpdateRnCsearch\" placeholder=\"Search\" />";
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

        $("#UpdateRnCList").empty().append(sb.toString());
        Holism.Upload.Search("UpdateRnCsearch");
        Global.CustomScrollbar($("#UpdateRnCList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#UpdateRnCList .divListArea .divDrpOption .tooltip"));
        self.bindRnCClick();
    }

    Update.prototype.bindRnCClick = function () {
        var self = this;
        $("#UpdateRnCList .divDrpOption").off('click').on('click', function () {

            //  var obj = self.MasterData.Table2;
            if ($(this).find(".divcheckboxbtn").hasClass('divactivecheckboxbtn')) {
                $(this).find(".divcheckboxbtn").removeClass('divactivecheckboxbtn');

           
                var removeIdIndex = self.SelectionData.RnC.map(function (x) { return x.id; }).indexOf(parseInt($(this).attr("data-id")));
                self.SelectionData.RnC.splice(removeIdIndex, 1);

               
            } else {
                $(this).find(".divcheckboxbtn").addClass('divactivecheckboxbtn');

             
                self.SelectionData.RnC.push({ id: parseInt($(this).attr("data-id")), value: $(this).attr("data-val") });

              

            }
          
            var container = $("#UpdateRnCOptionSelected>span");
          
            Holism.Upload.updateDrpdownTxt(self.SelectionData.RnC, container);
         
            Global.destroyCustomTooltip($("#UpdateRnCOptionSelected .tooltip"));
            Global.custom_tooltip($("#UpdateRnCOptionSelected .tooltip"));
            self.UpdateAllDropdowndata();
        });

    }

    Update.prototype.BindUpdateiconClick = function () {
        $("#UpdateUploadData .divcommondropdowncontainer").off('click').on('click', function () {
            $("#Updatefileuploadbtn").click();
        });
        $("#Updatefileuploadbtn").off("click").on('click', function (event) {
            event.stopPropagation();

        });
    }

    PrepareUpdateFile = function (event) {

        if (event.target.files.length > 0) {
            Holism.Update.UploadFileData = event.target.files;
            var file = Holism.Update.UploadFileData[0];
            $(".updatefilename").attr("title", file.name);
            $(".updatefilename").text(file.name);
            Global.custom_tooltip($(".updatefilename .tooltip"));
        }
    }

    

    validateUpdate = function (e, self) {
        var validate = true;
        self.SelectionData.SPL = $("#UpdateSPLinput").val();

        if (self.SelectionData.Project.value == "") {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#UpdateProject .divcommondropdowncontainer"), "Please Select Project to proceed", true);
        }
        //if (self.UploadFileData.length == 0) {
        //    validate = false;
        //    modalPopup.showErrorCustomPopup(e, $("#UploadData .divcommondropdowncontainer"), "Please Upload a file to proceed", true);
        //}
        if (self.SelectionData.SPL == "") {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#UpdateSPL .divcommondropdowncontainer"), "Please input Sharepoint link to proceed", true);
        }
        if (self.UploadFileData.length > 0) {

            var namearr = (self.UploadFileData[0].name.toLowerCase()).split('.');
            if (!(namearr[namearr.length - 1] == "xls" || namearr[namearr.length - 1] == "xlsx")) {

                validate = false;
                modalPopup.showErrorCustomPopup(e, $("#UpdateUploadData .divcommondropdowncontainer"), "Please Upload only excel file", true);
            }
        }


        return validate;
    }

    Update.prototype.BindDownloadiconClick = function () {
        var self = this;
        $("#UpdateDownloadData .divcommondropdowncontainer").off("click").on("click", function () {
            window.location.href = baseUrl + "TempUpload/" + self.SelectionData.Project.value + ".xlsx";
        })
    }

    Update.prototype.BindProjectData = function (obj) {
        var self = this;
        var sb = "";

        sb += "<div class=\"divListArea \">";
        sb += "<div class=\"searchContainer\" type=\"Projectsearch\">";
        sb += "<div class=\"searchBox\">";
        sb += "<input type=\"text\" class=\"divSearchVal\" id=\"divSearchBoxProjectsearch\" placeholder=\"Search\" />";
        //  sb += "<span class=\"searchClose DNI\">X</span>";
        sb += "</div>";
        sb += "</div>";
        sb += "<div class=\'divDPList\'>";
        for (var i = 0; i < obj.length; i++) {
            sb += " <div class=\"divDrpOption CP \"  data-val=\"" + obj[i].ProjectName + "\" data-id=\"" + obj[i].ProjectId + "\">";
            sb += "<div class=\"divradiobtn FL\"></div>";
            sb += "<div class=\"drpoptionlbl VAlign ellipsis tooltip \"  title=\"" + obj[i].ProjectName + "\">" + obj[i].ProjectName + "</div>";
            sb += "</div>";
        }
        sb += "</div></div>";
        //  sb += "<div class=\"divAddnewDrpOption CP FR\"><div class=\"divaddbtn FL\"></div><div class=\"drpoptionlbl VAlign\">Add Petitioner</div></div>";
        $("#UpdateProjectList").empty().append(sb.toString());
        Holism.Upload.Search("Projectsearch");
        Global.CustomScrollbar($("#UpdateProjectList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#UpdateProjectList .divListArea .divDrpOption .tooltip"));
        self.bindProjectClick();
        //  self.bindAddPetitionerClick();
    }

    Update.prototype.bindProjectClick = function () {
        var self = this;
        $("#UpdateProjectList .divDrpOption").off('click').on('click', function () {
            if (!$(this).find(".divradiobtn").hasClass('activeradiobtn')) {
                $(this).siblings().find(".divradiobtn").removeClass('activeradiobtn');
                $(this).find(".divradiobtn").siblings().removeClass("activeradiobtn");
                $(this).siblings().removeClass('drpOptionselected');
                $(this).find(".divradiobtn").addClass('activeradiobtn');
                $(this).addClass("drpOptionselected");
                Holism.Update.SelectionData.Project.id = parseInt($(this).attr("data-id"));
                Holism.Update.SelectionData.Project.value = $(this).attr("data-val");
                $(this).closest(".divDropDownOuterContainer").find(".divDropdownlist").addClass('DN');
                $("#UpdateProjectOptionSelected>span").text(Holism.Update.SelectionData.Project.value);
                $("#UpdateProjectOptionSelected>span").attr('title', (Holism.Update.SelectionData.Project.value));
                $("#UpdateDownloadData .divuploadInputcontainer").text(Holism.Update.SelectionData.Project.value + ".xlsx");
                $("#UpdateDownloadData .divuploadInputcontainer").attr("title", Holism.Update.SelectionData.Project.value + ".xlsx")
                Global.custom_tooltip($("#UpdateDownloadData .divuploadInputcontainer.tooltip"));
                Global.custom_tooltip($("#UpdateProjectOptionSelected .tooltip"));
                self.UpdateAllDropdowndata();
                var spl = _.filter(self.TempMasterData, { ProjectName: Holism.Update.SelectionData.Project.value })[0].SharePointLink;
                $("#UpdateSPLinput").val(spl);
                $("#UpdateDownloadData .divcommondropdowncontainer").removeClass("disable");
               // self.BindDownloadiconClick();
            }
        })
    }

    Update.prototype.BindDateData = function (obj) {
        var obj = _.uniqBy(_.filter(obj, "TimePeriod"), "TimePeriod");
        var self = this;
        var sb = "";
        sb += "<div class=\"divListArea \">";
        sb += "<div class=\"searchContainer\" type=\"Datesearch\">";
        sb += "<div class=\"searchBox\">";
        sb += "<input type=\"text\" class=\"divSearchVal\" id=\"divSearchBoxDatesearch\" placeholder=\"Search\" />";
        //  sb += "<span class=\"searchClose DNI\">X</span>";
        sb += "</div>";
        sb += "</div>";
        sb += "<div class=\'divDPList\'>";
        for (var i = 0; i < obj.length; i++) {
            var datetext = ((obj[i].TimePeriod).split('T')[0]).split('-').reverse().join('-');
            sb += " <div class=\"divDrpOption CP \"  data-val=\"" + obj[i].TimePeriod + "\" >";
            sb += "<div class=\"divradiobtn FL\"></div>";
            sb += "<div class=\"drpoptionlbl VAlign ellipsis tooltip \"  title=\"" + datetext + "\">" + datetext + "</div>";
            sb += "</div>";
        }
        sb += "</div></div>";
        //  sb += "<div class=\"divAddnewDrpOption CP FR\"><div class=\"divaddbtn FL\"></div><div class=\"drpoptionlbl VAlign\">Add Petitioner</div></div>";
        $("#UpdateDateList").empty().append(sb.toString());
        Holism.Upload.Search("Datesearch");
        Global.CustomScrollbar($("#UpdateDateList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#UpdateDateList .divListArea .divDrpOption .tooltip"));
        self.bindDateClick();
        //  self.bindAddPetitionerClick();
    }

    Update.prototype.bindDateClick = function () {
        var self = this;
        $("#UpdateDateList .divDrpOption").off('click').on('click', function () {
            if (!$(this).find(".divradiobtn").hasClass('activeradiobtn')) {
                $(this).siblings().find(".divradiobtn").removeClass('activeradiobtn');
                $(this).find(".divradiobtn").siblings().removeClass("activeradiobtn");
                $(this).siblings().removeClass('drpOptionselected');
                $(this).find(".divradiobtn").addClass('activeradiobtn');
                $(this).addClass("drpOptionselected");
                Holism.Update.SelectionData.Date = $(this).attr("data-val");
                var datetext = ((Holism.Update.SelectionData.Date).split('T')[0]).split('-').reverse().join('-');
                $(this).closest(".divDropDownOuterContainer").find(".divDropdownlist").addClass('DN');
                $("#UpdateDateOptionSelected>span").text(datetext);
                $("#UpdateDateOptionSelected>span").attr('title', (datetext));
                Global.custom_tooltip($("#UpdateDateOptionSelected .tooltip"));
                self.UpdateAllDropdowndata();
            }
        })
    }

    Update.prototype.UpdateAllDropdowndata = function () {
        var self = this;
        var obj = self.TempMasterData;
        if (self.SelectionData.PnC.id != null) {
            obj = _.filter(obj, { "ProductCategoryID": self.SelectionData.PnC.id });
        }
        if (self.SelectionData.Petitioner.id != null) {
            obj = _.filter(obj, { "PetitionerID": self.SelectionData.Petitioner.id });
        }
        if (self.SelectionData.RnC.length > 0) {
            for (var i = 0; i < self.SelectionData.RnC.length; i++) {
                obj = _.filter(obj, function (o) { return (o.Country).indexOf((self.SelectionData.RnC[i].id))>-1 });
            }
        }
        if (self.SelectionData.Date != "") {
            obj = _.filter(obj, { "TimePeriod": self.SelectionData.Date });
        }

        if (self.SelectionData.Project.id != null) {
            obj = _.filter(obj, { "ProjectId": self.SelectionData.Project.id });
        }
        self.TempMasterData = obj;
        self.BindPnCData(obj);
        self.BindPetitionerData(obj);
        self.BindRnCData(obj);
        self.BindDateData(obj);
        self.BindProjectData(obj);

        if (self.SelectionData.PnC.id != null) {
            $("#UpdatePncList").find(".divDrpOption[data-id=" + self.SelectionData.PnC.id + "]").find(".divradiobtn").addClass('activeradiobtn');
            $("#UpdatePncList").find(".divDrpOption[data-id=" + self.SelectionData.PnC.id + "]").addClass("drpOptionselected");


        }
        if (self.SelectionData.Petitioner.id != null) {
            $("#UpdatePetitionerList").find(".divDrpOption[data-id=" + self.SelectionData.Petitioner.id + "]").find(".divradiobtn").addClass('activeradiobtn');
            $("#UpdatePetitionerList").find(".divDrpOption[data-id=" + self.SelectionData.Petitioner.id + "]").addClass("drpOptionselected");

        }
        if (self.SelectionData.RnC.length > 0) {
            for (var i = 0; i < self.SelectionData.RnC.length; i++) {
                $("#UpdateRnCList").find(".divDrpOption[data-id=" + self.SelectionData.RnC[i].id + "]").find(".divcheckboxbtn").addClass('divactivecheckboxbtn');

            }
        }
        if (self.SelectionData.Date != "") {

            $("#UpdateDateList").find(".divDrpOption[data-val=\"" + self.SelectionData.Date + "\"]").find(".divradiobtn").addClass('activeradiobtn');
            $("#UpdateDateList").find(".divDrpOption[data-val=\"" + self.SelectionData.Date + "\"]").addClass("drpOptionselected");

        }

        if (self.SelectionData.Project.id != null) {
            $("#UpdateProjectList").find(".divDrpOption[data-id=" + self.SelectionData.Project.id + "]").find(".divradiobtn").addClass('activeradiobtn');
            $("#UpdateProjectList").find(".divDrpOption[data-id=" + self.SelectionData.Project.id + "]").addClass("drpOptionselected");

        }

    }

})(Holism || {})