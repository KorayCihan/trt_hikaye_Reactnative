import type { Story, StoryChoice, StoryNode } from '@/types/story';

const choice = (id: string, text: string, nextNodeId: string, transitionImageKey: string): StoryChoice => ({
  id, text, nextNodeId, transitionImageKey,
});

const node = (id: string, paragraphNumber: number, title: string, text: string, backgroundImage: string, choices: StoryChoice[]): StoryNode => ({
  id, paragraphNumber, title, text, backgroundImage, choices, isEnding: false,
});

const nodes: Record<string, StoryNode> = {};

nodes['ortak-1'] = node('ortak-1', 1, 'Gizemli Dijital İzler', 'Güneş, devasa metal kubbeleriyle parlayan Gök Kenti’nin üzerine doğarken Akıllı Tavşan Momo, en yeni buluşunu test etmek için yüksek teknoloji laboratuvarına doğru uçan kaykayıyla yola çıkmıştı. Tam atölyesinin kapısına varacakken yerde daha önce hiç görmediği tuhaf, dijital mavi kod parıltıları fark etti. Momo hemen durdu ve kulaklarını dikti. Koridorun derinliklerinden gelen gizemli bir biyonik bip sesi rüzgârla birlikte kulağına çalındı.', 'start.png', [
  choice('kodlari-incele', 'Uçan kaykaydan inip yerdeki dijital kodları incele.', 'ortak-2', 'p1-a.png'),
  choice('sesi-dinle', 'Kulaklarını dikip elektronik sesi dinle.', 'ortak-2', 'p1-b.png'),
  choice('konumu-kontrol-et', 'Kol saatindeki ana bilgisayar ekranını açıp konumunu kontrol et.', 'ortak-2', 'p1-c.png'),
]);

nodes['ortak-2'] = node('ortak-2', 2, 'İkiye Ayrılan Koridor', 'Momo adımlarını dikkatle atarak dijital izleri takip etmeye başladı. Koridor ilerledikçe akıllı duvar panelleri hafifçe yanıp sönüyor, sanki yapay zekâ ona bir şeyler fısıldıyordu. Birden koridor ikiye ayrıldı. Bir tarafta hologram ekranlarda parıldayan mavi veri çiçekleri, diğer tarafta ise havalandırma kovuğuna gizlenmiş eski bir enerji pili duruyordu.', 'p1-a.png', [
  choice('veri-cicekleri', 'Hologram veri çiçeklerinin yanına yaklaş.', 'ortak-3', 'p2-a.png'),
  choice('enerji-pili', 'Havalandırma kovuğundaki enerji pilini eline al.', 'ortak-3', 'p2-b.png'),
  choice('gokyuzu-ekrani', 'Kavşağın ortasında durup tavandaki gökyüzü ekranına bak.', 'ortak-3', 'p2-c.png'),
]);

nodes['ortak-3'] = node('ortak-3', 3, 'Gizli İpucu', 'Biraz daha ilerleyince yerdeki kod akışları aniden kesildi. Ancak tam o noktada, kontrol panelinin altında güvenlikle korunmuş küçük bir ipucu duruyordu. Momo eğilip baktığında bunun Gök Kenti’ndeki teknolojik dostlarından birine ait olabileceğini düşündü. Etraftaki sessizlik, yeni bir ipucunun habercisi gibiydi.', 'p2-a.png', [
  choice('konsolu-incele', 'Konsolun arasına iyice sokulup ipucunu incele.', 'ortak-4', 'p3-a.png'),
  choice('dijital-tozlar', 'Holografik büyüteciyle yerdeki dijital tozları tek tek kaldır.', 'ortak-4', 'p3-b.png'),
  choice('pille-aydinlat', 'Enerji pilini karanlık kontrol boşluğuna doğru tut.', 'ortak-4', 'p3-c.png'),
]);

