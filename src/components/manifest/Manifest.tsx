import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import ChevronUpIcon from '@mui/icons-material/ExpandLess'
import ChevronDownIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import CopyIcon from '@mui/icons-material/FilterNone'
import CheckIcon from '@mui/icons-material/Check'

import './Manifest.scss'
import {
  ContractManifest,
  ManifestParameter,
  METHOD_GROUPS,
  SortOrder,
  formatSignature,
  matchesQuery,
  methodKind,
  sortByName,
  splitMatch,
  typeGroup,
} from './manifestUtils'

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'manifest', label: 'Manifest order' },
  { value: 'az', label: 'A–Z' },
]

const Highlight: React.FC<{
  text: string
  query: string
  className?: string
}> = ({ text, query, className }) => {
  const { pre, hit, post } = splitMatch(text, query)
  return (
    <span className={className}>
      {pre}
      {hit && <mark>{hit}</mark>}
      {post}
    </span>
  )
}

const TypeName: React.FC<{ type: string }> = ({ type }) => (
  <span className={`sig-type sig-type--${typeGroup(type)}`}>{type}</span>
)

const CopySignatureButton: React.FC<{ text: string; label: string }> = ({
  text,
  label,
}) => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1200)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      type="button"
      className={classNames('manifest-copy', { 'is-copied': copied })}
      onClick={copy}
      aria-label={copied ? 'Copied' : label}
      title={copied ? 'Copied' : label}
    >
      {copied ? (
        <CheckIcon style={{ width: 18 }} aria-hidden="true" />
      ) : (
        <CopyIcon style={{ width: 15 }} aria-hidden="true" />
      )}
    </button>
  )
}

const SignatureRow: React.FC<{
  item: { name: string; parameters: ManifestParameter[] }
  returntype?: string
  query: string
}> = ({ item, returntype, query }) => {
  const { parameters } = item
  const close = returntype ? (
    <>
      <span className="sig-punct">): </span>
      <TypeName type={returntype} />
    </>
  ) : (
    <span className="sig-punct">)</span>
  )

  return (
    <li className="manifest-signature-row">
      <code
        className={classNames('manifest-signature', {
          'manifest-signature--no-params': !parameters.length,
        })}
      >
        <span className="sig-head">
          <Highlight className="sig-name" text={item.name} query={query} />
          <span className="sig-punct">(</span>
        </span>
        {parameters.length ? (
          <>
            <span className="sig-params">
              {parameters.map((parameter, i) => (
                <span className="sig-param" key={i}>
                  <Highlight
                    className="sig-param-name"
                    text={parameter.name}
                    query={query}
                  />
                  <span className="sig-punct">: </span>
                  <TypeName type={parameter.type} />
                  {i < parameters.length - 1 ? (
                    <span className="sig-punct">,</span>
                  ) : (
                    <span className="sig-close sig-close--inline">{close}</span>
                  )}
                </span>
              ))}
            </span>
            <span className="sig-close sig-close--block">{close}</span>
          </>
        ) : (
          <span className="sig-close">{close}</span>
        )}
      </code>
      <CopySignatureButton
        text={formatSignature(item, returntype)}
        label={`Copy ${item.name} signature`}
      />
    </li>
  )
}

