export function withWebpFormat(imageUrl: string | undefined) {
  //判断图片是否包含pic.centanet.com或centainfo.com&判断是否已经包含x-oss 避免误操作
  if (!imageUrl || !/(?:pic\.centanet\.com)/i.test(imageUrl)) return imageUrl
  if (/[?&]x-oss-process=/i.test(imageUrl)) return imageUrl

  const hashIndex = imageUrl.indexOf('#')
  const url = hashIndex < 0 ? imageUrl : imageUrl.slice(0, hashIndex)
  const hash = hashIndex < 0 ? '' : imageUrl.slice(hashIndex)
  return `${url}${url.includes('?') ? '&' : '?'}x-oss-process=image/format,webp${hash}`
}
