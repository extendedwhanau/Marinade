/**
 * Marinade — issue content & assets
 * ---------------------------------
 * Issue 01 (Writing) cover letters are not pasted here: they live as plain SVG
 * files in svg/issue-01/ (letter-m.svg … letter-e.svg). letter-a.svg is reused
 * for both “A” glyphs. Change fill inside those files to retint the cover.
 *
 * When you add Issue 04: duplicate a tab + pane in index.html (copy the closest
 * interaction pattern), then add a new entry here and wire data-w-tab / classes.
 *
 * `tabKey` must match data-w-tab on the tab link and tab pane in index.html.
 */
window.MARINADE_ISSUES = {
  writing: {
    tabKey: "Writing",
    contributors:
      "Daniel Michael Satele, Pandora Fulimalo Pereira, Ioana Gordon-Smith, Lagi-Maama Academy & Consultancy, Lana Lopesi, Leone Samu Tui, Luisa Keteiyau Tora, Natasha Matila-Smith, Ngahuia Harrison, Sean Mallon, Stephanie Oberg, Peter Brunt, Raymond Sagapolutele, Talei Tuʻinukuafe, Teresia Teaiwa",
    buyUrl:
      "https://shop.moanafresh.com/products/marinade-aotearoa-journal-of-moana-art",
  },
  international: {
    tabKey: "International",
    contributors:
      "Ahilapalapa Rands, Andrea Low, Christina Pataialii, Cora-Allan, Ioana Gordon-Smith, Janet Lilo, Jim Vivieaere, Kalisolaite ‘Uhila, Lana Lopesi, Leafā Wilson/Olga Krause, Léuli Eshrāghi, Misal Adnan Yildiz, Natasha Matila-Smith, Tuāfale Tanoaʻi",
    buyUrl:
      "https://shop.moanafresh.com/collections/books-1/products/book-marinade-aotearoa-journal-of-moana-art-issue-02",
    stutterImage: "images/img_1.svg",
  },
  friendship: {
    tabKey: "Friendship",
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
};
