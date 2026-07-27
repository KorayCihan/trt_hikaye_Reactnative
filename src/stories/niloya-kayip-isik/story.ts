import type { Story, StoryChoice, StoryNode } from '@/types/story';

type Accessory = 'red-bag' | 'yellow-hat' | 'lantern';
type Placement = 'stone' | 'flowers' | 'sand';
type Celebration = 'watch-flowers' | 'play-animals' | 'wave-fish';
type SkyKeyPath = 'niloya-key' | 'tospik-key' | 'wind-key';
type SkyEnding = 'watch-sky' | 'wave-birds' | 'view-forest';

const accessories: Accessory[] = ['red-bag', 'yellow-hat', 'lantern'];
const placements: Placement[] = ['stone', 'flowers', 'sand'];
const celebrations: Celebration[] = ['watch-flowers', 'play-animals', 'wave-fish'];
const skyKeyPaths: SkyKeyPath[] = ['niloya-key', 'tospik-key', 'wind-key'];
const skyEndings: SkyEnding[] = ['watch-sky', 'wave-birds', 'view-forest'];
const cavePaths = [
  { id: 'raise-leaf', text: 'Niloya parlak yaprağı havaya kaldırsın.' },
  { id: 'follow-lights', text: 'Tospik duvardaki ışıkları takip etsin.' },
  { id: 'follow-sound', text: 'İkisi sesin geldiği yere doğru yürüsün.' },
] as const;
const moonlightPaths = [
  { id: 'niloya-push', text: 'Niloya taşı aşağıdan itsin.' },
  { id: 'ask-bats', text: 'Tospik yarasalardan yardım istesin.' },
  { id: 'bats-fly', text: 'Bütün yarasalar taşın çevresinde uçsun.' },
] as const;
const moonCelebrations = [
  { id: 'walk-flowers', text: 'Niloya ve Tospik ay çiçeklerinin arasında yürüsün.' },
  { id: 'play-bats', text: 'Küçük yarasalarla birlikte oyun oynasınlar.' },
  { id: 'watch-moonlight', text: 'Mağaranın önünde ay ışığını izlesinler.' },
] as const;

const accessoryIds: Record<Accessory, string> = {
  'red-bag': 'kirmizi-canta',
  'yellow-hat': 'sari-sapka',
  lantern: 'kucuk-fener',
};

const placementIds: Record<Placement, string> = {
  stone: 'tas',
  flowers: 'cicekler',
  sand: 'kum',
};

const celebrationIds: Record<Celebration, string> = {
  'watch-flowers': 'cicekleri-izle',
  'play-animals': 'hayvanlarla-oyna',
  'wave-fish': 'baliklara-el-salla',
};

const skyKeyChoiceText: Record<SkyKeyPath, string> = {
  'niloya-key': 'Niloya anahtarı yerden alsın.',
  'tospik-key': 'Tospik anahtarı Niloya’ya getirsin.',
  'wind-key': 'Rüzgâr anahtarı kulübenin önüne sürüklesin.',
};

const skyEndingChoiceText: Record<SkyEnding, string> = {
  'watch-sky': 'Niloya gökyüzündeki ışığı izlesin.',
  'wave-birds': 'Tospik uçan kuşlara el sallasın.',
  'view-forest': 'İkisi tepenin üzerinden ormana baksın.',
};

const choice = (id: string, text: string, nextNodeId: string, transitionImageKey?: string): StoryChoice => ({
  id,
  text,
  nextNodeId,
  transitionImageKey,
});

const node = (
  id: string,
  paragraphNumber: number,
  title: string,
  text: string,
  backgroundImage: string,
  choices: StoryChoice[],
): StoryNode => ({ id, paragraphNumber, title, text, backgroundImage, choices, isEnding: false });

const nodes: Record<string, StoryNode> = {};

nodes['parlayan-isik'] = node(
  'parlayan-isik',
  1,
  'Parlayan Işık',
  'Niloya bahçede çiçekleri sularken çimenlerin arasında parlayan küçük bir ışık gördü. Tospik ışığa dokununca ışık ormana doğru uçmaya başladı. “Haydi Tospik, onu takip edelim!” dedi Niloya.',
  'niloya-light-1-start-portrait.jpg',
  [
    choice('kirmizi-canta', 'Niloya kırmızı çantasını alsın.', 'cicekli-yol-kirmizi-canta', 'niloya-light-2-red-bag-portrait.jpg'),
    choice('sari-sapka', 'Niloya sarı şapkasını taksın.', 'cicekli-yol-sari-sapka', 'niloya-light-2-yellow-hat-portrait.jpg'),
    choice('kucuk-fener', 'Niloya küçük fenerini alsın.', 'cicekli-yol-kucuk-fener', 'niloya-light-2-lantern-portrait.jpg'),
  ],
);