const SectionHeader: React.FC<{
  id: string
  title: string
  shown: number
  total: number
  open: boolean
  onToggle: () => void
  children?: React.ReactNode
}> = ({ id, title, shown, total, open, onToggle, children }) => {
  const label = `${open ? 'Collapse' : 'Expand'} ${title.toLowerCase()}`
  return (
    <div className="manifest-section-header">
      <div className="manifest-section-heading" onClick={onToggle}>
        <h3>{title}</h3>
        <span className="manifest-section-count">
          {shown === total ? total : `${shown} of ${total}`}
        </span>
      </div>
      {children}
      <button
        type="button"
        className="manifest-section-toggle"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        title={label}
      >
        {open ? (
          <ChevronUpIcon style={{ width: 30 }} aria-hidden="true" />
        ) : (
          <ChevronDownIcon style={{ width: 30 }} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

const Manifest: React.FC<{ manifest: ContractManifest }> = ({ manifest }) => {
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('manifest')
  const [methodsOpen, setMethodsOpen] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)

  // The search and sort controls live in the Methods header, so collapsing
  // Methods hides them; clear the search so it can't filter events unseen.
  const toggleMethods = (): void => {
    if (methodsOpen) setQuery('')
    setMethodsOpen(!methodsOpen)
  }

  const methods = manifest.abi.methods ?? []
  const events = manifest.abi.events ?? []

  const visibleMethods = sortByName(
    methods.filter(method => matchesQuery(method, query)),
    sortOrder,
  )
  const groups = METHOD_GROUPS.map(group => ({
    ...group,
    items: visibleMethods.filter(method => methodKind(method) === group.kind),
  })).filter(group => group.items.length)
  const visibleEvents = sortByName(
    events.filter(event => matchesQuery(event, query)),
    sortOrder,
  )

  return (
    <div className="manifest">
      {!!methods.length && (
        <section
          className={classNames('manifest-section', {
            'is-open': methodsOpen,
          })}
        >
          <SectionHeader
            id="manifest-methods"
            title="Methods"
            shown={visibleMethods.length}
            total={methods.length}
            open={methodsOpen}
            onToggle={toggleMethods}
          >
            {methodsOpen && (
              <div className="manifest-controls">
                <div
                  className="manifest-sort"
                  role="group"
                  aria-label="Sort methods and events"
                >
                  <span className="manifest-sort-label">Sort</span>
                  {SORT_OPTIONS.map(option => (
                    <button
                      type="button"
                      key={option.value}
                      className={classNames('manifest-sort-option', {
                        'is-active': sortOrder === option.value,
                      })}
                      aria-pressed={sortOrder === option.value}
                      onClick={(): void => setSortOrder(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <label className="manifest-search">
                  <SearchIcon style={{ width: 16 }} aria-hidden="true" />
                  <span className="manifest-visually-hidden">
                    Search methods and events
                  </span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e): void => setQuery(e.target.value)}
                    placeholder="Search methods or params"
                  />
                </label>
              </div>
            )}
          </SectionHeader>

          {methodsOpen && (
            <div id="manifest-methods">
              {groups.map(group => (
                <div className="manifest-group" key={group.kind}>
                  <div className="manifest-group-heading">
                    <h4
                      className={`manifest-group-title manifest-group-title--${group.kind}`}
                    >
                      {group.title}
                    </h4>
                    <span className="manifest-group-meta">
                      {group.items.length} · {group.description}
                    </span>
                  </div>
                  <ul className="manifest-signature-list">
                    {group.items.map(method => (
                      <SignatureRow
                        key={`${method.name}-${method.parameters.length}-${method.offset}`}
                        item={method}
                        returntype={method.returntype}
                        query={query}
                      />
                    ))}
                  </ul>
                </div>
              ))}
              {!groups.length && (
                <p className="manifest-empty">
                  No methods or parameters match “{query.trim()}”.
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {!!events.length && (
        <section
          className={classNames('manifest-section', {
            'is-open': eventsOpen,
          })}
        >
          <SectionHeader
            id="manifest-events"
            title="Events"
            shown={visibleEvents.length}
            total={events.length}
            open={eventsOpen}
            onToggle={(): void => setEventsOpen(!eventsOpen)}
          />
          {eventsOpen && (
            <div id="manifest-events">
              {visibleEvents.length ? (
                <ul className="manifest-signature-list manifest-signature-list--events">
                  {visibleEvents.map((event, i) => (
                    <SignatureRow
                      key={`${event.name}-${i}`}
                      item={event}
                      query={query}
                    />
                  ))}
                </ul>
              ) : (
                <p className="manifest-empty">
                  No events or parameters match “{query.trim()}”.
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default Manifest
