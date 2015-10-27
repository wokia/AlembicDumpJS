/// <reference path="../typings/tsd.d.ts"/>

describe('utility/ConstBufferArray', function() {

	it('ConstBufferArray Defined?', function() {
		expect(ConstBufferArrayView).toBeDefined();
	})

	it('Correctly it can be created?', function() {
		let buffer = ArrayBufferUtil.Generate(new Uint8Array(1024), (index:number) => {return index});

		{
			let view = new ConstBufferArrayView(buffer);
			expect(view).not.toBeNull();
			expect(view.getByteOffset()).toBe(0);
			expect(view.getBuffer()).toBe(buffer);
		}

		{
			let view = new ConstBufferArrayView(buffer, 512, 512);
			expect(view).not.toBeNull();
			expect(view.getByteOffset()).toBe(512);
			expect(view.getByteLength()).toBe(512);
		}
	})
})
