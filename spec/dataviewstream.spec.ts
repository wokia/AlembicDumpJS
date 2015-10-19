/// <reference path="../typings/tsd.d.ts"/>

describe('utility/DataViewStream', function() {
	interface IArray {
		[index:number]:number;
		length:number;
		buffer:ArrayBuffer;
	}

	interface valueFromIndex {(index:number): number}

	function generateArrayBuffer<T extends IArray>(array:T, callback:valueFromIndex) {
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
		let buffer = generateArrayBuffer(new Uint8Array(length), (index:number) => { return index })

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
			expect(stream.getEndianness()).toBe(DataViewStream.Endian.Big);
		}
		{
			let stream = new DataViewStream(buffer, DataViewStream.Endian.Little, 4, 4);
			expect(stream).not.toBeNull();
			expect(stream.getByteOffset()).toBe(4);
			expect(stream.getByteLength()).toBe(4);
			expect(stream.getPosition()).toBe(0);
			expect(stream.getEndianness()).toBe(DataViewStream.Endian.Little);
		}
	})

	it('getInt8()', function() {
		let length = 16;
		let genValue = (index:number) => {return (index+1)*-1};
		let buffer = generateArrayBuffer(new Int8Array(length), genValue)
		expect(buffer.byteLength).toBe(length * Int8Array.BYTES_PER_ELEMENT);

		let stream = new DataViewStream(buffer, DataViewStream.getNativeEndianness());
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getInt8()).toBe(genValue(cnt));
			expect(stream.getPosition()).toBe((cnt+1)*Int8Array.BYTES_PER_ELEMENT);
		}
	})

	it('getUint8()', function() {
		let length = 16;
		let genValue = (index:number) => {return index+128};
		let buffer = generateArrayBuffer(new Uint8Array(length), genValue)
		expect(buffer.byteLength).toBe(length * Uint8Array.BYTES_PER_ELEMENT);

		let stream = new DataViewStream(buffer, DataViewStream.getNativeEndianness());
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getUint8()).toBe(genValue(cnt));
			expect(stream.getPosition()).toBe((cnt+1)*Uint8Array.BYTES_PER_ELEMENT);
		}
	})

	it('getInt16()', function() {
		let length = 16;
		let genValue = (index:number) => {return (index+256)*-1};
		let buffer = generateArrayBuffer(new Int16Array(length), genValue)
		expect(buffer.byteLength).toBe(length * Int16Array.BYTES_PER_ELEMENT);

		let stream = new DataViewStream(buffer, DataViewStream.getNativeEndianness());
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getInt16()).toBe(genValue(cnt));
			expect(stream.getPosition()).toBe((cnt+1)*Int16Array.BYTES_PER_ELEMENT);
		}
	})

	it('getUint16()', function() {
		let length = 16;
		let genValue = (index:number) => {return index+32768};
		let buffer = generateArrayBuffer(new Uint16Array(length), genValue)
		expect(buffer.byteLength).toBe(length * Uint16Array.BYTES_PER_ELEMENT);

		let stream = new DataViewStream(buffer, DataViewStream.getNativeEndianness());
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getUint16()).toBe(genValue(cnt));
			expect(stream.getPosition()).toBe((cnt+1)*Uint16Array.BYTES_PER_ELEMENT);
		}
	})

	it('getInt32()', function() {
		let length = 16;
		let genValue = (index:number) => {return (index+65536)*-1};
		let buffer = generateArrayBuffer(new Int32Array(length), genValue)
		expect(buffer.byteLength).toBe(length * Int32Array.BYTES_PER_ELEMENT);

		let stream = new DataViewStream(buffer, DataViewStream.getNativeEndianness());
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getInt32()).toBe(genValue(cnt));
			expect(stream.getPosition()).toBe((cnt+1)*Int32Array.BYTES_PER_ELEMENT);
		}
	})

	it('getUint32()', function() {
		let length = 16;
		let genValue = (index:number) => {return index+2147483648};
		let buffer = generateArrayBuffer(new Uint32Array(length), genValue)
		expect(buffer.byteLength).toBe(length * Uint32Array.BYTES_PER_ELEMENT);

		let stream = new DataViewStream(buffer, DataViewStream.getNativeEndianness());
		for (let cnt=0; cnt<length; ++cnt) {
			expect(stream.getUint32()).toBe(genValue(cnt));
			expect(stream.getPosition()).toBe((cnt+1)*Uint32Array.BYTES_PER_ELEMENT);
		}
	})
})
