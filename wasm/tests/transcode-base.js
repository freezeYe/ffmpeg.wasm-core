const FileType = require('file-type');
const { CASES, TIMEOUT } = require('./config');

require('events').EventEmitter.defaultMaxListeners = 64;

console.log('in st')

module.exports = (mode) => {
  const { getCore, ffmpeg } = require('./utils')(mode);
  CASES.forEach(({
    name,
    args,
    dirs = [],
    input,
    output,
    st,
  }) => {
    console.log(mode, 'mode', st)
    if (mode === 'st' && st === false) { return; }
    test(`[${mode}] ${name}`, async () => {
      const core = await getCore();

      for (let i = 0; i < dirs.length; i++) {
        await core.FS.mkdir(dirs[i]);
      }
      for (let i = 0; i < input.length; i++) {
        const { name, data } = input[i];
        await core.FS.writeFile(name, data);
      }

      await ffmpeg({ core, args });
      for (let i = 0; i < output.length; i++) {
        const { name, type } = output[i];
        const data = await core.FS.readFile(name);

        // const dirs = await core.FS.readFile('frames')
        // console.log(dirs, 'dirs')
        expect(data.length).not.toBe(0);
        const { mime } = await FileType.fromBuffer(data);
        expect(type).toBe(mime);
      }
      try {
        await core.exit();
      } catch(e) {}
    }, TIMEOUT);
  });
};
