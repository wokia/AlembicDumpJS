module alembic {

	export interface IArchive {
		getCoreType() : alembic.Factory.CoreType;
		valid() : boolean;
	};


	export module abcunknown {

		export class Archive implements alembic.IArchive {

			getCoreType() : Factory.CoreType {
				return Factory.CoreType.Unknown;
			}

			valid() : boolean {
				return false;
			}
		};
	}
}
