test-cov: istanbul

istanbul:
	   istanbul cover --hook-run-in-context node_modules/mocha/bin/mocha test

coveralls:
	   cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
