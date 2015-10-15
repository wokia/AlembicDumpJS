module alembic {
	interface IArchive {
	};

	class Factory {
		constructor() {
		}

		getArchive(buffer : ArrayBuffer): IArchive {
			return null;
		}
	};
}
