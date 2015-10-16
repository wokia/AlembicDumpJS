/// <reference path="../typings/tsd.d.ts"/>

describe('alembic/Factory', function() {
	it('alembic.Factory Defined?', function() {
		expect(alembic.Factory).toBeDefined();
	})

	it('alembic.Factory can be created?', function() {
		var factory = new alembic.Factory();
		expect(factory).not.toBeNull();
	})
})

describe('alembic/Factory', function() {
	var request = new XMLHttpRequest();

	beforeAll(function (done) {
		request.open('GET', '/base/spec/assets/Alembic_Octopus_Example/alembic_octopus.abc', true);

		request.responseType = 'arraybuffer';
		request.addEventListener('loadend', function () {
			done();
		});

		request.send();
	})

	it('Archive can be getted from alembic_octopus.abc?', function() {
		var buffer = <ArrayBuffer>request.response;
		expect(buffer).not.toBeNull();

		var factory = new alembic.Factory();
		expect(factory).not.toBeNull();

		var archive = factory.getArchive(buffer);
		expect(archive).not.toBeNull();
	})
})
