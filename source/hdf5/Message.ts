module hdf5 {

	export class Message {
		type:number = -1;
		size:number = 0;
		flags:number = 0;
		creationOrder:number = undefined;

		body:ArrayBuffer = null;

		constructor(buffer:ArrayBuffer, containsCreationOrder:boolean) {
			var stream = new DataViewStream(buffer, hdf5.ENDIANNESS);

			this.type = stream.readUint8();
			this.size = stream.readUint16();
			this.flags = stream.readUint8();

			if (containsCreationOrder) {
				this.creationOrder = stream.readUint16();
			}

			this.body = buffer.slice(stream.getPosition(), this.size);

			//console.log(this.type.toString(16));
			//console.log(this.size);
			//console.log(this.flags);
			//console.log(this.creationOrder);
		}
	};

	export module Message {

		const enum Type {
			Attribute	= (0x000C),
		};
	}
}
