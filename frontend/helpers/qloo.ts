export const isEntityIdValid = (entityId: string) => {
  // Check if Entity ID is valid, i.e. 1BDBEB84-8068-41C8-AABF-739ED1092DE8
  if (!entityId || typeof entityId !== 'string') {
    return false
  }

  // UUID format: 8-4-4-4-12 characters (36 total including hyphens)
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(entityId)
}
