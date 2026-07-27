# Kod Öğrenme Rehberi

Bu rehber, projeyi ekranda gördüğünüz sonuçtan başlayıp veri ve altyapıya doğru öğrenmeniz için hazırlanmıştır. Dosyaları aşağıdaki sırayla okuyun; ilk turda her ayrıntıyı anlamaya çalışmayın.

## 1. Önce temel kavramlar

Bu proje TypeScript, React, React Native ve Expo kullanır. Başlamadan önce şu kavramları öğrenin:

1. `const`, fonksiyon, dizi ve nesne
2. TypeScript `type` ve `interface`
3. React bileşeni ve `props`
4. `useState`, `useEffect`, `useMemo` ve `useCallback`
5. React Native `View`, `Text`, `Pressable`, `Image` ve `StyleSheet`

## 2. Projenin kısa çalışma modeli

Uygulama dört katmandan oluşur:

1. **Hikâye verisi:** Metinler, seçimler ve hangi seçimin hangi bölüme gittiği
2. **Kayıt defterleri:** Hikâyelerin görsel ve ses dosyalarıyla eşleştirilmesi
3. **Hikâye motoru:** Seçimin uygulanması, ilerlemenin kaydedilmesi ve geri dönme
4. **Ekranlar:** Verinin kullanıcıya gösterilmesi

Temel akış şöyledir:

```text
Ana sayfa → Hikâye seç → StoryContext ilerlemeyi hazırlar
→ StoryPlayer mevcut düğümü gösterir → Kullanıcı seçim yapar
→ StoryContext sonraki düğüme geçer → Final ekranı açılır
```

## 3. Dosyaları bu sırayla okuyun

### Aşama 1 — Veri yapısını öğrenin

İlk dosya: `src/types/story.ts`

Burada uygulamanın sözlüğü bulunur:

- `Story`: Bir hikâyenin tamamı
- `StoryNode`: Tek bir bölüm
- `StoryChoice`: Kullanıcının seçeneği
- `StoryProgress`: Cihazda saklanan ilerleme

Alıştırma: Bir `StoryChoice` içindeki `nextNodeId` alanının ne işe yaradığını kendi cümlenizle açıklayın.

### Aşama 2 — En küçük hikâyeyi okuyun

Dosya: `src/stories/ormanda-kaybolus/story.ts`

Önce `common-1` düğümünü bulun. Sonra ilk seçimin `nextNodeId` değerini takip ederek finale kadar ilerleyin. Bir hikâyenin aslında birbirine kimliklerle bağlanan nesneler olduğunu burada göreceksiniz.

Niloya hikâyesi daha fazla otomatik üretilen varyasyon içerdiği için ilk öğrenme dosyası olarak uygun değildir. İbi hikâyesini anladıktan sonra `src/stories/niloya-kayip-isik/story.ts` dosyasına geçin.

### Aşama 3 — Görsel ve ses eşleştirmelerini öğrenin

Şu sırayla okuyun:

1. `src/stories/ormanda-kaybolus/images.ts`
2. `src/stories/ormanda-kaybolus/audio.ts`
3. `src/stories/index.ts`
4. `src/stories/audio.ts`

`story.ts` yalnızca bir görsel veya ses anahtarı söyler. `images.ts` ve `audio.ts`, bu anahtarı gerçek dosyaya bağlar. `src/stories/index.ts` ise bütün hikâyeleri uygulamaya kaydeder.

Alıştırma: `h1-end-a` düğümünün metnini, görselini ve sesini üç ayrı dosyada bulun.

### Aşama 4 — Hikâye motorunu öğrenin

Dosya: `src/context/StoryContext.tsx`

Bu dosyayı şu fonksiyon sırasıyla okuyun:

1. `createProgress`: Yeni hikâye ilerlemesi oluşturur.
2. `startStory`: Hikâyeyi başlatır veya kaldığı yerden açar.
3. `selectChoice`: Seçimi geçmişe ekler ve sonraki düğüme geçer.
4. `goBack`: Bir önceki seçime döner.
5. `restart`: Hikâyeyi sıfırlar.
6. İki `useEffect`: Cihaz kaydını okur ve tekrar kaydeder.

Buradaki `StoryProvider`, veriyi bütün ekranlara ulaştırır. Ekranlar bu verilere `useStory()` ile erişir.

### Aşama 5 — Hikâye ekranını öğrenin

