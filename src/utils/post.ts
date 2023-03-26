export function getPostTextContent (post): string | null {
  const { postBlocks } = post
  const textBlock = postBlocks.find(
    (blockItem) => blockItem.block.contentType === 'Text'
  )

  if (textBlock === null) return null

  return textBlock.block.content.text
}

export function getPostTitle (post): string {
  const textBlock = post.postBlocks.find(postBlock => postBlock.block.contentType === 'Text')
  if (textBlock === null) return ''
  return textBlock.block.content.title
}
