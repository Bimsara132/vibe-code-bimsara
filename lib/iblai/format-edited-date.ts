export function formatEditedDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return 'Edited recently'

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffSec < 60) return 'Edited just now'

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) {
    return diffMin === 1 ? 'Edited 1 minute ago' : `Edited ${diffMin} minutes ago`
  }

  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) {
    return diffHr === 1 ? 'Edited 1 hour ago' : `Edited ${diffHr} hours ago`
  }

  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) {
    return diffDay === 1 ? 'Edited yesterday' : `Edited ${diffDay} days ago`
  }

  const diffWeek = Math.floor(diffDay / 7)
  if (diffWeek < 5) {
    return diffWeek === 1 ? 'Edited 1 week ago' : `Edited ${diffWeek} weeks ago`
  }

  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) {
    return diffMonth <= 1 ? 'Edited 1 month ago' : `Edited ${diffMonth} months ago`
  }

  const diffYear = Math.floor(diffDay / 365)
  return diffYear === 1 ? 'Edited 1 year ago' : `Edited ${diffYear} years ago`
}
