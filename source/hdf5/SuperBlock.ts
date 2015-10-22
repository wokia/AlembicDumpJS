module hdf5 {

	export class SuperBlock {
		sizeOfOffsets:number = 0;
		sizeOfLengths:number = 0;
		fileConsistencyFlags:number = 0;

		superBlockExtensionAddress:number = 0;
		rootGroupObjectHeaderAddress:number = 0;

		buffer:ArrayBuffer = null;

		constructor(buffer:ArrayBuffer) {
			if (!matchSigneture(buffer, 0, SuperBlock.SIGNETURE)) {
				return ;
			}

			// SIGNETURE を読み飛ばす.
			var stream = new DataViewStream(buffer, hdf5.ENDIANNESS, SuperBlock.SIGNETURE.length);

			var superBlockVersion = stream.getUint8();
			if (superBlockVersion != 2) {
				return ;
			}

			this.sizeOfOffsets = stream.getUint8();
			this.sizeOfLengths = stream.getUint8();
			this.fileConsistencyFlags = stream.getUint8();

			this.buffer = buffer.slice(0, ((SuperBlock.SIGNETURE.length) + 4 + (8*4) + 4));
		}

		valid():boolean {
			return (this.buffer != null);
		}

		getRootGroupObjectHeaderAddress():number {
			return getUint64(new DataViewStream(this.buffer, ENDIANNESS, ((SuperBlock.SIGNETURE.length) + 4 + (8*3))));
		}
	}

	export module SuperBlock {
		export const SIGNETURE:Uint8Array = new Uint8Array([0x89, 0x48, 0x44, 0x46, 0x0d, 0x0a, 0x1a, 0x0a]);
	};
}
