/*
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
    export class CalendarVisual implements IVisual {
        private width = 960;
        private height = 136;
        private cellSize = 17; // cell size
        private element: HTMLElement;
        public init(options: VisualInitOptions) {
            this.element = options.element.get(0);
            this.draw(this.element, options.viewport.width, options.viewport.height);
        }
        
        private draw(element, itemWidth: number, itemHeight: number)
        {
            var quantizeColor =
                d3.scale.quantize()
                    .domain([-.05, .05])
                    .range(d3.range(11).map(function (d) { return "q" + d + "-11"; }));

            var percent = d3.format(".1%"),
                format = d3.time.format("%Y-%m-%d");
            
            var svg = d3.select(element).selectAll("svg")
                .data(d3.range(1990, 2011))
                .enter().append("svg")
                .attr("width", itemWidth)
                .attr("height", this.height)
                .attr("viewBox", "0 0 " + this.width + " " + this.height)
                .attr("class", "RdYlGn")
                .append("g")
                .attr("transform", "translate(" + ((this.width - this.cellSize * 53) / 2) + "," + (this.height - this.cellSize * 7 - 1) + ")");

            svg.append("text")
                .attr("transform", "translate(-6," + this.cellSize * 3.5 + ")rotate(-90)")
                .style("text-anchor", "middle")
                .text(function (d) { return d; });

            var rect = svg.selectAll(".day")
                .data(this.getDaysOfYear)
                .enter().append("rect")
                .attr("class", "day")
                .attr("width", this.cellSize)
                .attr("height", this.cellSize)
                .attr("x", this.getXPosition)
                .attr("y", this.getYPosition)
                .datum(format);

            rect.append("title")
                .text(function (d) { return d; });

            svg.selectAll(".month")
                .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                .enter().append("path")
                .attr("class", "month")
                .attr("d", this.monthPath);

            d3.csv("dji.csv", function (error, csv) {
                if (error) throw error;

                var data = d3.nest()
                    .key(function (d) { return d.Date; })
                    .rollup(function (d) { return (d[0].Close - d[0].Open) / d[0].Open; })
                    .map(csv);

                rect.filter(function (d) { return d in data; })
                    .attr("class", function (d) { return "day " + quantizeColor(data[d]); })
                    .select("title")
                    .text(function (d) { return d + ": " + percent(data[d]); });
            });

            d3.select(self.frameElement).style("height", "2910px");
        }

        public update(options: VisualUpdateOptions) {
            d3.select(this.element).selectAll("*").remove();
            this.draw(this.element, options.viewport.width, options.viewport.height);
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
        }

        public onResizing(viewport: IViewport): void {
        };

        private getDaysOfYear = (year: number) => { return d3.time.days(new Date(year, 0, 1), new Date(year + 1, 0, 1)); };
        private getXPosition = (date: Date) => { return d3.time.weekOfYear(date) * this.cellSize; };
        private getYPosition = (date: Date) => { return date.getDay() * this.cellSize; };
        private monthPath = (t0) => {
            console.log(t0.getFullYear());
            var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
                d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
            return "M" + (w0 + 1) * this.cellSize + "," + d0 * this.cellSize
                + "H" + w0 * this.cellSize + "V" + 7 * this.cellSize
                + "H" + w1 * this.cellSize + "V" + (d1 + 1) * this.cellSize
                + "H" + (w1 + 1) * this.cellSize + "V" + 0
                + "H" + (w0 + 1) * this.cellSize + "Z";
        };
    }
} 