module alembic {
	export module hdf5 {

		function isHDF5(buffer:ArrayBuffer): boolean {
			let SIGNETURE = new Uint8Array([0x89, 0x48, 0x44, 0x46, 0x0d, 0x0a, 0x1a, 0x0a]);
			let header = new Uint8Array(buffer, 0, SIGNETURE.length);

			if (environment.isLocalTesting()) {
				// Unit Test 環境では、2 bytes offset して、3 byte 目を無視する.
				// http://qiita.com/wokia/items/4c6e3942d5cdaa3b97b4
				SIGNETURE = SIGNETURE.subarray(1);
				header = new Uint8Array(buffer, 3, SIGNETURE.length);
			}

			for (let cnt=0; cnt<SIGNETURE.length; ++cnt) {
				if (SIGNETURE[cnt] != header[cnt]) {
					return false;
				}
			}

			return true;
		}

		export class Archive implements alembic.IArchive {

			buffer:ArrayBuffer = null;
			filename:string;

			constructor(buffer:ArrayBuffer, filename:string) {
				if (!isHDF5(buffer)) {
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
