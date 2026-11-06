const kneadToReadProducts = [
  // ==========================================
  // --- LIBRARY (BOOKS) - 20 RECORDS ---
  // ==========================================
  {
    name: "Pride and Prejudice",
    price: 12.00,
    description: "Jane Austen's classic tale of manners, misconceptions, and romance in regency England.",
    discountPrice: 10.00,
    countInStock: 15,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600",
        altText: "Pride and Prejudice book cover"
      }
    ],
    rating: 4.8,
    numReviews: 24,
    tags: ["romance", "regency", "classic", "austen"],
    metaTitle: "Buy Pride and Prejudice by Jane Austen | Knead to Read",
    metaDescription: "Immerse yourself in modern regency romance with Jane Austen's Pride and Prejudice. Available at Knead to Read.",
    metaKeywords: "books, jane austen, pride and prejudice, classic literature, romance"
  },
  {
    name: "Wuthering Heights",
    price: 13.00,
    description: "Emily Brontë's intense, stormy masterpiece of passion, vengeance, and the haunting Yorkshire moors.",
    discountPrice: 13.00,
    countInStock: 8,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600",
        altText: "Wuthering Heights book cover"
      }
    ],
    rating: 4.6,
    numReviews: 18,
    tags: ["gothic", "tragedy", "classic", "bronte"],
    metaTitle: "Wuthering Heights by Emily Brontë | Gothic Classics",
    metaDescription: "Explore the dark, haunting moors of Emily Brontë's Wuthering Heights. Shop classic books at Knead to Read.",
    metaKeywords: "wuthering heights, emily bronte, gothic novel, classic books"
  },
  {
    name: "Jane Eyre",
    price: 12.50,
    description: "Charlotte Brontë's empowering story of an orphaned governess navigating passion, morality, and secret truths.",
    discountPrice: 11.00,
    countInStock: 20,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600",
        altText: "Jane Eyre novel on a wooden desk"
      }
    ],
    rating: 4.9,
    numReviews: 35,
    tags: ["gothic", "romance", "classic", "bronte"],
    metaTitle: "Jane Eyre by Charlotte Brontë | Knead to Read",
    metaDescription: "Read Charlotte Brontë's unforgettable classic Jane Eyre. Fast delivery from Knead to Read.",
    metaKeywords: "jane eyre, charlotte bronte, classic romance, Victorian literature"
  },
  {
    name: "The Picture of Dorian Gray",
    price: 11.00,
    description: "Oscar Wilde's philosophical and chilling tale of aestheticism, youth, vanity, and secret moral decay.",
    discountPrice: 9.50,
    countInStock: 12,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=600",
        altText: "The Picture of Dorian Gray hardcover"
      }
    ],
    rating: 4.7,
    numReviews: 29,
    tags: ["gothic", "philosophical", "wilde", "classic"],
    metaTitle: "The Picture of Dorian Gray by Oscar Wilde | Knead to Read",
    metaDescription: "Explore Oscar Wilde's masterpiece of vanity and shadow, The Picture of Dorian Gray.",
    metaKeywords: "oscar wilde, dorian gray, gothic fiction, classic literature"
  },
  {
    name: "Great Expectations",
    price: 14.00,
    description: "Charles Dickens' gripping story of ambition, fortune, love, and redemption through the life of young Pip.",
    discountPrice: 14.00,
    countInStock: 18,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600",
        altText: "Stack of classic novels including Great Expectations"
      }
    ],
    rating: 4.5,
    numReviews: 21,
    tags: ["victorian", "dickens", "coming-of-age", "classic"],
    metaTitle: "Great Expectations by Charles Dickens | Knead to Read",
    metaDescription: "Follow Pip's journey in Charles Dickens' masterpiece Great Expectations. Order online today.",
    metaKeywords: "charles dickens, great expectations, Victorian classic, fiction"
  },
  {
    name: "Emma",
    price: 11.50,
    description: "Jane Austen's lighthearted and witty novel following the clever, well-meaning, but headstrong matchmaker Emma Woodhouse.",
    discountPrice: 10.00,
    countInStock: 25,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600",
        altText: "Open classic book with tea cup"
      }
    ],
    rating: 4.7,
    numReviews: 40,
    tags: ["romance", "austen", "comedy", "classic"],
    metaTitle: "Emma by Jane Austen | Knead to Read Library",
    metaDescription: "Delight in Jane Austen's beloved matchmaking comedy, Emma. Perfectly paired with your favorite tea.",
    metaKeywords: "emma, jane austen, romantic comedy, classic books"
  },
  {
    name: "The Odyssey",
    price: 15.00,
    description: "Homer's epic ancient Greek poem charting Odysseus' ten-year journey home after the Trojan War.",
    discountPrice: 13.50,
    countInStock: 10,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600",
        altText: "Ancient book open on wooden table"
      }
    ],
    rating: 4.8,
    numReviews: 19,
    tags: ["epic", "poetry", "homer", "mythology"],
    metaTitle: "The Odyssey by Homer | Epic Poetry at Knead to Read",
    metaDescription: "Experience Homer's foundational epic of adventure and resilience, The Odyssey.",
    metaKeywords: "homer, the odyssey, greek mythology, classic poetry, epics"
  },
  {
    name: "The Old Man and the Sea",
    price: 10.50,
    description: "Ernest Hemingway's powerful fable of an aging Cuban fisherman and his relentless battle with a giant marlin.",
    discountPrice: 10.50,
    countInStock: 22,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600",
        altText: "Vintage book lying flat"
      }
    ],
    rating: 4.6,
    numReviews: 33,
    tags: ["hemingway", "short-novel", "classic", "adventure"],
    metaTitle: "The Old Man and the Sea by Ernest Hemingway",
    metaDescription: "Hemingway's Pulitzer Prize-winning masterpiece about endurance, honor, and nature.",
    metaKeywords: "hemingway, old man and the sea, classic fiction, pulitzer"
  },
  {
    name: "Frankenstein",
    price: 12.00,
    description: "Mary Shelley's ground-breaking gothic sci-fi masterpiece exploring ambition, creation, and isolation.",
    discountPrice: 9.99,
    countInStock: 14,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600",
        altText: "Frankenstein dark edition cover"
      }
    ],
    rating: 4.9,
    numReviews: 50,
    tags: ["gothic", "sci-fi", "shelley", "classic"],
    metaTitle: "Frankenstein by Mary Shelley | Dark Gothic Classics",
    metaDescription: "Discover Mary Shelley's iconic Frankenstein. The original science-fiction gothic classic.",
    metaKeywords: "frankenstein, mary shelley, gothic sci-fi, horror classic"
  },
  {
    name: "Sense and Sensibility",
    price: 11.50,
    description: "The contrast between emotional passion and practical judgment played out through the lives of the Dashwood sisters.",
    discountPrice: 11.50,
    countInStock: 16,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=600",
        altText: "Cozy book with dried bookmark"
      }
    ],
    rating: 4.7,
    numReviews: 22,
    tags: ["romance", "austen", "regency", "classic"],
    metaTitle: "Sense and Sensibility by Jane Austen | Knead to Read",
    metaDescription: "Follow Elinor and Marianne Dashwood in Jane Austen's timeless exploration of heart versus reason.",
    metaKeywords: "sense and sensibility, jane austen, regency classic, romance"
  },
  {
    name: "Dracula",
    price: 13.00,
    description: "Bram Stoker's legendary epistolary vampire novel that established the modern dark fantasy genre.",
    discountPrice: 11.50,
    countInStock: 11,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509021436468-d51030095cbc?q=80&w=600",
        altText: "Dracula hardcover beside candle"
      }
    ],
    rating: 4.8,
    numReviews: 44,
    tags: ["gothic", "horror", "vampire", "classic"],
    metaTitle: "Dracula by Bram Stoker | Gothic Horror at Knead to Read",
    metaDescription: "Uncover the chilling tale of Count Dracula in Bram Stoker's classic epistolary gothic thriller.",
    metaKeywords: "dracula, bram stoker, gothic horror, vampire classic"
  },
  {
    name: "A Tale of Two Cities",
    price: 13.50,
    description: "Charles Dickens' dramatic historical epic set in London and Paris during the turbulent French Revolution.",
    discountPrice: 13.50,
    countInStock: 9,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=600",
        altText: "Vintage leather book binding"
      }
    ],
    rating: 4.6,
    numReviews: 17,
    tags: ["history", "dickens", "revolution", "classic"],
    metaTitle: "A Tale of Two Cities by Charles Dickens",
    metaDescription: "'It was the best of times, it was the worst of times.' Read Dickens' masterwork on sacrifice and revolution.",
    metaKeywords: "tale of two cities, charles dickens, historical fiction, classic"
  },
  {
    name: "Persuasion",
    price: 11.00,
    description: "Jane Austen's poignant story of second chances, mature love, and enduring devotion between Anne Elliot and Captain Wentworth.",
    discountPrice: 9.50,
    countInStock: 21,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600",
        altText: "Poetic softcover book with eyeglasses"
      }
    ],
    rating: 4.9,
    numReviews: 38,
    tags: ["romance", "austen", "second-chance", "classic"],
    metaTitle: "Persuasion by Jane Austen | Romantic Classics",
    metaDescription: "Experience Jane Austen's most soulful romance, Persuasion. Order your copy online now.",
    metaKeywords: "persuasion, jane austen, romantic classic, regency fiction"
  },
  {
    name: "The Importance of Being Earnest",
    price: 9.99,
    description: "Oscar Wilde's sparkling satirical play poking fun at Victorian social conventions and mistaken identities.",
    discountPrice: 8.50,
    countInStock: 30,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600",
        altText: "Play script and book on desk"
      }
    ],
    rating: 4.8,
    numReviews: 27,
    tags: ["play", "satire", "wilde", "comedy"],
    metaTitle: "The Importance of Being Earnest by Oscar Wilde",
    metaDescription: "Laugh along with Oscar Wilde's sharpest comedy, The Importance of Being Earnest.",
    metaKeywords: "oscar wilde, play, satire, victorian comedy, drama"
  },
  {
    name: "Little Women",
    price: 14.50,
    description: "Louisa May Alcott's heartwarming coming-of-age story following the lives, ambitions, and loves of the four March sisters.",
    discountPrice: 12.00,
    countInStock: 17,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600",
        altText: "Cozy stack of hardcover books"
      }
    ],
    rating: 4.9,
    numReviews: 62,
    tags: ["family", "coming-of-age", "alcott", "classic"],
    metaTitle: "Little Women by Louisa May Alcott | Knead to Read",
    metaDescription: "Revisit Meg, Jo, Beth, and Amy March in Louisa May Alcott's beloved family masterpiece Little Women.",
    metaKeywords: "little women, louisa may alcott, classic novels, coming of age"
  },
  {
    name: "The Secret Garden",
    price: 10.99,
    description: "Frances Hodgson Burnett's enchanting tale of healing, nature, and friendship inside a hidden walled garden.",
    discountPrice: 10.99,
    countInStock: 25,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600",
        altText: "Illustrated book cover surrounded by flowers"
      }
    ],
    rating: 4.8,
    numReviews: 31,
    tags: ["nature", "children-classic", "comfort", "healing"],
    metaTitle: "The Secret Garden | Knead to Read Comfort Books",
    metaDescription: "Step through the hidden door into The Secret Garden. A beautiful tale of growth and restoration.",
    metaKeywords: "secret garden, classic fiction, comforting reads, children classic"
  },
  {
    name: "Moby-Dick",
    price: 15.50,
    description: "Herman Melville's epic sea saga detailing Captain Ahab's obsessive pursuit of the white whale.",
    discountPrice: 13.99,
    countInStock: 7,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600",
        altText: "Vintage blue covered nautical novel"
      }
    ],
    rating: 4.4,
    numReviews: 15,
    tags: ["adventure", "melville", "nautical", "epic"],
    metaTitle: "Moby-Dick by Herman Melville | Knead to Read",
    metaDescription: "Set sail with Ishmael aboard the Pequod in Herman Melville's legendary Moby-Dick.",
    metaKeywords: "moby dick, herman melville, classic novel, sea story"
  },
  {
    name: "The Count of Monte Cristo",
    price: 16.99,
    description: "Alexandre Dumas' ultimate tale of betrayal, hidden treasure, calculated revenge, and ultimate justice.",
    discountPrice: 14.99,
    countInStock: 12,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600",
        altText: "Thick historical adventure book"
      }
    ],
    rating: 4.9,
    numReviews: 53,
    tags: ["revenge", "dumas", "adventure", "classic"],
    metaTitle: "The Count of Monte Cristo by Alexandre Dumas",
    metaDescription: "Experience Edmond Dantès' epic journey from prison to revenge in The Count of Monte Cristo.",
    metaKeywords: "monte cristo, alexandre dumas, adventure classics, revenge novel"
  },
  {
    name: "Northanger Abbey",
    price: 11.00,
    description: "Jane Austen's affectionate satire of gothic romance novels, starring the imaginative Catherine Morland.",
    discountPrice: 11.00,
    countInStock: 19,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600",
        altText: "Novel placed next to teapot"
      }
    ],
    rating: 4.6,
    numReviews: 20,
    tags: ["satire", "gothic", "austen", "romance"],
    metaTitle: "Northanger Abbey by Jane Austen | Knead to Read",
    metaDescription: "Enjoy Jane Austen's playful gothic satire Northanger Abbey. Available for quick shipping.",
    metaKeywords: "northanger abbey, jane austen, gothic satire, classic book"
  },
  {
    name: "Far from the Madding Crowd",
    price: 13.00,
    description: "Thomas Hardy's pastoral drama of passion, independence, and fate set in rural Victorian Wessex.",
    discountPrice: 11.50,
    countInStock: 10,
    category: "library",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600",
        altText: "Pastoral landscape book cover"
      }
    ],
    rating: 4.7,
    numReviews: 14,
    tags: ["pastoral", "hardy", "victorian", "romance"],
    metaTitle: "Far from the Madding Crowd by Thomas Hardy",
    metaDescription: "Read Bathsheba Everdene's story in Thomas Hardy's classic Far from the Madding Crowd.",
    metaKeywords: "thomas hardy, madding crowd, victorian classic, romance"
  },

  // ==========================================
  // --- OVEN (PASTRIES/BAKERY) - 20 RECORDS ---
  // ==========================================
  {
    name: "Classic Butter Croissant",
    price: 4.25,
    description: "Flaky, rich, and intensely laminated traditional pastry with layers that break apart perfectly.",
    discountPrice: 3.75,
    countInStock: 30,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600",
        altText: "Flaky golden croissant"
      }
    ],
    rating: 4.9,
    numReviews: 42,
    tags: ["pastry", "buttery", "bakery", "fresh"],
    metaTitle: "Fresh Butter Croissants Daily | Knead to Read Bakery",
    metaDescription: "Indulge in our classic, golden, intensely laminated butter croissants baked fresh every single morning.",
    metaKeywords: "croissant, bakery, fresh pastry, french pastry, breakfast"
  },
  {
    name: "Mixed Berry Tart",
    price: 5.50,
    description: "A buttery shortcrust base holding rich vanilla bean pastry cream, crowned with glossed ripe summer berries.",
    discountPrice: 5.50,
    countInStock: 15,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=600",
        altText: "Fresh fruit and berry tart"
      }
    ],
    rating: 4.7,
    numReviews: 15,
    tags: ["fruity", "tart", "sweet", "bakery"],
    metaTitle: "Artisanal Mixed Berry Tart | Sweet Treats",
    metaDescription: "Crisp shortcrust pastry filled with luxurious vanilla bean cream and topped with seasonal fresh berries.",
    metaKeywords: "fruit tart, berry pastry, dessert, fresh baking, sweet treats"
  },
  {
    name: "Artisan Sourdough Loaf",
    price: 8.00,
    description: "Naturally fermented over 36 hours with a crackly caramelized crust and an airy, chewy crumb.",
    discountPrice: 7.00,
    countInStock: 20,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1585478259715-876a6a81fc08?q=80&w=600",
        altText: "Crusty sourdough bread loaf scored on top"
      }
    ],
    rating: 5.0,
    numReviews: 58,
    tags: ["sourdough", "bread", "artisan", "savory"],
    metaTitle: "Fresh Fermented Sourdough Loaf | Knead to Read",
    metaDescription: "Hand-crafted 36-hour wild yeast sourdough bread baked on stone decks daily.",
    metaKeywords: "sourdough, artisan bread, bakery loaf, wild yeast, fresh bread"
  },
  {
    name: "Pain au Chocolat",
    price: 4.75,
    description: "Laminated golden pastry dough wrapped around two bars of rich, dark Belgian chocolate.",
    discountPrice: 4.25,
    countInStock: 25,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=600",
        altText: "Pain au chocolat pastry sprinkled with powdered sugar"
      }
    ],
    rating: 4.9,
    numReviews: 39,
    tags: ["chocolate", "pastry", "french", "sweet"],
    metaTitle: "Belgian Pain au Chocolat | Baked Fresh Daily",
    metaDescription: "Satisfy your chocolate cravings with warm, flaky french pain au chocolat filled with dark Belgian chocolate.",
    metaKeywords: "pain au chocolat, chocolate croissant, bakery, pastry"
  },
  {
    name: "Cinnamon Cardamom Bun",
    price: 4.50,
    description: "Swedish-style twisted brioche dough laced with fragrant ground cardamom and sweet dark cinnamon glaze.",
    discountPrice: 4.50,
    countInStock: 18,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600",
        altText: "Swedish cinnamon cardamom bun"
      }
    ],
    rating: 4.8,
    numReviews: 26,
    tags: ["cinnamon", "spice", "brioche", "sweet"],
    metaTitle: "Swedish Cinnamon Cardamom Buns | Fresh Baking",
    metaDescription: "Soft, fragrant cardamom and cinnamon buns baked to golden perfection.",
    metaKeywords: "cinnamon bun, cardamom twist, swedish bakery, sweet bread"
  },
  {
    name: "Blueberry Lemon Scone",
    price: 3.95,
    description: "Tender, crumbly butter scone packed with wild mountain blueberries and finished with a zesty lemon glaze.",
    discountPrice: 3.50,
    countInStock: 22,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=600",
        altText: "Blueberry scone with lemon glaze"
      }
    ],
    rating: 4.6,
    numReviews: 19,
    tags: ["scone", "blueberry", "lemon", "tea-time"],
    metaTitle: "Fresh Blueberry Lemon Scones | Knead to Read",
    metaDescription: "The perfect companion for your afternoon tea: buttery scones bursting with wild blueberries.",
    metaKeywords: "blueberry scone, tea pasties, lemon scone, bakery"
  },
  {
    name: "Almond Frangipane Tart",
    price: 5.75,
    description: "Sweet pastry shell filled with nutty almond cream frangipane, topped with toasted flaked almonds.",
    discountPrice: 5.75,
    countInStock: 12,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=600",
        altText: "Almond frangipane tart slice"
      }
    ],
    rating: 4.9,
    numReviews: 14,
    tags: ["almond", "tart", "nutty", "dessert"],
    metaTitle: "Almond Frangipane Tart | Artisanal Desserts",
    metaDescription: "Rich, nutty almond frangipane in a delicate crisp shortbread shell.",
    metaKeywords: "almond tart, frangipane, French pastry, dessert"
  },
  {
    name: "Rosemary Sea Salt Focaccia",
    price: 7.50,
    description: "Italian flatbread steeped in extra virgin olive oil, dimpled with fresh garden rosemary and flaky sea salt.",
    discountPrice: 6.50,
    countInStock: 15,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=600",
        altText: "Freshly baked rosemary focaccia slab"
      }
    ],
    rating: 4.8,
    numReviews: 33,
    tags: ["focaccia", "savory", "olive-oil", "bread"],
    metaTitle: "Rosemary & Sea Salt Focaccia | Fresh Bread",
    metaDescription: "Light, airy olive oil focaccia topped with aromatic sea salt and fresh rosemary sprigs.",
    metaKeywords: "focaccia, italian bread, olive oil bread, savory baking"
  },
  {
    name: "Pistachio Raspberry Danish",
    price: 5.25,
    description: "Flaky square pastry shell filled with vibrant raspberry compote and smooth Sicilian pistachio paste.",
    discountPrice: 5.25,
    countInStock: 14,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?q=80&w=600",
        altText: "Pistachio pastry topped with raspberries"
      }
    ],
    rating: 4.9,
    numReviews: 28,
    tags: ["danish", "pistachio", "raspberry", "gourmet"],
    metaTitle: "Pistachio Raspberry Danish Pastry",
    metaDescription: "An unforgettable flavor pair: rich Sicilian pistachio cream combined with tart wild raspberries.",
    metaKeywords: "danish pastry, pistachio raspberry, breakfast treat, bakery"
  },
  {
    name: "Dark Chocolate Chip Brioche Bun",
    price: 3.80,
    description: "Ultra-soft egg-rich brioche roll studded generously with 70% dark chocolate chunks.",
    discountPrice: 3.50,
    countInStock: 28,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600",
        altText: "Chocolate brioche roll close up"
      }
    ],
    rating: 4.7,
    numReviews: 21,
    tags: ["brioche", "chocolate", "soft-bread", "sweet"],
    metaTitle: "Dark Chocolate Chip Brioche Buns",
    metaDescription: "Pillow-soft brioche bread packed with melted dark chocolate chips.",
    metaKeywords: "brioche, chocolate bread, sweet rolls, fresh bakery"
  },
  {
    name: "Savory Cheese & Leek Turnover",
    price: 4.95,
    description: "Puff pastry pocket stuffed with caramelized slow-roasted leeks and sharp aged Gruyère cheese.",
    discountPrice: 4.95,
    countInStock: 16,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600",
        altText: "Golden puff pastry savory turnover"
      }
    ],
    rating: 4.8,
    numReviews: 17,
    tags: ["savory", "cheese", "puff-pastry", "lunch"],
    metaTitle: "Gruyère Cheese & Leek Turnover | Savory Baking",
    metaDescription: "Warm, buttery puff pastry holding aged Gruyère cheese and golden caramelized leeks.",
    metaKeywords: "cheese turnover, savory pastry, gruyere, leek turnover"
  },
  {
    name: "Salted Caramel Pecan Cookie",
    price: 3.25,
    description: "Chewy brown-butter cookie dough folded with toasted pecan halves and oozy salted caramel bits.",
    discountPrice: 2.99,
    countInStock: 40,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600",
        altText: "Large chocolate caramel pecan cookie"
      }
    ],
    rating: 4.9,
    numReviews: 65,
    tags: ["cookie", "caramel", "pecan", "sweet"],
    metaTitle: "Salted Caramel Pecan Brown Butter Cookies",
    metaDescription: "Our fan-favorite cookie: brown butter dough loaded with pecans and house-made salted caramel.",
    metaKeywords: "caramel cookie, pecan cookies, bakery cookie, sweet snack"
  },
  {
    name: "Apple Cinnamon Galette",
    price: 5.50,
    description: "Rustic open-faced pie crust layered with thinly sliced Honeycrisp apples, brown sugar, and warm spice.",
    discountPrice: 4.95,
    countInStock: 10,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=600",
        altText: "Rustic baked apple galette"
      }
    ],
    rating: 4.8,
    numReviews: 23,
    tags: ["apple", "galette", "pie", "autumn"],
    metaTitle: "Rustic Apple Cinnamon Galette | Knead to Read",
    metaDescription: "Hand-folded flaky pie crust topped with fresh apples and warm cinnamon brown sugar.",
    metaKeywords: "apple galette, apple pie, rustic pastry, fresh dessert"
  },
  {
    name: "Matcha White Chocolate Cookie",
    price: 3.50,
    description: "Vibrant Uji matcha green tea cookie dough balanced with sweet white chocolate chunks.",
    discountPrice: 3.50,
    countInStock: 25,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600",
        altText: "Green tea matcha cookie with white chocolate"
      }
    ],
    rating: 4.7,
    numReviews: 18,
    tags: ["matcha", "white-chocolate", "cookie", "tea"],
    metaTitle: "Uji Matcha White Chocolate Cookies",
    metaDescription: "Earth-toned Japanese matcha tea cookies studded with creamy white chocolate chunks.",
    metaKeywords: "matcha cookie, white chocolate, tea treats, cookies"
  },
  {
    name: "Classic Kouign-Amann",
    price: 5.00,
    description: "Breton pastry made with laminated dough layered with salted butter and sugar that caramelizes during baking.",
    discountPrice: 4.50,
    countInStock: 12,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600",
        altText: "Caramelized Kouign-Amann pastry"
      }
    ],
    rating: 5.0,
    numReviews: 31,
    tags: ["caramelized", "pastry", "french", "crispy"],
    metaTitle: "Traditional French Kouign-Amann | Bakery",
    metaDescription: "The ultimate caramelized butter pastry. Crunchy on the outside, soft and buttery inside.",
    metaKeywords: "kouign amann, french pastry, caramelized pastry, bakery"
  },
  {
    name: "Lemon Poppyseed Loaf Slice",
    price: 3.75,
    description: "Moist Meyer lemon sponge cake studded with crunchy poppyseeds and dripped with citrus royal icing.",
    discountPrice: 3.75,
    countInStock: 20,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=600",
        altText: "Lemon poppyseed cake slice with icing"
      }
    ],
    rating: 4.6,
    numReviews: 29,
    tags: ["lemon", "cake", "poppyseed", "slice"],
    metaTitle: "Meyer Lemon Poppyseed Pound Cake Slice",
    metaDescription: "Brighten your afternoon with a zesty, tender slice of lemon poppyseed pound cake.",
    metaKeywords: "lemon cake, poppyseed cake, bakery slice, lemon loaf"
  },
  {
    name: "Hazelnut Praline Eclair",
    price: 5.95,
    description: "Crisp choux pastry pipe filled with hazelnut praline creme patissiere and topped with dark chocolate ganache.",
    discountPrice: 5.95,
    countInStock: 8,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1612203985729-70726954388c?q=80&w=600",
        altText: "Chocolate hazelnut eclair with nuts"
      }
    ],
    rating: 4.9,
    numReviews: 12,
    tags: ["eclair", "hazelnut", "choux", "chocolate"],
    metaTitle: "Hazelnut Praline French Eclair | Desserts",
    metaDescription: "Traditional French choux pastry filled with roasted hazelnut cream and dark chocolate ganache.",
    metaKeywords: "eclair, hazelnut pastry, choux, french bakery"
  },
  {
    name: "Vanilla Bean Canelé",
    price: 3.50,
    description: "Traditional Bordeaux pastry with a dark, thick caramelized crust and a soft, custard-like rum vanilla center.",
    discountPrice: 3.00,
    countInStock: 15,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600",
        altText: "Golden brown French Canelé pastries"
      }
    ],
    rating: 4.8,
    numReviews: 22,
    tags: ["canele", "french", "custard", "caramel"],
    metaTitle: "Bordeaux Vanilla Bean Canelé | Knead to Read",
    metaDescription: "Crispy caramelized shell meets tender vanilla custard inside this authentic French Canelé.",
    metaKeywords: "canele, bordeaux pastry, french baking, vanilla dessert"
  },
  {
    name: "Earl Grey Tea Biscuits (Box of 6)",
    price: 6.50,
    description: "Crisp butter shortbread biscuits infused with fragrant Earl Grey bergamot tea leaves.",
    discountPrice: 6.50,
    countInStock: 18,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600",
        altText: "Shortbread tea biscuits in a box"
      }
    ],
    rating: 4.7,
    numReviews: 16,
    tags: ["shortbread", "earl-grey", "biscuits", "tea"],
    metaTitle: "Earl Grey Shortbread Biscuits | Knead to Read",
    metaDescription: "A delicate tea-time biscuit made with pure butter and real organic Earl Grey tea leaves.",
    metaKeywords: "earl grey biscuits, shortbread, tea cookies, bakery"
  },
  {
    name: "Triple Chocolate Brownie",
    price: 4.25,
    description: "Dense, fudgy chocolate brownie baked with dark chocolate batter, milk chocolate chunks, and white chocolate drizzle.",
    discountPrice: 3.80,
    countInStock: 30,
    category: "oven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600",
        altText: "Fudgy square chocolate brownie"
      }
    ],
    rating: 4.9,
    numReviews: 48,
    tags: ["brownie", "chocolate", "fudgy", "sweet"],
    metaTitle: "Fudgy Triple Chocolate Brownies | Knead to Read",
    metaDescription: "Rich, dense chocolate brownies baked for true cocoa lovers. Crispy top, fudgy center.",
    metaKeywords: "brownie, chocolate brownie, fudgy dessert, bakery"
  },

  // ==========================================
  // --- PAIRINGS (COMBOS) - 10 RECORDS ---
  // ==========================================
  {
    name: "The Morning Ritual Pairing",
    price: 14.50,
    description: "A buttery, golden croissant pairs elegantly with Jane Austen's sharp wit and warm romance. Ideal for a slow morning break.",
    discountPrice: 13.00,
    countInStock: 10,
    category: "pairing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600",
        altText: "Pride & Prejudice Book Cover"
      },
      {
        url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600",
        altText: "Butter Croissant Pastry"
      }
    ],
    rating: 5.0,
    numReviews: 31,
    tags: ["cozy", "morning", "bundle", "gift-box"],
    metaTitle: "The Morning Ritual Book & Pastry Box | Knead to Read",
    metaDescription: "The ultimate cozy morning bundle: A fresh flaky butter croissant combined with Jane Austen's Pride and Prejudice.",
    metaKeywords: "book pairing, gift box, jane austen, croissant, book bundle"
  },
  {
    name: "The Stormy Gothic Nights Box",
    price: 16.50,
    description: "Pair Emily Brontë's turbulent Wuthering Heights with a dense, dark Pain au Chocolat for a moody reading afternoon.",
    discountPrice: 15.00,
    countInStock: 8,
    category: "pairing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600",
        altText: "Wuthering Heights Novel"
      },
      {
        url: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=600",
        altText: "Pain au chocolat pastry"
      }
    ],
    rating: 4.8,
    numReviews: 19,
    tags: ["gothic", "dark-chocolate", "bronte", "bundle"],
    metaTitle: "Stormy Gothic Nights Book & Chocolate Box",
    metaDescription: "Embrace rainy days with Wuthering Heights and decadent dark Belgian pain au chocolat.",
    metaKeywords: "gothic book box, bronte pairing, chocolate pastry bundle"
  },
  {
    name: "The Regency Tea & Tart Bundle",
    price: 15.00,
    description: "Enjoy Jane Austen's Emma alongside our fresh, sweet mixed berry tart. The epitome of refined afternoon delight.",
    discountPrice: 14.00,
    countInStock: 12,
    category: "pairing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600",
        altText: "Emma classic book"
      },
      {
        url: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=600",
        altText: "Mixed berry tart"
      }
    ],
    rating: 4.9,
    numReviews: 22,
    tags: ["regency", "berry-tart", "austen", "tea-time"],
    metaTitle: "The Regency Tea & Tart Gift Box | Knead to Read",
    metaDescription: "Pair Jane Austen's Emma with a fresh artisanal berry tart for the ideal weekend read.",
    metaKeywords: "emma book box, berry tart pairing, tea time box"
  },
  {
    name: "The Decadent Aesthetician Box",
    price: 14.99,
    description: "Oscar Wilde's The Picture of Dorian Gray paired with a decadent Hazelnut Praline Eclair. Indulge all your senses.",
    discountPrice: 13.50,
    countInStock: 7,
    category: "pairing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=600",
        altText: "Dorian Gray hardcover"
      },
      {
        url: "https://images.unsplash.com/photo-1612203985729-70726954388c?q=80&w=600",
        altText: "Hazelnut eclair"
      }
    ],
    rating: 4.7,
    numReviews: 14,
    tags: ["wilde", "eclair", "gothic", "bundle"],
    metaTitle: "The Decadent Aesthetician Book Pairing",
    metaDescription: "Satisfy your mind and palate with Oscar Wilde and an exquisite hazelnut praline eclair.",
    metaKeywords: "wilde book box, eclair pairing, aesthetician box"
  },
  {
    name: "The Rustic Sea Voyage Pair",
    price: 17.50,
    description: "Ernest Hemingway's The Old Man and the Sea paired with a slab of fresh Rosemary Sea Salt Focaccia.",
    discountPrice: 16.00,
    countInStock: 9,
    category: "pairing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600",
        altText: "Hemingway novel"
      },
      {
        url: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=600",
        altText: "Rosemary focaccia bread"
      }
    ],
    rating: 4.8,
    numReviews: 16,
    tags: ["savory", "hemingway", "focaccia", "bundle"],
    metaTitle: "The Rustic Sea Voyage Book & Bread Box",
    metaDescription: "A savory pairing: Hemingway's enduring masterpiece with olive oil and sea salt focaccia.",
    metaKeywords: "hemingway box, savory book pairing, focaccia bread box"
  },
  {
    name: "The Victorian Fireside Bundle",
    price: 15.99,
    description: "Charles Dickens' Great Expectations accompanied by a warm Cinnamon Cardamom Bun.",
    discountPrice: 14.50,
    countInStock: 11,
    category: "pairing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600",
        altText: "Great Expectations novel"
      },
      {
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600",
        altText: "Cinnamon cardamom bun"
      }
    ],
    rating: 4.9,
    numReviews: 25,
    tags: ["victorian", "cinnamon", "dickens", "cozy"],
    metaTitle: "The Victorian Fireside Book & Pastry Box",
    metaDescription: "Warm up with Charles Dickens' Great Expectations and a sweet Swedish cinnamon bun.",
    metaKeywords: "dickens book box, cinnamon bun pairing, cozy reading box"
  },
  {
    name: "The Dark Frankenstein & Canelé Box",
    price: 14.25,
    description: "Mary Shelley's Frankenstein paired with two traditional caramelized Bordeaux Vanilla Canelés.",
    discountPrice: 13.00,
    countInStock: 14,
    category: "pairing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600",
        altText: "Frankenstein dark book"
      },
      {
        url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600",
        altText: "Vanilla canele"
      }
    ],
    rating: 4.8,
    numReviews: 18,
    tags: ["gothic", "canele", "sci-fi", "bundle"],
    metaTitle: "Frankenstein & French Canelé Pairing Box",
    metaDescription: "Unwind with Mary Shelley's gothic tale and crispy caramelized French Canelés.",
    metaKeywords: "frankenstein book box, canele pairing, gothic book gift"
  },
  {
    name: "The Family Comfort & Cookie Box",
    price: 16.00,
    description: "Louisa May Alcott's Little Women paired with a box of 4 Salted Caramel Pecan Cookies.",
    discountPrice: 14.99,
    countInStock: 15,
    category: "pairing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600",
        altText: "Little Women hardcover"
      },
      {
        url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600",
        altText: "Salted caramel cookies"
      }
    ],
    rating: 5.0,
    numReviews: 40,
    tags: ["comfort", "cookies", "alcott", "family"],
    metaTitle: "Little Women & Cookie Gift Box | Knead to Read",
    metaDescription: "Share or indulge: Little Women paired with four chewy brown-butter salted caramel pecan cookies.",
    metaKeywords: "little women box, cookie pairing box, comfort gift box"
  },
  {
    name: "The Secret Garden Tea Time Box",
    price: 13.99,
    description: "Frances Hodgson Burnett's The Secret Garden paired with Blueberry Lemon Scones and Earl Grey Tea Biscuits.",
    discountPrice: 12.50,
    countInStock: 20,
    category: "pairing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600",
        altText: "Secret garden book cover"
      },
      {
        url: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=600",
        altText: "Blueberry scones"
      }
    ],
    rating: 4.9,
    numReviews: 33,
    tags: ["tea-time", "scones", "nature", "bundle"],
    metaTitle: "The Secret Garden Tea & Scone Box",
    metaDescription: "Step into nature with The Secret Garden accompanied by zesty blueberry lemon scones.",
    metaKeywords: "secret garden box, tea time pairing, scone book bundle"
  },
  {
    name: "The Revolution & Sourdough Loaf Pairing",
    price: 18.50,
    description: "A Tale of Two Cities by Charles Dickens paired with a full, fresh-baked Artisan Sourdough Loaf.",
    discountPrice: 17.00,
    countInStock: 10,
    category: "pairing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=600",
        altText: "A Tale of Two Cities book"
      },
      {
        url: "https://images.unsplash.com/photo-1585478259715-876a6a81fc08?q=80&w=600",
        altText: "Fresh sourdough loaf"
      }
    ],
    rating: 4.8,
    numReviews: 21,
    tags: ["sourdough", "dickens", "bread", "bundle"],
    metaTitle: "A Tale of Two Cities & Sourdough Bread Box",
    metaDescription: "Hearty historical fiction paired with a 36-hour fermented fresh sourdough loaf.",
    metaKeywords: "dickens sourdough pairing, bread and book box, revolution bundle"
  }
];

module.exports = kneadToReadProducts;