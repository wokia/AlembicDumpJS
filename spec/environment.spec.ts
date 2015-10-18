describe('utility/Environment', function() {
	it('Local test environment can be determined correctly?', function() {
		expect(environment.isLocalTesting()).toBeTruthy();
	})
})
