export const grid = [
  [0,0,0,0,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1],
  [0,0,1,0,1,1,1,0,0],
  [0,0,1,1,1,0,1,0,0],
]

export const blocks = [
  { items: [[4, 4], [4, 5], [4, 6]], property: 'hot'},
  { items: [[0, 4], [0, 5], [0, 6], [1, 5]], property: 'normal'},
  { items: [[2, 1]], property: 'cold'},
  { items: [[2, 7]], property: 'normal'},
]

export const demonPos = {x: 2, y: 3}
export const destinationPos = {x: 5, y: 6}
