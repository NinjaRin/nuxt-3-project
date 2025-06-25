import { supabaseServer } from '~/server/utils/supabaseServer'
import { Article } from '~/types/article'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const requestedPage = parseInt(query.page as string) || 1
  const rawPageSize = parseInt(query.pageSize as string) || 10
  const pageSize = Math.min(Math.max(rawPageSize, 1), 100)

  // 👇 นับจำนวนทั้งหมดก่อน
  const { count, error: countError } = await supabaseServer
    .from('articles')
    .select('id', { count: 'exact', head: true })

  if (countError) {
    throw createError({ statusCode: 500, message: countError.message })
  }

  const total = count || 0
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)
  const page = Math.min(Math.max(requestedPage, 1), totalPages)

  const from = (page - 1) * pageSize
  const to = Math.min(from + pageSize - 1, total - 1)


  let data: Article[] = []
  if (total > 0 && from <= to) {
    const response = await supabaseServer
      .from('articles')
      .select('id, title, slug, content, cover_image_url, category_id, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (response.error) {
      throw createError({ statusCode: 500, message: response.error.message })
    }

    data = response.data
  }

  return {
    articles: data,
    total,
    page,
    pageSize,
  }
})
