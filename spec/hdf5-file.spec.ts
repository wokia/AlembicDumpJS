/// <reference path="../typings/tsd.d.ts"/>

describe('hdf5/File', function() {
	let request = new XMLHttpRequest();
	let filename = 'http://localhost:8000/assets/Alembic_Octopus_Example/alembic_octopus.abc';

	beforeAll(function (done) {
		request.open('GET', filename, true);

		request.responseType = 'arraybuffer';
		request.addEventListener('loadend', function () {
			done();
		});

		request.overrideMimeType('application/octet-stream');
		request.send();
	})

	it('CoreType of alembic_octopus.abc is HDF5?', function() {
		var buffer = <ArrayBuffer>request.response;
		expect(buffer).not.toBeNull();

		var stream = new DataViewStream(buffer, DataViewStream.Endian.Little);
		[0x89, 0x48, 0x44, 0x46, 0x0d, 0x0a, 0x1a, 0x0a].forEach(function(value) {
			expect(stream.getUint8()).toEqual(value);
		})

		// Super Block Version 2 のみ対象
		expect(stream.getUint8()).toBe(2);
	})

	it('hdf5.File can be generated from alembic_octopus.abc?', function() {
		let file = new hdf5.File(<ArrayBuffer>request.response);
		expect(file).not.toBeNull();
		expect(file.valid());
	})

	describe('hdf5/Group', function() {
		var file:hdf5.File = null;

		beforeAll(function() {
			file = new hdf5.File(<ArrayBuffer>request.response);
		})

		it('RootNode Group can be obtained from the hdf5.File?', function() {
			var rootnode = file.getRootGroup();
			expect(rootnode).not.toBeNull();
			expect(rootnode.valid()).toBeTruthy();
		})

		it('Get "abc_version" attribute from RootNode group.', function() {
			var rootnode = file.getRootGroup();
		})
	})
})
