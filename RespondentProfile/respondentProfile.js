
(function (Holism) {
    Holism.RespondentProfile = {};
    doRespondentProfileSettings = function () {
        Holism.RespondentProfile = new RespondentProfile();
        Holism.RespondentProfile.GetRespondentProfileData();
       // Holism.RespondentProfile.BindAllEvents();
    }
    function RespondentProfile() {
        this.colorValue = ["#118DFF", "#EC6176", "#B876D3", "#E6B34D", "#90C49C", "#85C5FF", "#6C6CEA", "#A4CCE0", "#EFA8C5", "#C7A8E5", "#7FC9C7", "#3BD1B4", "#4FA9DB", "#6AC9EA", "#73E09F", "#F39C12", "#CEC341", "#95A5A6", "#999966", "#FF9966", "#99CC66", "#669966", "#CC9999", "#845D5D"];
        this.RespondentProfileMasterData = [];
        this.SelectionDataObj = [];
        this.ExcelExportData = {
            InterviewedRespondent: "NA",
            //LeftpanelClaimsData: {
            //    Claims: { data: "NA", colorcode: "#000000" },
            //    Study: { data: "NA", colorcode: "#000000" },
            //    Country: { data: "NA", colorcode: "#000000" }
            //},
            LeftpanelClaimsData: {
                Claims:  "NA",
                Study: "NA",
                Country: "NA" 
            },
            Gender: {
                Male: { data: 0, colorcode: "#000000" },
                Female: { data: 0, colorcode: "#000000" },
                Others: { data: 0, colorcode: "#000000" }
            },
            Age: {
                "18 - 24 years": { data: "NA", colorcode: "#000000" },
                "25 - 34 years": { data: "NA", colorcode: "#000000" },
                "35 - 44 years": { data: "NA", colorcode: "#000000" },
                "45 - 55 years": { data: "NA", colorcode: "#000000" },
                "56 - 64 years": { data: "NA", colorcode: "#000000" },
                "65 years +": { data: "NA", colorcode: "#000000" },
                "Under 18 years": { data: "NA", colorcode: "#000000" }
            },
            Country: [],
            DeoFormatused:[]
        };
    }
    RespondentProfile.prototype.GetRespondentProfileData = function () {
        var self = this;
        var obj = {};
        obj.data = (sessionStorage.getItem("selected_projects")).split(',').join("|").toString();
        obj.countryId = sessionStorage["selected_countryids"].split(',').join('|');
        var option = {
           // type:'POST',
            url: baseUrl + "RespondentProfile/GetRespondentProfileData",
            data: JSON.stringify(obj),
            onsuccess: function (data) {
                var tabularData = JSON.parse(sessionStorage["tabularData"]);
                var selectionProjIds = (sessionStorage.getItem("selected_projects")).split('|');

                var SelectionData = [];
                for (var i = 0; i < tabularData.Table.length; i++) {
                    for (let j = 0; j < selectionProjIds.length; j++) {
                        if (tabularData.Table[i]["ProjectId"] == parseInt(selectionProjIds[j]))
                            SelectionData.push(tabularData.Table[i]);
                    }
                }
               var x= _.filter(SelectionData, function (e) {
                    e["Countries"] = e["Countries"].split(',');
                    e["Petitioner/Brand Team"] = e["Petitioner/Brand Team"].split(',');
                    e["Year"] = e["Date"].toString().slice(-4);
                });
                var uniqCountry = _.uniq([].concat.apply([], _.map(SelectionData, "Countries")).map(function (el) {
                    return el.trim();
                })).join(',');
                var uniqBrand = _.uniq([].concat.apply([], _.map(SelectionData, "Petitioner/Brand Team")).map(function (el) {
                    return el.trim();
                })).join(',');
               // var uniqBrand = _.uniq([].concat.apply([], _.map(SelectionData, "Petitioner/Brand Team"))).join(',');
                var uniqyear = _.uniq(_.map(SelectionData, "Year")).join(',');
                var productCategory = _.uniq(_.map(SelectionData, "Product Category")).join(',');
                self.SelectionDataObj = {
                    "Countries": uniqCountry,
                    "Petitioner/Brand Team": uniqBrand,
                    "Year": uniqyear,
                    "Product Category": productCategory
                }
                $(".excelReport").removeClass("disable");
                $(".pptExport").removeClass("disable");
                self.RespondentProfileMasterData = data;
                Holism.RespondentProfile.BindAllEvents();
            }
            
        }
    
        Global.AjaxCall(option);
    }
    RespondentProfile.prototype.BindAllEvents = function () {
        
        var self = this;
        $(".respondentProfile").addClass("disable");
      //  $(".profile").addClass("disable");
        $(".mainContainer").removeClass("removeLayoutRightContainer");
        if (!Global.IsEmptyObject(self.RespondentProfileMasterData.Table)) {
            self.ExcelExportData.InterviewedRespondent = Holism.RespondentProfile.RespondentProfileMasterData.Table[0]['Interviewed Respondants'];
            $(".container1-lower-value").html(Holism.RespondentProfile.RespondentProfileMasterData.Table[0]['Interviewed Respondants']);

        }
        else { $(".container1-lower-value").html("NA"); self.ExcelExportData.InterviewedRespondent = "NA";}
        self.BindLayoutRightPanel();
        self.plotChart2();
        self.plotPieChart();
        self.plotCircularChart();
        self.plotSemiCircleChart();
        self.BindExportClickEvent();
    }
    RespondentProfile.prototype.BindExportClickEvent = function () {
        var self = this;
        $(".pptExport").off('click').on('click', function () {
            var targetElem = ".mainContainer";
            Global.showBusyLoader(true);
            self.replaceAllSvgWithCanvas($(targetElem));
            html2canvas($(targetElem)[0]).then(function (canvas) {
                self.showBackSvgs($(targetElem));
                var imgString = canvas.toDataURL("image/png");
                var country = self.SelectionDataObj["Countries"];
                var petentionerr = self.SelectionDataObj["Petitioner/Brand Team"];
                var Timee = self.SelectionDataObj["Year"];
                var productcategory = self.SelectionDataObj["Product Category"];
                               
              //  imgString = imgString.replace('data:image/png;base64,', '');
                var options = {};
                options.url = baseUrl + "RespondentProfile/PreparePPT";
                options.data = JSON.stringify({ 'imgString': imgString, Country: country, Petentioner: petentionerr, Time: Timee ,prodcat:productcategory});
                options.async = true,
                    options.onsuccess = function (value) {
                    window.location = baseUrl + "RespondentProfile/DownloadPPT";
                    Global.showBusyLoader(false);
                    }
                Global.AjaxCall(options);
            });
        });
        $(".Pptdeo").off('click').on('click', function () {
            self.PPTExport();
        });

        $(".excelReport").off('click').on('click', function () {
            var data = {
                ExcelData: escape( JSON.stringify(self.ExcelExportData)),
                SelectionData: escape(JSON.stringify(self.SelectionDataObj))
                //JSON.parse(sessionStorage["leftPanelSelections"])
            }
            var option = {
                url: baseUrl + 'RespondentProfile/ExportExcel',
                async: true,
                data: "{ 'parameters':  '" + JSON.stringify(data) + "'}",
                onsuccess: function (data) {
                    if (Global.IsEmptyObject(data)) {
                        modalPopup.PopupError("Error message", "An error occurred. Please try again later.");
                    }
                    else {
                        if (data.success) {
                            window.location.href = baseUrl + "RespondentProfile/DownloadExcel";
                        } else {
                            modalPopup.PopupError("Error message", "An error occurred. Please try again later.");
                        }
                    }

                }

            }
            Global.AjaxCall(option);
        });
    }
    RespondentProfile.prototype.BindLayoutRightPanel = function () {
        var self = this;
        var data = JSON.parse(sessionStorage["LayoutRightContainer"]);
       let rightOuterContainerObj = $(".rightOuterContainer");
        rightOuterContainerObj.find(".claimsCount").text(data.Claims);
        rightOuterContainerObj.find(".studyCount").text(data.Study);
        rightOuterContainerObj.find(".countryCount").text(data.Country);
        self.ExcelExportData.LeftpanelClaimsData.Claims = data.Claims;
        self.ExcelExportData.LeftpanelClaimsData.Study = data.Study;
        self.ExcelExportData.LeftpanelClaimsData.Country = data.Country;
    }
    RespondentProfile.prototype.plotChart2 = function () {
        var self = this;
        var dataObj = _.filter(self.RespondentProfileMasterData.Table1, { "Metrics": "Gender" });
        let maleObj = _.filter(dataObj, { "MetricValues":"Male"});
        let femaleObj = _.filter(dataObj, { "MetricValues": "Female" });
        let othersObj = _.filter(dataObj, {"MetricValues": "Prefer not to answer" });

        //Fill first image
        if (maleObj.length > 0) {
            $("#first-fill").text(maleObj[0].MetricPercent + "%");
            $("#first-fill").css("color", maleObj[0].ColorCode);
            self.ExcelExportData.Gender.Male.data = maleObj[0].MetricPercent / 100;
            self.ExcelExportData.Gender.Male.colorcode = maleObj[0].ColorCode;
            self.fillSvgImage(".male", (100 - maleObj[0].MetricPercent), maleObj[0].MetricPercent, "#438AF7");
        } else {
            $("#first-fill").text("0" + "%");
            self.ExcelExportData.Gender.Male.data = 0;
            self.fillSvgImage(".male", (100), 0, "#438AF7");

        }
        //Fill second image
        if (femaleObj.length > 0) {
            $("#second-fill").text(femaleObj[0].MetricPercent + "%");
            $("#second-fill").css("color", femaleObj[0].ColorCode);
            self.ExcelExportData.Gender.Female.data = femaleObj[0].MetricPercent / 100;
            self.ExcelExportData.Gender.Female.colorcode = femaleObj[0].ColorCode;
            self.fillSvgImage(".female", (100 - femaleObj[0].MetricPercent), femaleObj[0].MetricPercent, "#B876D3");
        }
        else {
            $("#second-fill").text("0" + "%");
            self.ExcelExportData.Gender.Female.data = 0;
            self.fillSvgImage(".female", (100), 0, "#B876D3");
        }
        //fill third image
        if (othersObj.length > 0) {
            $("#third-fill").text(othersObj[0].MetricPercent + "%");
            $("#third-fill").css("color", othersObj[0].ColorCode);
            self.ExcelExportData.Gender.Others.data = othersObj[0].MetricPercent/100;
            self.fillSvgImage(".others", (100 - othersObj[0].MetricPercent), othersObj[0].MetricPercent, "#438AF7");
            self.ExcelExportData.Gender.Others.colorcode = othersObj[0].ColorCode;
        } else {
            $("#third-fill").text("0" + "%");
            self.ExcelExportData.Gender.Others.data = 0;
            self.fillSvgImage(".others", (100), 0, "#438AF7");
        }
    }
    RespondentProfile.prototype.fillSvgImage = function (classname, toppercentage, bottompercentage, color) {
        $(classname).find(".colortop").css("height", toppercentage + "%");
        $(classname).find(".colorbottom").css("height", bottompercentage + "%");
        $(classname).find(".colorbottom").css("background", color);
    }

    RespondentProfile.prototype.plotPieChart = function () {
        var self = this;
        var data = _.filter(self.RespondentProfileMasterData.Table1, { "Metrics": "Country" });
        if (data.length <= 0) {
            $(".divCountryChartContainer").html("No Data Available");
            return;
        }
        var seriesData = [];
       
        for (var i = 0; i < data.length; i++) {
            seriesData.push({ name: data[i]["MetricValues"], y: data[i]["MetricPercent"], color: self.colorValue[i], colorCode: data[i]["ColorCode"] })
            self.ExcelExportData.Country.push({ name: data[i]["MetricValues"], y: data[i]["MetricPercent"] / 100, colorCode: data[i]["ColorCode"] })
        }
        Highcharts.chart('container3', {
            chart: {
                backgroundColor: 'rgba(0,0,0,0)',
                plotBorderWidth: 0,
                plotShadow: false,
                type: 'pie',
                events: {
                    load: function () {
                        let innerSize = this.userOptions.plotOptions.pie.innerSize + 10;
                        this.renderer.image('./Content/Images/RespondentProfile/Deo_Claims_Holism-127.svg',
                            this.chartWidth / 2 - innerSize / 2,
                            this.plotTop + this.plotSizeY / 2 - innerSize / 2 + 2,
                            innerSize,
                            innerSize).add();
                    }
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip: {
                enabled: true,
                useHTML:true,
                formatter: function () {
                    return '<b>' + this.y + '%</b>';
                }
            },

            plotOptions: {
                pie: {
                    innerSize: 90,
                    //shadow: {
                    //    color: 'lightgrey',
                    //    offsetX: 0,
                    //    offsetY: 0,
                    //    opacity: 1,
                    //    width: 5
                    //},
                    allowPointSelect: false,
                    //cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                   // cursor: 'pointer'
                },
                series: {
                    pie: {
                         zIndex: 1
                    },
                    dataLabels: {
                        enabled: true,
                       // distance: 10
                    },
                    states: {
                        hover: {
                            enabled: false
                        },
                        inactive: {
                            opacity: 1
                        }
                    }
                }
            },
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical',
               
               // x: 0,
                //y: 50,
               // itemMarginBottom: 9,
                labelFormatter: function () {
                    return '<div style="text-align:center;font-family:UnileverShilling;font-size : 1.375rem;color: #000000;">' + this.name +'<br/>'  + Highcharts.numberFormat(this.percentage, 0) + "%" + '</div>';
                },
                enabled:false
            },
            series: [{
                name: 'Country',
                colorByPoint: true,
                data: seriesData
            }]
        }, function (chart) {
               

                var legend = $('.divCountryLegends');
                legend.html("");
            $.each(chart.series[0].data, function (j, data) {

                legend.append('<div class="item"><div class="divSymbol"><div class="symbol" style="background-color:' + data.color + '"></div></div><div class="serieName" ><div class="legendrow" style="  font-family : UnileverShilling;font-size:0.8125rem;color: #000000;">' + data.name + '</div><div class="legendrow"style="  font-family : UnileverShilling;font-size:1.375rem;color: #000000;">' + data.y + '%</div></div></div>');


            });
                Global.CustomScrollbar(".divCountryLegends", "outside", "y")
            //    $('.divCountryLegends .item').click(function () {
            //    var inx = $(this).index(),
            //        point = chart.series[0].data[inx];

            //    if (point.visible)
            //        point.setVisible(false);
            //    else
            //        point.setVisible(true);
            //});

        });
       
    }

    RespondentProfile.prototype.plotCircularChart = function () {
        var self = this;
        var data = _.filter(self.RespondentProfileMasterData.Table1, { "Metrics": "Age" });
        if (data.length <= 0) {
            $(".c4-divisions").html("No Data Available");
            return;
        }
        var ages = ["Under 18 years","18 - 24 years", "25 - 34 years", "35 - 44 years", "45 - 55 years", "56 - 64 years", "65 years +"];
        self.createAgePieChartContainer(ages);
       // let circlegraphcontainer = ["circlegraph1", "circlegraph2", "circlegraph3", "circlegraph4", "circlegraph5"];
       // let circlevalue = ["#circledown1", "#circledown2", "#circledown3", "#circledown4", "#circledown5"];
       
        // let x = [58, 30, 68, 10, 3];
        let y = _.maxBy(data, "MetricPercent").MetricPercent;
        for (var i = 0; i < ages.length; i++) {
            var percent = _.filter(data, { "MetricValues": ages[i] });
            if (percent.length > 0) {
                self.ExcelExportData.Age[ages[i]].data = parseFloat(percent[0]["MetricPercent"]) / 100;
                self.ExcelExportData.Age[ages[i]].colorcode = percent[0]["ColorCode"];
                $("#circledown" + (i + 1)).html(parseFloat(percent[0]["MetricPercent"]) + "%");
                $("#circledown" + (i + 1)).css("color", percent[0]["ColorCode"]);
            }
            else{
                $("#circledown" + (i + 1)).html("NA");
                
                $("#circlegraph" + (i + 1)).html("-");
                $("#circlegraph" + (i + 1)).css("background", "none");
                self.ExcelExportData.Age[ages[i]].data = "NA";
                continue;
            }
         
           let diff = parseFloat(y)*3.5 - (parseFloat(percent[0]["MetricPercent"])*3.5);//23-0=23  //23-23=0 //23-2=21
            let f = 350 - (diff)*3.5;
            let g = f - 10;
            //(parseFloat(percent[0]["MetricPercent"]))
            //let f = 300 - (diff * 3);
            //let f = parseFloat(percent[0]["MetricPercent"])*3.5;
          //  let f = 350;
             g =f<10?f: f - 10;
            if (parseFloat(percent[0]["MetricPercent"])==0) {
                f = 0;
                g = 0;
            }
           // let f = (parseFloat(percent[0]["MetricPercent"]));
           // let g = f - 10;
          //  if ((parseFloat(percent[0]["MetricPercent"]))==0) {
           //     f = 83; g = 73;
           // }
         
            Highcharts.chart("circlegraph"+(i+1), {
                chart: {
                    type: 'pie',
                    backgroundColor: 'rgba(0,0,0,0)',
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        center: ["50%", "50%"]
                    },
                    series: {
                        states: {
                            hover: {
                                enabled: false
                            },
                            inactive: {
                                opacity: 1
                            }
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: function () {
                        return '<b>' + this.series.userOptions.data[0].PercentData + '%</b>';
                    }
                },
                series: [
                    {
                    size: g + "%",
                    borderWidth: 0,
                    showInLegend: false,
                    enableMouseTracking: false,
                    data: [1],
                    animation: false,
                    colors: ['white'],
                    dataLabels: {
                        enabled: false
                    }
                    },
                    {
                    size: f + "%",
                    innerSize: '55%',
                    dataLabels: {
                        enabled: false,
                      //  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    },
                    allowPointSelect: false,
                    data: [
                        {
                            y: 100,
                            color: self.colorValue[i],
                            PercentData: percent[0]["MetricPercent"]
                        }
                    ],
                    enableMouseTracking: true,
                }]
            });
        }
    }

    RespondentProfile.prototype.createAgePieChartContainer = function (ages) {
        var sb = "";
       
       
        //<br /> Years
        for (var i = 0; i < ages.length; i++) {
           
            sb += " <div class=\"circledivision"+"\" > \
                <div class=\"circlegraphtitle"+ "\">" + ages[i]+" </div>\
                <div id =\"circlegraph"+( i+1) +"\" > </div> \
                <div id =\"circledown"+(i+1) + "\"></div> \
                </div>";
            if (i != ages.length-1)
                sb += "<div class=\"lineContainer" + "\"></div>";
        }
        $(".c4-divisions").html(sb);
        //background - image: url('../../Images/RespondentProfile/bottom.png'), url('../../Images/RespondentProfile/top.png');

    }
    RespondentProfile.prototype.plotSemiCircleChart = function () {
        var self = this;
       // let value = [90, 76, 65, 49, 34, 13];
        var data = _.orderBy(_.uniqBy(_.filter(self.RespondentProfileMasterData.Table1, function (datas) {
            if (datas["Metrics"].toString().toLowerCase() == ("Deo format used").toLowerCase())
                return datas;
        }), "MetricValues"), "MetricPercent", "desc");
        if (data.length <= 0) {
            $(".c5-divisions").html("No Data Available");
            $(".c5-expandedview").addClass("disable");
        }
        self.ExcelExportData.DeoFormatused = data;
      //  let chartTitle = _.uniqBy(data, "MetricValues");
        let graphcontainer = ["containergraph1", "containergraph2", "containergraph3", "containergraph4", "containergraph5", "containergraph6"];

        for (var i = 0; i < graphcontainer.length; i++) {
            if (i <= data.length-1) {
                self.bindMainDeoFormatChart(graphcontainer[i], data[i], i, 0);
            } else {
                $(graphcontainer[i]).html("-");
            }
                }
        self.bindExpandedViewClick();
    }
    RespondentProfile.prototype.bindMainDeoFormatChart = function (container, data, i,defaults) {
        var self = this;
        Highcharts.chart(container, {
            chart: {
                renderTo:container,
                backgroundColor: "#F6F7F9",
                plotBorderWidth: 0,
                plotShadow: false,
                plotTop: defaults == 0 ? 0 : undefined,
                plotBottom: defaults == 0 ? 0 : undefined,
                plotLeft: defaults == 0 ? 0 : undefined,
                plotRight: defaults == 0 ? 0 : undefined,
                marginLeft: defaults == 0 ? 0 : undefined,
                marginRight: defaults == 0 ? 0 : undefined,
                marginTop: defaults == 0 ? 0 : undefined,
                marginBottom: defaults == 0 ? 0 : 0,
                events: {
                    load: function () {
                        //$(this.series[1].data[0].graphic.element).attr('fill', 'red');//'url(#pattern)
                        //this.series[0].userOptions.data[1].graphic.element;
                    }
                }
               
                // BackgroundImage:'../Content/Images/Home/table_bg.png'              
            },
           
            title: {
                text:  data["MetricPercent"] + "%",
                align: 'center',
                verticalAlign: 'bottom',
              //  y: 50,
                style: {
                    "fontFamily": "UnileverShilling", "fontSize": "1rem","fontWeight":"bold",
                    "color": data["ColorCode"]
                }

            },
            subtitle: {
                text: data["MetricValues"],
                align: 'center',
                style: {
                    "fontFamily": "UnileverShilling", "fontSize": "0.8125rem",
                    "color": "#000000"
                }
            },

            tooltip: {
                enabled: true,
                formatter: function () {
                    return '<b>' + this.series.userOptions.data[0].y + '%</b>';
                }
            },
           
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                       // softConnector: false
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '125%'],
                    size: '150%',
                    borderWidth:2
                },
            },
            series: [{
                type: 'pie',
                startAngle: -90,
                endAngle: 90,
               // innerSize: '70%',
                center: ['50%', '125%'],
                data: [{
                    y: 100,
                    //color:"white"
                   color: {
                        pattern: {
                            image: "./Content/Images/RespondentProfile/Deo_Claims_Holism_Chart_white_bg.png"
                           
                        }
                    }
                }]
            },{
                type: 'pie',
                innerSize: '73%',
                data: [

                    {
                        y: data["MetricPercent"],
                        color: self.colorValue[i],
                       
                    }, {
                        y: 100-data["MetricPercent"],
                        color: 'rgba(0,0,0,0)',
                    }

                    //{
                    //    y: 100,
                    //    color: {
                    //        pattern: {
                    //            // image: url('./Content/Images/RespondentProfile/Deo_Claims_Holism_Chart_white_bg.png'),
                    //            image: "./Content/Images/RespondentProfile/Deo_Claims_Holism_Chart_white_bg.png",
                    //          //  width: '100%',
                    //         //   height: '100%'
                    //            // width: 100,
                    //            // height:100
                    //            // aspectRatio: 1.3
                    //        }
                    //        //width: 6,
                    //        //height: 6
                    //    }
                    //}
                    //{
                    //    y: 100 - data["MetricPercent"],
                    //   // color: "#EEE",
                      
                       
                    //}
                ],
                enableMouseTracking: true,
            }]
        });
    }
    RespondentProfile.prototype.bindExpandedViewClick = function () {
        var self = this;
        $(".c5-expandedview").off('click').on('click', function () {
            var data = _.orderBy(_.uniqBy(_.filter(self.RespondentProfileMasterData.Table1, function (datas) {
                if (datas["Metrics"].toString().toLowerCase() == ("Deo format used").toLowerCase())
                    return datas;
            }), "MetricValues"), "MetricPercent", "desc");
            var sb = "";
            sb+="<div class='Pptdeo'></div>"
            sb += "<div class='expanded-view-container'>";
            for (var i = 0; i < data.length; i++) {
                sb += "<div class='lower-inner-division-expanded'>";
                sb += "<div class='container' id='containergraph-expanded" + (i + 1) + "'></div>";
                sb += "</div>";
            }
            sb += "</div>";
            Global.destroyCustomScrollbar($('.expanded-view-container'));
            modalPopup.showExpandedPopup("Main Deo Format Used", sb);
            self.BindExportClickEvent();
            for (var i = 0; i < data.length; i++){
                self.bindMainDeoFormatChart("containergraph-expanded"+(i+1), data[i], i,1);
             }
            $('.expanded-view-container').mCustomScrollbar({ axis: "y", scrollbarPosition: "inside" });
        })
    }
    RespondentProfile.prototype.replaceAllSvgWithCanvas = function (container) {
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
            var canvas;
            var xml;
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
            $(this).attr('class', 'tempHide');          // no css needed for tempHide
            $(this).hide();
        });
    }

    RespondentProfile.prototype.showBackSvgs = function (container) {
        if (Global.IsNullOrEmpty(container)) {
            return false;
        }
        container.find('.screenShotTempCanvas').remove();
        container.find('.tempHide').show().removeClass('tempHide');
    }
        RespondentProfile.prototype.PPTExport = function () {
            //var targetElem = ".layoutTopHeader";
            var self = this;
            var targetElem = ".PopupInnerBody";
            self.replaceAllSvgWithCanvas($(targetElem));
            html2canvas($(targetElem)[0]).then(function (canvas) {
                self.showBackSvgs($(targetElem));
                var imgString = canvas.toDataURL("image/png");
               var country = self.SelectionDataObj["Countries"];
              var  petentionerr = self.SelectionDataObj["Petitioner/Brand Team"];
                var Timee = self.SelectionDataObj["Year"];
               var productcategory = self.SelectionDataObj["Product Category"];
                //country = JSON.parse(sessionStorage['leftPanelSelections'])["Country"].join(", ");
                //petentionerr = JSON.parse(sessionStorage['leftPanelSelections'])["Petitioner/Brand Team"].join(", ");
                //Timee = JSON.parse(sessionStorage['leftPanelSelections'])["TimePeriod"].join(", ");
                //productcategory = JSON.parse(sessionStorage['leftPanelSelections'])["Product Category"].join(", ");
                imgString = imgString.replace('data:image/png;base64,', '');
                console.clear();
                var options = {};
                options.url = baseUrl + "RespondentProfile/PreparePPT";
                options.data = JSON.stringify({ 'imgString': imgString, Country: country, Petentioner: petentionerr, Time: Timee,prodcat:productcategory });

                options.async = true,
                    options.onsuccess = function (value) {
                        window.location = baseUrl + "RespondentProfile/DownloadPPT";
                    }
                Global.AjaxCall(options);
            });
        
    }
})(Holism || {})







