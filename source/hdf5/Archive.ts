module alembic {
	export module hdf5 {

		class File {

		}

		module File {

			export function isHDF5(buffer:ArrayBuffer): boolean {
				let SIGNETURE = new Uint8Array([0x89, 0x48, 0x44, 0x46, 0x0d, 0x0a, 0x1a, 0x0a]);
				let header = new Uint8Array(buffer, 0, SIGNETURE.length);

				if (SIGNETURE.length != header.length) {
					return false;
				}

				for (let cnt=0; cnt<SIGNETURE.length; ++cnt) {
					if (SIGNETURE[cnt] != header[cnt]) {
						return false;
					}
				}

				return true;
			}
		}

		export class Archive implements alembic.IArchive {

			buffer:ArrayBuffer = null;
			filename:string;

			constructor(buffer:ArrayBuffer, filename:string) {
				if (!File.isHDF5(buffer)) {
					return ;
				}

				this.buffer = buffer;
				this.filename = filename;
			}

			getCoreType() : Factory.CoreType {
				return Factory.CoreType.HDF5;
			}

			valid() : boolean {
				return (this.buffer != null);
			}
		};
	}
}
