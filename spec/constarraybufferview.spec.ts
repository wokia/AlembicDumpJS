/// <reference path="../typings/tsd.d.ts"/>

describe('utility/ConstBufferArray', function() {

	it('ConstBufferArray Defined?', function() {
		expect(ConstBufferArrayView).toBeDefined();
	})

	it('Correctly it can be created?', function() {
		let buffer = ArrayBufferUtil.Generate(new Uint8Array(256), (index:number) => {return index});

		{
			let view = new ConstBufferArrayView(buffer);
			expect(view).not.toBeNull();
			expect(view.getByteOffset()).toBe(0);
			expect(view.getBuffer()).toBe(buffer);
		}

		{
			let view = new ConstBufferArrayView(buffer, 128, 128);
			expect(view).not.toBeNull();
			expect(view.getByteOffset()).toBe(128);
			expect(view.getByteLength()).toBe(128);
		}
	})

	it('Can create the DataViewStream?', function() {
		let buffer = ArrayBufferUtil.Generate(new Uint8Array(256), (index:number) => {return index;});

		let view = new ConstBufferArrayView(buffer);
		expect(view).not.toBeNull();

		{
			let stream = view.NewDataViewStream(DataViewStream.Endian.Big);
			expect(stream).not.toBeNull();
			expect(stream.getByteOffset()).toBe(0);
			expect(stream.readUint8()).toBe(0);
		}

		{
			let stream = view.NewDataViewStream(DataViewStream.Endian.Big, 128, 128);
			expect(stream).not.toBeNull();
			expect(stream.getByteOffset()).toBe(128);
			expect(stream.getByteLength()).toBe(128);
			expect(stream.readUint8()).toBe(128);
		}
	})
})
