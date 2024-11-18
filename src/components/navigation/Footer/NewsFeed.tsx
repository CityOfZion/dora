// @flow
import React, { useState, useEffect, ReactElement } from 'react'
import Parser, { Item } from 'rss-parser'

import './NewsFeed.scss'

const parser = new Parser()

const News: React.FC = (): ReactElement => {
  // Component state to hold new items, error, and loading state.
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On component mount, fetch and set the news feed, ensuring to handle errors.
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

  // Regular expression to match img tags in the content.
  const imgTagRegex = new RegExp('<s*img[^>]*>(.*?)')

  // Function to extract the src attribute from img tags.
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

  // We only want to display 3 items.
  const reducedItems = items.slice(0, 3)

  // Return early if the feed is still loading.
  if (isLoading) {
    return (
      <div id="NewsFeed" className="loading">
        Loading news from NNT...
      </div>
    )
  }

  // Return early if there was an error fetching the feed.
  if (error) {
    return (
      <div id="NewsFeed" className="error">
        {error}
      </div>
    )
  }

  // Render the news feed.
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
