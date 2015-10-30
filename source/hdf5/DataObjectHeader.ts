module hdf5 {

	export class DataObjectHeader {
		size:number = 0;
		flags:number = 0;
		sizeOfChunk:number = 0;

		buffer:ConstArrayBufferView = null;
		bufferOfChunk:ConstArrayBufferView = null;

		constructor(buffer:ConstArrayBufferView) {
			if (!matchSigneture(buffer, 0, DataObjectHeader.SIGNETURE)) {
				return ;
			}

			// SIGNETURE を読み飛ばす.
			var stream = buffer.NewDataViewStream(hdf5.ENDIANNESS, DataObjectHeader.SIGNETURE.length);

			var version = stream.readUint8();
			if (version != 2) {
				return ;
			}

			this.flags = stream.readUint8();
			if ((this.flags & DataObjectHeader.Flag.StoredAccessModificationChangeBirthTimes)!= 0) {
				stream.skipBytes(4 * 4);
			}

			if ((this.flags & DataObjectHeader.Flag.StoredNonDefaultAttributeStoragePhaseChangeValues)!= 0) {
				stream.skipBytes(4);
			}

			var sizeOfChunk = (function():number {
				switch (this.flags & DataObjectHeader.Flag.SizeOfChunkFieldBytesMask) {
				case 0:		return stream.readUint8();
				case 1:		return stream.readUint16();
				case 2:		return stream.readUint32();
				case 3:		return readUint64(stream);
				}
			})();

			this.buffer = buffer;
			this.bufferOfChunk = buffer.NewView(stream.getPosition(), sizeOfChunk);
		}

		valid(): boolean {
			return ((this.buffer != null)&&(this.bufferOfChunk != null));
		}

		getChunk():ConstArrayBufferView {
			return this.bufferOfChunk;
		}

		isAttributeCreationTracked():boolean {
			return ((this.flags & DataObjectHeader.Flag.TrackedAttributeCreationOrder)!= 0);
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
