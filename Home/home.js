(function (Holism) {
    Holism.Home = {};

    doHomePageSettings = function () {
        Holism.Home = new Home();
        home = Holism.Home;  
        home.doHomePageRelatedLayoutSettings();
        home.bindClickEvents();
    }

    function Home() {
        this.selectedProjectIds = [];
        this.CountryIDs = [];
        this.selectionSummary = {};
        this.totalNoOfprojects = null;
        this.filterSeparatorForTooltip = " || ";
        this.modulesBtn = $(".modulesBtn");
        this.columnNames = ["Product Category", "Petitioner/Brand Team", "Countries", "Date", "ProjectName"]; //backend column names used for searching and populating table
        this.tableOuterContainer = $(".contentOuterContainer");
        $(".searchInnerContainer").find("input:text").val("");
        this.regExpForNonAlphanumeric = /[^a-z0-9]/gi;
        this.emptyString = '';
        this.claimData = {};
    }

    //Does the page settings which is specific home page
    Home.prototype.doHomePageRelatedLayoutSettings = function () {
        var self = this;
        $(".home").addClass("disable"); //disable homeIcon since user is already in homePage
       
        $(".mainContainer").removeClass("removeLayoutRightContainer"); //make projects summary visible
        Global.custom_tooltip($(".navigateToModule"));
        
        if (sessionStorage["selected_projects"] != undefined) {
            home.selectedProjectIds = sessionStorage["selected_projects"].split(leftPanel.filterSeparator).map(Number);
            
        }
        home.addSearchColumnDataAttributes();

        //Open leftPanel after login
        if (sessionStorage["isInitialPageLoad"] === undefined) {
            home.tableOuterContainer.addClass("DN");
            leftPanel.getLeftPanelData();
        }
        else {
            home.bindTableDataAndSelectionSummary();
        }
    }

    //Adds the search column attribute for each column header where search is provided
    Home.prototype.addSearchColumnDataAttributes = function () {
        let idx = 0, searchTextObj = null;
        $(".tableSearchRow").find(".searchInnerContainer").each(function (e) {
            searchTextObj = $(this).find(".searchText");
            searchTextObj.attr("data-search-column", home.columnNames[idx++]);
        })
    }

    //Invokes methods that bind selection summary and populates data;
    Home.prototype.bindTableDataAndSelectionSummary = function () {
        home.bindSelectionSummary();
        if (sessionStorage["tabularData"] != undefined) {
            if (!IsEmptyObject(JSON.parse(sessionStorage.tabularData))) {
                home.tableOuterContainer.removeClass("DN");
                let tmpData = JSON.parse(sessionStorage["tabularData"]);
                home.tabularData = tmpData.Table;
                home.tableData = home.tabularData;
                if (tmpData.Table1.length != 0) {
                    Holism.LayoutContent.bindRightContainerCount(tmpData.Table1[0]);
                }
                home.bindTableData(home.tableData);
            }
        }
    }

    //binds and enables tooltip for selection summary
    Home.prototype.bindSelectionSummary = function () {
        let summaryContainerObj = $(".summaryContainer");
        let summaryFieldClasses = ["productCategoryVal", "petitionerBrandTeamVal", "countryVal", "timePeriodVal"];
        let summaryFields = ["Product Category: ", "Petitioner/Brand Team: ", "Country: ", "Time Period: "];
        let tmpVal = null, cur_col_selections = null, sb = new StringBuilder();
        sb.append("<span class='tooltipHighlight'>Selections: </span>");
        for (let idx = 0; idx < leftPanel.noOfFilters; idx++) {
            cur_col_selections = leftPanel.prevSelectionObj[leftPanel.distinctColNames[idx]];
            tmpVal = (cur_col_selections.length > 1) ? (summaryFieldClasses[idx] == "timePeriodVal") ? cur_col_selections.join(", "):"Multiple" : cur_col_selections[0];
            $("." + summaryFieldClasses[idx]).text(tmpVal);

            sb.append("<b>" + summaryFields[idx] + "</b>" + cur_col_selections.join(", "));

            if (idx != leftPanel.noOfFilters - 1) {
                sb.append(home.filterSeparatorForTooltip);
            }

            summaryContainerObj.attr("title", sb.toString());
            Global.custom_tooltip(summaryContainerObj);
        }
        //Data for selection
        country = leftPanel.prevSelectionObj["Country"].join(", ");
        petitioner = leftPanel.prevSelectionObj["Petitioner/Brand Team"].join(", ");
        time =leftPanel.prevSelectionObj['TimePeriod'].join(", ");
        productCategory = leftPanel.prevSelectionObj["Product Category"].join(", ");
        sessionStorage['selectionforppt'] = [country, petitioner, time, productCategory];
    }

    //Binds all click events
    Home.prototype.bindClickEvents = function () {
        home.bindExcelExportClickEvents();
        home.bindModuleBtnClickEvents();
        home.bindPptExportClickEvents();
    }

    //Handles click events for modules btn
    Home.prototype.bindModuleBtnClickEvents = function () {
        $(".modulesBtn").click(function (e) {
            let layout = Holism.LayoutContent;
            if ($(".buttonContainer").hasClass("DN")) {
                $(".buttonContainer").removeClass("DN");
            }
            else {
                $(".buttonContainer").addClass("DN");
            }
            layout.closeSettingOptions();
            layout.closeLeftPanel();
            e.stopPropagation();
        });

        $(".navigateToModule").off("click").on("click", function (e) {
            let thisObj = $(this);
            switch (thisObj.attr("data-navigateTo")) {
                case "compare": window.location.href = baseUrl +"Compare"; break;
                case "analyse": window.location.href = baseUrl +"Analyse"; break;
                case "deepdive": window.location.href = baseUrl +"Demographic_DeepDive"; break;
                default: break;
            }
        })
    }

    //handles excel export button click event
    Home.prototype.bindExcelExportClickEvents = function () {
        $(".excelReport").off("click").on("click", function (e) {
            $(".settingsContainer").css({ "visibility": "hidden" });
            home.excelExport();
            e.stopPropagation();
        })
    }

    //PPT export click event
    Home.prototype.bindPptExportClickEvents = function () {
        $(".pptExport").off("click").on("click", function (e) {
            $(".settingsContainer").css({ "visibility": "hidden" });
            home.pptExport();
            e.stopPropagation();
        })
    }


    //Populates the data passed in tabular format
    Home.prototype.bindTableData = function (tableData) {
        let str = new StringBuilder();
        let tempObj = {}, idx = 0;
        home.totalNoOfprojects = tableData.length;
        $.each(tableData, function (index, value) {
            idx = 0;
            //store all the column values in tempObj
            tempObj.product_category = Global.IsNullOrEmpty(value[home.columnNames[idx]]) ? "" : value[home.columnNames[idx++]];
            tempObj.petitioner = Global.IsNullOrEmpty(value[home.columnNames[idx]]) ? "" : value[home.columnNames[idx++]];
            tempObj.country = Global.IsNullOrEmpty(value[home.columnNames[idx]]) ? "" : value[home.columnNames[idx++]];
            tempObj.date = Global.IsNullOrEmpty(value[home.columnNames[idx]]) ? "" : value[home.columnNames[idx++]];
            tempObj.project_name = Global.IsNullOrEmpty(value[home.columnNames[idx]]) ? "" : value[home.columnNames[idx++]];

            //If there are multiple countries for current row, then showing generic country icon. Otherwise, will show country specific icon
            tempObj.countryIcon = (tempObj.country.split(",").length == 1) ? tempObj.country.trim().replace(home.regExpForNonAlphanumeric, home.emptyString).toLowerCase() : "";

            //Build the DOM for current row
            str.append("<div class=\"tableRow W100 DFR\">");
            str.append("<div class=\"checkBoxColumn checkBoxColumnBoxShadow dataCheckBoxColumn ellipsis bgImgSettings CP\" data-projectId=" + value.ProjectId + "></div>");
            str.append("<div class=\"tableDataRow DFR\">");
            str.append("<div class=\"dataColumn2 dataColumn addRightBorderImg DFR\"> \
                            <div class='dataColumnInnerContent DFR tooltip' title=\"" + tempObj.product_category + "\"> \
                                <div class=\"column1RightBorder\"></div>\
                                <div class='column1Val ellipsis'>"+ tempObj.product_category + "</div>\
                            </div>\
                       </div>");
            str.append("<div class=\"dataColumn3 dataColumn addRightBorderImg DFR\"> \
                            <div class='dataColumnInnerContent DFR tooltip' title=\"" + tempObj.petitioner + "\">\
                                <div class='column2Val ellipsis'>" + tempObj.petitioner + "</div>\
                            </div>\
                        </div>");
            str.append("<div class=\"dataColumn4 dataColumn addRightBorderImg DFR\"> \
                            <div class='dataColumnInnerContent DFR ellipsis tooltip' title=\"" + tempObj.country + "\">\
                                <div class=\"countryFlag bgImgSettings "+ tempObj.countryIcon +"\"></div> \
                                <div style='width:80%' class='ellipsis'>" + tempObj.country + "</div>\
                            </div>\
                        </div>");
            str.append("<div class=\"dataColumn5 dataColumn addRightBorderImg DFR\">\
                              <div class='dataColumnInnerContent DFR ellipsis tooltip' title=\"" + tempObj.date + "\">" + tempObj.date + "</div>\
                        </div>");
            str.append("<div class=\"dataColumn6 dataColumn DFR\">\
                            <div class='dataColumnInnerContent ellipsis tooltip' title=\"" + tempObj.project_name + "\">" + tempObj.project_name + "</div>\
                       </div>");
            str.append("</div>");
            str.append("</div>");
        })

        Global.destroyCustomScrollbar($('.tableBody'));
        $(".tableBody").empty().append(str.toString());
        Global.custom_tooltip($(".tableBody").find(".tooltip"));
        $('.tableBody').mCustomScrollbar({ axis: "y", scrollbarPosition: "outside" });
        home.enableHomeBtn(false);
        home.bindTableEvents();
    }

    //Binds table related events
    Home.prototype.bindTableEvents = function () {
        home.bindCheckBoxClickEvents();
        home.bindSearchEvents();
        home.bindMouseOverEvents();
        home.bindPreviouslyselectedProjects();
    }

    //Handles table's check box click events
    Home.prototype.bindCheckBoxClickEvents = function () {
        $(".checkBoxColumn").off("click").on("click", function (e) {
            let thisObj = $(this);
            let projectId = parseInt(thisObj.attr("data-projectId"));
            if (projectId == -1) { //select all
                if (thisObj.hasClass("checkBoxSelected")) { //select all is already check, so uncheck all the checkboxes
                    $(".checkBoxColumn").removeClass("checkBoxSelected");
                    home.selectedProjectIds = [];
                    home.CountryIDs = [];
                }
                else {
                    let cur_selectedProjects = _.map(home.tableData, "ProjectId");
                    $(".checkBoxColumn").addClass("checkBoxSelected");
                 
                    for (let idx = 0; idx < cur_selectedProjects.length; idx++) {
                        if (home.selectedProjectIds.indexOf(cur_selectedProjects[idx]) == -1) {
                            home.selectedProjectIds.push(cur_selectedProjects[idx]);
                            
                            home.CountryIDs.push(_.map(_.filter(Holism.Home.tableData, { "ProjectId": parseInt(cur_selectedProjects[idx]) }), "CountryIds")[0]);
                        }
                    }
                }
            }
            else {
                if (thisObj.hasClass("checkBoxSelected")) { //checkbox is already selected, so deselect it
                    $(".checkBoxColumn[data-projectId=-1]").removeClass("checkBoxSelected");
                    thisObj.removeClass("checkBoxSelected");
                    home.selectedProjectIds.splice(home.selectedProjectIds.indexOf(projectId), 1); //remove this projectId from selected projects array
                    var id = _.map(_.filter(Holism.Home.tableData, { "ProjectId": parseInt(projectId) }), "CountryIds")[0];
                    home.CountryIDs.splice(home.CountryIDs.indexOf(id), 1);
                }
                else {
                    thisObj.addClass("checkBoxSelected");
                    home.selectedProjectIds.push(projectId);
                    home.CountryIDs.push(_.map(_.filter(Holism.Home.tableData, { "ProjectId": parseInt(projectId) }), "CountryIds")[0]);
                }

                if (home.totalNoOfprojects == ($(".tableBody").find(".checkBoxSelected").length)) { //all the projects are selected, hence select selectAll checkbox
                    $(".checkBoxColumn[data-projectId=-1]").addClass("checkBoxSelected");
                }
            }

            if (home.selectedProjectIds.length != 0) {
                home.enableHomeBtn(true);
                $(".respondentProfile").removeClass("disable");
            }
            else {
                home.enableHomeBtn(false);
                $(".respondentProfile").addClass("disable");
            }
            sessionStorage["selected_countryids"] = home.CountryIDs.join('|');

            sessionStorage["selected_projects"] = home.selectedProjectIds.join(leftPanel.filterSeparator);
        })        
        
    }

    //Handles tables search functionality
    Home.prototype.bindSearchEvents = function () {
        $(".searchText").off("keyup").on("keyup", function (e) {
            if (e.keyCode == 13) {
                home.searchAndBindTableData();
            }
            else if (Global.IsNullOrEmpty($(this).text().trim())) {
                home.searchAndBindTableData();
            }
        })

        $(".searchIcon").off("click").on("click", function (e) {
            home.searchAndBindTableData();
        })
    }


    //Handles mouse hover events
    Home.prototype.bindMouseOverEvents = function () {
        $(".tableBody").find(".tooltip").off("mouseover").on("mouseover", function (e) {
            if (e.target.scrollWidth > e.target.clientWidth) { //Shows tooltip only if text overflows i.e, only when ellipsis is visible
                $(this).tooltipster('show');
            }
            else {
                $(this).tooltipster('hide');
                e.stopPropagation();
                return false;
            }
        })
    }

    //Filters the rows based on the search input and invokes the function that populates the data by passing the filtered data
    Home.prototype.searchAndBindTableData = function () {
        Global.showBusyLoader(true);
        //Get the search value
        let productCategorySearchText = $(".searchText[data-search-column=\"" + home.columnNames[0] + "\"]")[0].value;
        let petitionerSearchText = $(".searchText[data-search-column=\"" + home.columnNames[1] + "\"]")[0].value;
        let countrySearchText = $(".searchText[data-search-column=\"" + home.columnNames[2] + "\"]")[0].value;
        let dateSearchText = $(".searchText[data-search-column=\"" + home.columnNames[3] + "\"]")[0].value;
        let projectSearchText = $(".searchText[data-search-column=\"" + home.columnNames[4] + "\"]")[0].value;

        productCategorySearchText = (productCategorySearchText!= undefined) ? productCategorySearchText.trim().toLowerCase() : "";
        petitionerSearchText = (petitionerSearchText!= undefined) ? petitionerSearchText.trim().toLowerCase() : "";
        countrySearchText = (countrySearchText!= undefined) ? countrySearchText.trim().toLowerCase() : "";
        dateSearchText = (dateSearchText != undefined) ? dateSearchText.trim().toLowerCase() : "";
        projectSearchText = (projectSearchText != undefined) ? projectSearchText.trim().toLowerCase() : "";
        
        $(".checkBoxColumn[data-projectId=-1]").removeClass("checkBoxSelected");

        if ((Global.IsNullOrEmpty(productCategorySearchText)) && (Global.IsNullOrEmpty(petitionerSearchText)) &&
            (Global.IsNullOrEmpty(countrySearchText)) && (Global.IsNullOrEmpty(dateSearchText)) && (Global.IsNullOrEmpty(projectSearchText))
        ) { //all search fields are empty, rebind original data
            home.tableData = home.tabularData;
            home.rebindTableData(home.tabularData);
        }
        else {
            //filter the data based on given search conditions
            let tempObj = {}, idx = 0;
            home.tableData = [];
            $.each(home.tabularData, function (index, value) {
                idx = 0;
                tempObj.product_category = Global.IsNullOrEmpty(value[home.columnNames[idx]]) ? "" : value[home.columnNames[idx++]].toLowerCase();
                tempObj.petitioner = Global.IsNullOrEmpty(value[home.columnNames[idx]]) ? "" : value[home.columnNames[idx++]].toLowerCase();
                tempObj.country = Global.IsNullOrEmpty(value[home.columnNames[idx]]) ? "" : value[home.columnNames[idx++]].toLowerCase();
                tempObj.date = Global.IsNullOrEmpty(value[home.columnNames[idx]]) ? "" : value[home.columnNames[idx++]].toString().toLowerCase();
                tempObj.project_name = Global.IsNullOrEmpty(value[home.columnNames[idx]]) ? "" : value[home.columnNames[idx++]].toLowerCase();

                if ((tempObj.product_category.indexOf(productCategorySearchText) != -1) &&
                    (tempObj.petitioner.indexOf(petitionerSearchText) != -1) &&
                    (tempObj.country.indexOf(countrySearchText) != -1) &&
                    (tempObj.date.indexOf(dateSearchText) != -1) &&
                    (tempObj.project_name.indexOf(projectSearchText) != -1)
                ) {
                    home.tableData.push(value);
                }
            })

            if (home.tableData.length != 0) {
                home.rebindTableData(home.tableData);
            }
            else {
                $(":focus").blur(); //Removes focus from the currently focussed element
                modalPopup.showPopupMsg("", "No results found for the given search !!!");
            }

        }
        Global.showBusyLoader(false);
    }

    //Takes necessary actions to rebind the data passed in tabular format
    Home.prototype.rebindTableData = function (dataToBind) {
        home.enableHomeBtn(false);//disables modules button
        home.bindTableData(dataToBind);//invokes method to populate data
    }

    //Invokes Ajax call for preparing and downloading the table's data in excel format
    Home.prototype.excelExport = function () {
        var data = {
            tableData: escape(JSON.stringify(home.tableData)),
            country: leftPanel.prevSelectionObj["Country"].join(", "),
            petentioner: leftPanel.prevSelectionObj["Petitioner/Brand Team"].join(", "),
            productCategory: leftPanel.prevSelectionObj["Product Category"].join(", "),
            date: leftPanel.prevSelectionObj['TimePeriod'].join(", "),
            Claims: escape(JSON.stringify(JSON.parse(sessionStorage["tabularData"]).Table1[0].Claims)),
            Study: escape(JSON.stringify(JSON.parse(sessionStorage["tabularData"]).Table1[0].Study)),
            Country: escape(JSON.stringify(JSON.parse(sessionStorage["tabularData"]).Table1[0].Country))

        };
        var option = {
            url: baseUrl + "Home/ExcelExport",
            data: "{ 'parameters':  '" + JSON.stringify(data) + "' }",
            onsuccess: function () {
                window.location = baseUrl + "Home/DownloadExcel"
            }
        };
        Global.AjaxCall(option);
    }

    Home.prototype.replaceAllSvgWithCanvas = function (container) {
        function getStyle(el, styleProp) {
            var camelize = function (str) {
                return str.replace(/\-(\w)/g, function (str, letter) {
                    return letter.toUpperCase();
                });
            };

            if (el.currentStyle) {
                return el.currentStyle[camelize(styleProp)];
            } else if (document.defaultView && document.defaultView.getComputedStyle) {
                return document.defaultView.getComputedStyle(el, null)
                    .getPropertyValue(styleProp);
            } else {
                return el.style[camelize(styleProp)];
            }
        }

        if (container.length === 0) {
            return false;
        }

        var svgElements = container.find('svg');

        //replace all svgs with a temp canvas
        svgElements.each(function () {
            var canvas, xml;
            // canvg doesn't cope very well with em font sizes so find the calculated size in pixels and replace it in the element.
            $.each($(this).find('[style*=em]'), function (index, el) {
                $(this).css('font-size', getStyle(el, 'font-size'));
            });

            canvas = document.createElement("canvas");
            canvas.className = "screenShotTempCanvas";
            //convert SVG into a XML string
            xml = (new XMLSerializer()).serializeToString(this);

            // Removing the name space as IE throws an error
            xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
            //draw the SVG onto a canvas
            canvg(canvas, xml);
            $(canvas).insertAfter(this);
            //hide the SVG element
            $(this).attr('class', 'tempHide');
            $(this).hide();
        });
    }

    Home.prototype.showBackSvgs = function (container) {
        if (Global.IsNullOrEmpty(container)) {
            return false;
        }
        container.find('.screenShotTempCanvas').remove();
        container.find('.tempHide').show().removeClass('tempHide');
    }

    Home.prototype.hideunhideBottomContainer = function () {
        ($(".bottomContainer").css('visibility') === "visible") ? $(".bottomContainer").css('visibility', 'hidden') : $(".bottomContainer").css('visibility', 'visible');
        ($(".summaryContainer").css('visibility') === "visible") ? $(".summaryContainer").css('visibility', 'hidden') : $(".summaryContainer").css('visibility', 'visible');
    }

    //Invokes Ajax call for PPT export
    Home.prototype.pptExport = function () {
        home.hideunhideBottomContainer();
        var targetElem = ".mainContainer";
        $(".checkBoxColumn").removeClass("checkBoxColumnBoxShadow");
        $(".dataColumn").addClass("pptPadding");
        home.replaceAllSvgWithCanvas($(targetElem));
        html2canvas($(targetElem)[0]).then(function (canvas) {
            var imgString = canvas.toDataURL("image/png");
            imgString = imgString.replace('data:image/png;base64,', '');
            var options = {};
            options.url = baseUrl + "Home/PreparePPT";
            options.data = JSON.stringify({
                'imgString': imgString, "ProductCategory": productCategory, "Petitioner": petitioner, "Country": country, "TimePeriod": time});
            options.async = true,
                options.onsuccess = function (value) {
                $(".checkBoxColumn").addClass("checkBoxColumnBoxShadow");
                $(".dataColumn").removeClass("pptPadding");
                    window.location = baseUrl + "Home/DownloadPPT";
                }
            Global.AjaxCall(options);
            home.hideunhideBottomContainer();
        });


    }



    //Binds the previously selected projects in table
    Home.prototype.bindPreviouslyselectedProjects = function () {
        let currentObj = null;
        $.each(home.selectedProjectIds, function (index, value) {
            if (!Global.IsNullOrEmpty(value)) {
                currentObj = $(".checkBoxColumn[data-projectid=" + value + "]");
                if (currentObj.length != 0) {
                    currentObj.addClass("checkBoxSelected")
                }
            }
        })

        if (home.selectedProjectIds.length == home.tableData.length) {
            $(".checkBoxColumn[data-projectId=-1]").addClass("checkBoxSelected");
        }
        else {
            $(".checkBoxColumn[data-projectId=-1]").removeClass("checkBoxSelected");
        }

        if ($(".dataCheckBoxColumn.checkBoxSelected").length != 0) {
            home.enableHomeBtn(true);
        }
    }

    //Enables or disables the module navigation button
    Home.prototype.enableHomeBtn = function (flag) {
        if (flag) {
            home.modulesBtn.removeClass("disable");
        }
        else {
            home.modulesBtn.addClass("disable");
            $(".navigateToModule").find(".click").css({ "visibility": "hidden" });
        }
    }

})(Holism || {})


