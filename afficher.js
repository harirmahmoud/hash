import fs from 'node:fs/promises';
import { decrypt } from './ajouter.js';

const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');
const data = await fs.readFile('etudiant.json', 'utf8');

const etudiants = JSON.parse(data);
const nom = decrypt(etudiants.hash_nom, secretKey)
console.log(nom);
const releve = decrypt(etudiants.hash_note, secretKey)
console.log(releve);