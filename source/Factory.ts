module alembic {
	export interface IArchive {
	};

	export class Factory {
		constructor() {
		}

		getArchive(buffer : ArrayBuffer): IArchive {
			return null;
		}
	};
}
