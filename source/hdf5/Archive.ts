module alembic {
	export module hdf5 {

		export const ENDIANNESS = DataViewStream.Endian.Little;
		export const SUPERBLOCK_SIGNETURE = new Uint8Array([0x89, 0x48, 0x44, 0x46, 0x0d, 0x0a, 0x1a, 0x0a]);

		export const DATAOBJECT_HEADER_SIGNETURE = new Uint8Array([0x4f, 0x48, 0x44, 0x52]);

		export const enum DataObjectHeaderFlag {
			SizeOfChunkFieldBytesMask							= (3 << 0),
			TrackedAttributeCreationOrder						= (1 << 2),
			IndexedAttributeCreationOrder						= (1 << 3),
			StoredNonDefaultAttributeStoragePhaseChangeValues	= (1 << 4),
			StoredAccessModificationChangeBirthTimes			= (1 << 5),
		};

		function getUint64(stream:DataViewStream): number {
			var address:number = undefined;

			var addressL = stream.getUint32();
			var addressH = stream.getUint32();
			if ((addressL != 0xFFFFFFFF)&&(addressH != 0xFFFFFFFF)) {
				address = (addressH << 32)+ addressL;
			}

			return address;
		}

		export class Group {
			flags:number = 0;

			buffer:ArrayBuffer = null;
			bufferOfChunk:ArrayBuffer = null;

			constructor(buffer:ArrayBuffer) {
				if (!File.matchSigneture(buffer, 0, DATAOBJECT_HEADER_SIGNETURE)) {
					return ;
				}

				// SIGNETURE を読み飛ばす.
				var stream = new DataViewStream(buffer, ENDIANNESS, DATAOBJECT_HEADER_SIGNETURE.length);

				var version = stream.getUint8();
				if (version != 2) {
					return ;
				}

				this.flags = stream.getUint8();

				if ((this.flags & DataObjectHeaderFlag.StoredAccessModificationChangeBirthTimes)!= 0) {
					stream.skipBytes(4 * 4);
				}

				if ((this.flags & DataObjectHeaderFlag.StoredNonDefaultAttributeStoragePhaseChangeValues)!= 0) {
					stream.skipBytes(4);
				}

				var sizeOfChunk = (function():number {
					switch (this.flags & DataObjectHeaderFlag.SizeOfChunkFieldBytesMask) {
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

		export class File {
			sizeOfOffsets:number = 0;
			sizeOfLengths:number = 0;
			fileConsistencyFlags:number = 0;

			superBlockExtensionAddress:number = 0;
			rootGroupObjectHeaderAddress:number = 0;

			buffer:ArrayBuffer = null;
			rootGroup:Group = null;

			constructor(buffer:ArrayBuffer) {
				if (!File.matchSigneture(buffer, 0, SUPERBLOCK_SIGNETURE)) {
					return ;
				}

				// SIGNETURE を読み飛ばす.
				var stream = new DataViewStream(buffer, ENDIANNESS, SUPERBLOCK_SIGNETURE.length);

				var superBlockVersion = stream.getUint8();
				if (superBlockVersion != 2) {
					return ;
				}

				this.sizeOfOffsets = stream.getUint8();
				this.sizeOfLengths = stream.getUint8();
				this.fileConsistencyFlags = stream.getUint8();

				var baseAddres = getUint64(stream);
				this.superBlockExtensionAddress = getUint64(stream);
				var endOfFileAddress = getUint64(stream);

				this.rootGroupObjectHeaderAddress = getUint64(stream);
				var checksum = stream.getUint32();

				var rootGroup = new Group(buffer.slice(this.rootGroupObjectHeaderAddress));
				if (!rootGroup.valid()) {
					return ;
				}

				this.buffer = buffer;
				this.rootGroup = rootGroup;
			}

			valid(): boolean {
				return ((this.buffer != null)&&(this.rootGroup != null));
			}
		}

		export module File {
			export function matchSigneture(buffer:ArrayBuffer, offset:number, signeture:Uint8Array) {
				var array = new Uint8Array(buffer, offset, signeture.length);
				if (signeture.length != array.length) {
					return false;
				}

				for (let cnt=0; cnt<signeture.length; ++cnt) {
					if (signeture[cnt] != array[cnt]) {
						return false;
					}
				}

				return true;
			}
		}

		export class Archive implements alembic.IArchive {
			file:hdf5.File;
			filename:string;

			constructor(buffer:ArrayBuffer, filename:string) {
				this.file = new hdf5.File(buffer);
				this.filename = filename;
			}

			getCoreType() : Factory.CoreType {
				return Factory.CoreType.HDF5;
			}

			valid() : boolean {
				return this.file.valid();
			}
		};
	}
}
