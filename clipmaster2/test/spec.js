const assert = require('assert');
const path = require('path');
const Application = require('spectron').Application;
const electronPath = require('electron');

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '..')],
});

describe('clipmaster2', function () {
  this.timeout(10000); // increases Mocha default timeout to account for application load

  beforeEach(() => app.start());

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('shows an initial window', async () => {
    const count = await app.client.getWindowCount()
    return assert.equal(count, 1)
  });

});