nodes['ortak-4'] = node('ortak-4', 4, 'Eski Ana Terminal', 'Momo topladığı tüm dijital ipuçlarını kafasında birleştirmeye çalıştı. “Akıllı akıllı, teknolojik tavşan!” diyerek düşünme dansını yaptı. Tam o sırada üssün en eski ana bilgisayar terminaline ulaştı. Burası istasyonun en gizemli noktasıydı ve aradığı gizemin çözümü tam olarak burada gizliydi.', 'p3-a.png', [
  choice('spiral-kodlar', 'Terminalin ekranındaki spiral kod desenlerini incele.', 'ortak-5', 'p4-a.png'),
  choice('ana-kablolar', 'Terminalin altındaki ana kabloların arasına bak.', 'ortak-5', 'p4-b.png'),
  choice('derin-nefes', 'Sırtını terminal kasasına yaslayıp derin bir nefes al.', 'ortak-5', 'p4-c.png'),
]);

nodes['ortak-5'] = node('ortak-5', 5, 'Kritik Ayrım', 'Ana terminalin hemen arkasındaki gizli bölmede Momo’nun karşısına yan yana duran üç farklı şey çıktı. Hangisini seçerse Gök Kenti’nde bambaşka bir maceranın kapısını aralayacaktı. Momo kararını vermek zorundaydı.', 'p4-a.png', [
  choice('veri-karti', 'Yerde duran neon pembe renkli kayıp veri kartını takip et.', 'roni-6', 'p5-a.png'),
  choice('anahtar-karti', 'Panelin içine yarı gömülü duran dijital anahtar kartını al.', 'kasa-6', 'p5-b.png'),
  choice('uzay-haritasi', 'Terminalin üstünde asılı duran parıldayan uzay koordinat haritasını incele.', 'yildiz-6', 'p5-c.png'),
]);

type Branch = {
  prefix: string;
  titles: string[];
  texts: string[];
  choices: string[][];
  endingTitle: string;
  endingText: string;
  endingKind: NonNullable<StoryNode['endingKind']>;
};

