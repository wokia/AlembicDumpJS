module environment {

	export function isLocalTesting():boolean {
		// 全然正しい判定ではないけど、今の実用上の妥協点という事で…
		const LOCALTESTING_LOCATION_ORIGIN = 'http://localhost:9876';
		return (window.location.origin == LOCALTESTING_LOCATION_ORIGIN);
	}
}
