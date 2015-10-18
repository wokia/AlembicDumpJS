module alembic {

	export interface IArchive {
		getCoreType() : alembic.Factory.CoreType;
		valid() : boolean;
	};


	export module unknown {

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