const branches: Branch[] = [
  {
    prefix: 'roni', endingTitle: 'Dostluk Her Şeyden Parlak', endingKind: 'kindness',
    titles: ['Kayıp Veri Kartı', 'Robot Dost Roni', 'Momo İş Başında', 'Neon Işıklı Yol', 'Sıcak Laboratuvar'],
    texts: [
      'Momo yerdeki neon pembe veri kartını eline aldı. Bu kart, Gök Kenti’nin en neşeli robot tamircisi Roni’ye aitti. Karttan hafif bir melodi yayılıyordu. Momo, dostunun başının dertte olabileceğini düşünerek hızlı adımlarla kartın sinyal yönüne doğru yürümeye başladı.',
      'Koridorun arasından hafif bir arıza sinyali yükseldi. Momo, panellerin arasında Roni’yi büyük bir metal kutunun üzerine oturmuş, üzgün bir şekilde ekranına bakarken buldu. Roni en sevdiği şarkı verilerini içeren kartını kaybettiği için çok üzgündü ve sistem kilitlendiği için laboratuvarının yolunu şaşırmıştı.',
      'Momo, “Üzülme Roni, Akıllı Tavşan Momo iş başında!” diyerek dostuna gülümsedi. Hemen cebinden çıkardığı veri kartını Roni’ye uzattı. Roni’nin ekranı sevinçle parladı ve kartı göğsündeki yuvaya taktı. Ancak şimdi asıl görev, enerji kesilen üsten güvenli bir şekilde merkez üsse dönmekti.',
      'Momo, holografik büyüteciyle yerdeki taze motor yağı kokulu patikayı taramaya başladı. Bu yol, Roni’nin gün içinde yürüdüğü teknik koridordu. Momo liderliğinde iki dost el ele tutuşarak ritmik sesler eşliğinde neon ışıklı yoldan ilerlediler.',
      'Kısa süre sonra Roni’nin sıcak laboratuvarının ışıkları göründü. Roni, Momo’ya teşekkür etmek için ekranında kalp emojisi yaktı. Momo, dostuna yardım etmenin ve bir arızayı daha sevgiyle çözmenin verdiği mutlulukla kubbeden sızan yıldızların altında evine doğru yola koyuldu.',
    ],
    choices: [
      ['Veri kartını sisteme okut.', 'Kartın yanıp sönen ışığına tutup koridora bak.', 'Veri kartını dikkatlice çantana yerleştir.'],
      ['Roni’ye yavaşça yaklaş.', 'Panellerin arkasından el salla.', 'Etraftaki yanıp sönen arıza ışıklarını kontrol et.'],
      ['Kartı Roni’nin yuvasına takmasına yardım et.', 'Roni’ye metalik bir dostluk sarılması ver.', 'Elindeki lazer feneri yakıp yolu aydınlat.'],
      ['Büyüteçle yerdeki yağ izlerini tara.', 'Roni’nin metal elini sıkıca tut.', 'Üst kattaki dijital gökyüzü ekranlarını izle.'],
      ['Roni’nin laboratuvarının ışıklı pencerelerine bak.', 'Gökyüzündeki parlayan uzay istasyonlarını seyret.', 'Evine doğru neşeyle kayarak ilerle.'],
    ],
    endingText: 'Momo evine ulaştığında günün tüm yorgunluğu üzerinde tatlı bir uyku mahmurluğuna dönüşmüştü. Yumuşacık yatağına uzanırken dostu Roni’yi mutlu etmenin huzuru içini ısıtıyordu. Gözlerini yavaşça kapatırken Gök Kenti’ndeki dostluğun tüm teknolojiden daha parlak olduğunu bir kez daha anladı. Tatlı rüyalar Akıllı Tavşan Momo!',
  },
  {
    prefix: 'kasa', endingTitle: 'Gök Kenti’nin Tarihi Güvende', endingKind: 'curiosity',
    titles: ['Gizemli Dijital Anahtar', 'Merkez Kasa', 'Geçmişin Hazinesi', 'Barışın İlk Kuralları', 'Teknoloji Müzesi'],
    texts: [
      'Momo, konsoldaki dijital anahtar kartını dikkatlice çıkardı. Kartın üzerinde eski bir Gök Kenti sembolü parlıyordu. Bu sembol, istasyonun en eski katındaki “Ana Çekirdek”i işaret ediyordu. Momo kartı cebine koyup ana terminalin altındaki gizli asansör girişine doğru yöneldi.',
      'Asansörle aşağı indiğinde duvarları eski istasyon şemalarıyla süslenmiş geniş bir odaya ulaştı. Odanın tam ortasında, üzerinde kartındakine tıpatıp benzeyen bir sembol bulunan çelik bir kasa duruyordu. Uzun süredir kilitli olan kasanın üzerindeki güvenlik çemberi dönüyordu.',
      'Momo heyecanla anahtar kartı yuvaya yerleştirdi. “Bip” sesiyle birlikte kilit açıldı ve kasanın kapağı yavaşça yukarı kalktı. İçinden altınlar veya mücevherler çıkmadı; onun yerine çok eski zamanlardan kalma antika devre kartları ve Gök Kenti’nin ilk kuruluş kanunlarının yazılı olduğu dijital bir parşömen çıktı.',
      'Momo parşömendeki verileri holografik büyüteciyle okudu. Burada istasyondaki tüm robotların ve canlıların sonsuza kadar barış içinde yaşaması için yazılmış kurallar yer alıyordu. Ayrıca eski devreler de yeni sistemler için harika birer yedek parçaydı.',
      'Momo kasadaki tarihi parçaları ve parşömeni dikkatle çantasına yerleştirdi. Ertesi gün tüm kent sakinlerini toplayıp Gök Kenti’nin ilk teknoloji müzesini kuracaktı. Geçmişin bu harika sırrını gün yüzüne çıkarmanın gururuyla asansörden ana kata doğru tırmandı.',
    ],
    choices: [
      ['Kartın üzerindeki sembolü incele.', 'Asansörün karanlık girişine bak.', 'Kartı havaya kaldırıp dijital parıltısını izle.'],
      ['Duvarlardaki eski istasyon çizimlerini incele.', 'Kasanın üzerindeki dijital tozları sil.', 'Kasanın dijital paneline yakından bak.'],
      ['Kartı yuvada yavaşça kaydır.', 'Kasadan çıkan antika devreleri incele.', 'Dijital parşömene hayranlıkla dokun.'],
      ['Büyüteci parşömendeki yazılara tut.', 'Ekrandaki parlayan mührü incele.', 'Devreleri tek tek çantana yerleştir.'],
      ['Asansör çıkışındaki tavan ışığına bak.', 'Müze kuracağın alanı hayal et.', 'Çantanı sırtlayıp yukarı doğru yürü.'],
    ],
    endingText: 'Momo sıcacık yuvasına döndüğünde çantasındaki antika devreleri ve parşömeni baş ucundaki masaya özenle yerleştirdi. Yatağına girip örtüsünü üzerine çekerken yarın tüm kentle paylaşacağı müze projesinin heyecanıyla gülümsedi. Gök Kenti’nin tarihi artık güvendeydi. İyi uykular araştırmacı dedektif Momo!',
  },
  {
    prefix: 'yildiz', endingTitle: 'Gök Kenti’nin Parlak Rüyaları', endingKind: 'courage',
    titles: ['Parıldayan Uzay Haritası', 'Gözlem Kubbesi', 'Galaktik Hizalama', 'Yıldız Enerjisi', 'Işıl Işıl Gök Kenti'],
    texts: [
      'Momo terminaldeki parıldayan dijital projeksiyonu aldı. Bu sıradan bir harita değildi; üzerindeki çizgiler Gök Kenti’nin etrafındaki galaksileri ve takımyıldızlarını gösteriyordu. Haritaya dokunduğu anda ekrandan yayılan hafif bir mavi ışık odayı aydınlattı ve havada küçük dijital yıldız tozları uçuşmaya başladı.',
      'Haritanın üzerindeki parlayan bir ok işareti, istasyonun en yüksek noktası olan Gözlem Kubbesi’ni gösteriyordu. Momo gecenin karanlığına aldırmadan elindeki sihirli haritanın yaydığı ışığı takip ederek tepeye doğru kaykayıyla hareket etti. Geçtiği koridorlardaki paneller bile hafifçe parlıyordu.',
      'Zirveye ulaştığında dışarıdaki uzay rüzgârı hafif bir melodi gibi yankılanıyordu. Momo haritayı gerçek galaktik sistemle hizaladı. Tam o anda haritadaki boşluk ile uzaktaki en parlak bulutsu üst üste geldi ve kubbenin tam ortasında göz alıcı mavi bir enerji demeti belirdi.',
      'Işığın merkezinde, sadece bin yılda bir açtığı söylenen enerji kristali duruyordu. Kristal yavaşça parıltılarını açtı ve istasyonun tavanına doğru renkli ışık dalgaları saçtı. Bu dalgalar tüm Gök Kenti’nin üzerine bir şölen gibi yayılıp metal panelleri ve ekranları rengârenk yaptı.',
      'Momo bu büyüleyici manzarayı izlerken hayranlıkla gülümsedi. Gök Kenti artık geceleri de güvenli ve ışıl ışıldı. Akıllı Tavşan Momo, uzayın bu eşsiz mucizesini keşfetmiş olmanın sevinciyle parıldayan yoldan aşağıya, tatlı rüyalar görmek üzere evine doğru hareket etti.',
    ],
    choices: [
      ['Haritanın üzerindeki yıldız çizgilerini incele.', 'Havada uçuşan dijital tozlara dokun.', 'Haritayı dev cam kubbeye doğru kaldır.'],
      ['Patikadaki parlayan zemin ışıklarına bak.', 'Gözlem Kubbesi’nin zirvesini süz.', 'Haritanın gösterdiği parlayan oku takip et.'],
      ['Haritayı cam panele doğru tutup hizala.', 'Kubbenin ortasından fışkıran mavi ışığa bak.', 'Kaskını ve kulaklarını düzelt.'],
      ['Kristalin parıltısını izle.', 'Gökyüzüne yükselen dijital polenleri seyret.', 'Kenti aydınlatan renkli dalgalara bak.'],
      ['Işıldayan kente bakıp tebessüm et.', 'Parlayan patikadan aşağı doğru kay.', 'Gökyüzündeki kristal dalgalarının yayılışını izle.'],
    ],
    endingText: 'Momo yatağına uzandığında penceresinden dışarıya baktı. Kristalin enerjisiyle ışıl ışıl parıldayan Gök Kenti, adeta devasa bir galaksi masalı gibi göz kamaştırıyordu. Başını yumuşacık yastığına koyup gözlerini kapatırken sihirli haritası masanın üzerinde hafifçe parıldamaya devam ediyordu. Gök Kenti bu gece hiç olmadığı kadar parlak rüyalar görecekti. İyi uykular Akıllı Tavşan Momo!',
  },
];

