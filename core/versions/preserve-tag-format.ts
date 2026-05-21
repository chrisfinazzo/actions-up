import { isSemverLike } from './is-semver-like'

/**
 * Preserve the semver granularity of the current tag when projecting a newer
 * tag reference.
 *
 * Examples:
 *
 * - `v6` + `v7.0.2` -> `v7`
 * - `v6.1` + `v6.2.3` -> `v6.2`
 * - `v6.1.4` + `v6.2.3` -> `v6.2.3`.
 *
 * Returns null when the target tag cannot be preserved safely.
 *
 * @param currentVersion - Current tag reference found in the workflow.
 * @param latestVersion - Latest resolved tag reference.
 * @returns Preserved tag reference or null when preservation is unsafe.
 */
export function preserveTagFormat(
  currentVersion: undefined | string | null,
  latestVersion: undefined | string | null,
): string | null {
  if (!currentVersion || !latestVersion) {
    return null
  }

  let current = currentVersion.trim()
  let latest = latestVersion.trim()

  if (!isSemverLike(current) || !isSemverLike(latest)) {
    return null
  }

  let currentHasVPrefix = current.startsWith('v')
  let latestHasVPrefix = latest.startsWith('v')

  if (currentHasVPrefix !== latestHasVPrefix) {
    return null
  }

  let currentParts = current.replace(/^v/u, '').split('.')
  let latestParts = latest.replace(/^v/u, '').split('.')

  if (latestParts.length < currentParts.length) {
    return null
  }

  let prefix = currentHasVPrefix ? 'v' : ''

  return `${prefix}${latestParts.slice(0, currentParts.length).join('.')}`
}
