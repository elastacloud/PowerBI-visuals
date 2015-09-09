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
        private viewPort: IViewport;

        public init = (options: VisualInitOptions) => {
            //window.console.log(options);
            this.viewPort = options.viewport;

            //d3.select(options.element.get(0)).append("h1").text(this.data.title);
            this.svgContainer = d3.select(options.element.get(0))
                .append("svg").attr("viewBox", "0 0 120 120")
                .attr("preserveAspectRatio", "xMinYMin slice");

            this.setContainerSizeOptions();
        };

        private setContainerSizeOptions()
        {
            this.svgContainer
                .attr("width", this.viewPort.width).attr("height", this.viewPort.height);
        }

        public onResizing(options: any) { }

        public update(options: VisualUpdateOptions) {
            window.console.log('update');
            window.console.log(options);

            this.viewPort = options.viewport;
            this.setContainerSizeOptions();
            this.svgContainer.selectAll("*").remove();

            var data = this.convert(options.dataViews[0]);

            this.resolution = new InfographicResolution(100, 100,
                data.resolution[0], data.resolution[1]);

            this.draw(data);
        }

        public onDataChanged(options: VisualDataChangedOptions) {
            //window.console.log(options);
            window.console.log(this.convert(options.dataViews[0]));

            var data = this.convert(options.dataViews[0]);

            this.resolution = new InfographicResolution(100, 100,
                data.resolution[0], data.resolution[1]);

            this.draw(data);
        };

        private draw(data: IInfoGraphData) {
            var resMap = this.resolution.getMap();

            var cutOff = data.values[0] / (data.values[0] + data.values[1]);
            var offset = this.resolution.getBoundary(cutOff);

            var nth = 0;
            resMap.forEach((row, rowIdx) => {
                row.forEach((cell, idx) => {
                    var image = this.svgContainer.append("image")
                        .attr("x", cell.x).attr("y", cell.y)
                        .attr("width", this.resolution.getImageWidth()).attr("height", this.resolution.getImageHeight());

                    if (nth < offset)
                        image.attr("xlink:href", data.imageUris[0]);
                    else
                        image.attr("xlink:href", data.imageUris[1]);

                    nth++;
                });
            });
            if (data.shouldOverlayLabels) {
                this.svgContainer.append("text").attr("text-anchor", "start").attr("x", 20).attr("y", 20).attr("fill", "#999999")
                    .text(Math.round(data.values[0]));

                this.svgContainer.append("text").attr("text-anchor", "end").attr("x", 80).attr("y", 80).attr("fill", "#999999")
                    .text(Math.round(data.values[1]));
            };
        };

        private convert(data: DataView): IInfoGraphData {
            window.console.log(this);
            var resolutionW = this.viewPort.width / 100;
            var resolutionH = this.viewPort.height / 100;    

            var dataModel: IInfoGraphData = {
                imageUris: (<ImagesDataViewObjects>data.metadata.objects).general.imageUrls,
                categories: data.categorical.categories[0].values.map((val) => { return <string>val; }),
                values: data.categorical.values[0].values,
                resolution: [ resolutionW, resolutionH],
                viewPort: [ this.viewPort.width, this.viewPort.height],
                shouldOverlayLabels: true,
                title: "Comparing 1 Apple to 3 Oranges"
            };

            console.log(dataModel.resolution);
            return dataModel;
        };
    };

    export class InfographicResolution {
        public width: number;
        public height: number;
        private viewPortWidth: number;
        private viewPortHeight: number;
        public constructor(viewPortWidth: number, viewPortHeight: number, width: number, height: number) {
            this.width = width;
            this.height = height;
            this.viewPortWidth = viewPortWidth;
            this.viewPortHeight = viewPortHeight;
        }
        public getImageWidth() {
            return this.viewPortWidth / this.width;
        }
        public getImageHeight() {
            return this.viewPortHeight / this.height;
        }
        public getBoundary(factor: number) {
            return (this.width * this.height) * factor;
        }
        public getMap(): ICoordinate[][] {
            var ret = [];
            for (var i = 0; i < this.height; i++) {
                var row = [];
                for (var j = 0; j < this.width; j++) {
                    row.push(<ICoordinate> { x: j * this.getImageWidth(), y: i * this.getImageHeight()});
                }
                ret.push(row);
            }
            return ret;
        }
    }
}