branches.forEach((branch, branchIndex) => {
  const imagePrefix = `h${branchIndex + 1}`;
  for (let index = 0; index < 5; index += 1) {
    const paragraph = index + 6;
    const id = `${branch.prefix}-${paragraph}`;
    const nextNodeId = index < 4 ? `${branch.prefix}-${paragraph + 1}` : `${branch.prefix}-son`;
    nodes[id] = node(
      id,
      paragraph,
      branch.titles[index],
      branch.texts[index],
      index === 0 ? `p5-${String.fromCharCode(97 + branchIndex)}.png` : `${imagePrefix}-p${paragraph - 1}-a.png`,
      branch.choices[index].map((text, choiceIndex) => choice(
        `${id}-${choiceIndex + 1}`,
        text,
        nextNodeId,
        `${imagePrefix}-p${paragraph}-${String.fromCharCode(97 + choiceIndex)}.png`,
      )),
    );
  }

  const endingId = `${branch.prefix}-son`;
  nodes[endingId] = {
    id: endingId,
    paragraphNumber: 11,
    title: branch.endingTitle,
    endingTitle: branch.endingTitle,
    text: branch.endingText,
    backgroundImage: `${imagePrefix}-end.png`,
    choices: [],
    isEnding: true,
    endingKind: branch.endingKind,
  };
});

