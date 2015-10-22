module alembic {
	export module abchdf5 {

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
