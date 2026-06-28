const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;

  const cats = await db.collection('categories').find({}).toArray();
  console.log('Categories:');
  cats.forEach(c => console.log(' ', c.slug, '->', c._id));

  const products = await db.collection('products').find({}).toArray();
  console.log('\nProducts to fix:', products.length);

  for (const p of products) {
    const name = p.name.toLowerCase();
    let cat = null;

    if (name.includes('tomato') || name.includes('onion') || name.includes('spinach') ||
        name.includes('carrot') || name.includes('capsicum') || name.includes('potato') ||
        name.includes('brinjal') || name.includes('cauliflower') || name.includes('beans') ||
        name.includes('peas') || name.includes('cucumber') || name.includes('radish'))
      cat = cats.find(c => c.slug === 'vegetables');

    else if (name.includes('mango') || name.includes('banana') || name.includes('apple') ||
             name.includes('watermelon') || name.includes('grape') || name.includes('orange') ||
             name.includes('papaya') || name.includes('guava') || name.includes('pineapple'))
      cat = cats.find(c => c.slug === 'fruits');

    else if (name.includes('milk') || name.includes('paneer') || name.includes('curd') ||
             name.includes('butter') || name.includes('ghee') || name.includes('cheese') ||
             name.includes('cream'))
      cat = cats.find(c => c.slug === 'dairy');

    else if (name.includes('rice') || name.includes('dal') || name.includes('atta') ||
             name.includes('flour') || name.includes('wheat') || name.includes('oats') ||
             name.includes('rava') || name.includes('maida') || name.includes('poha'))
      cat = cats.find(c => c.slug === 'grains');

    else if (name.includes('chicken') || name.includes('mutton') || name.includes('fish') ||
             name.includes('egg') || name.includes('prawn') || name.includes('meat'))
      cat = cats.find(c => c.slug === 'meat');

    else if (name.includes('bread') || name.includes('cake') || name.includes('biscuit') ||
             name.includes('cookie') || name.includes('rusk') || name.includes('pav'))
      cat = cats.find(c => c.slug === 'bakery');

    else if (name.includes('juice') || name.includes('water') || name.includes('coffee') ||
             name.includes('tea') || name.includes('coconut') || name.includes('drink'))
      cat = cats.find(c => c.slug === 'beverages');

    else if (name.includes('chip') || name.includes('snack') || name.includes('namkeen') ||
             name.includes('nuts') || name.includes('cashew') || name.includes('lays'))
      cat = cats.find(c => c.slug === 'snacks');

    if (cat) {
      await db.collection('products').updateOne(
        { _id: p._id },
        { $set: { category: cat._id } }
      );
      console.log('✅', p.name, '->', cat.name);
    } else {
      console.log('⚠️  No match:', p.name);
    }
  }

  console.log('\n🎉 Done! Restart backend and refresh browser.');
  mongoose.disconnect();
});