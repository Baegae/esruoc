interface ImageOutput {
  success: number,
  file: FileOutput
}

interface FileOutput {
  url: string,
  name: string
}

export default ImageOutput;
