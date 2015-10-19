/// <reference path="../typings/tsd.d.ts"/>

describe('utility/DataViewStream', function() {
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
		let length = 16;
		let byteLength = (length * Uint8Array.BYTES_PER_ELEMENT);
		let buffer = genereateArrayBuffer(new Uint8Array(length), (index:number) => { return index })

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
		let length = 16;
		let buffer = genereateArrayBuffer(new Int8Array(length), (index:number) => {return (index+16)*-1})
		expect(buffer.byteLength).toBe(length * Int8Array.BYTES_PER_ELEMENT);

		let stream = new DataViewStream(buffer, DataViewStream.getNativeEndianness());
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getInt8()).toBe((cnt+16)*-1);
			expect(stream.getPosition()).toBe((cnt+1)*Int8Array.BYTES_PER_ELEMENT);
		}
	})

	it('getUint8()', function() {
		let length = 16;
		let buffer = genereateArrayBuffer(new Uint8Array(length), (index:number) => {return index+128})
		expect(buffer.byteLength).toBe(length * Uint8Array.BYTES_PER_ELEMENT);

		let stream = new DataViewStream(buffer, DataViewStream.getNativeEndianness());
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getUint8()).toBe(cnt+128);
			expect(stream.getPosition()).toBe((cnt+1)*Uint8Array.BYTES_PER_ELEMENT);
		}
	})

	it('getInt16()', function() {
		let length = 16;
		let buffer = genereateArrayBuffer(new Int16Array(length), (index:number) => {return (index+16)*-1})
		expect(buffer.byteLength).toBe(length * Int16Array.BYTES_PER_ELEMENT);

		let stream = new DataViewStream(buffer, DataViewStream.getNativeEndianness());
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getInt16()).toBe((cnt+16)*-1);
			expect(stream.getPosition()).toBe((cnt+1)*Int16Array.BYTES_PER_ELEMENT);
		}
	})

	it('getUint16()', function() {
		let length = 16;
		let buffer = genereateArrayBuffer(new Uint16Array(length), (index:number) => {return index+32768})
		expect(buffer.byteLength).toBe(length * Uint16Array.BYTES_PER_ELEMENT);

		let stream = new DataViewStream(buffer, DataViewStream.getNativeEndianness());
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getUint16()).toBe(cnt+32768);
			expect(stream.getPosition()).toBe((cnt+1)*Uint16Array.BYTES_PER_ELEMENT);
		}
	})
})
