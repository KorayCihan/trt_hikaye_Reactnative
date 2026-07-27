import type { Story, StoryChoice, StoryNode } from '@/types/story';

const c = (id: string, text: string, nextNodeId: string, transitionImageKey: string): StoryChoice => ({ id, text, nextNodeId, transitionImageKey });
const n = (id: string, paragraphNumber: number, title: string, text: string, backgroundImage: string, choices: StoryChoice[]): StoryNode => ({ id, paragraphNumber, title, text, backgroundImage, choices, isEnding: false });
const nodes: Record<string, StoryNode> = {};

nodes['ortak-1'] = n('ortak-1', 1, 'Eski Konaktaki Harita', 'Mert, mahalledeki eski ve terk edilmiş tarihi konağın bodrumunda araştırma yaparken eski bir İstanbul haritası bulur. Merakına yenik düşüp haritayı incelemeye başlar. Sokak lambalarının loş ışığı pencerelerden içeri süzülürken, konağın derinliklerinden ani bir tıkırtı yükselir.', 'start.png', [
  c('sese-dogru-ilerle', 'Sesin geldiği yöne doğru ilerle.', 'ortak-2', 'common-p2-a.png'),
  c('disari-cik', 'Haritayı çantana atıp hemen dışarı çık.', 'ortak-2', 'common-p2-b.png'),
  c('dolaba-saklan', 'Sessizce köşedeki eski dolabın arkasına saklan.', 'ortak-2', 'common-p2-c.png'),
]);
nodes['ortak-2'] = n('ortak-2', 2, 'Gizemli Kapak', 'Konağın zeminindeki eski ahşaplar gıcırdar. Mert fenerini doğrulttuğunda yerde, üzerinde garip kabartmalar olan eski bir ahşap kapağı fark eder. Bu kapak, mahallenin altından geçen tarihi tünellere açılıyor gibi görünmektedir. Giriş oldukça dar ve karanlıktır.', 'common-p2-b.png', [
  c('kapagi-ac', 'Kapağı açıp geçitten aşağı süzül.', 'ortak-3', 'common-p3-a.png'), c('tayfayi-cagir', 'Hayri, Kamil ve Akın’ı çağırmak için eve dön.', 'ortak-3', 'common-p3-b.png'), c('sembolleri-incele', 'Girişin üzerindeki sembolleri yakından incele.', 'ortak-3', 'common-p3-c.png'),
]);
nodes['ortak-3'] = n('ortak-3', 3, 'Dehlizin Şifresi', 'Aşağıdan gelen yankılı ve serin bir rüzgâr, havada uçuşan tozları savurur. Mert adımlarını dikkatle atarken dehlizin duvarlarındaki tarihi İstanbul kabartmalarını görür. Semboller sanki yüzyıllardır çözülmeyi bekleyen gizli bir şifreyi işaret etmektedir.', 'common-p3-a.png', [
  c('fotograf-cek', 'Duvarlardaki sembollerin fotoğrafını çek.', 'ortak-4', 'common-p4-a.png'), c('buton-ara', 'Sembollere dokunarak gizli bir buton ara.', 'ortak-4', 'common-p4-b.png'), c('sesleri-dinle', 'Feneri söndürüp gelen sesleri dinle.', 'ortak-4', 'common-p4-c.png'),
]);
nodes['ortak-4'] = n('ortak-4', 4, 'Taze Ayak İzleri', 'İlerledikçe dar tünel ikiye ayrılır. Mert yerdeki tozlu zemine baktığında yeni bırakılmış ayak izleri görür. Mahallede bu gizemli geçidi kendisinden başka birinin daha bildiğini fark etmek kalbini hızlandırır. Acaba bu izler kime aittir?', 'common-p4-a.png', [
  c('izleri-takip-et', 'Ayak izlerini takip et.', 'ortak-5', 'common-p5-a.png'), c('temiz-yol', 'İzlerin olmadığı temiz yoldan devam et.', 'ortak-5', 'common-p5-b.png'), c('bekle-gozle', 'Bir süre bekleyip etrafı gözle.', 'ortak-5', 'common-p5-c.png'),
]);
nodes['ortak-5'] = n('ortak-5', 5, 'Kritik Ayrım', 'Yolun sonunda geniş, kubbeli bir odaya ulaşır. Odanın ortasında üç dikkat çekici şey durmaktadır: eski armalı kilitli bir sandık, arkasından hafif bir ışık sızan tarihi bir tablo ve yerde parıldayan antik bir pirinç anahtar.', 'common-p5-a.png', [
  c('sandik', 'Ahşap sandığı açmaya çalış.', 'sandik-6', 'h1-p6.png'), c('tablo', 'Tabloyu yerinden oynat.', 'gecit-6', 'h2-p6.png'), c('anahtar', 'Antik anahtarı yerden al.', 'emanet-6', 'h3-p6.png'),
]);

