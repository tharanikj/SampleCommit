(function (Holism) {
    Holism.Delete = new Delete();
    doDeletepagesettings = function () {
        Holism.Delete.BindClickEvents();

    }

    function Delete() {
        this.SelectionData = {
            PnC: { id: null, value: null },
            Petitioner: { id: null, value: null },
            RnC: [],
            Date: "",
            Project: { id: null, value: null },
        };
        this.TempMasterData = [];
    }

    Delete.prototype.BindClickEvents = function () {
        var self = this;
        self.BindPnCData(Holism.Upload.MasterData.Table3);
        self.BindPetitionerData(Holism.Upload.MasterData.Table3);
        self.BindRnCData(Holism.Upload.MasterData.Table3);
        self.BindProjectData(Holism.Upload.MasterData.Table3);
        self.BindDateData(Holism.Upload.MasterData.Table3);
        self.TempMasterData = Holism.Upload.MasterData.Table3;
    }

    Delete.prototype.BindPnCData = function (dataobj) {
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

        $("#DeletePncList").empty().append(sb.toString());
        Global.CustomScrollbar($("#DeletePncList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#DeletePncList .divListArea .divDrpOption .tooltip"));
        self.bindPnCClick();
    }

    Delete.prototype.bindPnCClick = function () {
        var self = this;
        $("#DeletePncList .divDrpOption").off('click').on('click', function () {
            if (!$(this).find(".divradiobtn").hasClass('activeradiobtn')) {
                $(this).siblings().find(".divradiobtn").removeClass('activeradiobtn');
                $(this).find(".divradiobtn").siblings().removeClass("activeradiobtn");
                $(this).siblings().removeClass('drpOptionselected');
                $(this).find(".divradiobtn").addClass('activeradiobtn');
                $(this).addClass("drpOptionselected");
                Holism.Delete.SelectionData.PnC.id = parseInt($(this).attr("data-id"));
                Holism.Delete.SelectionData.PnC.value = $(this).attr("data-val");
                $(this).closest(".divDropDownOuterContainer").find(".divDropdownlist").addClass('DN');
                $("#DeletePnCOptionSelected>span").text(Holism.Delete.SelectionData.PnC.value);
                $("#DeletePnCOptionSelected>span").attr('title', (Holism.Delete.SelectionData.PnC.value));
                Global.custom_tooltip($("#DeletePnCOptionSelected .tooltip"));
                self.UpdateAllDropdowndata();
            }
        })
    }

    Delete.prototype.BindPetitionerData = function (dataobj) {
        var self = this;
        var sb = "";

        var petitionerfilterobj = _.map(_.uniqBy(_.filter(dataobj, "PetitionerID"), "PetitionerID"), "PetitionerID");
        var obj = _.filter(Holism.Upload.MasterData.Table1, function (o) { return petitionerfilterobj.indexOf(o.PetitionerID) > -1 });
        sb += "<div class=\"divListArea \">";
        sb += "<div class=\"searchContainer\" type=\"DeletePetitionersearch\">";
        sb += "<div class=\"searchBox\">";
        sb += "<input type=\"text\" class=\"divSearchVal\" id=\"divSearchBoxDeletePetitionersearch\" placeholder=\"Search\" />";
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
        $("#DeletePetitionerList").empty().append(sb.toString());
        Holism.Upload.Search("DeletePetitionersearch");
        Global.CustomScrollbar($("#DeletePetitionerList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#DeletePetitionerList .divListArea .divDrpOption .tooltip"));
        self.bindPetitionerClick();
        //  self.bindAddPetitionerClick();
    }

    Delete.prototype.bindPetitionerClick = function () {
        var self = this;
        $("#DeletePetitionerList .divDrpOption").off('click').on('click', function () {
            if (!$(this).find(".divradiobtn").hasClass('activeradiobtn')) {
                $(this).siblings().find(".divradiobtn").removeClass('activeradiobtn');
                $(this).find(".divradiobtn").siblings().removeClass("activeradiobtn");
                $(this).siblings().removeClass('drpOptionselected');
                $(this).find(".divradiobtn").addClass('activeradiobtn');
                $(this).addClass("drpOptionselected");
                Holism.Delete.SelectionData.Petitioner.id = parseInt($(this).attr("data-id"));
                Holism.Delete.SelectionData.Petitioner.value = $(this).attr("data-val");
                $(this).closest(".divDropDownOuterContainer").find(".divDropdownlist").addClass('DN');
                $("#DeletePetitionerOptionSelected>span").text(Holism.Delete.SelectionData.Petitioner.value);
                $("#DeletePetitionerOptionSelected>span").attr('title', (Holism.Delete.SelectionData.Petitioner.value));
                Global.custom_tooltip($("#DeletePetitionerOptionSelected .tooltip"));
                self.UpdateAllDropdowndata();
            }
        })
    }

    Delete.prototype.BindRnCData = function (dataobj) {
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
        sb += "<div class=\"searchContainer\" type=\"DeleteRnCsearch\">";
        sb += "<div class=\"searchBox\">";
        sb += "<input type=\"text\" class=\"divSearchVal\" id=\"divSearchBoxDeleteRnCsearch\" placeholder=\"Search\" />";
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

        $("#DeleteRnCList").empty().append(sb.toString());
        Holism.Upload.Search("DeleteRnCsearch");
        Global.CustomScrollbar($("#DeleteRnCList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#DeleteRnCList .divListArea .divDrpOption .tooltip"));
        self.bindRnCClick();
    }

    Delete.prototype.bindRnCClick = function () {
        var self = this;
        $("#DeleteRnCList .divDrpOption").off('click').on('click', function () {

            //  var obj = self.MasterData.Table2;
            if ($(this).find(".divcheckboxbtn").hasClass('divactivecheckboxbtn')) {
                $(this).find(".divcheckboxbtn").removeClass('divactivecheckboxbtn');
                var removeIdIndex = self.SelectionData.RnC.map(function (x) { return x.id; }).indexOf(parseInt($(this).attr("data-id")));
                self.SelectionData.RnC.splice(removeIdIndex, 1);

            } else {
                $(this).find(".divcheckboxbtn").addClass('divactivecheckboxbtn');

                self.SelectionData.RnC.push({ id: parseInt($(this).attr("data-id")), value: $(this).attr("data-val") });



            }

            var container = $("#DeleteRnCOptionSelected>span");

            Holism.Upload.updateDrpdownTxt(self.SelectionData.RnC, container);

            Global.destroyCustomTooltip($("#DeleteRnCOptionSelected .tooltip"));
            Global.custom_tooltip($("#DeleteRnCOptionSelected .tooltip"));
            self.UpdateAllDropdowndata();
        });

    }

    Delete.prototype.BindProjectData = function (obj) {
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
        $("#DeleteProjectList").empty().append(sb.toString());
        Holism.Upload.Search("Projectsearch");
        Global.CustomScrollbar($("#DeleteProjectList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#DeleteProjectList .divListArea .divDrpOption .tooltip"));
        self.bindProjectClick();
        //  self.bindAddPetitionerClick();
    }

    Delete.prototype.bindProjectClick = function () {
        var self = this;
        $("#DeleteProjectList .divDrpOption").off('click').on('click', function () {
            if (!$(this).find(".divradiobtn").hasClass('activeradiobtn')) {
                $(this).siblings().find(".divradiobtn").removeClass('activeradiobtn');
                $(this).find(".divradiobtn").siblings().removeClass("activeradiobtn");
                $(this).siblings().removeClass('drpOptionselected');
                $(this).find(".divradiobtn").addClass('activeradiobtn');
                $(this).addClass("drpOptionselected");
                Holism.Delete.SelectionData.Project.id = parseInt($(this).attr("data-id"));
                Holism.Delete.SelectionData.Project.value = $(this).attr("data-val");
                $(this).closest(".divDropDownOuterContainer").find(".divDropdownlist").addClass('DN');
                $("#DeleteProjectOptionSelected>span").text(Holism.Delete.SelectionData.Project.value);
                $("#DeleteProjectOptionSelected>span").attr('title', (Holism.Delete.SelectionData.Project.value));
                $("#DeleteDownloadData .divuploadInputcontainer").text(Holism.Delete.SelectionData.Project.value + ".xlsx");
                Global.custom_tooltip($("#DeleteProjectOptionSelected .tooltip"));
                self.UpdateAllDropdowndata();

            }
        })
    }

    Delete.prototype.BindDateData = function (obj) {
        var obj = _.uniqBy(_.filter(obj, "TimePeriod"), "TimePeriod");
        var self = this;
        var sb = "";
        sb += "<div class=\"divListArea \">";
        sb += "<div class=\"searchContainer\" type=\"DeleteDatesearch\">";
        sb += "<div class=\"searchBox\">";
        sb += "<input type=\"text\" class=\"divSearchVal\" id=\"divSearchBoxDeleteDatesearch\" placeholder=\"Search\" />";
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
        $("#DeleteDateList").empty().append(sb.toString());
        Holism.Upload.Search("DeleteDatesearch");
        Global.CustomScrollbar($("#DeleteDateList .divListArea .divDPList"), "inside", "y");
        Global.custom_tooltip($("#DeleteDateList .divListArea .divDrpOption .tooltip"));
        self.bindDateClick();
        //  self.bindAddPetitionerClick();
    }

    Delete.prototype.bindDateClick = function () {
        var self = this;
        $("#DeleteDateList .divDrpOption").off('click').on('click', function () {
            if (!$(this).find(".divradiobtn").hasClass('activeradiobtn')) {
                $(this).siblings().find(".divradiobtn").removeClass('activeradiobtn');
                $(this).find(".divradiobtn").siblings().removeClass("activeradiobtn");
                $(this).siblings().removeClass('drpOptionselected');
                $(this).find(".divradiobtn").addClass('activeradiobtn');
                $(this).addClass("drpOptionselected");
                Holism.Delete.SelectionData.Date = $(this).attr("data-val");
                $(this).closest(".divDropDownOuterContainer").find(".divDropdownlist").addClass('DN');
                var datetext = ((Holism.Update.SelectionData.Date).split('T')[0]).split('-').reverse().join('-');
                $("#DeleteDateOptionSelected>span").text(datetxt);
                $("#DeleteDateOptionSelected>span").attr('title', (datetxt));
                Global.custom_tooltip($("#DeleteDateOptionSelected .tooltip"));
                self.UpdateAllDropdowndata();
            }
        })
    }

    Delete.prototype.UpdateAllDropdowndata = function () {
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
                obj = _.filter(obj, function (o) { return (o.Country).indexOf((self.SelectionData.RnC[i].id)) > -1 });
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
            $("#DeletePncList").find(".divDrpOption[data-id=" + self.SelectionData.PnC.id + "]").find(".divradiobtn").addClass('activeradiobtn');
            $("#DeletePncList").find(".divDrpOption[data-id=" + self.SelectionData.PnC.id + "]").addClass("drpOptionselected");


        }
        if (self.SelectionData.Petitioner.id != null) {
            $("#DeletePetitionerList").find(".divDrpOption[data-id=" + self.SelectionData.Petitioner.id + "]").find(".divradiobtn").addClass('activeradiobtn');
            $("#DeletePetitionerList").find(".divDrpOption[data-id=" + self.SelectionData.Petitioner.id + "]").addClass("drpOptionselected");

        }
        if (self.SelectionData.RnC.length > 0) {
            for (var i = 0; i < self.SelectionData.RnC.length; i++) {
                $("#DeleteRnCList").find(".divDrpOption[data-id=" + self.SelectionData.RnC[i].id + "]").find(".divcheckboxbtn").addClass('divactivecheckboxbtn');

            }
        }
        if (self.SelectionData.Date != "") {

            $("#DeleteDateList").find(".divDrpOption[data-val=\"" + self.SelectionData.Date + "\"]").find(".divradiobtn").addClass('activeradiobtn');
            $("#DeleteDateList").find(".divDrpOption[data-val=\"" + self.SelectionData.Date + "\"]").addClass("drpOptionselected");

        }

        if (self.SelectionData.Project.id != null) {
            $("#DeleteProjectList").find(".divDrpOption[data-id=" + self.SelectionData.Project.id + "]").find(".divradiobtn").addClass('activeradiobtn');
            $("#DeleteProjectList").find(".divDrpOption[data-id=" + self.SelectionData.Project.id + "]").addClass("drpOptionselected");

        }

    }

    validateDelete = function (e, self) {
        var validate = true;
        if (self.SelectionData.Project.value == "") {
            validate = false;
            modalPopup.showErrorCustomPopup(e, $("#DeleteProject .divcommondropdowncontainer"), "Please Select Project to proceed", true);
        }
        return validate;
    }


})(Holism || {})