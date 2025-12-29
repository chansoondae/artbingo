import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import sharp from 'sharp';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const nickname = formData.get('nickname') as string;
    const exhibitionsStr = formData.get('exhibitions') as string;
    const visitedCount = parseInt(formData.get('visitedCount') as string);
    const profileImage = formData.get('profileImage') as File | null;

    const exhibitions = JSON.parse(exhibitionsStr);

    // 전시 이미지들 추출
    const exhibitionImages: File[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith('exhibitionImage_') && value instanceof File) {
        exhibitionImages.push(value);
      }
    });

    // 방문한 전시 목록 추출
    const visitedExhibitions = exhibitions
      .filter((ex: any) => ex.isVisited)
      .map((ex: any) => `${ex.museum} - ${ex.exhibition}`)
      .join(', ');

    // 프롬프트 생성
    const prompt = `이 사진 속 인물의 얼굴 특징은 유지하되, 귀엽고 예쁜 일러스트 캐릭터로 변환해주세요. 닉네임 "${nickname}"이고, 2025년에 다음 전시를 방문했습니다: ${visitedExhibitions || '시작 단계'}. 미술관에서 전시를 즐기는 모습을 표현하는 귀엽고 따뜻한 일러스트를 만들어주세요. 애니메이션이나 만화 스타일, 밝고 예술적인 분위기로.`;

    let imageResponse;

    if (profileImage || exhibitionImages.length > 0) {
      let compositeImageBuffer: Buffer;

      if (profileImage && exhibitionImages.length > 0) {
        // 프로필 이미지와 전시 이미지들을 합성
        const profileBytes = await profileImage.arrayBuffer();
        const profileBuffer = Buffer.from(profileBytes);

        // 프로필 이미지를 800x800으로 리사이즈
        const resizedProfile = await sharp(profileBuffer)
          .resize(800, 800, { fit: 'cover' })
          .toBuffer();

        // 전시 이미지들을 작게 리사이즈 (최대 4개만)
        const thumbnails = await Promise.all(
          exhibitionImages.slice(0, 4).map(async (img) => {
            const bytes = await img.arrayBuffer();
            const buffer = Buffer.from(bytes);
            return sharp(buffer)
              .resize(200, 200, { fit: 'cover' })
              .toBuffer();
          })
        );

        // 1024x1024 캔버스 생성
        const canvas = sharp({
          create: {
            width: 1024,
            height: 1024,
            channels: 3,
            background: { r: 255, g: 255, b: 255 }
          }
        });

        // 이미지 배치: 프로필은 중앙, 전시 이미지들은 하단에 가로로 배치
        const composites = [
          { input: resizedProfile, top: 112, left: 112 }, // 중앙에 프로필
        ];

        thumbnails.forEach((thumb, index) => {
          const x = 112 + (index * 200);
          composites.push({ input: thumb, top: 824, left: x });
        });

        compositeImageBuffer = await canvas.composite(composites).png().toBuffer();
      } else if (profileImage) {
        // 프로필 이미지만 있을 때
        const bytes = await profileImage.arrayBuffer();
        compositeImageBuffer = Buffer.from(bytes);
      } else {
        // 전시 이미지들만 있을 때 (첫 번째 이미지 사용)
        const bytes = await exhibitionImages[0].arrayBuffer();
        compositeImageBuffer = Buffer.from(bytes);
      }

      // FormData로 전송
      const formDataForApi = new FormData();
      const blob = new Blob([compositeImageBuffer as unknown as ArrayBuffer], { type: 'image/png' });
      formDataForApi.append('image', blob, 'composite.png');
      formDataForApi.append('model', 'gpt-image-1');
      formDataForApi.append('prompt', prompt);
      formDataForApi.append('n', '1');
      formDataForApi.append('size', '1024x1024');

      const response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formDataForApi,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API 오류: ${errorData.error?.message || JSON.stringify(errorData)}`);
      }

      imageResponse = await response.json();
    } else {
      // 프로필 사진이 없으면 프롬프트만으로 생성
      const defaultPrompt = `A cute and pretty character visiting art exhibitions in 2025. The character named "${nickname}" has visited these exhibitions: ${visitedExhibitions || 'starting their art journey'}. Create a whimsical, colorful illustration showing them enjoying art museums with paintings and sculptures in the background. Anime or cartoon style, cheerful and artistic atmosphere.`;

      imageResponse = await openai.images.generate({
        model: 'gpt-image-1.5',
        prompt: defaultPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'high',
      });
    }

    // console.log('Image response:', JSON.stringify(imageResponse, null, 2));

    if (!imageResponse.data || !imageResponse.data[0]) {
      console.error('Image response data:', imageResponse);
      throw new Error('Failed to generate image - no data returned');
    }

    // gpt-image-1은 b64_json으로 반환
    const imageData = imageResponse.data[0];
    let imageUrl: string;

    if (imageData.url) {
      imageUrl = imageData.url;
    } else if (imageData.b64_json) {
      // base64를 data URL로 변환
      imageUrl = `data:image/png;base64,${imageData.b64_json}`;
    } else {
      throw new Error('No image URL or base64 data in response');
    }

    // // 3. 설명 생성
    // const descriptionResponse = await openai.chat.completions.create({
    //   model: 'gpt-4o-mini',
    //   messages: [
    //     {
    //       role: 'system',
    //       content: '당신은 미술 전시 관람 성향을 분석하는 친근한 큐레이터입니다.',
    //     },
    //     {
    //       role: 'user',
    //       content: `닉네임: ${nickname}
    // 방문한 전시 수: ${visitedCount}개
    // 방문한 전시: ${visitedExhibitions || '없음'}

    // 이 사람을 2-3문장으로 표현해주세요.
    // - 방문한 전시의 특성 분석
    // - 미술 취향 분석
    // - 격려 메시지
    // 한국어로 친근하고 재미있게 작성하세요.`,
    //     },
    //   ],
    //   temperature: 0.7,
    // });

    // const description = descriptionResponse.choices[0].message.content || '';

    const description = `${nickname}님이 2025년에 방문한 ${visitedCount}개의 전시를 기념하는 이미지입니다! 🎨`;

    return NextResponse.json({
      imageUrl,
      description,
    });
  } catch (error: any) {
    console.error('Error generating profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate profile' },
      { status: 500 }
    );
  }
}
