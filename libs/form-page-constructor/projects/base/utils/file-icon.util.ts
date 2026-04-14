export function getFileIcon(name: string, assetsPath: string): string {
  const ext = name.split('.')?.pop() ?? '';
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'webp':
      return `${assetsPath}/jpg.svg`;
    case 'png':
      return `${assetsPath}/png.svg`;
    case 'svg':
      return `${assetsPath}/svg.svg`;
    case 'gif':
      return `${assetsPath}/gif.svg`;
    case 'tiff':
      return `${assetsPath}/tiff.svg`;
    case 'doc':
      return `${assetsPath}/doc.svg`;
    case 'docx':
      return `${assetsPath}/docx.svg`;
    case 'xls':
    case 'xlsx':
      return `${assetsPath}/xls.svg`;
    case 'rar':
      return `${assetsPath}/rar.svg`;
    case '7z':
      return `${assetsPath}/7z.svg`;
    case 'zip':
    case 'tar':
    case 'gz':
    case 'bz':
    case 'bz2':
      return `${assetsPath}/zip.svg`;
    case 'pdf':
      return `${assetsPath}/pdf.svg`;
    case 'ppt':
    case 'pptx':
      return `${assetsPath}/ppt.svg`;
    case 'exe':
    case 'sh':
      return `${assetsPath}/exe.svg`;
    default:
      return `${assetsPath}/file.svg`;
  }
}
