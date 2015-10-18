module alembic {
	export module hdf5 {

		export class Archive implements alembic.IArchive {

			filename:string;

			constructor(filename:string, buffer:ArrayBuffer) {
				this.filename = filename;
			}

			getCoreType() : Factory.CoreType {
				return Factory.CoreType.HDF5;
			}

			valid() : boolean {
				return false;
			}
		};
	}
}
