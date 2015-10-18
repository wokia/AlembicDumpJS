/// <reference path="../typings/tsd.d.ts"/>

describe('utility/DataViewOffset', function() {
	interface IArray {
		[index:number]:number;
		length:number;
		buffer:ArrayBuffer;
	}

	interface valueFromIndex {(index:number): number}

	function genereateArrayBuffer<T extends IArray>(array:T, callback:valueFromIndex) {
		for (let cnt=0; cnt<array.length; ++cnt) {
			array[cnt] = callback(cnt);
		}
		return array.buffer;
	}

	it('DataViewStream Defined?', function() {
		expect(DataViewStream).toBeDefined();
	})

	it('DataViewStream.Endian Defined?', function() {
		expect(DataViewStream.Endian.Big).toBeDefined();
		expect(DataViewStream.Endian.Little).toBeDefined();
	})

	it('Correctly it can be created?', function() {
		let byteLength = 32;
		let buffer = genereateArrayBuffer(new Uint8Array(byteLength/Int8Array.BYTES_PER_ELEMENT), (index:number) => { return index })

		{
			let stream = new DataViewStream(buffer);
			expect(stream).not.toBeNull();
			expect(stream.getByteOffset()).toBe(0);
			expect(stream.getByteLength()).toBe(byteLength);
			expect(stream.getPosition()).toBe(0);
		}
		{
			let stream = new DataViewStream(buffer, DataViewStream.Endian.Big, 4);
			expect(stream).not.toBeNull();
			expect(stream.getByteOffset()).toBe(4);
			expect(stream.getByteLength()).toBe(byteLength-4);
			expect(stream.getPosition()).toBe(0);
		}
		{
			let stream = new DataViewStream(buffer, DataViewStream.Endian.Big, 4, 4);
			expect(stream).not.toBeNull();
			expect(stream.getByteOffset()).toBe(4);
			expect(stream.getByteLength()).toBe(4);
			expect(stream.getPosition()).toBe(0);
		}
	})

	it('getInt8()', function() {
		let byteLength = 32;
		let length = byteLength/Int8Array.BYTES_PER_ELEMENT;
		let buffer = genereateArrayBuffer(new Int8Array(length), (index:number) => {return index*-1})

		let stream = new DataViewStream(buffer);
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getInt8()).toBe(cnt*-1);
			expect(stream.getPosition()).toBe(cnt+Int8Array.BYTES_PER_ELEMENT);
		}
	})

	it('getUint8()', function() {
		let byteLength = 32;
		let length = byteLength/Uint8Array.BYTES_PER_ELEMENT;
		let buffer = genereateArrayBuffer(new Uint8Array(length), (index:number) => {return index})

		let stream = new DataViewStream(buffer);
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getInt8()).toBe(cnt);
			expect(stream.getPosition()).toBe(cnt+Uint8Array.BYTES_PER_ELEMENT);
		}
	})
})
