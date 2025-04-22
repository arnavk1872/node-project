const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/schools.json');

function readSchools() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeSchools(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

router.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: "All fields required" });
  }

  const schools = readSchools();
  const newSchool = {
    id: Date.now(),
    name,
    address,
    latitude,
    longitude
  };

  schools.push(newSchool);
  writeSchools(schools);

  res.status(201).json({ message: "School added", school: newSchool });
});

router.get('/listSchools', (req, res) => {
  const schools = readSchools();
  res.json(schools);
});

router.put('/updateSchool/:id', (req, res) => {
  const { id } = req.params;
  const schools = readSchools();
  const index = schools.findIndex(s => s.id == id);

  if (index === -1) return res.status(404).json({ message: "School not found" });

  const updated = { ...schools[index], ...req.body };
  schools[index] = updated;
  writeSchools(schools);

  res.json({ message: "School updated", school: updated });
});

router.delete('/deleteSchool/:id', (req, res) => {
  const { id } = req.params;
  let schools = readSchools();
  const before = schools.length;
  schools = schools.filter(s => s.id != id);

  if (schools.length === before) return res.status(404).json({ message: "School not found" });

  writeSchools(schools);
  res.json({ message: "School deleted" });
});

module.exports = router;
