module hdf5 {

	export const ENDIANNESS = DataViewStream.Endian.Little;

	export class File {
		buffer:ConstArrayBufferView = null;
		superblock:SuperBlock = null;
		rootGroup:Group = null;

		constructor(buffer:ConstArrayBufferView) {
			var superblock = new SuperBlock(buffer);
			if (!superblock.valid()) {
				return ;
			}

			var rootGroup = new Group(buffer.NewView(superblock.getRootGroupObjectHeaderAddress()));
			if (!rootGroup.valid()) {
				return ;
			}

			this.buffer = buffer;
			this.superblock = superblock;
			this.rootGroup = rootGroup;
		}

		valid(): boolean {
			return ((this.buffer != null)
				&&(this.superblock != null)
				&&(this.rootGroup != null));
		}

		getRootGroup():Group {
			return this.rootGroup;
		}
	}
}
