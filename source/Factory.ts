module alembic {

	export class Factory {
		constructor() {
		}

		getArchive(buffer:ArrayBuffer, filename:string = ''): IArchive {
			var archiveHDF5 = new alembic.abchdf5.Archive(new ConstArrayBufferView(buffer), filename);
			if (archiveHDF5.valid()) {
				return archiveHDF5;
			}

			return new alembic.abcunknown.Archive();
		}
	};

	export module Factory {
		export const enum CoreType { HDF5, Unknown };
	}
}
