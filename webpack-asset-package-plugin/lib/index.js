const mime = require('mime-types');
const JSZip = require('jszip');
const { RawSource } = require('webpack-sources');

class AssetPackagePlugin {
  constructor(options) {
    const defaultOptions = {
      packageNameKey: 'packageName',
      packageNameValue: '',
      version: 1,
      folderName: 'package',
      indexFileName: 'index.json',
      baseUrl: '',
      fileTypes: ['html', 'js', 'json', 'css'],
      excludeFileNames: [],
      transformExtensions: /^(gz|map)$/i,
    };

    this.options = { ...defaultOptions, ...options };
  }

  getFileType(str) {
    // eslint-disable-next-line no-param-reassign
    str = str.replace(/\?.*/, '');
    const split = str.split('.');
    let ext = split.pop();
    if (this.options.transformExtensions.test(ext)) {
      ext = `${split.pop()}.${ext}`;
    }
    return ext;
  }

  apply(compiler) {
    const { hooks } = compiler;
    const zip = new JSZip();

    hooks.emit.tapAsync('AssetPackagePlugin', async (compilation, callback) => {
      const {
        fileTypes,
        packageNameKey,
        packageNameValue,
        excludeFileNames,
        version,
        indexFileName,
        folderName,
      } = this.options;
      const isFileTypeLimit = fileTypes.length > 0;

      // create index.json
      const content = {
        version,
        [packageNameKey]: packageNameValue,
        items: [],
      };

      // add filename
      // eslint-disable-next-line
      for (const filename in compilation.assets) {
        const fileType = this.getFileType(filename);

        if (!(
          // 在排除文件列表内
          excludeFileNames.includes(filename)
          // 不再文件类型列表中
          || (isFileTypeLimit && !fileTypes.includes(fileType))
        )) {
          content.items.push({
            version,
            [packageNameKey]: packageNameValue,
            // TODO:
            // remoteUrl: baseUrl + filename
            path: filename,
            mimeType: mime.lookup(fileType) || 'application/octet-stream',
          });
        }
      }

      const outputFile = JSON.stringify(content, null, 2);

      // output index.json
      compilation.assets[indexFileName] = { // eslint-disable-line
        source: () => outputFile,
        size: () => outputFile.length,
      };

      // create zip file
      const folder = zip.folder(folderName);
      // eslint-disable-next-line
      for (const filename in compilation.assets) {
        const fileType = this.getFileType(filename);

        if (!(
          // 在排除文件列表内
          excludeFileNames.includes(filename)
          // 不再文件类型列表中
          || (isFileTypeLimit && !fileTypes.includes(fileType))
        )) {
          const source = compilation.assets[filename].source();

          folder.file(filename, source);
        }
      }

      const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
      });
      const outputpath = `${folderName}.zip`;

      compilation.assets[outputpath] = new RawSource(zipBuffer); // eslint-disable-line

      callback();
    });
  }
}

module.exports = AssetPackagePlugin;
