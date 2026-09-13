import { createWriteStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { Readable } from "node:stream";

const OUT_DIR = path.join(process.cwd(), "public", "game-covers");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";

const GAMES = [
  { slug: "k-pop-stylist-idol-girls", title: "K-pop Stylist: Idol Girls", cover: "https://static.playhop.com/images/dddad_1881371_4b270/2fa56675b/2a0000019f52d807_e4fb874/4e37c5a05f88b0cf0cec_f04e5a/pjpg928x522" },
  { slug: "toca-life-habillez-vous-pour-les-filles", title: "Toca Life-habillez-vous pour les filles", cover: "https://static.playhop.com/images/1afa0_6300668_414e1/255ba97cc/2a0000019c57ce1a_1c8ab4b/1bbc08384b77a308dadd_00c953/pjpg928x522" },
  { slug: "pony-creator-jeu-dhabillage-pour-filles", title: "Pony Creator - jeu d'habillage pour filles", cover: "https://static.playhop.com/images/c2872_1881364_f7249/533a13dda/2a0000019e8a0d5c_11af28a/769c0dd0f0b1667ed9ae_b7137f/pjpg928x522" },
  { slug: "toca-world-a-house-with-a-roof-garden", title: "Toca World: A house with a roof garden", cover: "https://static.playhop.com/images/abbf2_15351989_13ea8/e48d8357b/2a0000019e504439_b7ce084/934c7d8c7755cd7b922b_eb2cc1/pjpg928x522" },
  { slug: "lol-surprise-dolls-unlock-all-100", title: "LOL Surprise Dolls: Unlock All 100!", cover: "https://static.playhop.com/opengraph/db60008e07e0986fd9e7387c0dbde67cfcc5fb378056b1186cda0e5ee5ec100b.png" },
  { slug: "blogger-dress-up", title: "Blogger Dress Up", cover: "https://static.playhop.com/opengraph/c17bbf1cca216f900e681add567d7b63dc25ac50ae26ff62604778e22e187f13.png" },
  { slug: "k-pop-star-dress-up", title: "K-Pop Star: Dress Up", cover: "https://static.playhop.com/images/9f2ec_17696815_1766d/7519f62db/2a0000019fe621d2_17b40c9/8780d2881bdf9271ccf2_9b0d14/pjpg928x522" },
  { slug: "habiller-les-filles-du-college", title: "Habiller les Filles du Collège", cover: "https://static.playhop.com/images/de236_1881364_2879a/e60a1287c/2a00000195138e9f_6866132/6789a4dc88b80d6a525d_4d274d/pjpg928x522" },
  { slug: "kpop-girls-dress-up-challenge", title: "Kpop Girls Dress Up Challenge", cover: "https://static.playhop.com/images/2897a_2977039_79cea/cb899000d/2a000001944f5c60_6c7e41a/375f6d6a358a749257e3_fcf6d8/pjpg928x522" },
  { slug: "toca-world-online", title: "Toca World Online", cover: "https://static.playhop.com/images/fa164_2977039_34130/5010f0600/2a0000019d00c9e0_cf66e95/0d85beab99aa5016a596_997c70/pjpg928x522" },
  { slug: "fashion-week-2025", title: "Fashion Week 2025", cover: "https://static.playhop.com/images/e361f_1881371_f98d4/410970bf5/2a0000019648b58f_25ba434/4b8f71c2b15a0513c97f_9b085e/pjpg928x522" },
  { slug: "ever-after-girls-dress-up", title: "Ever After Girls Dress Up", cover: "https://static.playhop.com/images/a8aec_1892995_ef2ae/67edde7e4/2a0000019540eb75_a022466/9012dcd8cf6bd2410433_2445da/pjpg928x522" },
  { slug: "asmr-makeup-and-makeover-studio", title: "ASMR Makeup & Makeover Studio", cover: "https://static.playhop.com/images/eb8b0_2977039_86a5e/5169951b5/2a00000193521e24_056569f/df49e8685754202f5a94_ccf691/pjpg928x522" },
  { slug: "wedding-stylist-dress-up-games", title: "Wedding Stylist Dress Up Games", cover: "https://static.playhop.com/images/36565_6238841_2e26c/c61579371/2a00000193f78f1b_b0fe4b8/b09c517fe764a87d6af4_3b1791/pjpg928x522" },
  { slug: "black-friday-mystery-sale", title: "Black Friday Mystery Sale", cover: "https://static.playhop.com/images/da3b8_1890793_64e16/0b49a3de0/2a00000193750ecb_3d26b8a/dbb1ea63fbdf8f69c620_58b9bb/pjpg928x522" },
  { slug: "girl-squad-habillage", title: "Girl Squad Habillage", cover: "https://static.playhop.com/images/a2591_2977039_4ed0a/e5254e7b6/2a0000018382a753_b90646b/76c41ce06b11a33762df_5d7fa9/pjpg928x522" },
  { slug: "fairy-sirenix-dress-up", title: "Fairy Sirenix Dress Up", cover: "https://static.playhop.com/images/80dc9_1881957_237f4/b95134eeb/2a00000195dbb8d0_bebff07/c72b3fc1ab1217b91e24_1b17c2/pjpg928x522" },
  { slug: "indian-bride-wedding-dress-up", title: "Indian Bride: Wedding Dress Up", cover: "https://static.playhop.com/images/d0601_3006389_6f5ef/bac141d5a/2a00000196679ac7_957b6fa/76707a317e903f6ccb65_b48881/pjpg928x522" },
  { slug: "date-night-grwm", title: "Date Night #GRWM", cover: "https://static.playhop.com/images/a38c2_1881371_cd774/396b6cd72/2a00000197609234_9970966/3483de6590f7f1e1a67f_12e6fd/pjpg928x522" },
  { slug: "fairy-girls-dress-up", title: "Fairy Girls Dress Up", cover: "https://static.playhop.com/images/18c13_12797757_98f9f/4dc887b49/2a00000193727fc9_cfe8eec/d29a73a348ca48da736a_7ef27f/pjpg928x522" },
  { slug: "high-school-popular-girls", title: "High School Popular Girls", cover: "https://static.playhop.com/images/dda57_11385414_b38dd/3eceff1a9/2a0000019d8bd2d4_818b3cc/7f3aea2a66a2fc5024d6_b76d25/pjpg928x522" },
  { slug: "superstar-family-dress-up-game", title: "Superstar Family Dress Up Game", cover: "https://static.playhop.com/images/63139_6238841_0c9fe/7ddb8b9fb/2a0000019584808a_5f7e778/7ccab66d99b3c0e5a35b_1fcc3e/pjpg928x522" },
  { slug: "dress-up-3d", title: "Dress Up 3D", cover: "https://static.playhop.com/images/0a0e7_10152950_7851b/a4be432d1/2a0000019f62f079_10ec8f6/429bc7b63dfad1e1518b_98eda9/pjpg928x522" },
  { slug: "creer-personnage-filles", title: "Créer Personnage: Filles", cover: "https://static.playhop.com/images/5d3d4_1892995_6398e/1e82da85c/2a00000184c2d27d_8e531a8/16f6c6af40942888895d_d86698/pjpg928x522" },
  { slug: "back-to-school-uniforms-edition", title: "Back To School: Uniforms Edition", cover: "https://static.playhop.com/images/fcb35_11385414_f0bad/3040bdf5b/2a0000019441429b_a669601/e9f0b334139bdaafc999_23885a/pjpg928x522" },
  { slug: "superstar-makeover-games", title: "Superstar Makeover Games", cover: "https://static.playhop.com/images/37a85_1892995_fdc7c/fd965b665/2a0000018069b57e_7301736/9720959777e37600aa95_09f09e/pjpg928x522" },
  { slug: "princess-city-dress-up-and-home-design", title: "Princess City: Dress Up & Home Design", cover: "https://static.playhop.com/images/e9291_6238841_689d8/9def9cf67/2a0000019ea318df_a995694/567fc606ae6850a5bce8_dd8c1d/pjpg928x522" },
  { slug: "avatar-world-salon-de-beaute", title: "Avatar World Salon de beauté", cover: "https://static.playhop.com/images/c1eab_1892995_87bc9/bd531b427/2a0000019c326c99_3afd9a4/b4c721e0c9bf7b2821a6_bd8515/pjpg928x522" },
  { slug: "lady-bug-salon-de-manucure", title: "Lady Bug : Salon de manucure", cover: "https://static.playhop.com/images/c519b_17955142_ef225/98a9bd6d9/2a0000019c99dc57_d64373c/8f85604e5b8fbcaf649c_2b01a2/pjpg928x522" },
  { slug: "salon-de-coiffure-ladybug", title: "Salon de Coiffure Ladybug", cover: "https://static.playhop.com/images/beca8_1881371_e5d2b/937b80255/2a0000019f8e44f2_df3cca7/dfe7a676397d83655fac_2322d0/pjpg928x522" },
  { slug: "sort-and-style-back-to-school", title: "Sort And Style: Back To School", cover: "https://static.playhop.com/images/70604_13012056_ca745/4b5ef467a/2a000001993dbcff_3464228/f6bc96c78dfddbe023a4_8d471e/pjpg928x522" },
  { slug: "pony-girls-dress-up", title: "Pony Girls Dress Up", cover: "https://static.playhop.com/images/a4bf3_2977039_b3b31/8a5d12cbf/2a000001928efa5f_4fbd00b/af2631dd998110484319_5383de/pjpg928x522" },
  { slug: "lolirocks-dress-up", title: "LoliRocks Dress Up", cover: "https://static.playhop.com/images/1419b_17782796_7d184/25b340aba/2a0000019e39ceb9_b51dd61/a9286587b85771508f72_f217a6/pjpg928x522" },
  { slug: "paper-doll-diary-dress-up-diy", title: "Paper Doll Diary: Dress Up DIY", cover: "https://static.playhop.com/images/cc0de_10152950_875b4/6f89eba7c/2a000001926bf967_233ac4e/b285100869f8cbbfcc8d_6df1fe/pjpg928x522" },
  { slug: "couple-dress-up-fashion-levels", title: "Couple Dress Up－Fashion Levels", cover: "https://static.playhop.com/images/7b9a2_3006389_73934/ca8aafe7d/2a0000019647dd8c_267e20f/2b0fc9af7b483f39a418_04f29c/pjpg928x522" },
  { slug: "habillage-de-bff-filles", title: "Habillage de BFF Filles", cover: "https://static.playhop.com/images/533e4_1881371_629d6/8ac702f46/2a000001835f119c_67ae8ce/5988d4124a176a278cea_c807ff/pjpg928x522" },
  { slug: "le-telephone-de-chat-noir", title: "Le téléphone de Chat Noir", cover: "https://static.playhop.com/images/4eb41_1890793_f1e88/8fb6d031c/2a00000192bbae39_cbdd007/cf43fbada4b5c513aff4_dc3373/pjpg928x522" },
  { slug: "idol-livestream-doll-dress-up", title: "Idol Livestream: Doll Dress Up", cover: "https://static.playhop.com/images/6453f_6300668_d6dd5/a6c24cc51/2a00000196d33c27_5b8963a/527ac6ae060db074def2_954c01/pjpg928x522" },
  { slug: "lycee-habiller-jeux-de-filles", title: "Lycée Habiller: Jeux de Filles", cover: "https://static.playhop.com/images/200c6_1881371_1177f/c1ac9273c/2a000001888a8b2a_ed650e4/3085cb1a4330469559e4_24e6c4/pjpg928x522" },
  { slug: "bff-dress-up-girls", title: "BFF Dress Up Girls", cover: "https://static.playhop.com/images/59e45_6300668_ee6b2/936c3d88c/2a0000019668198c_9a3562e/478f036ee9541968b833_794fad/pjpg928x522" },
  { slug: "glam-makeover-studio", title: "Glam Makeover Studio", cover: "https://static.playhop.com/images/69384_3006389_4260e/5db6ffd30/2a0000019ebaeace_b2a848c/98a20788e6d8f7fa098e_60930a/pjpg928x522" },
  { slug: "pony-dress-up", title: "Pony Dress Up", cover: "https://static.playhop.com/images/58c40_1881364_09888/b733e2cab/2a00000193f1f908_121044a/0b8d064d8809045deb2e_fdfa87/pjpg928x522" },
  { slug: "mon-bebe-jeux-de-habillage-et-de-soins-pour-bebe", title: "Mon Bébé : Jeux de Habillage et de Soins pour Bébé", cover: "https://static.playhop.com/images/99a1d_13012056_9ba80/b5cdd396a/2a000001a01e702d_11e8b66/1ab6a08709c2d02cc849_2b676d/pjpg928x522" },
  { slug: "monster-dolls-dress-up", title: "Monster Dolls Dress Up", cover: "https://static.playhop.com/images/6682e_12797757_aed62/aac1a27d2/2a00000195c6ade9_3f6fb3e/a133685edddc802d13f0_03665a/pjpg928x522" },
  { slug: "valentines-day-proposal", title: "Valentine's Day Proposal", cover: "https://static.playhop.com/images/8434c_1892995_97444/61498c6b0/2a0000019504a588_edd467a/d272f877868d97c3338e_be15cc/pjpg928x522" },
  { slug: "habillage-de-filles-et-garcons", title: "Habillage de Filles et Garçons", cover: "https://static.playhop.com/images/30c93_1892995_16472/485f44e1d/2a00000183552402_8e6d0e9/0c25e50252f33ebd4356_12443b/pjpg928x522" },
  { slug: "gacha-club", title: "Gacha Club", cover: "https://static.playhop.com/images/42358_11374519_64a14/d7a3e31da/2a0000018cead891_f89fecd/422f4f33439fddd0754f_2031d7/pjpg928x522" },
  { slug: "toca-life-all-items-unlocked", title: "Toca Life: All Items Unlocked", cover: "https://static.playhop.com/images/a8d8d_1881371_feee9/b3517d975/2a0000019147310c_697f2f2/00f25f4ac260bf2c967f_8ff1f9/pjpg928x522" },
  { slug: "toca-life-salon-de-beaute", title: "Toca Life - Salon de Beauté", cover: "https://static.playhop.com/images/b1953_11385414_494be/b335221f7/2a0000019e81bd7c_d36f616/409903e75c8012e82ff8_15fb93/pjpg928x522" },
  { slug: "ellies-recipe-dubai-chocolate-bar", title: "Ellie's Recipe Dubai Chocolate Bar", cover: "https://static.playhop.com/images/4df28_1881364_70723/040d4a8c7/2a000001979858a8_081be8a/d2607d6d320258cb00ea_09216e/pjpg928x522" },
];

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "image/avif,image/webp,image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  if (res.body) {
    await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  } else {
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let ok = 0;
  for (const game of GAMES) {
    const dest = path.join(OUT_DIR, `${game.slug}.png`);
    try {
      await download(game.cover, dest);
      ok += 1;
      console.log(`OK  ${game.slug}`);
    } catch (err) {
      console.error(`FAIL ${game.slug}: ${err}`);
    }
  }
  console.log(`\nDone ${ok}/${GAMES.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
