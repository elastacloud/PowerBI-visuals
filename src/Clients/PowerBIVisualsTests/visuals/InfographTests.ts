
/// <reference path="../_references.ts"/>

module powerbitests {
    import infographVisual = powerbi.visuals.InfoGraph;
    import InfographicResolution = powerbi.visuals.InfographicResolution;

    describe("InfographVisuals", () =>
    {
        var builder: InfographVisualDataBuilder;

        beforeEach(() => {
            builder = new InfographVisualDataBuilder();
        });

        it("wonkydata!", () => {
            builder.onDataChanged();
            //expect(builder.infograph
        });
    });

    describe("InfographicResolution", () => {
        var resolution: InfographicResolution;

        it("can handle a square", () => {
            resolution = new InfographicResolution(100, 100, 100, 100);
            var map = resolution.getMap();

            expect(map.length === 100);
            expect(map[0].length === 100);
        });

    });

    class InfographVisualDataBuilder {
        private _element: JQuery;

        public get element(): JQuery {
            return this._element;
        }

        public get imageBackgroundElement(): JQuery {
            return this._element.find('.imageBackground');
        }

        private _hostService: powerbi.IVisualHostServices;

        private _style: powerbi.IVisualStyle;

        private _image: infographVisual;

        public get infograph(): infographVisual {
            return this._image;
        }

        private _imageUrl: string;

        public get imageUrl(): string {
            return this._imageUrl;
        }

        public set imageUrl(value: string) {
            this._imageUrl = value;
        }

        private _imageScalingType: string;

        public get imageScalingType(): string {
            return this._imageScalingType;
        }

        public set imageScalingType(value: string) {
            this._imageScalingType = value;
        }

        constructor() {
            this._element = powerbitests.helpers.testDom("200", "300");
            this._hostService = mocks.createVisualHostServices();
            this._style = powerbi.visuals.visualStyles.create();
            this._image = new infographVisual();

            this.init();
        }

        private init() {
            this.infograph.init({
                element: this._element,
                host: this._hostService,
                style: this._style,
                viewport: {
                    height: this._element.height(),
                    width: this._element.width()
                },
                animation: {
                    transitionImmediate: true
                }
            });
        }

        public onDataChanged() {

            var objects: powerbi.DataViewObjects = {
                general: {
                    imageUrls: ['about:blank','about:blank']
                }
            };
            

            this.infograph.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [],
                        objects: objects
                    }
                }]
            });
        }
    }
}