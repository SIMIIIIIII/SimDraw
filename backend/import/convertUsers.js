// Script de conversion users.json vers le nouveau format User
// Placez ce script dans le dossier import/ puis lancez-le avec: node convertUsers.js

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'users.json');
const outputPath = path.join(__dirname, 'users_formatted.json');

function toObjectId(str) {
  if (typeof str === 'object' && str.$oid) return str.$oid;
  return str;
}

function convertDrawing(d) {
  return {
    drawingId: toObjectId(d.drawingId),
    date: d.date ? new Date(d.date.$date || d.date) : new Date()
  };
}

function convertUser(u) {
  return {
    _id: toObjectId(u._id),
    username: u.username,
    name: u.name,
    email: u.email,
    password: u.password,
    emoji: u.emoji || '1f600',
    admin: u.admin || false,
    drawings: (u.drawings || []).map(convertDrawing),
    createdAt: u.createdAt ? new Date(u.createdAt.$date || u.createdAt) : undefined,
    updatedAt: u.updatedAt ? new Date(u.updatedAt.$date || u.updatedAt) : undefined
  };
}

function main() {
  const raw = fs.readFileSync(inputPath, 'utf-8');
  const users = JSON.parse(raw);
  const formatted = users.map(convertUser);
  fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2), 'utf-8');
  console.log('Conversion terminée. Fichier généré :', outputPath);
}

main();
