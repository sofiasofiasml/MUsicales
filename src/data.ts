export type Q = { kind: 'audio' | 'image'; term: string; answer: string; note?: string }

// Audio: fragmento de la preview de iTunes. Imagen: carátula del álbum (borrosa).
export const QUESTIONS: Q[] = [
  { kind: 'audio', term: 'Dancing Queen Mamma Mia Soundtrack', answer: 'Mamma Mia!' },
  { kind: 'audio', term: 'Super Trouper Mamma Mia Soundtrack', answer: 'Mamma Mia!' },
  { kind: 'audio', term: "Don't Stop Believin' Glee Cast", answer: 'Glee' },
  { kind: 'audio', term: 'Somebody to Love Glee Cast', answer: 'Glee' },
  { kind: 'audio', term: 'Willkommen Cabaret', answer: 'Cabaret', note: 'Con Natalia Millán en la versión española 💃' },
  { kind: 'audio', term: 'Maybe This Time Liza Minnelli Cabaret', answer: 'Cabaret' },
  { kind: 'audio', term: 'Vois sur ton chemin Les Choristes', answer: 'Los chicos del coro' },
  { kind: 'audio', term: 'Les Choristes Caresse sur ocean', answer: 'Los chicos del coro' },
  { kind: 'audio', term: 'Defying Gravity Wicked Original Broadway Cast', answer: 'Wicked' },
  { kind: 'audio', term: 'Popular Wicked Kristin Chenoweth', answer: 'Wicked' },
  { kind: 'audio', term: 'Proud Mary Tina The Tina Turner Musical', answer: 'Tina' },
  { kind: 'audio', term: 'The Devil Wears Prada The Musical Elton John', answer: 'El diablo se viste de Prada' },
  { kind: 'audio', term: 'Summer Nights Grease Soundtrack', answer: 'Grease' },
  { kind: 'audio', term: 'Circle of Life Lion King Broadway', answer: 'El Rey León' },
  { kind: 'image', term: 'Mamma Mia! Original Motion Picture Soundtrack', answer: 'Mamma Mia!' },
  { kind: 'image', term: 'Glee The Music Season 1', answer: 'Glee' },
  { kind: 'image', term: 'Cabaret Original Soundtrack', answer: 'Cabaret' },
  { kind: 'image', term: 'Les Choristes bande originale', answer: 'Los chicos del coro' },
  { kind: 'image', term: 'Wicked Original Broadway Cast Recording', answer: 'Wicked' },
  { kind: 'image', term: 'Tina The Tina Turner Musical', answer: 'Tina' },
  { kind: 'image', term: 'The Devil Wears Prada The Musical', answer: 'El diablo se viste de Prada' },
]

export const POOL = [...new Set([...QUESTIONS.map(q => q.answer), 'Chicago', 'Hairspray', 'La La Land', 'Moulin Rouge!', 'Los Miserables', 'Hamilton'])]
