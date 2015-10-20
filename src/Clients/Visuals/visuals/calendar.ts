/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Elastcloud Ltd
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 *  Acknowledgements
 *  Layout inspired by Rick Wicklin and Robert Allison http://stat-computing.org/dataexpo/2009/posters/
 *  Original code by mbostock http://bl.ocks.org/mbostock/4063318
 *  Modified and integrated with love by Andy.
 */

/// <reference path="../_references.ts"/>


declare module D3 {
    export module Time {
        export interface Time {
            weekOfYear(x: any): any;//this is missin from d3.d.ts
        }
    }
}

module powerbi.visuals {
    import SelectionManager = utility.SelectionManager;
    export interface DateValue {
        date: Date;
        value: number;
        selector: SelectionId;
        dateStr: string;
        tooltipInfo?: TooltipDataItem[];
    };
    export interface CalendarViewModel {
        values: DateValue[][];
        yearsList: any[];
    };

    export class CalendarVisual implements IVisual {
        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: VisualDataRoleKind.Grouping,
                },
                {
                    name: 'Y',
                    kind: VisualDataRoleKind.Measure,
                },
            ],
            dataViewMappings: [{
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                    },
                    values: {
                        for: { in: 'Y' }
                    },
                    rowCount: { preferred: { max: 2 } }
                },
            }],
            dataPoint: {
                displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                properties: {
                    fill: {
                        displayName: data.createDisplayNameGetter('Visual_Fill'),
                        type: { fill: { solid: { color: true } } }
                    },
                }
            },
            labels: {
                displayName: data.createDisplayNameGetter('Visual_DataPointsLabels'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    },
                    color: {
                        displayName: data.createDisplayNameGetter('Visual_LabelsFill'),
                        type: { fill: { solid: { color: true } } }
                    },
                    labelDisplayUnits: {
                        displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
                        type: { formatting: { labelDisplayUnits: true } }
                    }
                }
            }
        };

        private drawMonthPath = false;
        private drawLegend = false;
        private drawLabels = true;
        private width = 1016;
        private height = 144;
        private cellSize = 18; // cell size
        private element: HTMLElement;
        private rect: D3.Selection;
        private selectionManager: SelectionManager;
        private maxDomain: number;
        private colors: IDataColorPalette;

        constructor(cellSizeOpt?: number) {
            if (cellSizeOpt) {
                this.cellSize = cellSizeOpt;
            }
        }

        public init(options: VisualInitOptions) {
            this.colors = options.style.colorPalette.dataColors;
            this.element = options.element.get(0);
            this.selectionManager = new SelectionManager({ hostServices: options.host });
        }

        public update(options: VisualUpdateOptions) {
            d3.select(this.element).selectAll("*").remove();
            var viewModel = this.convert(options.dataViews[0]);

            if (viewModel == null) return;

            this.maxDomain = viewModel.yearsList.map((year: number) => {
                return viewModel.values[year]
                    .map(dv => { return dv.value ? dv.value : 0; })
                    .reduce((p, c) => { if (c > p) { console.log(c, p); return c; } else { return p; } }, 0);
            }).reduce((p, c) => { if (c > p) { console.log(c, p); return c; } else { return p; } }, 0);

            console.log(this.maxDomain);
            this.draw(this.element, options.viewport.width, options.viewport.height, viewModel, this.colors);
            // this.apply(viewModel, CalendarVisual.maxDomain);
        }

        private renderTooltip(selection: D3.Selection): void {
            TooltipManager.addTooltip(selection, (tooltipEvent: TooltipEvent) => {
                return (<DateValue>tooltipEvent.data).tooltipInfo;
            });
        }

        private static getTooltipData(displayName: string, value: number): TooltipDataItem[] {
            return [{
                displayName: displayName,
                value: value < 0 ? "" : value.toString()
            }];
        }
        private prevSelection: D3.Selection;
        private draw(element, itemWidth: number, itemHeight: number, calendarViewModel: CalendarViewModel, colors: IDataColorPalette) {
            var colorScale = colors.getNewColorScale();
            var yearslist = calendarViewModel.yearsList;
            var format = d3.time.format("%Y-%m-%d");

            var svg = d3.select(element).selectAll("svg")
                .data(yearslist)
                .enter().append("svg");

            svg.attr("width", itemWidth)
                .attr("height", itemWidth / 7)
                .attr("viewBox", "-20 -20 " + (this.width - 20) + " " + (this.height + 4))
                .append("g")
                .attr("transform", "translate(" + (20 + (this.width - this.cellSize * 52) / 2) + "," + (20 + this.height - this.cellSize * 7 - 1) + ")");

            if (this.drawLabels) {
                var textGroup = svg.append("g").attr("fill", "#cccccc");
                textGroup.append("text")
                    .attr("transform", "translate(" + this.cellSize * -1.5 + "," + this.cellSize * 3.5 + ")rotate(-90)")
                    .style("text-anchor", "middle")
                    .text(function (d) { return d; });

                textGroup.append("text")
                    .style("text-anchor", "middle")
                    .text("M")
                    .attr("transform", "translate(" + this.cellSize * -0.75 + ")")
                    .attr("x", 0)
                    .attr("y", 2 * this.cellSize);

                textGroup.append("text")
                    .style("text-anchor", "middle")
                    .text("W")
                    .attr("transform", "translate(" + this.cellSize * -0.75 + ")")
                    .attr("x", 0)
                    .attr("y", 4 * this.cellSize);

                textGroup.append("text")
                    .style("text-anchor", "middle")
                    .text("F")
                    .attr("transform", "translate(" + this.cellSize * -0.75 + ")")
                    .attr("x", 0)
                    .attr("y", 6 * this.cellSize);

                textGroup.append("text")
                    .attr("transform", "translate(" + (this.width - (3 * this.cellSize)) + "," + this.cellSize * 3.5 + ")rotate(90)")
                    .style("text-anchor", "middle")
                    .text(function (d) { return d; });

                textGroup.selectAll(".month")
                    .data((d) => { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                    .enter()
                    .append("text")
                    .attr("transform", (d) => { return "translate(" + d3.time.weekOfYear(d) * this.cellSize + ", -5)"; })
                    .text((d) => { return d3.time.format("%b")(d); });
            }
            var pad = (n: any) => {
                if (n.toString().length === 1) {
                    return "0" + n;
                }

                return n.toString();
            };
            var quantizeColor =
                d3.scale.quantize()
                    .domain([0, this.maxDomain])
                    .range(d3.range(256).map(function (d) { return "#00" + pad(d.toString(16)) + "00"; }));

            (<any>window).quantizeColor = quantizeColor;
            this.rect = svg.selectAll(".day")
                .data((d, i) => {
                    return calendarViewModel.values[d]
                })
                .enter().append("rect")
                .attr("width", this.cellSize - 1)
                .attr("height", this.cellSize - 1)
                .attr("class", "day")
            // .attr("style", "stroke-width: 2px; stroke: #ffffff")
                .attr("style", (d) => { return "fill:" + (d.value == 0 ? "#ffffff" : quantizeColor(d.value)) })
                .attr("x", this.getXPosition)
                .attr("y", this.getYPosition)
                .on("mousedown", (d) => {
                    if (d.selector) {
                        this.selectionManager.select(d.selector);
                    }

                    if (this.prevSelection) {
                        var oldStyle = this.prevSelection.attr("oldStyle");
                        this.prevSelection.attr("style", oldStyle);
                    }

                    var rect = d3.select(d3.event.target);
                    var oldFill = rect.attr("style");
                    rect.attr("style", "stroke:#000000;stroke-width: 1px;" + oldFill);
                    rect.attr("oldStyle", oldFill);
                    this.prevSelection = rect;

                });

            // this.rect.append("title")
            //     .text(function (d) { return d; });
                
            this.renderTooltip(this.rect);

            // if (this.drawMonthPath) {
            svg.selectAll(".month")
                .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                .enter().append("path")
                .attr("class", "month")
                .attr("d", this.monthPath)
                .attr("stroke", "#bbbbbb");
            // }

            if (this.drawLegend) {
                var legendGroup = d3.select(this.element).insert("svg", ":first-child")
                    .attr("width", itemWidth)
                    .attr("height", itemWidth / 17.5)
                    .attr("viewBox", "0 0 " + this.width + " " + this.height / 7)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .append("g");

                legendGroup.append("rect")
                    .attr("width", this.cellSize)
                    .attr("height", this.cellSize)
                    .attr("x", 0).attr("y", 0)
                    .attr("fill", "#000000");

                legendGroup.append("rect")
                    .attr("width", this.cellSize)
                    .attr("height", this.cellSize)
                    .attr("x", 0).attr("y", this.cellSize * 1.5)
                    .attr("fill", "#00ff00");

                legendGroup
                    .append("text").text(0)
                    .attr("x", this.cellSize * 2).attr("y", this.cellSize);
                legendGroup
                    .append("text").text(d3.format(".4r")(this.maxDomain))
                    .attr("x", this.cellSize * 2).attr("y", this.cellSize * 2.5);
            }
            svg.on('mousedown', (d) => {
                this.selectionManager.clear();
            });
        }

        public static pad = (n: any) => {
            if (n.toString().length === 1) {
                return "0" + n;
            }
            return n.toString();
        };

        private convert(dataView: DataView): CalendarViewModel {
            if (dataView == undefined || dataView.categorical == undefined || dataView.categorical.categories == null) {
                window.console.log("no categoricals"); return;
            } else
                if (dataView.categorical.categories[0].values == undefined || dataView.categorical.categories[0].values == null) {
                    window.console.log("no categoricals"); return;
                }
            var returnSet = dataView.categorical.categories[0].values.map(
                (v, i) => {
                    if (dataView.categorical.values) {
                        var retVal = <DateValue> {
                            date: v,
                            value: dataView.categorical.values.map((val) => { return val.values[i]; })
                                .reduce((prev, curr) => { return prev + curr; }),
                            //selector:  SelectionId.createWithId(dataView.categorical.categories[0].identity[i]),
                            selector: visuals.SelectionIdBuilder.builder()
                                .withCategory(dataView.categorical.categories[0], i)
                                .withMeasure(dataView.categorical.values[0].source.queryName)
                                .createSelectionId(),
                            dateStr: v.getFullYear() + "-" + CalendarVisual.pad(v.getMonth()+1) +
                            "-" + CalendarVisual.pad(v.getDate())
                        }
                        retVal.tooltipInfo = CalendarVisual.getTooltipData(retVal.dateStr, retVal.value);
                        return retVal;
                    }
                    else return null;
                });

            var yearsList = this.getYears(returnSet);
            var daysList = new Array();
            for (var i = 0; i < yearsList.length; i++) {

                var daysofY = this.getDaysOfYear(yearsList[i]).map((d) => {
                    var activeDays = returnSet.filter((val) => {
                        return val.date.getTime() == d.getTime();
                    });
                    if (activeDays.length > 0) {
                        return activeDays[0];
                    }
                    return <DateValue>{
                        date: d,
                        dateStr: "",
                        value: 0
                    }
                });

                daysList[yearsList[i]] = daysofY;
            };
            return <CalendarViewModel> {
                values: daysList,
                yearsList: yearsList
            };
        }
        public getYears(values: DateValue[]) {
            var allYears = values.map((value) => {
                if (value == null || value.date == null || value.date == undefined || isNaN(Date.parse(value.date.toString()))) {
                    return 1900;
                };
                return value.date.getFullYear ? value.date.getFullYear() : null;
            });
            var uniqueYears = {}, a = [];
            for (var i = 0, l = allYears.length; i < l; ++i) {
                if (allYears[i] == null || uniqueYears.hasOwnProperty(allYears[i].toString())) {
                    continue;
                }
                a.push(allYears[i]);
                uniqueYears[allYears[i].toString()] = 1;
            }
            return a.sort();
        }

        private getDaysOfYear = (year: number) => { return d3.time.days(new Date(year, 0, 1), new Date(year + 1, 0, 1)); };
        public getXPosition = (date: DateValue) => { return (d3.time.weekOfYear(date.date) * this.cellSize); };
        public getYPosition = (date: DateValue) => { return (date.date.getDay() * this.cellSize); };
        private monthPath = (t0) => {
            var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0), d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0), d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
            return "M" + (w0 + 1) * this.cellSize + "," + d0 * this.cellSize + "H" + w0 * this.cellSize + "V" + 7 * this.cellSize + "H" + w1 * this.cellSize + "V" + (d1 + 1) * this.cellSize + "H" + (w1 + 1) * this.cellSize + "V" + 0 + "H" + (w0 + 1) * this.cellSize + "Z";
        };
    }
} 