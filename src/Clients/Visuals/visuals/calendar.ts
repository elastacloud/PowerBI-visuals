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
    export interface DateValue {
        date: Date;
        value: number;
    };
    export interface CalendarViewModel {
        values: DateValue[];
    };

    export class CalendarVisual implements IVisual {
        private drawMonthPath = true;
        private drawLegend = true;
        private drawLabels = true;
        private width = 1016;
        private height = 144;
        private cellSize = 18; // cell size
        private element: HTMLElement;
        private rect: D3.Selection;

        constructor(cellSizeOpt?: number)
        {
            if (cellSizeOpt) {
                this.cellSize = cellSizeOpt;
            }
        }

        public init(options: VisualInitOptions) {
            this.element = options.element.get(0);
        }

        public update(options: VisualUpdateOptions) {
            d3.select(this.element).selectAll("*").remove();
            var viewModel = this.convert(options.dataViews[0]);

            var maxDomain = Math.max.apply(Math,
                viewModel.values.map((v) => {
                    return v.value;
                })
            );
            this.draw(this.element, options.viewport.width, options.viewport.height, this.getYears(viewModel), maxDomain);
            this.apply(viewModel, maxDomain);
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
        }

        public onResizing(viewport: IViewport): void {
        };
        
        private draw(element, itemWidth: number, itemHeight: number, range: number[], maxDomain: number)
        {
            var format = d3.time.format("%Y-%m-%d");
            
            var svg = d3.select(element).selectAll("svg")
                .data(range)
                .enter().append("svg")
                .attr("width", itemWidth)
                .attr("height", itemWidth / 7)
                .attr("viewBox", "0 0 " + this.width + " " + this.height)
                .append("g")
                .attr("transform", "translate(" + ((this.width - this.cellSize * 52) / 2) + "," + (this.height - this.cellSize * 7 - 1) + ")");

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

            this.rect = svg.selectAll(".day")
                .data(this.getDaysOfYear)
                .enter().append("rect")
                .attr("width", this.cellSize)
                .attr("height", this.cellSize)
                .attr("class", "day")
                .attr("style", "fill: #eeeeee; stroke-width: 2px; stroke: #ffffff")
                .attr("x", this.getXPosition)
                .attr("y", this.getYPosition)
                .datum(format);

            this.rect.append("title")
                .text(function (d) { return d; });

            if (this.drawMonthPath) {
                svg.selectAll(".month")
                    .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                    .enter().append("path")
                    .attr("class", "month")
                    .attr("d", this.monthPath)
                    .attr("stroke", "#cccccc");
            }

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
                    .append("text").text(d3.format(".4r")(maxDomain))
                    .attr("x", this.cellSize * 2).attr("y", this.cellSize * 2.5);
            }
        }

        private apply(viewModel: CalendarViewModel, maxDomain: number)
        {            
            var pad = (n: any) => {
                if (n.toString().length === 1) {
                    return "0" + n;
                }

                return n.toString();
            };

            var quantizeColor =
                d3.scale.quantize()
                    .domain([0, maxDomain])
                    .range(d3.range(256).map(function (d) { return "#00" + pad(d.toString(16)) + "00"; }));

            
            var data = d3.nest()
                .key(function (d: DateValue) { return d.date.getFullYear() + "-" + pad(d.date.getMonth()) + "-" + pad(d.date.getDate()); })
                .rollup(function (d: DateValue[]) { return d.map((dateValue) => { return dateValue.value; }).reduce((prev, curr) => prev + curr);  })
                .map(viewModel.values);

            this.rect.filter(function (d) { return d in data; })
                .attr("style", function (d) { return "fill:" + quantizeColor(data[d]); })
                .select("title")
                .text(function (d) { return d + ": " + d3.format(".6f")(data[d]); });
        }

        private convert(dataView: DataView): CalendarViewModel {
            var returnSet = dataView.categorical.categories[0].values.map(
                (v, i) => {
                    return <DateValue> {
                        date: v,
                        value: dataView.categorical.values.map((val) => { return val.values[i]; })
                            .reduce((prev, curr) => { return prev + curr; })
                    };
            });

            return <CalendarViewModel> {
                values: returnSet
            };
        };
        public getYears(viewModel: CalendarViewModel) {
            var allYears = viewModel.values.map((value) => { return value.date.getFullYear(); });
            var uniqueYears = {}, a = [];
            for (var i = 0, l = allYears.length; i < l; ++i) {
                if (uniqueYears.hasOwnProperty(allYears[i].toString())) {
                    continue;
                }
                a.push(allYears[i]);
                uniqueYears[allYears[i].toString()] = 1;
            }
            return a.sort();
        };
        private getDaysOfYear = (year: number) => { return d3.time.days(new Date(year, 0, 1), new Date(year + 1, 0, 1)); };
        public getXPosition = (date: Date) => { return d3.time.weekOfYear(date) * this.cellSize; };
        public getYPosition = (date: Date) => { return date.getDay() * this.cellSize; };
        private monthPath = (t0) => {
            var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0), d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0), d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
            return "M" + (w0 + 1) * this.cellSize + "," + d0 * this.cellSize + "H" + w0 * this.cellSize + "V" + 7 * this.cellSize + "H" + w1 * this.cellSize + "V" + (d1 + 1) * this.cellSize + "H" + (w1 + 1) * this.cellSize + "V" + 0 + "H" + (w0 + 1) * this.cellSize + "Z";
        };
    }
} 