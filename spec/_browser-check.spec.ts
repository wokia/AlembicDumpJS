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

describe('File read test using XMLHttpRequest', function() {
	var request = new XMLHttpRequest();

	beforeAll(function (done) {
		request.open('GET', '/base/spec/assets/test.bin', true);

		request.responseType = 'arraybuffer';
		request.addEventListener('loadend', function () {
			done();
		});

		request.send();
	})

	it('Read binary files?', function() {
		expect(request.status).toBe(200);
		expect(request.response).toEqual(jasmine.any(ArrayBuffer));

		var buffer = <ArrayBuffer>request.response;
		expect(buffer.byteLength).toBe(8);
	})
})

describe('Read the contents of the file using the DataView', function() {
	var request = new XMLHttpRequest();

	beforeEach(function (done) {
		request.open('GET', '/base/spec/assets/test.bin', true);

		request.responseType = 'arraybuffer';

		request.addEventListener('loadend', function () {
			done();
		});

		request.send();
	})

	it('Contents of the file are read correctly?', function() {
		var buffer = <ArrayBuffer>request.response;

		var dataview = new DataView(buffer);
		expect(dataview).not.toBeNull();
		expect(dataview.byteLength).toEqual(buffer.byteLength);

		var offset : number = 0;
		[0, 1, 2, 3, 4, 5, 6, 7].forEach(function(value) {
			expect(dataview.getUint8(offset)).toEqual(value);
			offset += 1;
		})
	})
})
