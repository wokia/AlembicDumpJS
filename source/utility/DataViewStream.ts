class DataViewStream {
	constructor(buffer:ArrayBuffer, endian?:DataViewStream.Endian, byteOffset?:number, byteLength?:number) {
		if (byteLength) {
			this.dataview = new DataView(buffer, byteOffset, byteLength);
		}
		else if (byteOffset) {
			this.dataview = new DataView(buffer, byteOffset);
		}
		else {
			this.dataview = new DataView(buffer);
		}

		this.littleEndian = ((endian)&&(endian == DataViewStream.Endian.Little))? true : false;
	}

	getByteOffset():number {
		return this.dataview.byteOffset;
	}

	getByteLength():number {
		return this.dataview.byteLength;
	}

	getPosition():number {
		return this.position;
	}

	getInt8():number {
		var value = this.dataview.getInt8(this.position);
		this.position += Int8Array.BYTES_PER_ELEMENT;
		return value;
	}

	getUint8():number {
		var value = this.dataview.getUint8(this.position);
		this.position += Uint8Array.BYTES_PER_ELEMENT;
		return value;
	}

	dataview:DataView;
	littleEndian:boolean;

	position:number = 0;
};

module DataViewStream {
	export const enum Endian { Big, Little };
}
