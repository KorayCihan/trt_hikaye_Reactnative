import type { Story, StoryChoice, StoryNode } from '@/types/story';

const letters = ['a', 'b', 'c'] as const;

function choices(texts: string[], nextNodeId: string, imagePrefix: string): StoryChoice[] {
  return texts.map((text, index) => ({
    id: `${imagePrefix}-${letters[index]}`,
    text,
    nextNodeId,
    transitionImageKey: `${imagePrefix}-${letters[index]}.png`,
  }));
}

function node(id: string, paragraphNumber: number, title: string, text: string, choiceTexts: string[], nextNodeId: string, imagePrefix: string): StoryNode {
  return { id, paragraphNumber, title, text, backgroundImage: `${id}.png`, choices: choices(choiceTexts, nextNodeId, imagePrefix), isEnding: false };
}

function ending(id: string, title: string, text: string): StoryNode {
  return { id, paragraphNumber: 11, title, endingTitle: title, text, backgroundImage: `${id}.png`, choices: [], isEnding: true, endingKind: 'courage' };
}

const nodes: Record<string, StoryNode> = {
  'common-1': node('common-1', 1, 'Ormanda Kayboluş', "İbi akşam yürüyüşü yaparken fark etmeden ormanın derinliklerine kadar ilerlediğini anlar ve geri dönmek istediğinde yönünü tamamen kaybettiğini fark eder. Telefonunu çıkarıp sinyal arar ama hiçbir şekilde çekmediğini görünce içini hafif bir korku kaplar. Etrafındaki sessizlik normalden daha yoğun gelir.", ['İlerlemeye devam et', 'Etrafı incele', 'Olduğun yerde bekle'], 'common-2', 'common-p2'),
  'common-2': node('common-2', 2, 'Derinleşen Orman', "Ağaçlar giderek sıklaşır ve gökyüzü neredeyse tamamen kapanır, bu da İbi’nin yönünü bulmasını daha da zorlaştırır. Ayaklarının altında kırılan dalların sesi bile onu irkiltecek kadar belirgin hale gelir. Bir an için geri dönmeyi düşünse de hangi yönden geldiğini hatırlayamaz.", ['Sesin geldiği yöne git', 'Düz devam et', 'Geri dönmeye çalış'], 'common-3', 'common-p3'),
  'common-3': node('common-3', 3, 'Belirsiz Ses', "Bir süre sonra uzaktan gelen belirsiz bir ses duyar ve bunun bir insan mı yoksa hayvan mı olduğunu ayırt edemez. Ses bazen yaklaşır gibi olur bazen tamamen kaybolur ve bu durum İbi’nin karar vermesini zorlaştırır. Kalbi daha hızlı atmaya başlar.", ['Sesi takip et', 'Sesten uzaklaş', 'Olduğun yerde dinle'], 'common-4', 'common-p4'),
  'common-4': node('common-4', 4, 'Garip İzler', 'Etrafına dikkatlice baktığında yerde bazı izler, kırılmış dallar ve eskiye benzeyen garip işaretler görür. Bu izlerin birine ait olduğunu düşünür ama hangisinin güvenli olduğunu kestiremez. Yanlış bir kararın onu daha kötü bir duruma sokabileceğini hisseder.', ['İzleri takip et', 'Kendi yolunu çiz', 'Bekleyip düşün'], 'common-5', 'common-p5'),
  'common-5': { id: 'common-5', paragraphNumber: 5, title: 'Kritik Ayrım', text: 'Sonunda karşısına üç şey çıkar: yerde yaralı bir adam, toprağa gömülü eski bir kapı ve hafifçe parlayan garip bir taş. Üçü de ona farklı bir hikâyenin kapısını açacak gibi görünür. İbi hangisini seçerse hayatı tamamen değişecektir.', backgroundImage: 'common-5.png', choices: [
    { id: 'yarali-adam', text: 'Yaralı adama git', nextNodeId: 'h1-6', transitionImageKey: 'h1-p6.png' },
    { id: 'gizli-kapi', text: 'Kapıyı aç', nextNodeId: 'h2-6', transitionImageKey: 'h2-p6.png' },
    { id: 'parlayan-tas', text: 'Taşı al', nextNodeId: 'h3-6', transitionImageKey: 'h3-p6.png' },
  ], isEnding: false },

  'h1-6': node('h1-6', 6, 'Yaralı Adam', "İbi yaralı adama yaklaşır ve onun hâlâ nefes aldığını fark eder. Durumu ciddidir. Adamın gözleri aralanır, titreyen eliyle İbi'nin bileğini tutar ve gitmesine izin vermez.", ['Adamı sarsarak konuşturmaya çalış', 'Yarasına müdahale etmeye çalış', 'Adamın elini çekmeye çalış'], 'h1-7', 'h1-p7'),
  'h1-7': node('h1-7', 7, 'Lanetli Nöbet', "İbi ne yaparsa yapsın adamın tutuşundan kurtulamaz. Adam son nefesiyle zayıf bir sesle ‘Buraya kadarmış... Ama artık nöbet sende,’ diye fısıldar ve gözleri tamamen kapanır. O anda İbi'nin bileğinde, adamın dokunduğu yerde siyah bir leke belirmeye başlar. Leke hafifçe sızlamaktadır.", ['Lekeyi ovarak temizlemeye çalış', 'Adamın üstünü arayıp ipucu bul', 'Panikle yardım çığlığı at'], 'h1-8', 'h1-p8'),
  'h1-8': node('h1-8', 8, 'Kırmızı Gözler', "Bir anda çalılıkların arasından gelen hırıltı sesleri İbi’nin dikkatini çeker. Karanlığın içinden iki kırmızı göz doğrudan ona kilitlenir. Kaçacak bir yer yoktur; yaratık yaralı adamın kokusuna gelmiştir ve şimdi hedef İbi'dir.", ['Kalın dalı eline al', 'Siyah lekenin gücüyle yaratığa odaklan', 'Yaratığa bağırarak onu korkutmayı dene'], 'h1-9', 'h1-p9'),
  'h1-9': node('h1-9', 9, 'Son Hamle', "Yaratık karanlıktan fırlayıp İbi'nin üzerine doğru atılır. Bileğindeki sızlayan leke, tehlike anında vücuduna garip bir sıcaklık ve cesaret pompalamaya başlar. İbi artık sıradan bir insan gibi hissetmemektedir. Son bir hamleyle bu lanetle yüzleşmek zorundadır.", ['Dalı vahşi hayvana doğru savur', 'İçindeki tuhaf enerjiyi serbest bırak', 'Kendini adamın üstüne siper et'], 'h1-10', 'h1-p10'),
  'h1-10': node('h1-10', 10, 'Karanlık Gölge', "Karanlık gölge İbi'nin üzerine çökerken bileğindeki siyah leke tüm vücuduna yayılır. Gözlerini acıyla kapatıp yere yığılır. Bilinci kapanmadan hemen önce son bir hamle yapar.", ['Son gücünle gölgeye yumruk at', 'Gözlerini kapatıp kadere teslim ol', 'Tılsımlı lekeyi yaratığa doğru uzat'], 'h1-end-a', 'unused'),
  'h1-end-a': ending('h1-end-a', 'Ormanın Yeni Koruyucusu', 'Attığın yumrukla yaratık toza dönüşür. Ancak bileğindeki leke tüm vücudunu kaplar. Acı dindiğinde ayağa kalkarsın; artık bu ormanın ebedi ve güçlü koruyucusu sensindir.'),
  'h1-end-b': ending('h1-end-b', 'Lanetli Nöbetçi', 'Karanlık seni tamamen sarar. Kendine geldiğinde hareket edemediğini fark edersin. Artık yerde yatan, bir sonraki yolcuyu bekleyecek olan yeni yaralı adam sensindir.'),
  'h1-end-c': ending('h1-end-c', 'Dostluk', 'Leke parlar ve yaratık sakinleşip önünde diz çöker. Ormanın lanetini kontrol altına almayı başarmışsındır. Artık yanında sadık bir canavarla ormanın yeni efendisisin.'),

  'h2-6': node('h2-6', 6, 'Gizli Kapı', 'İbi eski kapıyı açtığında aşağıya doğru inen, nemli ve karanlık taş merdivenleri görür. Yukarıda kalmak artık bir seçenek değildir çünkü yukarıdaki orman kapısı arkasından büyük bir gürültüyle kilitlenir. Tek yol aşağıya inmektir.', ['Duvarlara tutunarak yavaşça aşağı in', 'Merdivenlerden koşarak in', 'Telefon ışığıyla basamakları inceleyerek in'], 'h2-7', 'h2-p7'),
  'h2-7': node('h2-7', 7, 'Taş Labirent', 'Aşağıya indiğinde soğuk hava yüzüne çarpar. Burası devasa, taştan bir labirentin girişidir. Duvarlardan fısıltıya benzer rüzgâr sesleri gelmektedir. Yerde, daha önce buraya girmiş olanların bıraktığı meşaleler durmaktadır.', ['Meşalelerden birini yakıp koridorda ilerle', 'Karanlığa alışarak sessizce ilerle', 'Duvarlardaki fısıltıların ritmini takip et'], 'h2-8', 'h2-p8'),
  'h2-8': node('h2-8', 8, 'İki Kapı', 'Yolun sonunda karşısına biri dar ve basık, diğeri ise yüksek tavanlı ama sonu görünmeyen iki büyük kapı çıkar. İki kapının ortasında ise duvara monte edilmiş paslı bir kol durmaktadır.', ['Dar ve basık kapıdan gir', 'Geniş ve yüksek kapıdan gir', 'Ortadaki paslı kolu çek'], 'h2-9', 'h2-p9'),
  'h2-9': node('h2-9', 9, 'Daralan Oda', 'Atılan adımdan sonra arkadaki tüm geçitler büyük bir gürültüyle kapanır. Duvarlar yavaşça hareket etmeye başlar. Burası çıkışı olmayan devasa bir taş odadır ve duvarlar gitgide daralmaktadır. İbi son bir can havliyle kurtulmaya çalışır.', ['Sembolleri mantığınla çözmeye çalış', 'Sembollere rastgele dokun', 'Duvarların arasına bir taş sıkıştır'], 'h2-10', 'h2-p10'),
  'h2-10': node('h2-10', 10, 'Son Bir Saniye', "Taş duvarlar milim milim yaklaşarak İbi'yi tamamen köşeye sıkıştırır. Son bir saniye kalmıştır.", ['Duvarları iki elinle iterek durdurmaya çalış', 'Yere çöküp başını ellerinin arasına al', 'Son parlayan sembole vur'], 'h2-end-a', 'unused'),
  'h2-end-a': ending('h2-end-a', 'Sonsuz Tutsak', 'Gücün yetmez. Duvarlar tamamen birleşir ve tavan üstüne kilitlenir. Bu antik zindanda sonsuz bir karanlığa gömülürsün.'),
  'h2-end-b': ending('h2-end-b', 'Kadim Taht', 'Duvarlar tam birleşecekken zemin çöker ve taştan bir taht odasına düşersin. Labirent seni yeni hükümdarı olarak kabul etmiştir.'),
  'h2-end-c': ending('h2-end-c', 'Bedelli Kaçış', 'Büyük bir patlama olur ve gözlerini açtığında kendini tekrar ormanın yüzeyinde bulursun. Kurtulmuşsundur ama dünyada yüz yıl geçmiş, her şey değişmiştir.'),

  'h3-6': node('h3-6', 6, 'Parlayan Taş', 'İbi parlayan taşı eline aldığı an, taş avucuna adeta yapışır. Taşın yaydığı mor ışık tüm ormanı kaplar. Ağaçlar eriyormuş gibi görünür, zaman yavaşlar ve gökyüzü mor bir girdaba dönüşür. Taşı bırakmak artık imkânsızdır.', ['Taşı iki eliyle sıkıca kavra', 'Taşı taşa vurarak kırmaya çalış', 'Gözlerini kapatıp enerjinin geçmesini bekle'], 'h3-7', 'h3-p7'),
  'h3-7': node('h3-7', 7, 'Kozmik Fısıltılar', "Taştan yayılan titreşimler İbi'nin zihnine ulaşır. Beyninin içinde hiç bilmediği dillerde fısıltılar ve evrenin yaradılışına dair kozmik görüntüler belirmeye başlar. Zihni bu bilgi yükünü taşımakta zorlanmaktadır.", ['Görüntülere odaklanıp her şeyi anlamaya çalış', 'Zihnini kapatıp fısıltılara diren', 'Çığlık atarak enerjiyi dışarı yönlendir'], 'h3-8', 'h3-p8'),
  'h3-8': node('h3-8', 8, 'Işıktan Yansıma', "Işığın içinden İbi'nin tamamen ışıktan yapılmış kusursuz bir kopyası çıkar. Bu kopya ona doğru elini uzatır. ‘Eğer bana katılırsan, zamanın ve mekânın ötesine geçebiliriz,’ der.", ['Yansımanın elini tut', 'Yansımaya saldırıp onu yok etmeye çalış', 'Yansımadan geriye doğru uzaklaş'], 'h3-9', 'h3-p9'),
  'h3-9': node('h3-9', 9, 'Kristalleşme', 'Kozmik enerji zirve noktasına ulaşır. Taşın ışığı İbi’nin damarlarında parlamaya başlar. Artık fiziksel bedeni yavaş yavaş şeffaflaşmakta, parmak uçlarından başlayarak kristalleşmektedir. Gerçek dünya ile bu boyut arasında sıkışmıştır.', ['Işık bedenini kabul edip dönüşümü tamamla', 'Fiziksel bedenine tutunmaya çalış', 'Taştaki tüm enerjiyi tek noktada patlat'], 'h3-10', 'h3-p10'),
  'h3-10': node('h3-10', 10, 'Mor Işık', 'Göz alıcı mor ışık tüm ekranı kaplar. İbi artık bedenini hissetmiyordur; tamamen ışık ve taştan ibaret bir kütleye dönüşmek üzeredir. Son bilinciyle bir hamle yapar.', ['Enerjiyi içine çekip son kez çığlık at', 'Yere uzanıp gözlerini son kez kapat', 'Taşı göğsüne bastırıp diren'], 'h3-end-a', 'unused'),
  'h3-end-a': ending('h3-end-a', 'Kozmik Gezgin', 'Enerji bedenini eritir. Artık fiziksel bir bedenin yoktur; zaman ve mekânda serbestçe dolaşabilen kozmik bir varlığa dönüşürsün.'),
  'h3-end-b': ending('h3-end-b', 'Taşın Yeni Gücü', 'Işık söner ve derin bir sessizlik çöker. Bedeninin yerinde artık sadece yerde parıldayan mor kristal taş kalmıştır. Bir sonraki kurbanını beklemektedir.'),
  'h3-end-c': ending('h3-end-c', 'İnsanlığı Kurtarmak', 'Büyük bir patlama olur. Taş parçalanır. Kendini tekrar normal ormanda bulursun; insan kalmayı başarmışsındır ama artık sol gözün mor bir kristal gibi parlamaktadır.'),
};

