import FontFaceObserver from 'fontfaceobserver';

interface FontOption {
  fontName: string;
  href: string;
}

const fontLoader = ({
  fontName,
  href,
}: FontOption) => {
  const fontSlug = fontName.replace(/\s/g, '-').toLocaleLowerCase();
  const fontLoadedClassName = `${fontSlug}-loaded`;

  if (document.documentElement.classList.contains(fontLoadedClassName)) {
    return;
  }

  const link = document.createElement('link');
  link.href = href;
  link.rel = 'stylesheet';

  document.head.appendChild(link);

  const fontObserver = new FontFaceObserver(fontName);
  fontObserver.load().then(() => {
    document.documentElement.classList.add(fontLoadedClassName);
  }).catch(console.log);
};

export default fontLoader;
