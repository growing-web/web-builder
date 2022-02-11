import latestVersion from 'latest-version'

export async function getLatestVersion(name: string) {
  const version = await latestVersion(name)
  return version
}
