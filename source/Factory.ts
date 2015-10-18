module alembic {

	export class Factory {
		constructor() {
		}

		getArchive(filename:string, buffer:ArrayBuffer): IArchive {
			var archiveHDF5 = new alembic.hdf5.Archive(filename, buffer);
			if (archiveHDF5.valid()) {
				return archiveHDF5;
			}

			return new alembic.unknown.Archive();
		}
	};

	export module Factory {
		export const enum CoreType { HDF5, Unknown };
	}
}
