module hdf5 {


	export class Group {
		dataObjectHeader:DataObjectHeader = null;


		constructor(buffer:ArrayBuffer) {
			var dataObjectHeader = new DataObjectHeader(buffer);
			if (!dataObjectHeader.valid()) {
				return ;
			}

			this.dataObjectHeader = dataObjectHeader;

			new hdf5.Message(this.dataObjectHeader.getChunk(), this.dataObjectHeader.isAttributeCreationTracked());
		}

		valid():boolean {
			return (this.dataObjectHeader != null);
		}
	}
}
