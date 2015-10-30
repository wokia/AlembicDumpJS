module hdf5 {

	export function readUint64(stream:DataViewStream): number {
		var address:number = undefined;

		var addressL = stream.readUint32();
		var addressH = stream.readUint32();
		if ((addressL != 0xFFFFFFFF)&&(addressH != 0xFFFFFFFF)) {
			address = (addressH << 32)+ addressL;
		}

		return address;
	}

	export function matchSigneture(buffer:ConstArrayBufferView, offset:number, signeture:Uint8Array) {
		var array = buffer.NewUint8Array(offset, signeture.length);
		if (signeture.length != array.length) {
			return false;
		}

		for (let cnt=0; cnt<signeture.length; ++cnt) {
			if (signeture[cnt] != array[cnt]) {
				return false;
			}
		}

		return true;
	}
}
