
class ConstArrayBufferView {

	constructor(buffer:ArrayBuffer, byteOffset:number = 0, byteLength:number = 0) {
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

	private calculateOffsetAndLength(byteOffset:number, byteLength:number):{byteOffset:number, byteLength:number} {
		byteOffset = (this.byteOffset + byteOffset);
		byteLength = (byteLength > 0)? byteLength : (Math.min((this.byteLength - byteOffset), 0));
		return {byteOffset:byteOffset, byteLength:byteLength};
	}

	NewView(byteOffset:number, byteLength:number = 0):ConstArrayBufferView {
		var result = this.calculateOffsetAndLength(byteOffset, byteLength);
		return new ConstArrayBufferView(this.buffer, result['byteOffset'], result['byteLength']);
	}

	NewUint8Array(byteOffset:number, byteLength:number):Uint8Array {
		var result = this.calculateOffsetAndLength(byteOffset, byteLength);
		return new Uint8Array(this.buffer, result['byteOffset'], result['byteLength']);
	}

	NewDataViewStream(endian:DataViewStream.Endian =DataViewStream.Endian.Big, byteOffset:number =0, byteLength:number =0):DataViewStream {
		var result = this.calculateOffsetAndLength(byteOffset, byteLength);
		return new DataViewStream(this.buffer, endian, result['byteOffset'], result['byteLength']);
	}

	buffer:ArrayBuffer;
	byteOffset:number;
	byteLength:number;
}