Dosya: `src/components/StoryPlayer.tsx`

Şu sırayı takip edin:

1. `activeStoryId` ile etkin hikâyenin bulunması
2. `currentNodeId` ile mevcut bölümün bulunması
3. Görsel ve ses kaynağının seçilmesi
4. `choose` fonksiyonunun `selectChoice` çağırması
5. JSX bölümünde başlık, metin ve seçeneklerin çizilmesi

Alt bileşenler:

- `src/components/StoryBackground.tsx`: Arka plan görseli
- `src/components/ChoiceButton.tsx`: Tek bir seçim düğmesi
- `src/hooks/useNarration.ts`: Bölüm seslendirmesi
- `src/config/storyUi.ts`: Hikâyeye özel panel ve banner ayarları

### Aşama 6 — Ekran yönlendirmesini öğrenin

Şu sırayla okuyun:

1. `src/app/_layout.tsx`: Uygulamanın kökü ve ekran listesi
2. `src/app/index.tsx`: Ana sayfa
3. `src/app/story.tsx`: Hikâye ekranına açılan küçük yönlendirme dosyası
4. `src/app/result.tsx`: Final ekranı
5. `src/app/my-story.tsx`: Seçilen yolun baştan okunması

Expo Router, `src/app` klasöründeki dosya adlarını adres olarak kullanır. Örneğin `result.tsx`, `/result` ekranıdır.

### Aşama 7 — Kontrol araçlarını öğrenin

Şu dosyalar hatalı hikâye bağlantılarını bulur:

1. `src/engine/validateStory.ts`
2. `src/engine/storyPaths.ts`
3. `src/app/story-check.tsx`

`validateStory`, eksik düğüm ve görselleri kontrol eder. `listStoryPaths`, başlangıçtan finale giden yolları çıkarır. `story-check.tsx`, sonuçları geliştirme ekranında gösterir.

## 4. Kod okurken kullanacağınız yöntem

Her dosyada şu beş soruyu cevaplayın:

1. Bu dosya dışarıdan ne alıyor?
2. Hangi veriyi oluşturuyor veya değiştiriyor?
3. Dışarıya ne veriyor?
4. Bu dosyayı kim kullanıyor?
5. Hata olursa kullanıcı ekranda ne görür?

Bir fonksiyonu anlamadığınızda önce parametrelerine, sonra dönüş değerine bakın. Fonksiyonun içindeki her satırı aynı anda çözmeye çalışmayın.

## 5. Güvenli değişiklik yapma sırası

Küçük bir değişiklikte şu sırayı izleyin:

1. Değişecek hikâye düğümünü bulun.
2. Düğüm kimliğini değiştirmeden metni düzenleyin.
3. Görsel veya ses değişiyorsa ilgili eşleştirme dosyasını kontrol edin.
4. TypeScript denetimini çalıştırın:

```bash
npx tsc --noEmit
```

5. Geliştirme sürümünde **Hikâye Kontrolü** ekranını açın.
6. Değiştirdiğiniz yolu uygulamada baştan sona oynayın.

## 6. Başlangıç alıştırmaları

Kolaydan zora doğru:

1. Bir hikâyenin açıklamasını değiştirin.
2. `src/config/storyUi.ts` içinden Niloya panel yüksekliğini değiştirin.
3. Bir seçim metnini değiştirin; `nextNodeId` alanına dokunmayın.
4. Yeni bir ses dosyasını mevcut düğüme bağlayın.
5. İbi hikâyesine yeni bir ara düğüm ekleyin.
6. `validateStory` içine yeni bir uyarı kuralı ekleyin.

## 7. Şimdilik dokunmamanız gerekenler

İlk öğrenme aşamasında şunları değiştirmeyin:

- `STORAGE_KEY`: Değişirse kullanıcıların kayıtlı ilerlemesi kaybolur.
- Mevcut düğümlerin `id` değerleri: Ses, görsel ve kayıt bağlantıları bozulabilir.
- `nextNodeId`: Hedef düğüm yoksa hikâye ilerlemez.
- `require(...)` içindeki dosya yolları: Expo bu yolları uygulama oluşturulurken paketler.

Bu okuma sırasını tamamladığınızda uygulamadaki bir seçimin veriden ekrana, ekrandan kayda ve sonraki bölüme nasıl ilerlediğini baştan sona takip edebilirsiniz.
