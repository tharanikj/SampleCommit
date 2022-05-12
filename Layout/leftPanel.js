(function (Holism) {
    Holism.LeftPanel = {};

    doLeftPanelSettings = function () {
        Holism.LeftPanel = new LeftPanel();
        leftPanel = Holism.LeftPanel;
        leftPanel.bindClickEvents();
    }

    //Initialize all required variables
    function LeftPanel() {
        this.outerContainerObj = $(".leftPanelOuterContainer");
        this.iconObj = $(".leftPanelIcon");
        this.isOpen = false;
        this.filterSeparator = "|";
        this.data = null;

        /* A mapping for columns in leftPanel
            * colName - name of the column in backend
            * idColName - id column name in backend
            * id - dummy id used for maintaining filter order
            * isMultiSelect - type of filter
            * colValType - type of values in the filter
        */
        this.columnName_Id_Type_Mapping = [
            { colName: "Product Category", idColName:"ProductCategoryID", id: 1, isMultiSelect: false, colValType: "string" },
            { colName: "Petitioner/Brand Team", idColName: "PetitionerID", id: 2, isMultiSelect: true, colValType: "string" },
            { colName: "Country", idColName: "CountryId",id: 3, isMultiSelect: true, colValType: "string" },
            { colName: "TimePeriod", idColName: "TimePeriodId", id: 4, isMultiSelect: true, colValType: "number" }
        ];

        this.currentFilterObj = {}; //used to save current filter details
        this.filterWiseAllOptions = []; //used to save all options available for filters
        this.distinctColNames = _.map(this.columnName_Id_Type_Mapping, "colName");
        this.distinctIdColNames = _.map(this.columnName_Id_Type_Mapping, "idColName");
        this.noOfFilters = this.distinctIdColNames.length;
        this.unbranded = "unbranded";
        this.petitionerFilterId = 2; //id where unbranded is required at the top

        if (sessionStorage["leftPanelSelections"] != undefined) {
            this.prevSelectionObj = JSON.parse(sessionStorage["leftPanelSelections"]);
            this.tmpSelectionObj = JSON.parse(JSON.stringify(this.prevSelectionObj));
            $(".respondentProfile").removeClass("disable");
        }
        else {
            $(".respondentProfile").addClass("disable");

            this.prevSelectionObj = []; //used for rebinding
            this.tmpSelectionObj = {}; //used for saving left panel selections temporarily
            //set temporarily selection obj to empty array for all filters
            for (let idx = 0; idx < this.noOfFilters; idx++) {
                this.tmpSelectionObj[this.distinctColNames[idx]] = [];
                this.tmpSelectionObj[this.distinctIdColNames[idx]] = [];
            }
        }
        
        Global.custom_tooltip($(".lp_selection_type"));
    }

    //Invokes methods that binds click events
    LeftPanel.prototype.bindClickEvents = function () {
        leftPanel.bindLeftPanelIconClickEvents();
        leftPanel.bindOutsideClickEvents();
        leftPanel.bindFilterClickEvents();
        leftPanel.clearAllFilters();
        leftPanel.submitFilters();
    }

    //Handle left panel icon click events
    LeftPanel.prototype.bindLeftPanelIconClickEvents = function () {
        //Toggle leftPanel and stop event bubbling
        leftPanel.iconObj.off("click").on("click", function (e) {
            leftPanel.toggleLeftPanel();
            e.stopPropagation();
        })
    }

    //Toggles left panel
    LeftPanel.prototype.toggleLeftPanel = function () {
        let layout = Holism.LayoutContent;
        if (!leftPanel.isOpen) {           
            $(".leftPanelTopArrow").css({ "left": Math.round($(".leftPanelIcon").position().left) + "px" });
            leftPanel.iconObj.addClass("leftPanelClose");
            leftPanel.outerContainerObj.removeClass("DN");
            layout.mainContainerObj.addClass("disable");
            leftPanel.isOpen = true;
            leftPanel.getLeftPanelData();
        }
        else {
            leftPanel.iconObj.removeClass("leftPanelClose");
            leftPanel.outerContainerObj.addClass("DN");
            layout.mainContainerObj.removeClass("disable");
            leftPanel.isOpen = false;

            if (sessionStorage["isInitialPageLoad"] === undefined) {
                modalPopup.showPopupMsg("", "Please select from the panel to view studies");
            }
        }
        layout.closeModuleNavigationButtons();
        layout.closeSettingOptions();
    }
    LeftPanel.prototype.bindOutsideClickEvents = function () {
        //If user clicks anywhere within leftPanel, then stop event bubbling
        leftPanel.outerContainerObj.off("click").on("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
        })
    }

    //Handles click events related to left panel filters
    LeftPanel.prototype.bindFilterClickEvents = function () {
        $(".lp_selection_container").off("click").on("click", function (e) {
            let thisObj = $(this), filterId = parseInt(thisObj.attr("data-filter-id"));
            let tmpColDetails = leftPanel.columnName_Id_Type_Mapping[filterId - 1];
            $(".lp_selection_active").removeClass("lp_selection_active");//De-selects previously selected filter
            thisObj.addClass("lp_selection_active");//selects current filter

            //save current filter details
            leftPanel.currentFilterObj.filterId = filterId;
            leftPanel.currentFilterObj.colName = tmpColDetails.colName;//get the columnName
            leftPanel.currentFilterObj.isMultiSelect = tmpColDetails.isMultiSelect; //get the type of column
            leftPanel.currentFilterObj.idColName = tmpColDetails.idColName;//get the idcolumnName

            //if user selects any previous left panel filter, then just unhide that filter's options. Otherwise, load filter
            if (leftPanel.tmpSelectionObj[leftPanel.currentFilterObj.idColName].length != 0) {
                $(".lp_filter_options_active").addClass("DN");
                $("#filter_options_" + filterId).removeClass("DN").addClass("lp_filter_options_active");
            }
            else {
                leftPanel.loadFilter(); //loads options that corresponds to currently selected filter
            }
            e.stopPropagation();

        })
    }

    //Clears the selections of current filter
    LeftPanel.prototype.clearAllFilters = function () {
        $(".clearAllBtn").off("click").on("click", function (e) {
            leftPanel.tmpSelectionObj[leftPanel.currentFilterObj.colName] = [];
            leftPanel.tmpSelectionObj[leftPanel.currentFilterObj.idColName] = [];
            $("#filter_options_" + $(".lp_selection_active").attr("data-filter-id")).find(".filterOptionActive").removeClass("filterOptionActive");
            leftPanel.clearAndDisableSuccessiveFilters(false);
            e.stopPropagation();
        })
    }

    //Handles left panel's submit button click event
    LeftPanel.prototype.submitFilters = function () {
        $(".lp_submit_btn").off("click").on("click", function (e) {
            Global.showBusyLoader(true);
            let data = {};     

            //Generates the json object that has to be passed to controller
            for (let idx = 0; idx < leftPanel.noOfFilters; idx++) {
                if (idx == (leftPanel.petitionerFilterId - 1)) { //if current filter is petitioner - then it requires unbranded to be first element                
                    leftPanel.placeUnBrandAtBeginning();
                }
                else {
                    leftPanel.tmpSelectionObj[leftPanel.distinctColNames[idx]].sort();
                }
                data[leftPanel.distinctIdColNames[idx]] = escape(leftPanel.tmpSelectionObj[leftPanel.distinctIdColNames[idx]].join(leftPanel.filterSeparator));
            }

            //saves the current left panel selections in session and other required object
            leftPanel.prevSelectionObj = leftPanel.tmpSelectionObj;
            sessionStorage["leftPanelSelections"] = JSON.stringify(leftPanel.prevSelectionObj);

            sessionStorage["isInitialPageLoad"] = false;
            leftPanel.toggleLeftPanel();

            //remove the selected projects from session and variable
            sessionStorage.removeItem("selected_projects");
            if (Holism.Home != undefined) {
                home.selectedProjectIds = [];
            }

            //Invokes an ajax call that will retrieve the data neccessary for populating landing page's tabular view
            let option = {
                url: baseUrl + "Home/GetTabularDataBasedOnLeftPanelSelection", data: "{ 'parameters':  '" + JSON.stringify(data) + "'}",
                onsuccess: leftPanel.saveLandingPageTableData
            };

            Global.AjaxCall(option);
        })
    }

    //Fetch the data for left panel and default data for tabular view
    LeftPanel.prototype.getLeftPanelData = function () {
        let option = {
            url: baseUrl + "Home/GetLeftPanelData", data: "{ 'parameters':  '{}' }",
            onsuccess: leftPanel.saveAndLoadLeftPanelData
        };
        Global.AjaxCall(option);
    }

    /*
     * Saves the left panel data in session
     * If previous selections of left panel exists in session, then invokes a function that will rebind the left panel selections
     * Otherwise, loads first filter of left panel, i.e, product and category
    */
    LeftPanel.prototype.saveAndLoadLeftPanelData = function (response) {
        leftPanel.data = response.Table;
        
        if (sessionStorage["leftPanelSelections"] != undefined) {
            leftPanel.prevSelectionObj = JSON.parse(sessionStorage["leftPanelSelections"]);
            leftPanel.tmpSelectionObj = JSON.parse(JSON.stringify(leftPanel.prevSelectionObj));
            leftPanel.loadAndRebindLeftPanelOptions();
        }
        else {
            $(".lp_selection_container:first").click(); //Programmatically click on Product and Category       
        }
    }

    /* Load  rebinds the previous left panel selections */
    LeftPanel.prototype.loadAndRebindLeftPanelOptions = function () {
        let tmpOptions = null, tmpOptionsLength = 0, optionIconClass = null,
            sb = null, selectOptionClass = null, cur_colName = null, filterOptionActive = "filterOptionActive",
            tmpOptionsContainer = null;

        for (let idx = 0; idx < leftPanel.noOfFilters; idx++) {
            sb = new StringBuilder();
            cur_colName = leftPanel.distinctColNames[idx];
            cur_idColName = leftPanel.distinctIdColNames[idx];
            leftPanel.currentFilterObj.colName = cur_colName;
            leftPanel.currentFilterObj.filterId = (idx + 1);
            leftPanel.currentFilterObj.isMultiSelect = leftPanel.columnName_Id_Type_Mapping[idx].isMultiSelect;
            leftPanel.currentFilterObj.idColName = cur_idColName;

            filterOptionsContainerObj = $("#filter_options_" + leftPanel.currentFilterObj.filterId);
            tmpOptions = leftPanel.getFilteredData();
            leftPanel.filterWiseAllOptions[cur_idColName] = _.map(_.uniqBy(tmpOptions, cur_idColName), cur_idColName); //save all options ids available for current filter
            leftPanel.filterWiseAllOptions[cur_colName] = _.map(_.uniqBy(tmpOptions, cur_colName), cur_colName); //save all display values available for current filter

            tmpOptionsContainer = $("#filter_options_" + leftPanel.currentFilterObj.filterId);

            tmpOptionsLength = tmpOptions.length;

            //Assign the class of icons depending on filter type. If filter type is multi-select, then append Select All option to string builder
            if (leftPanel.currentFilterObj.isMultiSelect) {
                optionIconClass = "checkBox checkBoxIcon";
                selectOptionClass = (tmpOptionsLength == leftPanel.prevSelectionObj[cur_idColName].length) ? filterOptionActive : "";
                sb.append("<div class=\"filterOption DFR CP " + selectOptionClass + "\" data-option-value=\"Select All\"> \
                <div class=\"bgImgSettings "+ optionIconClass + "\"></div> \
                <div class=\"filterOptionTxt tooltip\" title=\"Select All\">Select All </div>\
             </div>");
            }
            else {
                optionIconClass = "radioBtn radioBtnIcon";
            } 

            //Builds the DOM elements for filter options using string builder
            for (let optionIdx = 0; optionIdx < tmpOptionsLength; optionIdx++) {
                selectOptionClass = (leftPanel.prevSelectionObj[cur_idColName].indexOf(tmpOptions[optionIdx][cur_idColName]) != -1) ? filterOptionActive : "";
                sb.append("<div class=\"filterOption DFR CP " + selectOptionClass + "\" data-option-value=\"" + tmpOptions[optionIdx][cur_idColName] + "\" \
                                                data-display-value=\"" + tmpOptions[optionIdx][cur_colName] + "\"> \
                <div class=\"bgImgSettings "+ optionIconClass + "\"></div> \
                <div class=\"filterOptionTxt tooltip ellipsis\" title=\""+ tmpOptions[optionIdx][cur_colName]+"\">"+ tmpOptions[optionIdx][cur_colName] + "</div>\
             </div>");
            }


            Global.destroyCustomScrollbar(tmpOptionsContainer); //destroy scrollbar
            tmpOptionsContainer.empty().append(sb.toString());//append the string to dom
            Global.custom_tooltip(tmpOptionsContainer.find(".tooltip")); //add tooltip
            tmpOptionsContainer.mCustomScrollbar({ axis: "y", scrollbarPosition: "outside" }); //add scrollbar
        }

        $(".lp_selection_container:not(:first)").removeClass("lp_selection_active");//de-active left panel filters except first filter
        $(".lp_selection_container:first").addClass("lp_selection_active");//Active first filter of left panel

        $(".lp_filter_options_active").addClass("DN"); //Hides previously active left panel options 
        $("#filter_options_1").removeClass("DN").addClass("lp_filter_options_active"); //Activates first filter options of left panel

        $(".lp_selection_container").removeClass("disable");

        leftPanel.bindOptionClickEvents(); //bind left panel option click events
        leftPanel.bindMouseOverEvents(); //handle mouse over events

        if (!leftPanel.isOpen) { //If left panel is not currently open, then opens it
            leftPanel.toggleLeftPanel();
        }

        Global.showBusyLoader(false);
    }

    //Handles left panel filter click events
    LeftPanel.prototype.bindFilterClickEvents = function () {
        $(".lp_selection_container").off("click").on("click", function (e) {
            let thisObj = $(this), filterId = parseInt(thisObj.attr("data-filter-id"));
            let tmpColDetails = leftPanel.columnName_Id_Type_Mapping[filterId - 1];
            $(".lp_selection_active").removeClass("lp_selection_active");//De-selects previously selected filter
            thisObj.addClass("lp_selection_active");//selects current filter

            //save current filter details
            leftPanel.currentFilterObj.filterId = filterId;
            leftPanel.currentFilterObj.colName = tmpColDetails.colName;//get the columnName
            leftPanel.currentFilterObj.isMultiSelect = tmpColDetails.isMultiSelect; //get the type of column
            leftPanel.currentFilterObj.idColName = tmpColDetails.idColName; //get the idColName
               
            //if user selects any previous left panel filter, then just unhide that filter's options. Otherwise, load filter
            if (leftPanel.tmpSelectionObj[leftPanel.currentFilterObj.idColName].length != 0) {
                $(".lp_filter_options_active").addClass("DN");
                $("#filter_options_" + filterId).removeClass("DN").addClass("lp_filter_options_active");
            }
            else {
                leftPanel.loadFilter(); //loads options that corresponds to currently selected filter
            }
            e.stopPropagation();

        })
    }

    //Load leftPanel filter based on filterid
    LeftPanel.prototype.loadFilter = function () {
        let tmpOptions = {}, tmpOptionsLength = 0, optionIconClass = null, sb = new StringBuilder(),
            filterId = leftPanel.currentFilterObj.filterId, cur_idColName = leftPanel.currentFilterObj.idColName,
            cur_colName = leftPanel.currentFilterObj.colName;
        let filterOptionsContainerObj = $("#filter_options_" + filterId);
        tmpOptions = leftPanel.getFilteredData();
        tmpOptionsLength = tmpOptions.length;

        leftPanel.filterWiseAllOptions[cur_idColName] = _.map(_.uniqBy(tmpOptions, cur_idColName), cur_idColName); //save all options ids available for current filter
        leftPanel.filterWiseAllOptions[cur_colName] = _.map(_.uniqBy(tmpOptions, cur_colName), cur_colName); //save all display values available for current filter

        //Assign the class of icons depending on filter type. If filter type is multi-select, then append Select All option to string builder
        if (leftPanel.currentFilterObj.isMultiSelect) {
            optionIconClass = "checkBox checkBoxIcon";
            sb.append("<div class=\"filterOption DFR CP\" data-option-value=\"Select All\"> \
                <div class=\"bgImgSettings "+ optionIconClass + "\"></div> \
                <div class=\"filterOptionTxt tooltip\" title=\"Select All\">Select All </div>\
             </div>");
        }
        else {
            optionIconClass = "radioBtn radioBtnIcon";
        }

        //Builds the DOM elements for filter options using string builder
        for (let optionIdx = 0; optionIdx < tmpOptionsLength; optionIdx++) {
            sb.append("<div class=\"filterOption DFR CP\" data-option-value=\"" + tmpOptions[optionIdx][cur_idColName] + "\" \
                    data-display-value=\"" + tmpOptions[optionIdx][cur_colName] + "\"> \
                <div class=\"bgImgSettings "+ optionIconClass + "\"></div> \
                <div class=\"filterOptionTxt  tooltip ellipsis\" title=\""+ tmpOptions[optionIdx][cur_colName] +"\">"+ tmpOptions[optionIdx][cur_colName] + "</div>\
             </div>");
        }

        Global.destroyCustomScrollbar(filterOptionsContainerObj); //destroy scrollbar
        filterOptionsContainerObj.empty().append(sb.toString());//append the string to dom
        Global.custom_tooltip(filterOptionsContainerObj.find(".tooltip")); //add tooltip
        filterOptionsContainerObj.mCustomScrollbar({ axis: "y", scrollbarPosition: "outside" }); //add scrollbar

        $(".lp_filter_options_active").addClass("DN"); //disable currently active filter options
        filterOptionsContainerObj.removeClass("DN").addClass("lp_filter_options_active"); //active filter options corresponding to current filter

        leftPanel.bindOptionClickEvents();//bind left panel option click events
        leftPanel.bindMouseOverEvents(); //handle mouse over events

        if (!leftPanel.isOpen) {
            leftPanel.toggleLeftPanel();
        }
    }


    //Filters and returns the options to be shown for the selected left panel filter
    LeftPanel.prototype.getFilteredData = function () {
        let cur_colId = leftPanel.currentFilterObj.filterId,
            cur_idColName = leftPanel.currentFilterObj.idColName,
            cur_colName = leftPanel.currentFilterObj.colName;

        if (cur_colId == 1) {
            //For first left panel filter, filteration is not required. Hence returning, only uniq options
            return _.sortBy(_.uniqBy(leftPanel.data, cur_idColName), cur_colName);
        }

        let tmpIdColName = null, tmpSelectedOptionIds = null,tmpColName=null;
        let filtered_lefpanel_data = JSON.parse(JSON.stringify(leftPanel.data)); //create a copy of left panel data

        //filters the required data based on previous filters of left panel
        for (let idx = 0; idx < (cur_colId-1); idx++) {
            tmpIdColName = leftPanel.columnName_Id_Type_Mapping[idx].idColName;
            tmpSelectedOptionIds = leftPanel.tmpSelectionObj[tmpIdColName];
            tmpColName = leftPanel.columnName_Id_Type_Mapping[idx].colName;

            filtered_lefpanel_data = _.filter(filtered_lefpanel_data, function (e) {
                return tmpSelectedOptionIds.indexOf(e[tmpIdColName])!=-1;
            })

        }

        if (cur_colId != leftPanel.petitionerFilterId) {//Except petitioner/brand team
            return _.sortBy(_.uniqBy(filtered_lefpanel_data, cur_idColName), cur_colName);
        }
        else {
            return leftPanel.sortJsonArrayAlphabeticallyButPlaceUnbrandedAtTop(_.uniqBy(filtered_lefpanel_data, cur_idColName), cur_colName);
        }
    }

    //handles left panel options click events
    LeftPanel.prototype.bindOptionClickEvents = function () {
        $(".lp_filter_options").find(".filterOption").off("click").on("click", function (e) {
            let thisObj = $(this);
            let selectedOption = thisObj.attr("data-option-value");
            let selectedDisplayValue = thisObj.attr("data-display-value");
            let isMultiSelectAndSelectAll = (leftPanel.currentFilterObj.isMultiSelect && (selectedOption == "Select All")) ? true : false;
            let tmpIdColName = leftPanel.currentFilterObj.idColName;
            let tmpColName = leftPanel.currentFilterObj.colName;
            let filterOptionsContainerObj = $("#filter_options_" + leftPanel.currentFilterObj.filterId);

            if (thisObj.hasClass("filterOptionActive")) {
                if (isMultiSelectAndSelectAll) {
                    filterOptionsContainerObj.find(".filterOption").removeClass("filterOptionActive");//deselect all selected options for this filter
                    leftPanel.tmpSelectionObj[tmpIdColName] = []; //clear the selections
                    leftPanel.tmpSelectionObj[tmpColName] = [];
                }
                else {
                    thisObj.removeClass("filterOptionActive"); //deselect this option
                    //remove currently selected option from the selection obj
                    let selectedIdx = leftPanel.tmpSelectionObj[tmpIdColName].indexOf(parseInt(selectedOption))
                    leftPanel.tmpSelectionObj[tmpIdColName].splice(selectedIdx, 1);
                    leftPanel.tmpSelectionObj[tmpColName].splice(selectedIdx, 1);


                    if (leftPanel.currentFilterObj.isMultiSelect) {
                        //deselect select All
                        if (!thisObj.hasClass("filterOptionActive")) {
                            filterOptionsContainerObj.find(".filterOption:first").removeClass("filterOptionActive");
                        }
                    }
                }
            }
            else {
                if (isMultiSelectAndSelectAll) {
                    filterOptionsContainerObj.find(".filterOption").addClass("filterOptionActive");//select all selected options for this filter
                    //adds all the options of current filter to the selection obj
                    leftPanel.tmpSelectionObj[tmpIdColName] = leftPanel.filterWiseAllOptions[tmpIdColName];
                    leftPanel.tmpSelectionObj[tmpColName] = leftPanel.filterWiseAllOptions[tmpColName];
                }
                else {
                    thisObj.addClass("filterOptionActive");//select this option
                    //add currently selected option to selection obj
                    leftPanel.tmpSelectionObj[tmpIdColName].push(parseInt(selectedOption));
                    leftPanel.tmpSelectionObj[tmpColName].push(selectedDisplayValue);

                    if (leftPanel.currentFilterObj.isMultiSelect) {
                        //All the options of multi-select filter is selected individually, then selects "Select All". 
                        if (filterOptionsContainerObj.find(".filterOptionActive").length == leftPanel.filterWiseAllOptions[tmpIdColName].length) {
                            filterOptionsContainerObj.find(".filterOption:first").addClass("filterOptionActive");
                        }
                    }
                }
            }

            //If any of the options of current filter is selected, then disable successive filters, but enable only immediate filter
            //Otherwise, disable all successive filters
            if (leftPanel.tmpSelectionObj[tmpIdColName].length != 0) {
                leftPanel.clearAndDisableSuccessiveFilters(true);
            }
            else {
                leftPanel.clearAndDisableSuccessiveFilters(false);
            }

            leftPanel.enableOrDisableSubmitBtn();
        })
    }

    //handles mouse over events
    LeftPanel.prototype.bindMouseOverEvents = function () {
        $(".filterOption").find(".filterOptionTxt").off("mouseover").on("mouseover", function (e) {
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

    //Disable all successive filters. But enables immediate filter based on the flag
    LeftPanel.prototype.clearAndDisableSuccessiveFilters = function (enableImmediateFilter) {
        for (let idx = leftPanel.currentFilterObj.filterId; idx < leftPanel.noOfFilters; idx++) {
            leftPanel.tmpSelectionObj[leftPanel.distinctColNames[idx]] = [];
            leftPanel.tmpSelectionObj[leftPanel.distinctIdColNames[idx]] = [];
            $(".lp_selection_container[data-filter-id=" + (idx + 1) + "]").addClass("disable");
        }

        if (enableImmediateFilter) {
            $(".lp_selection_container[data-filter-id=" + (leftPanel.currentFilterObj.filterId + 1) + "]").removeClass("disable");
        }
        $(".lp_submit_btn").removeClass("disable");
    }

    //Decides whether to enable or disable left panel's submit button
    LeftPanel.prototype.enableOrDisableSubmitBtn = function () {
        let isEnable = true;

        //If none of the option is selected for any left panel, then sets isEnable flag to false
        for (let idx = 0; idx < leftPanel.noOfFilters; idx++) {
            if (leftPanel.tmpSelectionObj[leftPanel.distinctIdColNames[idx]].length == 0) {
                isEnable = false;
            }
        }

        if (isEnable) {
            $(".lp_submit_btn").removeClass("disable");
        }
        else {
            $(".lp_submit_btn").addClass("disable");
        }
    }

    /* Saves the data in session, which will be used to populate landing page table.
     * If user is currently in home page, then calls the function that will populate table and summary
     * Otherwise, redirects user to home page
    */
    LeftPanel.prototype.saveLandingPageTableData = function (response) {
        sessionStorage["tabularData"] = JSON.stringify(response);
        let homeObj = Holism.Home;
        if (homeObj == undefined) {
            window.location.href = baseUrl +"Home";
        }
        else {
            $(".searchInnerContainer").find("input:text").val("");
            homeObj.bindTableDataAndSelectionSummary();          
        }
    }


    /* Below function is used while filtering the data to get options to be shown in left panel
     * Sorts the given json array in alphabetical order, but places 'unbranded' at the top of list  for petitioner/brand team filter
    */
    LeftPanel.prototype.sortJsonArrayAlphabeticallyButPlaceUnbrandedAtTop = function (filtered_lefpanel_data, cur_colName) {
        let finalList = [];
        let unbrandedData = [];
        let filtered_leftpanel_data_length = filtered_lefpanel_data.length;
        for (let idx = 0; idx < filtered_leftpanel_data_length; idx++) {
            if (filtered_lefpanel_data[idx]["Petitioner/Brand Team"].toLowerCase().trim() != leftPanel.unbranded) {
                finalList.push(filtered_lefpanel_data[idx]); //copy all options that is except unbranded
            }
            else {
                unbrandedData.push(filtered_lefpanel_data[idx]); //copy unbranded
            }
        }

        if (finalList.length != 0) {
            finalList = _.sortBy(finalList,cur_colName); //Filter unique list by cur_idColName and then  sort list alphabetically
        }

        if (unbrandedData.length != 0) {
            finalList.unshift(unbrandedData[0]);
        }
        return finalList;
    }

    /*Below function is used before submitting the leftpanel selections
     * Sorts the given array in alphabetical order, but places 'unbranded' at the beginning of selected petitioner objects
    */
    LeftPanel.prototype.placeUnBrandAtBeginning = function () {
        let filterIdxForPetitioner = leftPanel.petitionerFilterId - 1; //using minus 1, because array index starts from 0 where filterId starts from 1
        let petitionerList = (leftPanel.tmpSelectionObj[leftPanel.distinctColNames[filterIdxForPetitioner]]).sort();
        let noOfpetitionerSelected = petitionerList.length;
        let petitionerIdx = -1;

        //find the index where unbranded exists
        for (let j = 0; j < noOfpetitionerSelected; j++) {
            if (petitionerList[j].toLowerCase() == leftPanel.unbranded) {
                petitionerIdx = j;
                break;
            }
        }

        if (petitionerIdx != -1) {
            let unbrandedOption = petitionerList.splice(petitionerIdx, 1);//remove 'unbranded' from the array                  
            petitionerList.unshift(unbrandedOption[0]);//insert 'unbranded' at first
            leftPanel.tmpSelectionObj[leftPanel.distinctColNames[filterIdxForPetitioner]] = petitionerList;//update existing selected petitioner options
        }
    }
})(Holism || {})