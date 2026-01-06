const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  const { data, error } = await supabase
    .from('art_contents_all')
    .select('author')
    .order('view_count', { ascending: false })
    .limit(300);

  if (error) {
    console.error('Error:', error);
    return;
  }

  const authors = {};
  data.forEach(item => {
    if (item.author) {
      authors[item.author] = (authors[item.author] || 0) + 1;
    } else {
      authors['(작성자 없음)'] = (authors['(작성자 없음)'] || 0) + 1;
    }
  });

  console.log('\n닉네임별 콘텐츠 개수 (Top 300):');
  console.log('='.repeat(50));

  const sortedAuthors = Object.entries(authors)
    .sort((a, b) => b[1] - a[1]);

  sortedAuthors.forEach(([author, count], index) => {
    console.log(`${index + 1}. ${author}: ${count}개`);
  });

  console.log('='.repeat(50));
  console.log(`총 ${sortedAuthors.length}명의 작성자`);
})();
