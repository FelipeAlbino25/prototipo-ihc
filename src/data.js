export const lessons = [
  { id: 'numeros', title: 'Números e operações', minutes: 20, transcript: 'Ao resolver uma expressão numérica, comece pelos parênteses. Em seguida, resolva multiplicações e divisões. Por último, faça adições e subtrações.', example: '3 + 2 × 4 = 11' },
  { id: 'fracoes', title: 'Frações no dia a dia', minutes: 25 },
  { id: 'porcentagens', title: 'Porcentagens', minutes: 25, transcript: 'Uma porcentagem representa uma parte de um total dividido em 100. Para calcular uma porcentagem de um valor, multiplique o valor pela fração equivalente.', example: '20% de 50 = 20/100 × 50 = 10' },
  { id: 'diagnostico', title: 'Revisão do diagnóstico', minutes: 15, locked: true },
]

export const subjects = [['Matemática', 1], ['Português', 4], ['Biologia', 2], ['História', 1], ['Química', 0], ['Física', 0]]

export const initialThreads = [
  {
    id: 'fracoes', subject: 'Matemática', topic: 'Frações no dia a dia', author: 'Mateus · Aluno · hoje, 09:10',
    title: 'Por que 1/2 é equivalente a 2/4?',
    body: 'Na aula, usamos 2/4 no lugar de 1/2 para somar com 1/4. Se os números mudam, por que o valor é o mesmo?',
    votes: 12, count: 2, teacher: 'Ana',
    peer: { author: 'Lucas · Aluno · hoje, 09:18', body: 'Pensei numa pizza: metade dela ocupa o mesmo espaço que dois dos quatro pedaços iguais.' },
    answer: 'Isso mesmo, Lucas! Multiplicamos o numerador e o denominador pelo mesmo número, diferente de zero: (1 × 2)/(2 × 2) = 2/4. As partes ficam menores, mas a quantidade é a mesma. Assim, 2/4 + 1/4 = 3/4.',
  },
  {
    id: 'ecologia', subject: 'Biologia', topic: 'Ecologia', author: 'Júlia · Aluna · ontem',
    title: 'Por que a energia diminui na cadeia alimentar?', votes: 8, count: 3, teacher: 'Renata',
    answer: 'Parte da energia é usada no metabolismo e dissipada como calor. Por isso, só uma fração chega ao próximo nível trófico.',
    replies: ['Então parte da energia é gasta antes de chegar ao consumidor?', 'Sim, os organismos usam energia para manter suas funções vitais.'],
  },
  {
    id: 'interpretacao', subject: 'Português', topic: 'Interpretação', author: 'Pedro · Aluno · ontem',
    title: 'Como diferenciar tema e tese de um texto?', votes: 6, count: 2, teacher: 'Carla',
    answer: 'Tema é o assunto tratado; tese é o ponto de vista defendido sobre ele. Em “o transporte público deve ser ampliado”, há uma tese, não só um tema.',
    replies: ['Se o assunto é transporte público, o que o autor defende sobre ele é a tese.'],
  },
]

export const fractionNotes = [
  'Vamos somar meio sanduíche com um quarto de sanduíche. Primeiro, escrevemos as duas frações com o mesmo denominador. Um meio equivale a dois quartos.',
  'Agora somamos dois quartos com um quarto. São três quartos ao todo. Somamos os numeradores e mantemos o denominador 4, pois as partes continuam do mesmo tamanho.',
]
export const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
