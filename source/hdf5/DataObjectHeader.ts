module hdf5 {

	export class DataObjectHeader {
		flags:number = 0;

		buffer:ArrayBuffer = null;
		bufferOfChunk:ArrayBuffer = null;

		constructor(buffer:ArrayBuffer) {
			if (!matchSigneture(buffer, 0, DataObjectHeader.SIGNETURE)) {
				return ;
			}

			// SIGNETURE を読み飛ばす.
			var stream = new DataViewStream(buffer, hdf5.ENDIANNESS, DataObjectHeader.SIGNETURE.length);

			var version = stream.getUint8();
			if (version != 2) {
				return ;
			}

			this.flags = stream.getUint8();

			if ((this.flags & DataObjectHeader.Flag.StoredAccessModificationChangeBirthTimes)!= 0) {
				stream.skipBytes(4 * 4);
			}

			if ((this.flags & DataObjectHeader.Flag.StoredNonDefaultAttributeStoragePhaseChangeValues)!= 0) {
				stream.skipBytes(4);
			}

			var sizeOfChunk = (function():number {
				switch (this.flags & DataObjectHeader.Flag.SizeOfChunkFieldBytesMask) {
				case 0:		return stream.getUint8();
				case 1:		return stream.getUint16();
				case 2:		return stream.getUint32();
				case 3:		return getUint64(stream);
				}
			})();

			this.buffer = buffer;
			this.bufferOfChunk = buffer.slice(stream.getPosition(), sizeOfChunk);
		}

		valid(): boolean {
			return ((this.buffer != null)&&(this.bufferOfChunk != null));
		}
	}

	export module DataObjectHeader {
		export const SIGNETURE = new Uint8Array([0x4f, 0x48, 0x44, 0x52]);

		export const enum Flag {
			SizeOfChunkFieldBytesMask							= (3 << 0),
			TrackedAttributeCreationOrder						= (1 << 2),
			IndexedAttributeCreationOrder						= (1 << 3),
			StoredNonDefaultAttributeStoragePhaseChangeValues	= (1 << 4),
			StoredAccessModificationChangeBirthTimes			= (1 << 5),
		};
	}
}
