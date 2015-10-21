module alembic {
	export module hdf5 {

		export const ENDIANNESS = DataViewStream.Endian.Little;
		export const SUPERBLOCK_SIGNETURE = new Uint8Array([0x89, 0x48, 0x44, 0x46, 0x0d, 0x0a, 0x1a, 0x0a]);
		export const DATAOBJECT_HEADER_SIGNETURE = new Uint8Array([0x4f, 0x48, 0x44, 0x52]);

		export class Group {
			flags:number = 0;

			buffer:ArrayBuffer = null;

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
				stream.skipBytes(2);

				this.buffer = buffer;
			}

			valid(): boolean {
				return (this.buffer != null);
			}
		}

		export class File {
			sizeOfOffsets:number = 0;
			sizeOfLengths:number = 0;
			fileConsistencyFlags:number = 0;

			baseAddres:number = 0;
			superBlockExtensionAddress:number = 0;
			endOfFileAddress:number = 0;

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

				this.baseAddres = File.getUint64Address(stream);
				this.superBlockExtensionAddress = File.getUint64Address(stream);
				this.endOfFileAddress = File.getUint64Address(stream);

				var rootGroupObjectHeaderAddress = File.getUint64Address(stream);
				var checksum = stream.getUint32();

				var rootGroup = new Group(buffer.slice(rootGroupObjectHeaderAddress));
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

			export function getUint64Address(stream:DataViewStream): number {
				var address:number = undefined;

				var addressL = stream.getUint32();
				var addressH = stream.getUint32();
				if ((addressL != 0xFFFFFFFF)&&(addressH != 0xFFFFFFFF)) {
					address = (addressH << 32)+ addressL;
				}

				return address;
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
