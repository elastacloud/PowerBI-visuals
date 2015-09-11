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

module powerbi.visuals.sampleDataViews {
    import DataViewTransform = powerbi.data.DataViewTransform;

    export class SimpleInfographData extends SampleDataViews implements ISampleDataViewsMethods {

        public name: string = "SimpeInfographData";
        public displayName: string = "Infograph data";

        private dataValues: number[] = [75, 25];

        public visuals: string[] = ['infograph',
        ];

        private sampleImages = [
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABfCAMAAAC5kuvHAAAAYFBMVEX///8AAAAUFBTHx8csLCzLy8upqalERESQkJDt7e339/d2dnYXFxcwMDCwsLDQ0NBUVFSKiorb29tbW1u/v7+CgoIPDw+enp5OTk6Wlpbi4uIjIyMeHh44ODhvb29oaGhJ+XQrAAABiElEQVRoge3ZyZKDIBAGYIjjAkaQRYlG4/u/5RCjiVnnQFM1M9X/RU4fAUXSQggGs4Rrmcg+Gi8Lk+eHKWNxeFvTOe1Jx+DTka6ZYozA0FscPK83PB05uN9tfQr/EJV3vgT3m8i+uPPh559v+RO8T9yNH1J4nrDrHT5mEXjfQZEPLW2PtYjC+6SZajoR4e3Dey19tE5squdmD/gK4ladTD3HmKUxlQ5qDcimoi/S1jAbQWpe6fNzVAB0oOt3PKV7F7zOmHrP+xEELzT5cu6vaQJniLv2o58HLgbWfOTpYAP98rO/z8Lu8E/+DsY/5E/woQL0rds9+F+iAfSl2D/4VVJE9hX66KOPPvro/1afz2X1yMTj/lul9nIJ4i8D8H+isqf9PeV+AG3gz5976L2x+srmq09Ir8GKmNUvko0PGPTRRx999NFHH3300f9P/lpfdHr5mj7CnmLoy+FpZfnyvbsE5f0Azh1UHSOyHHzLgB/CJF1T2HO90gulXIwzHrZWQyzSATnm7+UbMrcgJvOwNvQAAAAASUVORK5CYII=',
            'data:image/png;base64,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',
        ];

        public getDataViews(): DataView[] {
            var fieldExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: "table1", column: "fruits" });

            var categoryValues = ["Apples", "Oranges"];
            var categoryIdentities = categoryValues.map(function (value) {
                var expr = powerbi.data.SQExprBuilder.equal(fieldExpr, powerbi.data.SQExprBuilder.text(value));
                return powerbi.data.createDataViewScopeIdentity(expr);
            });

            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'Fruit',
                        queryName: 'Fruit',
                        type: powerbi.ValueType.fromDescriptor({ text: true })
                    },
                    {
                        displayName: 'Quantity',
                        isMeasure: true,
                        queryName: 'quantity1',
                        type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                    }
                ],
                objects: { general: { imageUrls: this.sampleImages } }
            };
            var columns = [
                {
                    source: dataViewMetadata.columns[1],
                    values: this.dataValues,
                },
            ];

            var dataValues: DataViewValueColumns = DataViewTransform.createValueColumns(columns);

            return [{
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                        objects: [
                            {
                                dataPoint: {
                                    fill: {
                                        solid: {
                                            color: 'rgb(165, 172, 175)'
                                        }
                                    }
                                }
                            },
                            {
                                dataPoint: {
                                    fill: {
                                        solid: {
                                            color: 'rgb(175, 30, 44)'
                                        }
                                    }
                                }
                            },
                        ]
                    }],
                    values: dataValues,
                },
            }];
        }

        public randomize(): void {
            var randomPercentile = Math.random() * 100;

            this.dataValues = [
                randomPercentile, 100 - randomPercentile
            ];
        }

    }
}