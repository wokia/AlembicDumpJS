module alembic {
	export module abchdf5 {

		export const ENDIANNESS = DataViewStream.Endian.Little;


		function getUint64(stream:DataViewStream): number {
			var address:number = undefined;

			var addressL = stream.getUint32();
			var addressH = stream.getUint32();
			if ((addressL != 0xFFFFFFFF)&&(addressH != 0xFFFFFFFF)) {
				address = (addressH << 32)+ addressL;
			}

			return address;
		}

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
				var stream = new DataViewStream(buffer, ENDIANNESS, SuperBlock.SIGNETURE.length);

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

		export class DataObjectHeader {
			flags:number = 0;

			buffer:ArrayBuffer = null;
			bufferOfChunk:ArrayBuffer = null;

			constructor(buffer:ArrayBuffer) {
				if (!matchSigneture(buffer, 0, DataObjectHeader.SIGNETURE)) {
					return ;
				}

				// SIGNETURE を読み飛ばす.
				var stream = new DataViewStream(buffer, ENDIANNESS, DataObjectHeader.SIGNETURE.length);

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

		export class Group {
			dataObjectHeader:DataObjectHeader = null;

			constructor(buffer:ArrayBuffer) {
				var dataObjectHeader = new DataObjectHeader(buffer);
				if (!dataObjectHeader.valid()) {
					return ;
				}

				this.dataObjectHeader = dataObjectHeader;
			}

			valid():boolean {
				return (this.dataObjectHeader != null);
			}
		}

		export class File {
			buffer:ArrayBuffer = null;
			superblock:SuperBlock = null;
			rootGroup:Group = null;

			constructor(buffer:ArrayBuffer) {
				var superblock = new SuperBlock(buffer);
				if (!superblock.valid()) {
					return ;
				}

				var rootGroup = new Group(buffer.slice(superblock.getRootGroupObjectHeaderAddress()));
				if (!rootGroup.valid()) {
					return ;
				}

				this.buffer = buffer;
				this.superblock = superblock;
				this.rootGroup = rootGroup;
			}

			valid(): boolean {
				return ((this.buffer != null)
					&&(this.superblock != null)
					&&(this.rootGroup != null));
			}
		}

		export class Archive implements alembic.IArchive {
			file:abchdf5.File;
			filename:string;

			constructor(buffer:ArrayBuffer, filename:string) {
				this.file = new abchdf5.File(buffer);
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
