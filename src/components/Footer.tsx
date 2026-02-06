export function Footer() {
  const links = [
    {
      name: 'GitHub',
      url: 'https://github.com/sicheng-svg',
      icon: 'https://github.com/favicon.ico',
    },
    {
      name: 'CSDN',
      url: 'https://blog.csdn.net/xsc2004zyj?spm=1000.2115.3001.5343',
      icon: 'https://g.csdnimg.cn/static/logo/favicon32.ico',
    },
  ];

  return (
    <footer className="bg-transparent py-8">
      <div className="flex items-center justify-center gap-6">
        {links.map(({ name, url, icon }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white hover:-translate-y-1 transition-all duration-200"
          >
            <img src={icon} alt={name} className="w-5 h-5" />
            <span>{name}</span>
          </a>
        ))}
      </div>
    </footer>
  );
}
