import { useMemo, useState } from 'react'
import { defaultSiteContent } from '../data/defaultSiteContent'
import { SiteContentContext, STORAGE_KEY, getInitialSiteContent } from './siteContentStore'

export const SiteContentProvider = ({ children }) => {
  const [siteContent, setSiteContent] = useState(getInitialSiteContent)

  const updateContent = (nextValue) => {
    setSiteContent(nextValue)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValue))
  }

  const resetContent = () => {
    setSiteContent(defaultSiteContent)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSiteContent))
  }

  const value = useMemo(
    () => ({
      siteContent,
      updateContent,
      resetContent,
    }),
    [siteContent],
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