const branch = (prefix: string, titles: string[], texts: string[], choices: string[][], imagePrefix: string, endingTitles: string[]) => {
  for (let i = 0; i < 5; i += 1) {
    const paragraph = i + 6; const id = `${prefix}-${paragraph}`;
    const next = i < 4 ? `${prefix}-${paragraph + 1}` : `${prefix}-son`;
    const backgroundImage = paragraph === 6 ? `${imagePrefix}-p6.png` : `${imagePrefix}-p${paragraph}-1.png`;
    nodes[id] = n(id, paragraph, titles[i], texts[i], backgroundImage, choices[i].map((text, index) => c(`${id}-${index + 1}`, text, i < 4 ? next : `${next}-${index + 1}`, `${imagePrefix}-${i < 4 ? `p${paragraph + 1}` : 'end'}-${index + 1}.png`)));
  }
  endingTitles.forEach((endingTitle, index) => { const id = `${prefix}-son-${index + 1}`; nodes[id] = { id, paragraphNumber: 11, title: endingTitle, endingTitle, text: `${titles[4]} macerasında verdiğin son kararla hikâyenin bu sonuna ulaştın.`, backgroundImage: `${imagePrefix}-end-${index + 1}.png`, choices: [], isEnding: true, endingKind: index === 0 ? 'curiosity' : index === 1 ? 'courage' : 'kindness' }; });
};

branch('sandik', ['Gizemli Sandık', 'Tünel Haritası', 'Tanıdık Ses', 'Eski Bekçi', 'Mahallenin Sırrı'], [
  'Mert sandığın üzerindeki tozları üfler ve kilidini zorlar. Sandık hafif bir gıcırtıyla aralandığında içinden eski bir günlüğün sayfaları dökülür. Sayfalarda mahallenin geçmişine ve kurucularına ait çok büyük bir sır yazmaktadır.',
  'Günlükte, mahallenin altında yüzyıllardır saklanan eski bir tünel ağının haritası yer almaktadır. Tam o sırada arkasından hızlı bir gölge geçer. Mert, bu karanlık dehlizde yalnız olmadığını kesin olarak anlar.',
  'Karanlığın içinden tanıdık bir ses yükselir: “Mert! Orada ne yapıyorsun?” Bu gelen Hayri’dir! Yanında Kamil ve Akın da vardır. Ancak onların arkasındaki tünelde de gizemli bir karaltı belirmektedir.',
  'Karaltının aslında mahallenin eski bekçisi olduğu ortaya çıkar. Bekçi, bu dehlizlerin güvenli olmadığını ve hemen yukarı çıkmaları gerektiğini söyler. Ancak ellerindeki fenerlerin pilleri tükenmek üzeredir.',
  'Tayfa, bekçinin yardımıyla ya da kendi cesaretleriyle dehlizden çıkmayı başarır. Günlükteki gizem çözülmüştür; mahalle artık onlar için çok daha heyecan verici bir yerdir. Son karar tayfanın kaderini belirleyecektir.',
], [
  ['Günlüğü hemen okumaya başla.', 'Günlüğü çantana koyup dehlizden çık.', 'Sandığın içindeki diğer gizli bölmeleri ara.'], ['Arkana dönüp feneri o yöne tut.', 'Günlüğü sıkıca tutup çıkışa doğru koş.', 'Gölgelerin arasından fısıldayarak seslen.'], ['Tayfayı uyar ve hemen saklanın.', 'Arkadaki karaltıya doğru feneri doğrult.', 'Hiç arkana bakmadan tayfayla birlikte koş.'], ['Bekçiyi takip ederek güvenli yoldan gidin.', 'Kendi bulduğunuz kestirmeden yukarı koşun.', 'Bekçiye bulduğunuz tarihi günlüğü gösterin.'], ['Günlüğü sakla ve sırrı tayfayla koru.', 'Günlükteki sırrı tüm mahalleye anlat.', 'Günlüğü kütüphaneye teslim et.'],
], 'h1', ['Sırrın Koruyucuları', 'Mahallenin Büyük Sırrı', 'Tarihe Emanet']);

