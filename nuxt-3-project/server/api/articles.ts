export default defineEventHandler(async (event) => {
  // ตัวอย่าง mock data
  return [
    {
      id: 1,
      title: 'วิธีปลูกต้นไม้ในคอนโด',
      slug: 'planting-in-condo',
      description: 'เรียนรู้วิธีการปลูกต้นไม้ในพื้นที่จำกัด...',
    },
    {
      id: 2,
      title: 'ทำ SEO ให้เว็บไซต์ยังไงให้ติดหน้าแรก',
      slug: 'seo-tips',
      description: 'บทความนี้จะช่วยคุณปรับแต่งเว็บไซต์ให้ถูกใจ Google...',
    },
  ]
})