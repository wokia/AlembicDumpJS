/// <reference path="../typings/tsd.d.ts"/>

module ArrayBufferUtil {
	interface IArray {
		[index:number]:number;
		length:number;
		buffer:ArrayBuffer;
	}

	interface valueFromIndex {
		(index:number): number;
	}

	export function Generate<T extends IArray>(array:T, callback:valueFromIndex): ArrayBuffer {
		for (let cnt=0; cnt<array.length; ++cnt) {
			array[cnt] = callback(cnt);
		}
		return array.buffer;
	}
}
