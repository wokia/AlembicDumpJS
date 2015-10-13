/// <reference path="../typings/tsd.d.ts"/>

describe('Browser feature Check', function() {
	it('Browser supports File API?', function() {
		expect(File).toBeDefined();
		expect(FileReader).toBeDefined();
		expect(FileList).toBeDefined();
		expect(Blob).toBeDefined();
	})

	it('Browser supports XMLHttpRequest?', function() {
		expect(XMLHttpRequest).toBeDefined();
	})
})

describe('File read test using XMHttpRequest', function() {
	var request = new XMLHttpRequest();

	beforeEach(function (done) {
		request.responseType = 'blob';

		request.onload = function () {
			done();
		}

		request.open('GET', '/base/spec/assets/test.bin', true);
		request.send();
	})

	it('Read binary files?', function() {
		expect(request.status).toBe(200);
		expect(request.response).toEqual(jasmine.any(Blob));

		var blob = <Blob>request.response;
		expect(blob.size).toBe(8);
	})
})
