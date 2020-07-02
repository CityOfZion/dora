// @flow
import React, { useState, useEffect, ReactElement } from 'react'
import Parser, { Item } from 'rss-parser'
import moment from 'moment'

import './NewsFeed.scss'

const parser = new Parser()

type Props = {
  feed: {
    items: Item[]
  }
  loading: boolean
  networkId: string
  net: string
}

const News: React.FC = (): ReactElement => {
  const feed: Item[] = []
  const [items, setItems] = useState(feed)

  useEffect(() => {
    async function fetchAndSetFeed(): Promise<void> {
      const results = await parser.parseURL(
        'https://cors-anywhere.herokuapp.com/http://neonewstoday.com/feed/',
      )
      if (results) {
        results.items && setItems(results.items)
      }
    }
    if (!items.length) {
      fetchAndSetFeed()
    }
  }, [feed, items.length])

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
              <small>{moment(item.isoDate).format('YYYY-MM-DD')}</small>
              <p> {title}</p>
            </div>
          </a>
        )
      })}
    </div>
  )
}

export default News
