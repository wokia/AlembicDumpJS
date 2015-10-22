module hdf5 {


	export class Group {
		dataObjectHeader:DataObjectHeader = null;

		constructor(buffer:ArrayBuffer) {
			var dataObjectHeader = new DataObjectHeader(buffer);
			if (!dataObjectHeader.valid()) {
				return ;
			}

			this.dataObjectHeader = dataObjectHeader;
		}

		valid():boolean {
			return (this.dataObjectHeader != null);
		}
	}
}
