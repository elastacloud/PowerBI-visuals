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

module powerbitests {
    import aCalendarVisual = powerbi.visuals.CalendarVisual;
    import aCalendarViewModel = powerbi.visuals.CalendarViewModel;
    import DateValue = powerbi.visuals.DateValue;

    var testData = <aCalendarViewModel> {
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

    describe("calendarVisual", () => {
        it('does not draw on init', () => {
            var element = powerbitests.helpers.testDom('200', '300');
            var options: powerbi.VisualInitOptions = {
                element: element,
                host: mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: {
                    transitionImmediate: true
                }
            };

            var calendar = new aCalendarVisual();
            calendar.init(options);

            expect(element.children().length).toBe(0);
        });

        it('calculates years to visualize', () => {
            var calendar = new aCalendarVisual();
            var actual = calendar.getYears(testData);

            expect(actual).toBe([1973, 1990]);
        });

        it('calculates y Position', () => {
            var calendar = new aCalendarVisual(1);
            var actual = calendar.getYPosition(new Date(2015, 09, 18));
            var expected = 5;
            expect(actual).toBe(expected);
        });
    });
}