for (const accessory of accessories) {
  const suffix = accessoryIds[accessory];
  const image = (number: number, detail = '') => `niloya-light-${number}-${accessory}${detail}-portrait.jpg`;

  nodes[`cicekli-yol-${suffix}`] = node(
    `cicekli-yol-${suffix}`,
    2,
    'Çiçekli Yol',
    'Niloya ve Tospik, ışığı takip ederek çiçeklerle dolu bir yola ulaştı. Önlerinde üç farklı çiçek yolu vardı.',
    image(2),
    ['Kırmızı gelinciklerin arasından geçsinler.', 'Sarı papatyaların arasından geçsinler.', 'Mor çiçeklerin arasından geçsinler.'].map((text, index) =>
      choice(`cicek-yolu-${index + 1}`, text, `yasli-agac-${suffix}`, image(3)),
    ),
  );

  nodes[`yasli-agac-${suffix}`] = node(
    `yasli-agac-${suffix}`,
    3,
    'Yaşlı Ağaç',
    'Büyük ağacın gövdesinde parlak bir yıldız belirdi. Yaşlı ağaç, ormanın ışığının kaybolduğunu ve hayvanların yollarını bulamadığını söyledi. “Merak etme, ışığı bulacağız!” dedi Niloya.',
    image(3),
    ['Niloya yıldız işaretine dokunsun.', 'Tospik ağacın köklerine baksın.', 'Niloya dallardaki kuşları dinlesin.'].map((text, index) =>
      choice(`agac-${index + 1}`, text, `sisli-orman-${suffix}`, image(4)),
    ),
  );

  nodes[`sisli-orman-${suffix}`] = node(
    `sisli-orman-${suffix}`,
    4,
    'Sisli Orman',
    'Yaşlı ağaç, onlara yolu gösterecek parlak bir yaprak verdi. Niloya ve Tospik ormana girince çevrelerini kalın bir sis kapladı. Parlak yaprak havaya yükselerek önlerindeki yolu aydınlattı.',
    image(4),
    ['Tavşan izlerini takip etsinler.', 'Renkli taşları takip etsinler.', 'Ağaçlardaki kurdeleleri takip etsinler.'].map((text, index) =>
      choice(`orman-yolu-${index + 1}`, text, `uc-gizemli-yol-${suffix}`, image(5)),
    ),
  );

  nodes[`uc-gizemli-yol-${suffix}`] = node(
    `uc-gizemli-yol-${suffix}`,
    5,
    'Üç Gizemli Yol',
    'Açıklıkta parlayan ışık üç parçaya ayrıldı. Bir parça nehre, biri yüksek tepeye, diğeri karanlık mağaraya doğru ilerledi. Niloya bu kez önemli bir karar vereceğini anladı.',
    image(5),
    [
      choice('nehir-yolu', 'Nehir yoluna git.', `sarki-soyleyen-nehir-${suffix}`, image(6, '-river')),
      choice('yuksek-tepe', 'Yüksek tepeye çık.', `ruzgarli-tepe-${suffix}`, `niloya-sky-6-${accessory}-windy-hill-portrait.jpg`),
      choice('karanlik-magara', 'Karanlık mağaraya gir.', `karanlik-magara-${suffix}`, `niloya-moon-6-${accessory}-dark-cave-portrait.jpg`),
    ],
  );

  const skyImage = (number: number, detail: string) => `niloya-sky-${number}-${accessory}-${detail}-portrait.jpg`;

  nodes[`ruzgarli-tepe-${suffix}`] = node(
    `ruzgarli-tepe-${suffix}`,
    6,
    'Rüzgârlı Tepe',
    'Niloya ve Tospik yüksek tepeye çıkmaya başladı. Zirvede, kuyruğunda altın bir anahtar bulunan renkli bir uçurtma gördüler.',
    skyImage(6, 'windy-hill'),
    [
      choice('ucurtmaya-kos', 'Niloya uçurtmaya doğru koşsun.', `altin-anahtar-${suffix}`, skyImage(7, 'golden-key')),
      choice('golgeyi-takip-et', 'Tospik uçurtmanın gölgesini takip etsin.', `altin-anahtar-${suffix}`, skyImage(7, 'golden-key')),
      choice('birlikte-izle', 'İkisi uçurtmayı birlikte izlesin.', `altin-anahtar-${suffix}`, skyImage(7, 'golden-key')),
    ],
  );

  nodes[`altin-anahtar-${suffix}`] = node(
    `altin-anahtar-${suffix}`,
    7,
    'Altın Anahtar',
    'Uçurtmanın kuyruğundaki anahtar yere düştü. Aynı anda yakındaki eski kulübenin kapısı parlamaya başladı.',
    skyImage(7, 'golden-key'),
    skyKeyPaths.map((path) =>
      choice(path, skyKeyChoiceText[path], `sonmus-fener-${suffix}-${path}`, skyImage(8, `${path}-extinguished-lantern`)),
    ),
  );

  for (const keyPath of skyKeyPaths) {
    nodes[`sonmus-fener-${suffix}-${keyPath}`] = node(
      `sonmus-fener-${suffix}-${keyPath}`,
      8,
      'Sönmüş Fener',
      'Kulübenin içinde büyük fakat sönmüş bir fener vardı. Niloya ve Tospik feneri yeniden yakmaya çalıştı.',
      skyImage(8, `${keyPath}-extinguished-lantern`),
      [
        choice('yapragi-fenere-koy', 'Niloya parlak yaprağı fenerin içine koysun.', `gokyuzundeki-yol-${suffix}`, skyImage(9, 'watch-sky-final')),
        choice('perdeleri-ac', 'Tospik kulübenin perdelerini açsın.', `gokyuzundeki-yol-${suffix}`, skyImage(9, 'wave-birds-final')),
        choice('tozlari-temizle', 'İkisi fenerin üzerindeki tozları temizlesin.', `gokyuzundeki-yol-${suffix}`, skyImage(9, 'view-forest-final')),
      ],
    );
  }

  nodes[`gokyuzundeki-yol-${suffix}`] = node(
    `gokyuzundeki-yol-${suffix}`,
    9,
    'Gökyüzündeki Yol',
    'Fenerin ışığı gökyüzüne yükseldi. Ormandaki sis dağıldı ve kuşlar ışığı takip ederek yollarını buldu.',
    skyImage(9, 'watch-sky-final'),
    skyEndings.map((ending) =>
      choice(ending, skyEndingChoiceText[ending], `birlikte-basarmak-${suffix}-${ending}`, skyImage(9, `${ending}-final`)),
    ),
  );

  for (const skyEnding of skyEndings) {
    const id = `birlikte-basarmak-${suffix}-${skyEnding}`;
    nodes[id] = {
      id,
      paragraphNumber: 10,
      title: 'Birlikte Başarmak',
      text: 'Akşam olduğunda fener bütün ormanı aydınlattı. Yaşlı ağaç, dostların birlikte çalışınca bütün zorlukları aşabileceğini söyledi. Tepedeki fener sonsuza kadar ormana yol gösterdi.',
      backgroundImage: skyImage(9, `${skyEnding}-final`),
      choices: [],
      isEnding: true,
      endingTitle: 'Gökyüzü Fenerinin Bekçileri',
      endingKind: 'courage',
    };
  }

  const moonImage = (number: number, detail: string) => `niloya-moon-${number}-${accessory}-${detail}-portrait.jpg`;

  nodes[`karanlik-magara-${suffix}`] = node(
    `karanlik-magara-${suffix}`,
    6,
    'Karanlık Mağara',
    'Niloya ve Tospik karanlık mağaraya girdi. Duvarlardaki küçük ışıklar yollarını gösterirken uzaktan bir ağlama sesi duyuldu.',
    moonImage(6, 'dark-cave'),
    cavePaths.map((path) =>
      choice(path.id, path.text, `kucuk-yarasa-${suffix}-${path.id}`, moonImage(7, `${path.id}-bat`)),
    ),
  );

  for (const cavePath of cavePaths) {
    nodes[`kucuk-yarasa-${suffix}-${cavePath.id}`] = node(
      `kucuk-yarasa-${suffix}-${cavePath.id}`,
      7,
      'Küçük Yarasa',
      'Küçük bir yarasanın kanadı iki taşın arasına sıkışmıştı. Niloya ve Tospik onu kurtarmaya karar verdi.',
      moonImage(7, `${cavePath.id}-bat`),
      [
        choice('niloya-tasi-kaldirsin', 'Niloya küçük taşı kaldırsın.', `uyuyan-ay-cicegi-${suffix}`, moonImage(8, 'sleeping-moon-flower')),
        choice('tospik-tasi-itsin', 'Tospik taşı kabuğuyla itsin.', `uyuyan-ay-cicegi-${suffix}`, moonImage(8, 'sleeping-moon-flower')),
        choice('birlikte-hareket-ettirsin', 'İkisi taşları birlikte hareket ettirsin.', `uyuyan-ay-cicegi-${suffix}`, moonImage(8, 'sleeping-moon-flower')),
      ],
    );
  }

  nodes[`uyuyan-ay-cicegi-${suffix}`] = node(
    `uyuyan-ay-cicegi-${suffix}`,
    8,
    'Uyuyan Ay Çiçeği',
    'Yarasa onları kapalı bir ay çiçeğinin bulunduğu gizli bölüme götürdü. Tavandaki büyük bir taş, ay ışığının içeri girmesini engelliyordu.',
    moonImage(8, 'sleeping-moon-flower'),
    moonlightPaths.map((path) =>
      choice(path.id, path.text, `ay-isiginin-donusu-${suffix}-${path.id}`, moonImage(9, `${path.id}-moonlight`)),
    ),
  );

  for (const moonlightPath of moonlightPaths) {
    nodes[`ay-isiginin-donusu-${suffix}-${moonlightPath.id}`] = node(
      `ay-isiginin-donusu-${suffix}-${moonlightPath.id}`,
      9,
      'Ay Işığının Dönüşü',
      'Ay ışığı çiçeğe ulaşınca ay çiçeği açıldı. İçinden çıkan parlak ışıklar mağaradan çıkarak bütün ormana dağıldı.',
      moonImage(9, `${moonlightPath.id}-moonlight`),
      [
        choice('isiklara-dokun', 'Niloya ışık tanelerine dokunsun.', `cesur-dostlar-${suffix}`, moonImage(10, 'walk-flowers-final')),
        choice('cicegin-yaninda-dur', 'Tospik ay çiçeğinin yanında dursun.', `cesur-dostlar-${suffix}`, moonImage(10, 'watch-moonlight-final')),
        choice('yarasalar-ucsun', 'Küçük yarasalar ışıkların arasında uçsun.', `cesur-dostlar-${suffix}`, moonImage(10, 'play-bats-final')),
      ],
    );
  }

  nodes[`cesur-dostlar-${suffix}`] = node(
    `cesur-dostlar-${suffix}`,
    10,
    'Cesur Dostlar',
    'Ay çiçeği Niloya’ya parlak bir yaprak verdi. Niloya yaprağı mağaranın girişine dikince yeni bir ay çiçeği büyüdü.',
    moonImage(10, 'walk-flowers-final'),
    moonCelebrations.map((celebration) =>
      choice(celebration.id, celebration.text, `ay-ciceginin-cesur-dostlari-${suffix}-${celebration.id}`, moonImage(10, `${celebration.id}-final`)),
    ),
  );

  for (const celebration of moonCelebrations) {
    const id = `ay-ciceginin-cesur-dostlari-${suffix}-${celebration.id}`;
    nodes[id] = {
      id,
      paragraphNumber: 11,
      title: 'Ay Çiçeğinin Cesur Dostları',
      text: 'Mağaranın girişi ay çiçekleriyle aydınlandı. Niloya, Tospik ve küçük yarasalar cesaretin yardıma ihtiyacı olan birini yalnız bırakmamak olduğunu hiç unutmadı.',
      backgroundImage: moonImage(10, `${celebration.id}-final`),
      choices: [],
      isEnding: true,
      endingTitle: 'Ay Çiçeğinin Cesur Dostları',
      endingKind: 'courage',
    };
  }

  nodes[`sarki-soyleyen-nehir-${suffix}`] = node(
    `sarki-soyleyen-nehir-${suffix}`,
    6,
    'Şarkı Söyleyen Nehir',
    'Niloya ve Tospik nehre ulaştı. Büyük bir kaya suyun akmasını engelliyor, nehrin sesi giderek azalıyordu.',
    image(6, '-river'),
    ['Niloya kayayı bir dalla itsin.', 'Tospik kayayı kabuğuyla itsin.', 'Niloya ve Tospik birlikte itsin.'].map((text, index) =>
      choice(`kayayi-it-${index + 1}`, text, `baliklarin-sirri-${suffix}`, image(7, '-fish-secret')),
    ),
  );

  nodes[`baliklarin-sirri-${suffix}`] = node(
    `baliklarin-sirri-${suffix}`,
    7,
    'Balıkların Sırrı',
    'Kaya kenara çekildi ve nehir yeniden akmaya başladı. Renkli balıklar ortaya çıktı. Balıklar, nehrin dibinde ormanı aydınlatabilecek mavi bir kristal bulunduğunu söyledi.',
    image(7, '-fish-secret'),
    ['Niloya balıklara kristalin yerini sorsun.', 'Tospik suyun içine dikkatlice baksın.', 'Balıklar yüzerek kristalin yerini göstersin.'].map((text, index) =>
      choice(`kristali-ara-${index + 1}`, text, `mavi-kristal-${suffix}`, image(8, '-blue-crystal')),
    ),
  );

  nodes[`mavi-kristal-${suffix}`] = node(
    `mavi-kristal-${suffix}`,
    8,
    'Mavi Kristal',
    'Kristalin yosunların altında saklandığı anlaşıldı. Tospik yosunları temizleyince mavi kristal ortaya çıktı. Niloya kristali nehirden ayırmadan ışığını yaymanın bir yolunu düşündü.',
    image(8, '-blue-crystal'),
    [
      choice('tasa-koy', 'Kristali büyük bir taşın üzerine koysun.', `ormanin-uyanisi-${suffix}-tas`, image(9, '-stone')),
      choice('ciceklere-koy', 'Kristali çiçeklerin yanına yerleştirsin.', `ormanin-uyanisi-${suffix}-cicekler`, image(9, '-flowers')),
      choice('kuma-koy', 'Kristali nehir kıyısındaki kumlara koysun.', `ormanin-uyanisi-${suffix}-kum`, image(9, '-sand')),
    ],
  );

  for (const placement of placements) {
    const placementSuffix = placementIds[placement];
    nodes[`ormanin-uyanisi-${suffix}-${placementSuffix}`] = node(
      `ormanin-uyanisi-${suffix}-${placementSuffix}`,
      9,
      'Ormanın Uyanışı',
      'Mavi kristalin ışığı suya, çiçeklere ve bütün ormana yayıldı. Kuruyan yapraklar canlandı, nehir yeniden parladı ve hayvanlar sevinçle yuvalarından çıktı.',
      image(9, `-${placement}`),
      [
        choice('cicekleri-izle', 'Niloya ve Tospik canlanan çiçekleri izlesin.', `paylasmanin-gucu-${suffix}-cicekleri-izle`, image(10, '-watch-flowers')),
        choice('hayvanlarla-oyna', 'Niloya ve Tospik hayvanlarla oynasın.', `paylasmanin-gucu-${suffix}-hayvanlarla-oyna`, image(10, '-play-animals')),
        choice('baliklara-el-salla', 'Niloya ve Tospik balıklara el sallasın.', `paylasmanin-gucu-${suffix}-baliklara-el-salla`, image(10, '-wave-fish')),
      ],
    );
  }

  for (const celebration of celebrations) {
    const celebrationSuffix = celebrationIds[celebration];
    const id = `paylasmanin-gucu-${suffix}-${celebrationSuffix}`;
    nodes[id] = {
      id,
      paragraphNumber: 10,
      title: 'Paylaşmanın Gücü',
      text: 'Ormanın kayıp ışığı tamamen geri döndü. Niloya ve Tospik, yeniden parlayan nehre ve canlanan ormana sevinçle baktı. Bütün orman canlıları onların etrafında toplandı ve ışığın dönüşünü kutladı. Niloya, mutluluğun paylaştıkça çoğaldığını anladı.',
      backgroundImage: image(10, `-${celebration}`),
      choices: [],
      isEnding: true,
      endingTitle: 'Mavi Kristalin Koruyucuları',
      endingKind: 'kindness',
    };
  }
}

export const niloyaLostLightStory: Story = {
  id: 'niloya-lost-light',
  title: 'Niloya ve Tospik’in Kayıp Işık Macerası',
  description: 'Niloya ve Tospik, ormanın kaybolan ışığını geri getirmek için parlayan bir izin peşine düşüyor.',
  coverImage: 'niloya-banner.png',
  startNodeId: 'parlayan-isik',
  estimatedMinutes: 4,
  ageRange: '5–8',
  category: 'Macera',
  isNew: true,
  visualBible: {
    artStyle: 'Yüksek kaliteli, sıcak ve renkli 3D çocuk animasyonu',
    aspectRatio: '9:16',
    characterDescription: 'Niloya ve arkadaşı Tospik; yüzleri ve görünümleri tüm sahnelerde tutarlı',
    characterClothing: 'Seçilen kırmızı çanta, sarı şapka veya küçük fener sonraki sahnelerde korunur',
    colorPalette: 'Canlı orman yeşilleri, sıcak sarılar ve büyülü mavi ışıklar',
    lightingStyle: 'Yumuşak sinematik ışık',
    negativePrompt: 'text, watermark, logo, horror, blood, gore',
  },
  nodes,
};