// Onuncu paragrafın seçenekleri üç ayrı finale gider.
for (const branch of ['h1', 'h2', 'h3']) {
  nodes[`${branch}-10`].choices.forEach((choice, index) => {
    choice.nextNodeId = `${branch}-end-${letters[index]}`;
    choice.transitionImageKey = `${branch}-end-${letters[index]}.png`;
  });
}

export const forestStory: Story = {
  id: 'ormanda-kaybolus',
  title: 'Ormanda Kayboluş',
  description: 'İbi’nin gizemli ormanda verdiği kararlar onu yaralı bir yabancıya, saklı bir kapıya ya da parlayan bir taşa götürüyor.',
  coverImage: 'cover.png',
  startNodeId: 'common-1',
  estimatedMinutes: 18,
  ageRange: '8–12',
  category: 'Gizem',
  isNew: true,
  visualBible: {
    artStyle: "High-quality 3D animated children's adventure illustration",
    aspectRatio: '9:16',
    characterDescription: 'İbi, pembe saçlı ve yeşil tokalı küçük kız',
    characterClothing: 'Mavi elbise, sarı sırt çantası, beyaz çorap ve mavi ayakkabı',
    colorPalette: 'Koyu orman yeşilleri, sıcak gün batımı ve büyülü mor ışıklar',
    lightingStyle: 'Soft cinematic lighting',
    negativePrompt: 'text, watermark, logo, gore',
  },
  nodes,
};
