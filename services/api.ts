import * as FileSystem from 'expo-file-system';

// Update with your actual Render URL
const BASE_URL = 'https://pill-identification-ocr-based.onrender.com';

const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    throw new Error('Failed to convert image to base64');
  }
};

export const uploadImage = async (imageUri: string) => {
  try {
    const base64Image = await convertImageToBase64(imageUri);
    
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    
    if (!response.ok || !contentType.includes('application/json')) {
      const text = await response.text();
      console.warn('[UPLOAD] 非 JSON 回應：', text);
      throw new Error('伺服器錯誤，請稍後再試。');
    }

    return await response.json();
  } catch (error) {
    throw new Error('伺服器錯誤，請稍後再試。');
  }
};

export const matchPill = async (payload: any) => {
  try {
    const response = await fetch(`${BASE_URL}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      throw new Error(`JSON 解析錯誤：${(parseError as Error).message}\n原始回應：\n${text}`);
    }
  } catch (error) {
    throw error;
  }
};
