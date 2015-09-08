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

        private dataValues: number[] = [90, 30];

        public visuals: string[] = ['infograph',
        ];

        private sampleImages = [
            'data:image/jpeg;base64,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',
            'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxQTEhUUExIVFhUXFxUXGBcYFBQVFxgXGBgXHBcXFxgYHCggGBolHBQUITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGywkHyQsLCwsLCwsLDcsLCwsLCwsLDQsLCwsLCwvLy0sLCwsLCwsLCwsNCwsLCwsLCwsLDQsNP/AABEIANwA5QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwQCBQYBB//EADUQAAEDAgQEBAUEAgMBAQAAAAEAAhEDIQQxQVEFEmFxgZGh8AYiscHREzJC4VLxBzNiFSP/xAAaAQACAwEBAAAAAAAAAAAAAAAAAwECBAUG/8QALxEAAgIBAwIDBwMFAAAAAAAAAAECEQMEEiEFMRNBURQiYXGBkfAyoeFCUsHR8f/aAAwDAQACEQMRAD8A+4oiIAIiIAIiIAIirY7H06TS6o4AAT18kAWUXG474zn/AKm8rf8AJ2d4/jkDfqudxnxDiHc3NXcMrMPLEiQJbF46JUsyQt5Yo+qIvjZxhJvUqTnP6pc64m481aOJrtgsxFUdnPzJtkb6JftHwK+MvQ+tIvn3DPirEM5Q7lqiwOjoOoPfuup4Z8R0ax5ZLHzHK60nocj2z6K8c0X8C8Zpm4RETi4REQAREQAREQAREQAREQAREQAREQAREQAREQARFz/H+OCnLWkRyuJO8DJqCG6JeM8ebTlrCC7U5gfk3XE43FOeSXOk3k818gRPYL2pWbzXN45suXQzJ/jEeHy3yXPY7GcwkGC5og5ENbZpibNOxSMk0ZpzslxVeTlAF9wZi5VSo8b/AE1z3tmoqmKLoLZJECQAZIG35UNJrzpmSdjLozjMLJOQpk76xFoyNySL9vI+a2mDxct0NpiR/l17gf6WrZhnGbjKciYytJj2FZpcP6uzk5bkm855ZKibvgmzYvbyn5SbxsIJ32tN1fpObVEOEOiJgZla+nhHXHO7vAv69FPh8C4Xa6L7advwrpP0JTOu4Hxh9MinWPMwmGuNy3buPX6LrAZXzfCvfEEtO2ekWuF1XBOIcoDXft015ek7LTilt4b+5phNM36Lwm1lFhsQ14kaEgjUOGYPVaLV0MomRUsfxSnScxr3taXzHM4NFupVqlVDhIMhG5XQGaIikAiIgAiIgAiIgAiIgAiIgAiLWcax/wCm3laYe7IgSWjVyCG6IuLcTgFrL6GL3y5ZGS4rifEGu5XTctcG5xzGGmPEQD0lX8VBaBMgyeVuZBvLtASbzOyqNwbLEMAa0QLT8o0aCquxEm2aQtc8QYOfMTcEtz+WYgnWbXVOphRIDpNpL3TygHUTAOw+y3gouqcwu0CJI1taJ0Fx1RnCKlflbSYSz+R5obGgnI3E5jIBIlGxVNmna5ogRJzAvNoiwsCeizcOUkRMi4DZiMySBYrtcL8FOP8A2VAzWGy45RAJsB5rYngmFoABzTUcBA5jJ8YgJc1ti5SaSGw085OkcPQA5ZaDcEWi4BMCATPoruH4c8iA0m2cRPjl4Lp2kEHlY1g2Y1o8zqojV9O65WXqccfKja9exuh01vuzU/8AzqvLAaAYzc4Z9QLqz/8AMcP5N8ir3MTOnn9FkHZQZ7LO+rZXdJIcun413spU+HEH9wm0kA3VttEN1KsMbulSjY9FL1+olF+X0LR0uFPsG8TfTGXM3z/tcb8RfFJpYg1qFX9MuYBUYW8zXOaf3AaGIF107aomP95r5P8A8mYgOxbgwfta1pj/ACiT76K+i1WXNPY3aX3RGbBHGtx7h8ZiOKY1vO6XOdytH8WjeNgJPgvvuAwjaNNtNghrQAPyepz8V8P/AOLn0ab31KtRrHRys5jy6/Nn2X17C49wvIc3PP6FdVaqGObUl9TNDA3G13N0ihw+Ia8WPhqplvjJSVxdoo006YREViAiIgAiIgAiIgAiIgCLE1wxpcdPXouMxVc1HfMZJk2iJsIjOBfwXV4uiaogEBu8HMHRVaPw/TF3FzvGAoZSSbOYxNdoEO5ibhrWgy50wcrndY/DHw9iTzuq8zGOI5WPe5xaNbHUyu6oYZjP2tA8L+amUONuyPD5tmqw3AaTTzOHOf8A1EDsPzK2jWgCAIC9VHG4j+LfE/ZROSgrHQhbpEeOxxu2nnv9gtaAb6nWTvurL7C2eVzAVfEODZyg59Tv2hcbUuUnuk/9L88zoY4qKpFXEPAFr62k217Kq6tGkTkBmBusHVRMzDMgDa3Qeea1uJx17A95K4WX3uV9vz9jfjh5GxGJFr3k3/AU1LE+8iO0rnquOm7c9dfLZKFd5Ihp8ikbGuR/g2jt8M8FucyjiciB+Vz9H9UZMdHS/wBE4txg06ZJa4RuCtkdRvjTX8mN6Z7uGQcWxooio8mOW/cxbzK+UHFGpWJMOc9xLgSYdJmDF9/Nbz4zx1Z1JtuZhMyLnpPS5Uf/AB7wovLqzmghpDWk3g6kD3mtmmxLT4ZZO5mnL2iaj2rgu4P4NLqwcBFMwYmWDKReHX7L6YzDui8AbDLwWvpO5SIlbjBl2cLN7RLUy2yXH53HSwxw+9E9oM5CHA3Hu62+Hx4dZ1j6LXnqIXjmLo6acsHEO3oZskVk/Ub1Fq8HjeX5X5b7d1tF2sOaOWNxMU4ODphEROKBERABERABERAHgC9REAEReEoAgxlflEDM+5WvNgetkrVpdJ9ibKF1XyHgD065rDkybmbcePajDGV2gGcgM/rHVavEPe7ldDWucSADc8vZehwh7gS4kxJs0TsdGj8KlxCvLnlpktYANLEwY9PNcrUT3K/2+/n8l/02Y406IMVyzBdO5yl32A2UDMOD+4SLa5fhUquJ5bCCe03tafD6rxuKmx2AsFypJ3ZujFpGzp06YgxPhnv9FZZUPQeC0wqg25j4qeiHcp9ykzi2S4+p0OFxRymOqx4iOZpBvIvIEZLW4WoQJNypKeN53RoI8So8SWzbYrwve3I5ujwnEgcvyvYHSxrjBDII5Zi+kTstrwqi4saGt5YkOa+xzysSJldPRiROn3Wv4jSDKlsjdPlkn4bd+dClDHPJ+nnyMXlwiWmN8/op8FxDQ5K5wypzDeN1LWwLHHKJ8FGPTzaWSDCeWNuM0WW1J2I95oMrHw0WvpMfTNzLVdovH8YXSw59/EuH6P8Ax8DLOFdux5Uj6qzwzH/xcex+ygeTBgeByVSuwgk9vf1UvPPBNTj9fz6EbIzW1nUIqPCsZ+o2D+5tj12KvL0WLLHLBTj2ZzpwcJbWEREwqEREAEREAEREAFR4riOVvfPsry57i9eX59APMD1lZtVl2Y+O7H6eG6ZFzk6wDvvOQWNZwDbkXEZTPh7zUbBYkn9xuALjaFQx2KE8sHLO+2vguS8u2Ns6KjbpFbiOIj5B+0AC+VtY1y9Voq2KP7ua9gffRWOIvaGukmSLGddfoPJamq8nIR0zyAhc+fvdzdihwGvnVZ0gZVZjozF9Pv8AVWKNP/0ltGmixRN7q3QeZg3E2vmq1MER281cptFjPqkSIZcNUhjtInv1CxwJyvksX1uY5i+f5Kz5OUjVpkT7slyXAvyo3NPEWg6rGt8wAjRUqNYRyqek/mH/AK3vZXjJPhidm12Y4GvyvLTIM+C236+/9eC0rqnzfMbixke+ivgy2Aex2V8UttpFc0E2mzYNqTmsf0wO3v0VFtSLTJVmk+YKfHJfDMzg12Jw6NvNRFsyD/rZYueMtc4KjNaC4dB1yRknF9+38fiCMX5EmExPJUBGVpvaDmupXDvOXUT6n8Lq+D1uak2cxY+GXpC39D1LblifzRn12Kkp/QuoiL0RzgiIgAiIgAiIgCOvU5Wlx0BK5TEmXA9ctDEi/SSuj4qf/wAz1geq5PFONh94zhcfqc2qR0dFHhsHExIEE5bev3VKs8NBy5oiRpEmJHZY4iqbZQJO3ZafEmAYOsnaNhOa43iOzpRx2Q4+qXw6b5AdNCqrcv3XmSftPn5qOu6TnNpzgf2VGYj+9fY9VJrjGlRm8wPupKYBm/gqzQPRSNdp793UNDKLVN4mFaZXA6jJa5gIyup3NP01+yU0RSLpeLEHXJXKbzpvoFqsM+cplW6LiDYpUokOJsHVjrmBH4WdHEQqNaocydhv6rKnWhUaK7OC4+vMHPvoVPSqwYJG1vdlTbyGzh4grN1OAYHMLEHUIq+SHFdjah24E9/dkFUbG+ypMqkjptqs+aLtBjW9lbfYjwy8agH7c9zlAUP6xAMxectZOqgvkZjMxp3XjnTEdAFR5JELGjI1Jj0XQfDFSzm9j781zZzW9+Hn/OOoIP2WvpMtuqixOsjeJnSoiL2hwAiIgAiIgAiIgCnxX/r8fsVxWNdnp+fvkF23FP8ArPu+nrC4bHCba59NJHmuL1Vdjq9P7GsqVySfGFTNxEiw7yfxdZlwk7i3br9VVrG2cQBouIkddIq1TIuI0lVx397rPEP6qNzdPfVOQ5GU/VeTKxcbkLJjot+EEkoqKVtTZQfqG0jSycwOVraKrQIsU6sXm6s0Xmc1QDoOisA5XVJItRsWvIkHI9iCvKjYi9ot+FWY4jPJTtsc5FkpqiOxM0zkJjqrAdsesZd1RebyBGtlfwFRsXCo0isuFZKzmzi26mbVAEgRvfVRUagGYnZGnOAI2P0Sxb5JhU63OeymeRlp0VWm4qZptKoysketGS3HBXfO3q765LUNbuVuuEt+dttW598vJdDpsX4qZl1L9xnUIiL2Z50IiIAIiIAIiIAq8SbLD0uuGxpInvI7GJld9imyxw6FcJxNp5rG15Hfb08ly+pRtJnR0L7o5+qM95y7qjigZtmfJbTENnO2Y9f7WsxAMk3XB20duDKFTPa/mvCFk833usKgj7K40xnQpfpCydvosH/66qQMm5hZdZUbPC+fvRZtHmhl0Zsd0UtNyhp7KYNvCoyxZmFlz2G6hFypGCUtogm540/Cmo1IFrBQuFgs26KjILrXqfnLjuqjDZTB03SWijRapPORNvNWGqpTVsDbz+sKlWxcibDsn3r7K33CRNTSxt4D35rUYQZdR5d1vuCUrk7CPW59F3umYqa+5zdZP3WbhERejOIEREAEREAEREAeELiOLUSHwNz53+/1XcLm/iTC3kWDoM9co8vqsmshux/I16Se2depx2OpCD2E+v5Wqq3gzfLx2K3mLbY9beG/vZaeozTWV53IqZ3cb4NfUp+ixIveI1/pWKrLyo3DRUHlZ7L5DJYTfSN5VipT2sfdlgWzmFNkpmEIbD8L39O1wsmM8o8UFkxScZVhziFhSYREkKZrfrnmqMmz1otJUjR5QvA38KQNzJiPsqMhscthtqpmjb31XjBnspGDMk2sqMHIkA09hTHTyUbWwCpQ2feqW0VsmA81cpDIe49n0UDaX9q7h7jLt4JmLHb5EzlwXsMzpnH+l0vD6IaxoGy1HDMJJEgkZnZb8Beq0WLbGzh6zJb2o9REW4whERABERABERABVuIYb9RhbrmO6sooatUyU2naPnfEKJbIIg3HmtJWYJnbXrqu/wDiXhfMP1GZ/wAgNtwuKxLIJHX2V53WYXjmd3S5lONmrez1Ub6fRW301ByrCbkysW21WBbp9VYI6LHllFliJrV4+nPZSsabybLNtPawUWTZE1msXUv6ckdF6KXp5KUMVbJs8DfRTOGi8a3bxUgbdVYNho/tZgeP0XoHv7qVrFUq2eRKtMEBRU2qyxklSlZRszY1bLCUMt4i2fh5qth6S6fg2DgcxHb8rqaLS75GLU59kS9gqHK3qVYRF6JKlSOE227YREUkBERABERABERABERABcn8RcDj56Y+XUf49ey6xRYg2Ss2GOWO2Q3FlljlaPllajCqVWFdtxLhDXS5gAO2QP4XM4rClsgghee1GknjfwO3g1MZmqLVjyq26mouRYmmjapEJavWt7qQNWTWqGTZiGnKSpGhAFI0KrA8DVIBdZBqzAVSLPGiFnyoximY1SlZDYpM8/srtGj0WNGlK3/CeFF13CG+pW7S6WU32MubPGCtjg/DuY8xFvxouiARrQBAsF6vSYcKxRpHCzZXklbCIiaKCIiACIiACIiACIiACIiAC8IXqIA0+IEEha3G0Q4XEro8Th+butVXoEWIVJRtUxsJUcjjMBGS11SnGa6+vhpWsxOAnRYMuihLtwb8erku5oORehiuVeHkZKB2GeFil09+Rrjq15kYasgE/TfsvCx+yS9BMZ7VAzasmqMUXn/SsUsG45oXTpkPVQMmq7h8OXRAWWFwC3eEw0LZh6cv6mZsus/tJuE8OaCJHN3yC6BVsFQ5RJzVldbHjjBVFHKyZHN2wiIriwiIgAiIgAiIgAiIgAiIgAiIgAiIgAsXsBsQskQBSq8PByPmqdXh7tvJblFFEqTObqYHcKB2AC6tYmmNh5KNqLeIzkzw4LwcOGy6v9Fv+I8kFFv+I8lGxE+Izl28PGysUuH7D0XRBg2HkslO1B4jNTR4aeyv0MKG9Tup0U0UcmwiIpICIiACIiACIiACIiAP/9k=',
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
            this.dataValues = [
                Math.random() * 100, Math.random() * 100,
            ];
        }

    }
}