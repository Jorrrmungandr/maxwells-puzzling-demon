export const grid = [
  [0,0,0,0,1,0,0,0,0],
  [0,0,0,0,1,0,0,0,0],
  [1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1],
]

export const blocks = [
  { items: [[2, 0]], property: 'cold'},
  { items: [[3, 5]], property: 'cold'},
  { items: [[4, 4], [4, 5]], property: 'cold'},
  { items: [[5, 6], [5, 7], [4, 7]], property: 'hot'},
]

export const demonPos = {x: 3, y: 1}
export const destinationPos = {x: 0, y: 4}
