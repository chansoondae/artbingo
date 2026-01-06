const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  const { data, error } = await supabase
    .from('art_contents_all')
    .select('category')
    .order('view_count', { ascending: false })
    .limit(300);

  if (error) {
    console.error('Error:', error);
    return;
  }

  const categories = {};
  data.forEach(item => {
    if (item.category) {
      categories[item.category] = (categories[item.category] || 0) + 1;
    } else {
      categories['null'] = (categories['null'] || 0) + 1;
    }
  });

  console.log('카테고리별 개수 (Top 300):');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`${cat}: ${count}개`);
    });
})();
