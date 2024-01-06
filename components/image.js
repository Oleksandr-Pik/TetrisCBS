// Компонент створення картинки.
export function Image(src, clasName, alt) {
  return`<img class="${clasName}" src="./image/${src}" alt="${alt}">`
}