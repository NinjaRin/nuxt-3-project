import { supabaseServer } from '~/server/utils/supabaseServer'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 10

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabaseServer
    .from('articles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return {
    articles: data,
    total: count,
    page,
    pageSize,
  }
})
