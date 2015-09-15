﻿/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
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
        private width = 1016;
        private height = 144;
        private cellSize = 18; // cell size
        private element: HTMLElement;
        private rect: D3.Selection;

        public init(options: VisualInitOptions) {
            this.element = options.element.get(0);
        }

        public update(options: VisualUpdateOptions) {
            d3.select(this.element).selectAll("*").remove();
            var viewModel = this.convert(options.dataViews[0]);
            this.draw(this.element, options.viewport.width, options.viewport.height, this.getYears(viewModel));
            this.apply(viewModel);
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
        }

        public onResizing(viewport: IViewport): void {
        };
        
        private draw(element, itemWidth: number, itemHeight: number, range: number[])
        {
            var format = d3.time.format("%Y-%m-%d");
            
            var svg = d3.select(element).selectAll("svg")
                .data(range)
                .enter().append("svg")
                .attr("width", itemWidth)
                .attr("height", itemWidth / 7)
                .attr("viewBox", "0 0 " + this.width + " " + this.height)
                .append("g")
                .attr("transform", "translate(" + ((this.width - this.cellSize * 54) / 2) + "," + (this.height - this.cellSize * 7 - 1) + ")");

            svg.append("text")
                .attr("transform", "translate(-6," + this.cellSize * 3.5 + ")rotate(-90)")
                .style("text-anchor", "middle")
                .text(function (d) { return d; });

            svg.append("text")
                .attr("transform", "translate("+ (this.width - (3*this.cellSize)) + "," + this.cellSize * 3.5 + ")rotate(90)")
                .style("text-anchor", "middle")
                .text(function (d) { return d; });

            this.rect = svg.selectAll(".day")
                .data(this.getDaysOfYear)
                .enter().append("rect")
                .attr("width", this.cellSize)
                .attr("height", this.cellSize)
                .attr("class", "day")
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
                    .attr("stroke", "#aaaaaa");
            }
        }

        private apply(viewModel: CalendarViewModel)
        {            
            var quantizeColor =
                d3.scale.quantize()
                    .domain([0, 100])
                    .range(d3.range(256).map(function (d) { return "#00" + d.toString(16) + "00"; }));

            var pad = (n: number) => {
                if (n.toString().length === 1) {
                    return "0" + n;
                }

                return n.toString();
            };
            
            var data = d3.nest()
                .key(function (d: DateValue) { return d.date.getFullYear() + "-" + pad(d.date.getMonth()) + "-" + pad(d.date.getDate()); })
                .rollup(function (d: DateValue[]) { return d.map((dateValue) => { return dateValue.value; }).reduce((prev, curr) => prev + curr);  })
                .map(viewModel.values);

            this.rect.filter(function (d) { return d in data; })
                .attr("style", function (d) { return "fill:" + quantizeColor(data[d]); })
                .select("title")
                .text(function (d) { return d + ": " + d3.format(".1%")(data[d]/100); });
        }

        private convert(dataView: DataView): CalendarViewModel {
            return <CalendarViewModel> {
                values: [<DateValue> { date: new Date(1990, 1, 1), value: 20 },
                    <DateValue> { date: new Date(1990, 1, 2), value: 15 },
                    <DateValue> { date: new Date(1990, 1, 3), value: 9 },
                    <DateValue> { date: new Date(1990, 1, 4), value: 60 },
                    <DateValue> { date: new Date(1990, 1, 5), value: 35 },
                    <DateValue> { date: new Date(1973, 1, 6), value: 150 },
                    <DateValue> { date: new Date(1990, 1, 7), value: 19 },
                    <DateValue> { date: new Date(1990, 1, 9), value: 60 },
                    <DateValue> { date: new Date(1990, 1, 10), value: 75 },
                    <DateValue> { date: new Date(1990, 1, 11), value: 99 },
                    <DateValue> { date: new Date(1990, 1, 12), value: 19 },
                    <DateValue> { date: new Date(1973, 2, 19), value: 17 }]
            };
        };
        private getYears(viewModel: CalendarViewModel) {
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
        private getXPosition = (date: Date) => { return d3.time.weekOfYear(date) * this.cellSize; };
        private getYPosition = (date: Date) => { return date.getDay() * this.cellSize; };
        private monthPath = (t0) => {
            var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0), d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0), d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
            return "M" + (w0 + 1) * this.cellSize + "," + d0 * this.cellSize + "H" + w0 * this.cellSize + "V" + 7 * this.cellSize + "H" + w1 * this.cellSize + "V" + (d1 + 1) * this.cellSize + "H" + (w1 + 1) * this.cellSize + "V" + 0 + "H" + (w0 + 1) * this.cellSize + "Z";
        };
    }
} 