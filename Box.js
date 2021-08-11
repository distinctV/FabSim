const base_spread = SpreadsheetApp.getActiveSpreadsheet()
let sheet = null
let cache = null

function openBox(exp = 'arc', ed = 'u') {
  sheet = base_spread.getSheetByName(`${exp}`)//sheet for each expansion structured properly
  cache = sheet.getRange(1, 1, 310, 1).getValues()//310 changes to longest set length
  writeBox(makeBox(exp))
}
function makeBox(exp) {
  let packs = 0
  let box = []
  while (packs++ < 24) {
    box.push(makePack(exp))
  }
  return box
}

function makePack(exp, chaff = true) {
  let pack = []
  pack = pack.concat(make(exp, 'f'))
  pack = pack.concat(make(exp, 'b'))
  if (chaff) {
    pack = pack.concat(make(exp, 'r'))
    if (exp == 'wtr' || exp == 'arc' || exp == 'mon')
      pack = pack.concat(make(exp, 't'))
    if (exp == 'wtr' || exp == 'arc')
      pack = pack.concat(make(exp, 'g'))
    pack = pack.concat(make(exp, 'c'))
    pack = pack.concat(make(exp, 'e'))
  }
  return pack
}

function make(exp, type) {
  let add = []
  let count = packSlots[exp][type]
  for (let i = 0; i < count; i++) {
    if (type == 'b' || type == 'f')
      add.push(cache[selectIndex(ends[exp][bonus(exp, type)])])
    else
      add.push(cache[selectIndex(ends[exp][type])])
  }
  return add
}

function selectIndex(pair) {
  //if(exp != 'wtr && exp !='arc)
  //todo shortPrintHeadache() else
  return pair[0] + Math.floor(Math.random() * (pair[1] - pair[0]))
}

//https://reddit.com/r/FABTCG/comments/fg2of7/flesh_blood_card_rarity/fk2paxn/
//Foil rates source
//Common Rare Equipment Super Legendary Majestic Fabled
//0.811	0.129	0.031 0.012 0.01 0.006 0.001

function bonus(exp, type) {
  let outcomes = []
  let upgrades = []
  let i = 0
  let roll = Math.random()
  if (exp == 'wtr' || exp == 'arc') {
    if (type == 'f') {
      outcomes = ['x', 'm', 'l', 's', 'r', 'c'] //foil common equipment 1/80 read somewhere but mixed with commons
      upgrades = [1 / 960, 1 / 160, 1 / 96, 1 / 32, 1 / 8]
    }
    if (type == 'b') {
      outcomes = ['m', 's', 'r']
      upgrades = [1 / 12, 1 / 6]
    }
    for (i = 0; i < upgrades.length; i++) {
      if (roll <= upgrades[i]) {
        break
      }
    }
  } else if (exp == 'mon') {
    if (type == 'f') {
      outcomes = ['x', 'l', 'm', 'r', 'c']
      upgrades = [1 / 960, 1 / 96, 1 / 32, 1 / 8]
    }
    if (type == 'b') {//todo fix alt art
      outcomes = ['m', 'r']
      upgrades = [1 / 6]
    }
    for (i = 0; i < upgrades.length; i++) {
      if (roll <= upgrades[i]) {
        break
      }
    }
  } else if (exp == 'cru') {
    if (type == 'f') {
      outcomes = ['x', 'l', 'm', 'r', 'c']
      upgrades = [1 / 960, 1 / 240, 1 / 32, 1 / 8]
    }
    if (type == 'b') {//todo fix alt art
      outcomes = ['m', 'r']
      upgrades = [1 / 6]
    }
    for (i = 0; i < upgrades.length; i++) {
      if (roll <= upgrades[i]) {
        break
      }
    }
  }
  return outcomes[i]
}

function writeBox(box) {
  let sheet = base_spread.getSheetByName("Box")
  dataRange = sheet.getRange(1, 1, box.length, box[0].length);
  dataRange.setValues(box);
}

//pack data constants
const packSlots = {
  'wtr': {
    't': 1,
    'c': 7,
    'e': 1,
    'g': 4,
    'r': 1,
    'b': 1,
    'f': 1,
    'a': 16
  },
  'arc': {
    't': 1,
    'c': 7,
    'g': 4,
    'e': 1,
    'r': 1,
    'b': 1,
    'f': 1,
    'a': 16

  },
  'cru': {
    'c': 7,
    'r': 1,
    'b': 1,
    'f': 1,
    'a': 10

  },
  'mon': {
    't': 1,
    'e': 1,
    'c': 11,
    'r': 1,
    'b': 1,
    'f': 1,
    'a': 16
  },
}
const ends = {
  'wtr': {
    'a': [1, 303],
    't': [212, 303],
    'r': [149, 196],
    's': [197, 211],
    'm': [139, 148],
    'l': [134, 138],
    'x': [133, 133],
    'c': [49, 120],
    'e': [121, 132],
    'g': [1, 48],
  },
  'arc': {
    'a': [1, 283],
    't': [207, 283],
    'r': [144, 191],
    's': [192, 206],
    'm': [134, 143],
    'l': [129, 133],
    'x': [128, 128],
    'c': [53, 127],
    'g': [13, 52],
    'e': [1, 12],
  },
  'cru': {
    'a': [1, 199],
    'r': [144, 199],
    'm': [108, 143],
    'ma': [107, 107],//todo fix alt art
    'l': [105, 106],
    'x': [104, 104],
    'c': [1, 103],
    'e': [1, 103],
  },
  'mon': {
    'a': [1, 309],
    't': [294, 309],
    'r': [215, 293],
    'm': [184, 214],
    'ma': [180, 184],//todo fix alt art
    'l': [174, 179],
    'x': [219, 219],
    'c': [1, 172],
    'e': [1, 172],//todo fix equipment mixed in.
  }
}