export const akilliTavsanMomoStory: Story = {
  id: 'akilli-tavsan-momo',
  title: 'Akıllı Tavşan Momo',
  description: 'Momo, Gök Kenti’nin dijital izlerini takip ederek dostluk, tarih ve yıldız enerjisiyle dolu üç maceradan birini keşfediyor.',
  coverImage: 'cover.png',
  startNodeId: 'ortak-1',
  estimatedMinutes: 13,
  ageRange: '6–10',
  category: 'Bilim Kurgu',
  isNew: true,
  visualBible: {
    artStyle: 'Yüksek kaliteli, sinematik 3D çocuk animasyonu',
    aspectRatio: '9:16',
    characterDescription: 'Akıllı Tavşan Momo; sevimli, meraklı, uzun kulaklı teknolojik tavşan',
    characterClothing: 'Fütüristik macera kıyafeti, sırt çantası, holografik kol saati ve uçan kaykay',
    colorPalette: 'Neon mavi, pembe ve mor vurgular; sıcak ve güvenli çocuk hikâyesi renkleri',
    lightingStyle: 'Yumuşak sinematik ışık, holografik parıltılar ve yıldız ışığı',
    negativePrompt: 'text, watermark, logo, horror, blood, gore, frightening imagery',
  },
  nodes,
};
