let Holism = {};

(function (Holism) {
    Holism.LayoutContent = {};

    doLayoutPageSettings = function () {
        Holism.LayoutContent = new LayoutContent();
        Holism.LayoutContent.bindAllEvents();
        doLeftPanelSettings();
    }

    //Initialize all required variables and bind tooltips
    function LayoutContent() {
        this.mainContainerObj = $(".mainContainer");
        this.settingsIcon = $("#settingsToggle");
        this.settingsContainer = $(".settingsContainer");
        Global.custom_tooltip($(".iconsettings")); //binds custom tooltips
    }

    //bind all the events related to layout page
    LayoutContent.prototype.bindAllEvents = function () {
        let self = Holism.LayoutContent;
        self.bindAllClickEvents();
    }

    //binds all the click events related to layout page
    LayoutContent.prototype.bindAllClickEvents = function () {
        //redirect to respondent profile page
        $(".respondentProfile").off("click").on("click", function () {
            window.location.href = baseUrl +"RespondentProfile";
        })

        //redirect to home page
        $(".topHeader-right").find(".home").off("click").on("click", function () {
            window.location.href = baseUrl +"Home";
        })

        //redirect to upload module
        $(".uploadData").off("click").on("click", function () {
            sessionStorage.clear();
            window.location.href = baseUrl +"Upload";
        })

        //Closes leftPanel and settings when user clicks outside(body)
        $("body").off("click").on("click", function (e) {
            let self = Holism.LayoutContent;
            self.closeSettingOptions();
            self.closeModuleNavigationButtons();
            self.closeLeftPanel();
        })

        //Toggle settings and closes left panel(only if left panel is open)
        Holism.LayoutContent.settingsIcon.click(function (e) {
            let self = Holism.LayoutContent;
            if (Holism.Home != undefined) {
                if (home.tableOuterContainer.hasClass("DN")) {
                    $(".excelReport").addClass("disable");
                    $(".pptExport").addClass("disable");
                }
                else {
                  //  $(".excelReport").removeClass("disable");
                  //  $(".pptExport").removeClass("disable");
                }
            }
            if (self.settingsContainer.css("visibility") != "visible") {
                self.settingsContainer.css({ "visibility": "visible" });
            }
            else {
                self.settingsContainer.css({ "visibility": "hidden" });
            }
            self.closeLeftPanel();
            self.closeModuleNavigationButtons();
            e.stopPropagation();
        });


        //Bind right panel count
        Holism.LayoutContent.bindRightContainerCount = function (rightContainerData) {
            let rightOuterContainerObj = $(".rightOuterContainer");
            rightOuterContainerObj.find(".claimsCount").text(rightContainerData.Claims);
            rightOuterContainerObj.find(".studyCount").text(rightContainerData.Study);
            rightOuterContainerObj.find(".countryCount").text(rightContainerData.Country);
            sessionStorage["LayoutRightContainer"] = JSON.stringify(rightContainerData);
        }

        //Closes left panel
        Holism.LayoutContent.closeLeftPanel = function () {
            if (leftPanel.isOpen) { //Toggle left panel, if it is open 
                leftPanel.toggleLeftPanel();
            }
        }

        //Closes settings dropdown
        Holism.LayoutContent.closeSettingOptions = function () {
            Holism.LayoutContent.settingsContainer.css({ "visibility": "hidden" }); 
        }

        //Hides navigation buttons
        Holism.LayoutContent.closeModuleNavigationButtons = function () {
            if (Holism.Home != undefined) {
                if (!$(".buttonContainer").hasClass("DN")) {
                    $(".buttonContainer").addClass("DN")
                }
            }
        }

        //Open guide document
        $(".helpDoc").off("click").on("click", function (e) {
            modalPopup.showHelpDocument();
        })
    }

})(Holism || {})