branch('gecit', ['Gizli Geçit', 'Tarihi Sarnıç', 'Kayıp Pusula', 'Yükselen Sular', 'Pusulanın Rehberliği'], [
  'Mert tabloyu hafifçe yana kaydırdığında arkasındaki gizli mekanizma harekete geçer. Duvar büyük bir gürültüyle ikiye ayrılır. İçeriden hafif bir su şırıltısı ve taze toprak kokusu yayılmaktadır.',
  'Geçidin ucu, mahallenin altındaki tarihi bir su sarnıcına çıkmaktadır. Sarnıcın devasa sütunları arasında suyun yankısı duyulur. Mert, suyun üzerinde yüzen çok eski bir ahşap kayık fark eder.',
  'Sarnıcın derinliklerinde parıldayan bir şey Mert’in dikkatini çeker. Bunun mahallenin eski saatçisinin yıllar önce kaybettiği, üzerinde işlemeler olan pirinç bir pusula olduğunu görür. Pusulanın ibresi sürekli bir yönü işaret etmektedir.',
  'Aniden sarnıcın giriş kapısı büyük bir gürültüyle kapanır. Sular hafifçe yükselmeye başlar. Mert’in panik yapmadan bir çıkış yolu bulması gerekmektedir. Duvarlardaki çıkış işaretleri pusulanın gösterdiği yönle uyuşmaktadır.',
  'Mert, sarnıçtan başarıyla kurtulur ya da sarnıcın gizemli sularında yeni bir maceraya atılır. Tarihi pusula artık onun en büyük rehberidir. Son karar kaderini çizecektir.',
], [
  ['Yeni açılan geçide doğru adım at.', 'Mekanizmayı kapatıp eski odaya dön.', 'Diğer tayfaya seslenmek için telefonunu kontrol et.'], ['Kayığa binip suyun üzerinde ilerle.', 'Sarnıcın kenarındaki dar patikadan yürü.', 'Geri dönmek için geçidin kapısını incele.'], ['Pusulayı cebine koy.', 'Pusulaya dokunmadan üzerindeki yazıyı oku.', 'Pusulayı bırakıp sarnıçtan çıkış yolu ara.'], ['Pusulanın gösterdiği yöndeki tüneli takip et.', 'Sarnıcın üst kemerlerine tırmanmaya çalış.', 'Kapanan kapıyı tüm gücünle zorla.'], ['Pusulayı sakla ve yeni maceralarda kullan.', 'Pusulayı eski sahibine teslim et.', 'Pusulayı tayfayla paylaşıp ortak karar al.'],
], 'h2', ['Yeni Maceraların Pusulası', 'Saatçiye Dönüş', 'Tayfanın Ortak Rehberi']);

branch('emanet', ['Kayıp Emanet', 'Saat Kulesi', 'Çarkların Arasında', 'Ustanın Mesajı', 'Zamana Meydan Okumak'], [
  'Mert parıldayan antik anahtarı eline aldığında, üzerindeki işlemelerin mahalledeki eski saat kulesinin kapısındaki motiflerle birebir uyuştuğunu fark eder. Bu anahtar, yıllardır kilitli olan o gizemli kuleyi açabilir.',
  'Mert gece yarısı gizlice saat kulesinin kapısına ulaşır. Kule, ay ışığının altında her zamankinden daha görkemli durmaktadır. Anahtarı kapının paslı kilidine soktuğunda tam oturduğunu görür ve yavaşça çevirir.',
  'Kulenin içi devasa çarklar ve tıkırdayan saat mekanizmalarıyla doludur. Mert yukarı doğru çıkan dar ahşap merdivenleri tırmanırken, büyük çarkların arasında sıkışmış eski bir mektup rulosu görür.',
  'Mektupta kuleyi yapan eski ustanın mahalle halkına bıraktığı gizli bir mesaj yazılıdır: “Zamanı doğru okuyan, geleceği bulur.” Tam o sırada kule saati çalmaya başlar ve çarklar büyük bir gürültüyle hızla dönmeye başlar.',
  'Mert, saat kulesinin büyük gizemini çözer ya da kulenin tarih kokan çarkları arasında zamana meydan okur. Mahallenin tarihi artık onun ellerindedir. Son karar kaderini belirler.',
], [
  ['Saat kulesine doğru hemen yola çık.', 'Anahtarı cebine koyup sabaha kadar bekle.', 'Anahtarı fenerin ışığında daha detaylı incele.'], ['Kapıyı açıp içeri adım at.', 'Son anda vazgeçip anahtarı geri çek.', 'Kulenin etrafında şüpheli bir durum var mı diye bak.'], ['Mektubu sıkıştığı yerden dikkatlice çıkar.', 'Mektuba dokunmadan kulenin zirvesine tırman.', 'Merdivenlerden geri inip kuleyi terk et.'], ['Ana mekanizmadaki kolu çekip sistemi durdur.', 'Hemen merdivenlerden aşağı doğru koş.', 'Kulenin penceresinden dışarı bakıp tayfayı ara.'], ['Sistemi eski haline getirip kuleyi kilitle.', 'Tayfayı kuleye çağırıp bu gizemli yeri üs yapın.', 'Mektubu ve anahtarı mahalle muhtarına götür.'],
], 'h3', ['Kulenin Koruyucusu', 'Tayfanın Gizli Üssü', 'Mahallenin Tarihi Emaneti']);

export const dehlizinGizemiStory: Story = { id: 'dehlizin-gizemi', title: 'Gizemli Mahalle', description: 'Mert ve tayfa, eski konağın altındaki dehlizlerde mahallenin unutulmuş sırlarının peşine düşüyor.', coverImage: 'cover.png', startNodeId: 'ortak-1', estimatedMinutes: 14, ageRange: '7–11', category: 'Gizem', isNew: true, visualBible: { artStyle: 'Sıcak, sinematik, yüksek kaliteli 3D çocuk macerası', aspectRatio: '9:16', characterDescription: 'Mert ve mahalledeki arkadaşları; yüzleri tüm sahnelerde tutarlı', characterClothing: 'Mert kahverengi kazağı ve mavi pantolonuyla', colorPalette: 'Gece mavileri, sıcak fener ışıkları ve tarihi taş tonları', lightingStyle: 'Yumuşak sinematik gece ışığı', negativePrompt: 'text, watermark, logo, horror, blood, gore' }, nodes };
