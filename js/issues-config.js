/**
 * Marinade — issue content & assets (single source of truth)
 * ----------------------------------------------------------
 * Edit here: titles, contributor list, buy link + label, shop URLs, images,
 * Issue 03 comparison URLs, Issue 04 cover SVG path + solid background colour.
 *
 * Issue 01 cover letters: svg/issue-01/letter-*.svg (change fill in those files).
 *
 * When you add Issue 05+: duplicate a tab + pane in index.html, add an entry below,
 * and wire any special behaviour in js/marinade-site.js if needed.
 *
 * `tabKey` must match data-w-tab on the tab link and tab pane in index.html.
 */
window.MARINADE_ISSUES = {
  writing: {
    tabKey: "Writing",
    title: "Writing",
    buyLabel: "Buy",
    contributors:
      "Daniel Michael Satele, Pandora Fulimalo Pereira, Ioana Gordon-Smith, Lagi-Maama Academy & Consultancy, Lana Lopesi, Leone Samu Tui, Luisa Keteiyau Tora, Natasha Matila-Smith, Ngahuia Harrison, Sean Mallon, Stephanie Oberg, Peter Brunt, Raymond Sagapolutele, Talei Tuʻinukuafe, Teresia Teaiwa",
    buyUrl:
      "https://shop.moanafresh.com/products/marinade-aotearoa-journal-of-moana-art",
  },
  international: {
    tabKey: "International",
    title: "International",
    buyLabel: "Buy",
    contributors:
      "Ahilapalapa Rands, Andrea Low, Christina Pataialii, Cora-Allan, Ioana Gordon-Smith, Janet Lilo, Jim Vivieaere, Kalisolaite ‘Uhila, Lana Lopesi, Leafā Wilson/Olga Krause, Léuli Eshrāghi, Misal Adnan Yildiz, Natasha Matila-Smith, Tuāfale Tanoaʻi",
    buyUrl:
      "https://shop.moanafresh.com/collections/books-1/products/book-marinade-aotearoa-journal-of-moana-art-issue-02",
    stutterImage: "images/img_1.svg",
  },
  friendship: {
    tabKey: "Friendship",
    title: "Friendship",
    buyLabel: "Buy",
    contributors:
      "Edith Amituanai, Ralph Brown, Peter Brunt, Kiri Chan, Feeonaa Clifton, Ioana Gordon-Smith, Jacki Leota-Mua, Lindah Lepou, Lana Lopesi, Andrea Low, Gloriana Meyers, Rosanna Raymond, Tuāfale Tanoaʻi, Seutaʻafili Patrick Thomsen, Luisa Keteiyau Tora, Manuhaʻapai Vaeatangitau, John Vea",
    buyUrl:
      "https://shop.moanafresh.com/products/marinade-aotearoa-journal-of-moana-art-issue-02-copy",
    comparison: {
      base:
        "https://d2w9rnfcy7mm78.cloudfront.net/29561535/original_648ee4d8f854400c4d362c481f55cdbc.png?1721703992?bc=0",
      overlay:
        "https://d2w9rnfcy7mm78.cloudfront.net/29561545/original_0039bf3c0725e7a38cccf229cd86693e.png?1721704029?bc=0",
    },
  },
  fourth: {
    tabKey: "Fourth",
    title: "Uncertainty",
    buyLabel: "Coming Soon",
    contributors:
      "Zoe Black, Peter Brunt, Ioana Gordon-Smith, Manumaleuga Grace Iwashita-Taylor, Emelihter Kihleng, Lana Lopesi, Andrea Low, Roman Lytollis, Emma Ng, Emily Parr, Israel Randell, Seuta‘afili Patrick Thomsen, Luisa Keteiyau Tora, Matariki Williams, Leafā Wilson/Olga Krause, Wheke Fortress",
    buyUrl: "https://shop.moanafresh.com/",
    /** Issue 04 hero artwork (slow spin + gentle zoom; path used by applyIssueCopy). */
    coverLetterSvg: "images/breadfruit.svg",
    /** Solid colour behind the Issue 04 artwork (all breakpoints). */
    coverBackground: "#615243",
  },
};
