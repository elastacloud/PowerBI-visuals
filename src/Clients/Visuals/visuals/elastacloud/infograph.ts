/// <reference path="../../_references.ts"/>

module powerbi.visuals {

    export interface ISvgComponent {
        name;
        attributes: [string[]];
        children: ISvgComponent[];
    }
    export interface IInfoGraphData {
        imageUris: string[];
        categories: string[];
        values: number[];
        resolution: number[];
        viewPort: number[];
        shouldOverlayLabels: boolean;
        title: string;
    }
    export interface ICoordinate {
        x: number;
        y: number;
    }

    export interface ImagesDataViewObjects extends DataViewObjects {
        general: ImagesDataViewObject;
    }

    export interface ImagesDataViewObject extends DataViewObject {
        imageUrls: string[];
    }
    
    export class InfoGraph implements IVisual {
        /*private data: IInfoGraphData = {
            imageUris: ["/Assets/asset1.svg",
                "/Assets/asset2.svg"],
            categories: ["Apples", "Oranges"],
            values: [1, 3],
            resolution: [6, 6],
            viewPort: [400, 300],
            shouldOverlayLabels: false,
            title: "Comparing 1 Apple to 3 Oranges"
        };*/
        private resolution: InfographicResolution;
        private svgContainer: D3.Selection;

        public init = (options: VisualInitOptions) => {
            //window.console.log(options);

            //d3.select(options.element.get(0)).append("h1").text(this.data.title);
            this.svgContainer = d3.select(options.element.get(0))
                .append("svg").attr("viewBox", "0 0 100 100")
                .attr("width", options.viewport.width).attr("height", options.viewport.height);
        };

        public onResizing(options: any) { }

        public onDataChanged(options: VisualDataChangedOptions) {
            window.console.log(this.convert(options.dataViews[0]));
            var data = this.convert(options.dataViews[0]);

            this.resolution = new InfographicResolution(100, 100,
                data.resolution[0], data.resolution[1]);

            var imageHW = this.resolution.getImageHeightWidth();
            var resMap = this.resolution.getMap();

            var cutOff = data.values[0] / (data.values[0] + data.values[1]);
            var offset = this.resolution.getBoundary(cutOff);

            var nth = 0;
            resMap.forEach((row, rowIdx) => {
                row.forEach((cell, idx) => {
                    var image = this.svgContainer.append("image")
                        .attr("x", cell.x).attr("y", cell.y)
                        .attr("width", imageHW).attr("height", imageHW);

                    if (nth < offset)
                        image.attr("xlink:href", data.imageUris[0]);
                    else
                        image.attr("xlink:href", data.imageUris[1]);

                    nth++;
                });
            });
            if (data.shouldOverlayLabels) {
                this.svgContainer.append("text").attr("text-anchor", "start").attr("x", 20).attr("y", 20).attr("fill", "#999999")
                    .text(data.values[0]);

                this.svgContainer.append("text").attr("text-anchor", "end").attr("x", 80).attr("y", 80).attr("fill", "#999999")
                    .text(data.values[1]);
            }
        };

        private convert(data: DataView): IInfoGraphData {
            var dataModel: IInfoGraphData = {
                imageUris: (<ImagesDataViewObjects>data.metadata.objects).general.imageUrls,
                categories: data.categorical.categories[0].values.map((val) => { return <string>val; }),
                values: data.categorical.values[0].values,
                resolution: [6, 6],
                viewPort: [400, 300],
                shouldOverlayLabels: false,
                title: "Comparing 1 Apple to 3 Oranges"
            };
            return dataModel;
        };
    }

    export class InfographicResolution {
        private width: number;
        private height: number;
        private viewBoxWidth: number;
        private viewBoxHeight: number;
        public constructor(viewBoxW: number, viewBoxH: number, width: number, height: number) {
            this.width = width;
            this.height = height;
            this.viewBoxWidth = viewBoxW;
            this.viewBoxHeight = viewBoxH;
        }
        public getImageHeightWidth() {
            return this.viewBoxWidth / this.width;
        }
        public getBoundary(factor: number) {
            return (this.width * this.height) * factor;
        }
        public getMap(): ICoordinate[][] {
            var ret = [];
            var size = this.getImageHeightWidth();
            for (var i = 0; i < this.height; i++) {
                var row = [];
                for (var j = 0; j < this.width; j++) {
                    row.push(<ICoordinate> { x: j * size, y: i * size });
                }
                ret.push(row);
            }
            return ret;
        }
    }
}