// Script de conversion drawings.json vers le nouveau format Drawing
// Placez ce script dans le dossier import/ puis lancez-le avec: node convertDrawings.js

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'drawings.json');
const outputPath = path.join(__dirname, 'drawings_formatted.json');

function toObjectId(str) {
  // Si déjà ObjectId, retourne tel quel
  if (typeof str === 'object' && str.$oid) return str.$oid;
  return str;
}

function convertParticipant(p) {
  return {
    userId: toObjectId(p.userId),
    start: p.start,
    end: p.end,
    joinedAt: p.joinedAt ? new Date(p.joinedAt) : undefined,
    isActive: p.isActive !== undefined ? p.isActive : false
  };
}

function convertPath(p) {
  return {
    points: (p.points || []).map(pt => ({ x: pt.x, y: pt.y })),
    userId: toObjectId(p.userId),
    color: p.color || '#000000',
    size: p.size || 1,
    timestamp: p.timestamp || Date.now()
  };
}

function convertAuthor(a) {
  return {
    authorId: toObjectId(a.authorId || a._id),
    username: a.authorName || a.username || '',
    emoji: a.emoji || '1f600'
  };
}

function convertDrawing(d) {
  return {
    _id: toObjectId(d._id),
    title: d.title,
    theme: d.theme,
    description: d.description || '',
    participants: (d.participants || []).map(convertParticipant),
    maxParticipants: d.maxParticipants || d.numberPlayers || 1,
    path: (d.path || []).map(convertPath),
    currentTurn: d.currentTurn ? toObjectId(d.currentTurn) : null,
    createdAt: d.createdAt ? new Date(d.createdAt.$date || d.createdAt) : new Date(),
    updatedAt: d.modifiedAt ? new Date(d.modifiedAt.$date || d.modifiedAt) : (d.updatedAt ? new Date(d.updatedAt.$date || d.updatedAt) : new Date()),
    author: convertAuthor(d.author),
    likes: d.likes || 0,
    whoLiked: (d.whoLiked || []).map(toObjectId),
    isDone: d.isDone || false,
    isPublic: d.isPublic || false
  };
}

function main() {
  const raw = fs.readFileSync(inputPath, 'utf-8');
  const drawings = JSON.parse(raw);
  const formatted = drawings.map(convertDrawing);
  fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2), 'utf-8');
  console.log('Conversion terminée. Fichier généré :', outputPath);
}

main();
