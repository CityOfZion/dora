// @flow
import React, { useState, useEffect, ReactElement } from 'react'
import Parser, { Item } from 'rss-parser'

import './NewsFeed.scss'

const parser = new Parser()

const News: React.FC = (): ReactElement => {
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAndSetFeed(): Promise<void> {
      try {
        setIsLoading(true)
        setError(null)
        const results = await parser.parseURL('https://neonewstoday.com/feed/')
        if (results?.items?.length) {
          setItems(results.items)
        } else {
          setError('No news items found from NNT')
        }
      } catch (err) {
        setError('Unable to load news feed from NNT')
        console.error('News feed error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndSetFeed()
  }, [])

  const imgTagRegex = new RegExp('<s*img[^>]*>(.*?)')

  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  const imageHrefFromImgTags = img =>
    img
      .split(' ')
      .find((prop: string) => prop.includes('src'))
      .replace('src=', '')
      .replace('.png', '')
      .replace('"', '')
      .replace('"', '')

  const reducedItems = items.slice(0, 3)

  if (isLoading) {
    return (
      <div id="NewsFeed" className="loading">
        Loading news from NNT...
      </div>
    )
  }

  if (error) {
    return (
      <div id="NewsFeed" className="error">
        {error}
      </div>
    )
  }

  return (
    <div id="NewsFeed">
      {reducedItems.map(item => {
        const imgSrc = `${imageHrefFromImgTags(
          // eslint-disable-next-line
          // @ts-ignore
          item.content.match(imgTagRegex)[0],
        )}-300x169.png`
        const { title, link } = item

        return (
          <a
            className="news-item-container"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            key={title}
          >
            <img src={imgSrc} alt={title} />
            <div>
              <p> {title}</p>
            </div>
          </a>
        )
      })}
    </div>
  )
}

export default News
