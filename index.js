import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import ProductSpecification from './models/ProductSpecification.js'; // Attention ici aussi

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Connexion MongoDB
mongoose.connect(
  'mongodb+srv://ikramelhayani1999:a17PG84TFRVDFSLB@cluster0.vcjxyqf.mongodb.net/ordermanagement_db?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log('✅ Connecté à MongoDB Atlas');
}).catch((err) => {
  console.error('❌ Erreur de connexion MongoDB :', err);
});

// Route : Product Specification
app.post('/send-specification', async (req, res) => {
  const specification = req.body;

  console.log('📦 Données Specification reçues de ServiceNow :', specification);

  try {
    const existingSpec = await ProductSpecification.findOne({ sys_id: specification.sys_id });

    if (existingSpec) {
      console.log(`⚠️ Spécification avec sys_id ${specification.sys_id} déjà existante. Mise à jour...`);
      await ProductSpecification.updateOne({ sys_id: specification.sys_id }, specification);
      console.log('✅ Spécification mise à jour dans MongoDB');
    } else {
      const newSpec = new ProductSpecification(specification);
      await newSpec.save();
      console.log('✅ Nouvelle spécification enregistrée dans MongoDB');
    }

    res.status(200).json({ message: '✅ Specification enregistrée ou mise à jour dans MongoDB' });
  } catch (err) {
    console.error('❌ Erreur lors de l\'enregistrement dans MongoDB :', err);
    res.status(500).json({ error: 'Erreur MongoDB' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur API en écoute sur le port ${PORT}`);
});
