
class ConstBufferArrayView {

	constructor(buffer:ArrayBuffer, byteOffset:number =0, byteLength:number =0) {
		this.buffer = buffer;
		this.byteOffset = byteOffset;
		this.byteLength = (byteLength > 0)? byteLength : buffer.byteLength;
	}

	getByteOffset():number {
		return this.byteOffset;
	}

	getByteLength():number {
		return this.byteLength;
	}

	getBuffer():ArrayBuffer {
		return this.buffer;
	}

	NewDataViewStream(endian:DataViewStream.Endian =DataViewStream.Endian.Big, byteOffset:number =0, byteLength:number =0) {
		byteOffset = (this.byteOffset + byteOffset);
		byteLength = (byteLength > 0)? byteLength : (Math.min((this.byteLength - byteOffset), 0));

		return new DataViewStream(this.buffer, endian, byteOffset, byteLength);
	}

	buffer:ArrayBuffer;
	byteOffset:number;
	byteLength:number;
}
