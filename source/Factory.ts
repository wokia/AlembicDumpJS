module alembic {

	export class Factory {
		constructor() {
		}

		getArchive(buffer : ArrayBuffer): IArchive {
			var archive = new alembic.unknown.Archive();
			return archive;
		}
	};
}
