import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { createRequire } from 'module';
import ProductSpecification from './models/ProductSpecification.js';

dotenv.config();

const require = createRequire(import.meta.url);
const kafka = require('kafka-node');

const app = express();
app.use(bodyParser.json());

// Connexion MongoDB
mongoose.connect(
  'mongodb+srv://ikramelhayani1999:a17PG84TFRVDFSLB@cluster0.vcjxyqf.mongodb.net/ordermanagement_db?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// Connexion Kafka
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
  console.log('✅ Kafka Producer is connected and ready.');
});

producer.on('error', (err) => {
  console.error('❌ Kafka Producer error:', err);
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
      console.log('✅ Spécification enregistrée dans MongoDB');
    }
  } catch (err) {
    console.error('❌ Erreur MongoDB Specification :', err);
    return res.status(500).json({ error: 'Erreur MongoDB' });
  }

  const payloads = [
    {
      topic: process.env.KAFKA_TOPIC_SPECIFICATION,
      messages: JSON.stringify(specification),
    },
  ];

  producer.send(payloads, (err, data) => {
    if (err) {
      console.error('❌ Erreur Kafka Specification :', err);
      return res.status(500).json({ error: 'Erreur Kafka' });
    }
    console.log('📨 Message Specification envoyé à Kafka :', data);
    res.status(200).json({ message: 'Specification envoyée à Kafka et MongoDB', data });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API listening on port ${PORT}`);
});
