module alembic {
	export module hdf5 {

		export class File {
			buffer:ArrayBuffer = null;
			sizeOfOffsets:number = 0;
			sizeOfLengths:number = 0;
			fileConsistencyFlags:number = 0;

			baseAddres:number = 0;
			superBlockExtensionAddress:number = 0;
			endOfFileAddress:number = 0;
			rootGroupObjectHeaderAddress:number = 0;

			constructor(buffer:ArrayBuffer) {
				if (!File.isSupportedFormat(buffer)) {
					return ;
				}

				// SIGNETURE と Super Block Version を読み飛ばす.
				var stream = new DataViewStream(buffer, File.ENDIANNESS, File.SIGNETURE.length+1);

				this.sizeOfOffsets = stream.getUint8();
				this.sizeOfLengths = stream.getUint8();
				this.fileConsistencyFlags = stream.getUint8();

				this.baseAddres = File.getUint64Address(stream);
				this.superBlockExtensionAddress = File.getUint64Address(stream);
				this.endOfFileAddress = File.getUint64Address(stream);
				this.rootGroupObjectHeaderAddress = File.getUint64Address(stream);

				this.buffer = buffer;
			}

			valid(): boolean {
				return (this.buffer != null);
			}
		}

		export module File {
			export const SIGNETURE = new Uint8Array([0x89, 0x48, 0x44, 0x46, 0x0d, 0x0a, 0x1a, 0x0a]);
			export const ENDIANNESS = DataViewStream.Endian.Little;

			export function isSupportedFormat(buffer:ArrayBuffer): boolean {
				var header = new Uint8Array(buffer, 0, SIGNETURE.length);

				if (SIGNETURE.length != header.length) {
					return false;
				}

				for (let cnt=0; cnt<SIGNETURE.length; ++cnt) {
					if (SIGNETURE[cnt] != header[cnt]) {
						return false;
					}
				}

				var superBlockVersion = (new Uint8Array(buffer, SIGNETURE.length))[0];
				if (superBlockVersion != 2) {
					return false;
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
