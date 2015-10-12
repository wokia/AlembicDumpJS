/// <reference path="../typings/tsd.d.ts"/>

describe('browser future check', function() {
	beforeAll(function() {
		document.body.innerHTML = window.__html__['spec/_browser-check.spec.html'];
	})

	afterAll(function () {
		document.body.innerHTML = '';
	})

	it('Browser supports the File API?', function() {
		expect(File).not.toBeNull();
		expect(FileReader).not.toBeNull();
		expect(FileList).not.toBeNull();
		expect(Blob).not.toBeNull();
	})
})
