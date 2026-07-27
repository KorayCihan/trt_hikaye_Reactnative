# TRT Çocuk Hikâye Motoru

Expo SDK 54, Expo Router ve TypeScript ile hazırlanan; Expo Go uyumlu, veri tabanlı ve dallanan çocuk hikâyeleri uygulaması. Tam ekran sahneler, Türkçe seslendirme, çoklu final, favoriler ve cihazda ilerleme kaydı içerir.

## Çalıştırma

Node.js 20.19 veya daha yeni bir sürüm kullanın.

```bash
npm install
npx expo start --clear
```

Telefon ve bilgisayar aynı ağdayken QR kodunu Expo Go ile okutun. Bağlantı kurulmazsa `npx expo start --tunnel` kullanın.

## Yeni hikâye ekleme

1. `src/stories/<hikaye-kimliği>/` klasörünü oluşturun.
2. Bu klasöre `story.json`, `images.ts` ve `assets/` ekleyin.
3. `story.json` içinde `startNodeId` ve `nodes` alanlarını tanımlayın. Her seçeneğin `nextNodeId` değeri mevcut bir düğüme bağlanmalıdır.
4. Her düğüm için `backgroundImage` ve mümkünse `imagePrompt` yazın. Görseller 9:16, yazısız ve alt kısmında metin için sakin alan bırakacak biçimde hazırlanmalıdır.
5. Görselleri `assets/` içine koyun ve dinamik `require()` kullanmadan `images.ts` içinde sabit olarak eşleyin:

```ts
export const storyImages = {
  'cover.png': require('./assets/cover.png'),
  'intro.png': require('./assets/intro.png'),
};
```

6. Hikâyeyi `src/stories/index.ts` içindeki `stories` dizisine kaydedin. Ekran kodlarında değişiklik yapmanız gerekmez.
7. Geliştirme sürümünde ana sayfanın altındaki **Hikâye Kontrolü** ekranından bağlantıları, finalleri, ulaşılamayan düğümleri ve görselleri denetleyin.

## TXT dosyasını taslak hikâyeye dönüştürme

```bash
npm run convert-story -- "./incoming/hikaye.txt"
```

Araç `1. Paragraf`, `A)`, `7. Paragrafa gider`, `HİKAYE 1` ve `SON 1` kalıplarını tanır. Çıktı ilgili hikâyenin klasörüne `story.generated.json` adıyla yazılır. Belirsiz hedefler başlangıç düğümüne güvenli biçimde bağlanır ve konsolda uyarı gösterilir.

## Kontroller

```bash
npx tsc --noEmit
npx expo-doctor
npx expo export --platform android
```

İlerleme, seçim geçmişi, açılan sonlar, favoriler ve ses tercihi AsyncStorage ile cihazda saklanır.
