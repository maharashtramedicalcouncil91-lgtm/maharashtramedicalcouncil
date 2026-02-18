import { createContext, useContext } from 'react'
import { defaultSiteContent } from '../data/defaultSiteContent'

export const STORAGE_KEY = 'mmc_site_content_v1'

export const SiteContentContext = createContext(null)

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value)

const mergeDeep = (target, source) => {
  if (Array.isArray(target)) {
    return Array.isArray(source) ? source : target
  }

  if (!isObject(target)) {
    return source ?? target
  }

  const output = { ...target }
  Object.keys(target).forEach((key) => {
    const targetValue = target[key]
    const sourceValue = source?.[key]

    if (Array.isArray(targetValue)) {
      output[key] = Array.isArray(sourceValue) ? sourceValue : targetValue
      return
    }

    if (isObject(targetValue)) {
      output[key] = mergeDeep(targetValue, sourceValue)
      return
    }

    output[key] = sourceValue ?? targetValue
  })

  return output
}

export const getInitialSiteContent = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return defaultSiteContent
    }

    const parsed = JSON.parse(saved)
    return mergeDeep(defaultSiteContent, parsed)
  } catch {
    return defaultSiteContent
  }
}

export const useSiteContent = () => {
  const context = useContext(SiteContentContext)
  if (!context) {
    throw new Error('useSiteContent must be used inside SiteContentProvider')
  }

  return context
}

