import {VetproviehPager} from "../lib/vetprovieh-pager";


describe('constructor', () => {
    test("default values should be set", () => {
        const pager = new VetproviehPager() ;

        expect(pager.page).toEqual(1);
        expect(pager.maximum).toEqual(1);
    })
})

describe('observedAttributes', function () {
    test("should have expected attributes", () => {
        const expected = ['page', 'maximum'];
        expect(VetproviehPager.observedAttributes).toEqual(expected)
    })
});


describe('template', function () {
    test("should have template set", () => {
        expect(new VetproviehPager().template).not.toEqual(undefined)
    })
});


describe('page', function () {
    test("should set page", () => {
        const pager = new VetproviehPager() ;
        pager.maximum = 5;
        pager.page = 2;

        expect(pager.page).toEqual(2)

        pager.attributeChangedCallback("page","2","3");
        expect(pager.page).toEqual(3)
    })


    test("should not set over maximum", () => {
        const pager = new VetproviehPager();
        pager.page = 3;
        expect(pager.page).toEqual(1);
    })

    test("could not be negative or 0", () => {
        const pager = new VetproviehPager();
        pager.page = -3;
        expect(pager.page).toEqual(1);

        pager.page = 0;
        expect(pager.page).toEqual(1);
    })
});

describe('connectedCallback', function () {
    test("should render innerHtml", () => {
        const pager = new VetproviehPager();
        pager.maximum = 5;

        pager.connectedCallback();

        const pagerContainer = pager.getByIdFromShadowRoot('pager') as HTMLElement;

        [1,2,"…",5].forEach((i) => {
            expect(pagerContainer.innerHTML).toMatch(i.toString());
        })

    })
});


