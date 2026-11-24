import React, { useEffect, useId, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BarChart3, BookOpen, CheckCircle2, Clock, House, Info, Leaf, Menu, MessageCircle, Paperclip, Play, Volume2, VolumeX, X } from 'lucide-react'
import '@fontsource-variable/inter/wght.css'
import { fractionNotes, initialThreads, lessons, normalize, subjects } from './data'
import './styles.css'

const nav = [['Inicio', 'Início', House], ['Estudar', 'Estudar', BookOpen], ['Duvidas', 'Dúvidas', MessageCircle], ['Progresso', 'Progresso', BarChart3]]
const route = (name, anchor) => '#/' + name + (anchor ? '?foco=' + anchor : '')
const lessonHref = (id = 'fracoes', anchor) => route('Estudar/aula/' + id, anchor)

function useSaved(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem('primeira-' + key)) ?? initial } catch { return initial }
  })
  useEffect(() => {
    try { localStorage.setItem('primeira-' + key, JSON.stringify(value)) } catch { /* storage unavailable */ }
  }, [key, value])
  return [value, setValue]
}

function Button({ href, plain = false, className = '', children, ...props }) {
  const styles = 'button ' + (plain ? 'button--plain ' : '') + className
  return href ? <a className={styles} href={href} {...props}>{children}</a>
    : <button className={styles} type="button" {...props}>{children}</button>
}

function Card({ children, className = '' }) {
  return <section className={'card ' + className}>{children}</section>
}

function Tag({ children, color = 'blue' }) {
  return <span className={'tag tag--' + color}>{children}</span>
}

function ProgressBar({ value, label }) {
  return <progress value={value} max={100} aria-label={label} />
}

function Modal({ title, close, children }) {
  const dialog = useRef(null)
  const titleId = useId()
  useEffect(() => { dialog.current.showModal() }, [])
  return <dialog ref={dialog} aria-labelledby={titleId} onCancel={close}>
    <div className="spread"><h2 id={titleId}>{title}</h2><button className="icon-button" type="button" aria-label="Fechar" onClick={close}><X size={20} /></button></div>
    {children}
  </dialog>
}

function Home({ complete, download }) {
  return <div className="stack page home">
    <h1>Olá, Mateus</h1>
    <div className="stack home-overview">
      <Card className="home-resume">
        <div className="resume-heading"><h2>Continuar de onde parou</h2><Tag color="gray">Retome no seu ritmo</Tag></div>
        <p className="muted">Matemática para o ENEM · Duração estimada: 25 minutos</p>
        <h3>{complete ? 'Porcentagens' : 'Frações no dia a dia'}</h3>
        <p className="muted">{complete ? 'Sua próxima aula está disponível' : 'Você parou em 08:32'}</p>
        <TrailProgress complete={complete} />
        <Button href={lessonHref(complete ? 'porcentagens' : 'fracoes')}>Continuar: {complete ? 'Porcentagens' : 'Frações no dia a dia'}</Button>
        <Button plain href={lessonHref('fracoes', 'transcricao')}>Relembrar o que já vi</Button>
      </Card>
      <Card>
        <h3>Estudar hoje</h3>
        <div className="lines"><p>Matemática · Frações</p><p className="muted">2 aulas e 10 questões</p><p className="muted">Tempo estimado: 45 minutos</p></div>
        <Tag color="gold">Cai muito no ENEM</Tag>
        <Button plain onClick={() => download('hoje')}>Baixar tudo de hoje (14 MB)</Button>
        <p className="small muted">O download só começa quando você confirmar</p>
      </Card>
    </div>
    <div className="stack home-shortcuts">
      <Card><h3>Praticar</h3><p className="muted">Resolva questões com correção na hora</p><Button plain href={lessonHref('fracoes', 'questoes')}>Praticar agora</Button></Card>
      <Card><h3>Tirar dúvidas</h3><p className="muted">Professores voluntários respondem você</p><Button plain href={route('Duvidas', 'publicar')}>Perguntar</Button></Card>
      <Card><h3>Meu progresso</h3><div className="lines"><p>{complete ? 50 : 38}% da trilha concluída</p><p className="muted">Sequência: 4 dias de estudo</p><p className="muted">Próxima atividade: aula de Porcentagens</p></div></Card>
    </div>
    <div className="notice notice--blue"><Info size={20} /><span>Estude no seu ritmo. A duração das aulas é uma estimativa. Você pode precisar de mais tempo.</span></div>
  </div>
}

function TrailProgress({ complete }) {
  return <div className="progress-group"><p className="small">{complete ? '4 de 8 aulas concluídas (50%)' : '3 de 8 aulas concluídas (38%)'}</p><ProgressBar value={complete ? 50 : 38} label="Progresso da trilha de Matemática" /></div>
}

function Trail({ complete }) {
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const matches = lessons.filter(({ title }) => normalize(title).includes(normalize(query)))
  const clear = () => { setText(''); setQuery('') }
  return <div className="stack page trail">
    <div className="stack trail-heading">
      <Button plain href={route('Inicio')}>Voltar ao início</Button>
      <div className="page-intro"><h1>Matemática</h1><p className="muted">Todas as aulas são gratuitas. Estude aqui no portal, na ordem que preferir e no seu ritmo.</p></div>
    </div>
    <div className="stack trail-layout">
      <Card className="trail-summary"><h3>Matemática para o ENEM</h3><TrailProgress complete={complete} /><p className="muted">Tempo restante para concluir a trilha: {complete ? '2 h 40 min' : '3 h 05 min'}</p></Card>
      <div className="stack trail-main">
        <form className="stack compact" onSubmit={(event) => { event.preventDefault(); setQuery(text) }}>
          <h3><label htmlFor="lesson-search">Buscar aulas</label></h3>
          <p className="small muted" id="lesson-hint">Digite um assunto, como frações ou interpretação</p>
          <div className="stack compact trail-search">
            <input type="search" id="lesson-search" aria-describedby="lesson-hint" placeholder="Buscar aulas" value={text} onChange={(event) => setText(event.target.value)} />
            <div className="split"><Button type="submit">Buscar</Button><Button plain onClick={clear}>Limpar busca</Button></div>
          </div>
        </form>
        {!matches.length && <Card className="trail-empty"><h3 role="status">Nenhuma aula encontrada. Tente outro assunto ou remova os filtros.</h3><Button plain onClick={clear}>Ver todas as aulas</Button></Card>}
        <section className="stack compact trail-lessons">
          <h2>Seu percurso em matemática</h2>
          <div className="stack compact lesson-list">
            {(matches.length ? matches : lessons).map((lesson) => {
              const done = lesson.id === 'numeros' || (complete && lesson.id === 'fracoes')
              const current = lesson.id === (complete ? 'porcentagens' : 'fracoes')
              return <Card key={lesson.id}>
                <p className="small muted">Aula {lessons.indexOf(lesson) + 1}</p>
                <h3>{lesson.title}</h3>
                <p className="small muted">Duração estimada: {lesson.minutes} minutos</p>
                <div className="tags">
                  {done && <Tag color="green"><CheckCircle2 size={14} /> Concluída</Tag>}
                  {current && <Tag><Clock size={14} /> Aula atual</Tag>}
                  {lesson.id === 'fracoes' && <Tag color="gold">Cai muito no ENEM</Tag>}
                </div>
                <Button href={lesson.locked ? undefined : lessonHref(lesson.id)} disabled={lesson.locked}>{done ? 'Revisar' : 'Abrir aula'}</Button>
                {lesson.locked && <p className="small muted">Indisponível: responda ao diagnóstico para receber a revisão das suas respostas.</p>}
              </Card>
            })}
          </div>
        </section>
        <p className="muted">Você pode revisar aulas anteriores.</p>
      </div>
    </div>
  </div>
}

function QuestionForm({ onPublish, sample = false }) {
  const [file, setFile] = useState(sample ? { name: 'calculo-fracoes.jpg', size: 245760 } : null)
  const [imageDescription, setImageDescription] = useState('')
  const [feedback, setFeedback] = useState(sample ? 'error' : '')
  const invalid = feedback === 'error' && file && !imageDescription.trim()
  const submit = (event) => {
    event.preventDefault()
    if (file && !imageDescription.trim()) { setFeedback('error'); event.currentTarget.elements.imageDescription.focus(); return }
    const fields = new FormData(event.currentTarget)
    const title = fields.get('title').trim()
    const body = fields.get('body').trim()
    if (!title || !body) {
      setFeedback('text')
      event.currentTarget.elements[title ? 'body' : 'title'].focus()
      return
    }
    onPublish(title, body, file ? { name: file.name, description: imageDescription.trim() } : null)
    event.currentTarget.reset()
    setFile(null)
    setImageDescription('')
    setFeedback('success')
  }
  return <Card>
    <form className="stack compact question-form" onSubmit={submit}>
      <p className="small muted">Envie sua pergunta aqui no portal. Os campos com “obrigatório” precisam ser preenchidos.</p>
      <label>Título da dúvida · obrigatório<input name="title" required defaultValue={sample ? 'Por que usamos quartos?' : ''} /></label>
      <label>Descrição · obrigatório<textarea name="body" required defaultValue={sample ? 'Não entendi por que 1/2 vira 2/4. Anexei meu cálculo no caderno.' : ''} /></label>
      <label>Anexo de imagem · opcional
        {file ? <span className="attachment"><Paperclip size={16} /><span>{file.name}<small>Imagem anexada · {Math.max(1, Math.round(file.size / 1024))} KB</small></span></span>
          : <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files[0] ?? null)} />}
      </label>
      {file && <>
        <button type="button" className="link" onClick={() => { setFile(null); setFeedback('') }}>Remover anexo</button>
        <p className="small muted">Se anexar uma imagem, descreva o que ela mostra.</p>
        <label>Descrição da imagem · obrigatório<textarea name="imageDescription" aria-required="true" aria-invalid={!!invalid} aria-describedby="image-hint" value={imageDescription} onChange={(event) => setImageDescription(event.target.value)} /></label>
        <p className="small muted" id="image-hint">Exemplo: “No caderno, escrevi 1/2 + 1/4 e tentei somar os denominadores.”</p>
      </>}
      {invalid && <p role="alert" className="notice notice--error">Erro: falta descrever a imagem anexada. Escreva o que aparece nela no campo acima e tente enviar de novo.</p>}
      {feedback === 'text' && <p role="alert" className="notice notice--error">Preencha o título e a descrição da dúvida.</p>}
      <Button type="submit">Enviar dúvida</Button>
      {invalid && <p className="small muted">A dúvida ainda não foi enviada. Corrija a descrição da imagem para continuar.</p>}
      {feedback === 'success' && <p role="status" className="notice notice--green">Dúvida publicada na comunidade.</p>}
    </form>
  </Card>
}

function Player({ openTranscript }) {
  const [message, setMessage] = useState('')
  const [muted, setMuted] = useState(false)
  const [rate, setRate] = useState(2)
  return <>
    <div className="player">
      <span>Vídeo pausado</span>
      <button type="button" className="play" aria-label="Reproduzir vídeo" onClick={() => { setMessage('Vídeo indisponível. Você pode estudar pela transcrição.'); openTranscript() }}><Play size={23} /></button>
      <div className="player-bottom">
        <ProgressBar value={37} label="Posição do vídeo" />
        <div className="spread"><span>08:32 / 23:00</span><div className="player-controls">
          <button type="button" aria-label={muted ? 'Ativar som' : 'Silenciar som'} onClick={() => setMuted(!muted)}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
          <button type="button" className="rate" aria-label={'Velocidade ' + rate + ' vezes. Alterar velocidade'} onClick={() => setRate(rate === 2 ? 1 : rate + 0.5)}>{rate}x</button>
        </div></div>
      </div>
    </div>
    <p className="small muted">{message || 'O vídeo só carrega quando você escolhe reproduzir. Você também pode estudar pelo texto abaixo.'}</p>
  </>
}

function Lesson({ lesson, complete, setComplete, ask, download }) {
  const fraction = lesson.id === 'fracoes'
  const done = fraction ? complete : lesson.id === 'numeros'
  const [transcript, setTranscript] = useState(true)
  const [captions, setCaptions] = useState(true)
  const [audio, setAudio] = useState(false)
  const [glossary, setGlossary] = useState(false)
  const [answer, setAnswer] = useSaved('resposta-fracoes', 'B')
  const next = lesson.id === 'numeros' ? 'fracoes' : 'porcentagens'
  return <div className={fraction ? 'stack page lesson lesson--fractions' : 'stack page lesson'}>
    <div className="stack lesson-header">
      <div className="lesson-title">
        <div><h1>{lesson.title}</h1><p className="muted">Matemática para o ENEM · {lesson.minutes} minutos</p></div>
        <Tag color={done ? 'green' : 'blue'}>{done ? 'Concluída' : 'Em andamento'}{fraction ? ' · Aula 4 de 8' : ''}</Tag>
      </div>
      {fraction && done && <p role="status" className="notice notice--green">Atividade concluída. Você terminou os exercícios de frações. Escolha a próxima aula quando quiser.</p>}
    </div>
    {fraction && <div className="stack tight lesson-media">
      <Player openTranscript={() => setTranscript(true)} />
      <div className="stack tight lesson-settings">
        <button type="button" className="setting" role="switch" aria-checked={captions} onClick={() => setCaptions(!captions)}>Legendas <span className={captions ? 'on' : ''}>{captions ? 'Ligado' : 'Desligado'}</span></button>
        <button type="button" className="setting" role="switch" aria-checked={audio} onClick={() => setAudio(!audio)}>Audiodescrição <span className={audio ? 'on' : ''}>{audio ? 'Ligado' : 'Desligado'}</span></button>
        <button type="button" className="setting setting--blue" aria-expanded={transcript} aria-controls="transcricao" onClick={() => setTranscript(!transcript)}>Transcrição completa <span>{transcript ? 'Aberta' : 'Fechada'}</span></button>
      </div>
    </div>}
    <div id="transcricao" hidden={!transcript} tabIndex={-1}><Card>
      <h2>{fraction ? 'Transcrição completa' : 'Resumo da aula'}</h2>
      {fraction ? <><p className="small muted">08:32 · Fala e conteúdo da lousa</p><p>“{fractionNotes[0]}”</p><p className="notice notice--blue"><strong>Na lousa: 1/2 + 1/4 = 3/4</strong></p><p>“{fractionNotes[1]}”</p></>
        : <><p>{lesson.transcript}</p><p className="notice notice--blue">{lesson.example}</p></>}
    </Card></div>
    {fraction && <>
      <Card className="lesson-terms">
        <h2>Entenda os termos</h2>
        <div className="term"><h3>Algoritmo</h3><p>Algoritmo: uma sequência organizada de passos para resolver um problema.</p></div>
        <div className="term"><h3>Variável</h3><p>Variável: um nome usado para identificar um valor que o programa pode consultar ou alterar.</p></div>
        <button type="button" className="link" onClick={() => setGlossary(true)}>Abrir glossário completo</button>
      </Card>
      {glossary && <Modal title="Glossário completo" close={() => setGlossary(false)}><dl><dt>Numerador</dt><dd>Indica quantas partes do todo estamos considerando.</dd><dt>Denominador</dt><dd>Indica em quantas partes iguais o todo foi dividido.</dd><dt>Frações equivalentes</dt><dd>Frações que representam a mesma quantidade, como 1/2 e 2/4.</dd><dt>Algoritmo</dt><dd>Sequência organizada de passos para resolver um problema.</dd><dt>Variável</dt><dd>Nome que identifica um valor que o programa pode consultar ou alterar.</dd></dl></Modal>}
      <section id="questoes" tabIndex={-1} className="stack compact">
        <h2>Questões relacionadas</h2>
        <Card>
          <p className="small muted">Questão 1 · Múltipla escolha · Respondida</p>
          <fieldset>
            <legend>Quanto é 1/2 + 1/4?</legend>
            <p className="muted">Escolha uma alternativa. Sua resposta está indicada abaixo.</p>
            {[['A', '2/6'], ['B', '3/4'], ['C', '1/4']].map(([key, value]) => <label key={key} className={'choice ' + (key === answer ? (key === 'B' ? 'correct' : 'incorrect') : '')}>
              <input type="radio" name="resposta" checked={key === answer} onChange={() => setAnswer(key)} /> {key}. {value}{key === answer ? (key === 'B' ? ' — sua resposta, correta' : ' — sua resposta, incorreta') : ''}
            </label>)}
          </fieldset>
          <p role="status" className={'notice ' + (answer === 'B' ? 'notice--green' : 'notice--error')}>{answer === 'B' ? 'Você acertou' : 'Tente novamente'}</p>
          <div className="term"><h3>Resolução comentada</h3><p>1/2 equivale a 2/4. Então, 2/4 + 1/4 = 3/4. Somamos 2 + 1 e mantemos o denominador 4. A alternativa B está correta.</p></div>
        </Card>
      </section>
    </>}
    <section className="stack compact lesson-question"><h2>Tirar dúvidas</h2><QuestionForm sample={fraction} onPublish={(title, body, attachment) => ask(lesson.title, title, body, attachment)} /></section>
    {fraction && <div className="lesson-example"><Card><h3>Exemplo de resposta</h3><p className="small muted">Ana · Professora voluntária</p><p>“Imagine dividir cada metade em duas partes iguais. O todo passa a ter quatro partes, e a metade ocupa duas delas. Por isso, 1/2 = 2/4: a quantidade não muda.”</p></Card></div>}
    <div className="stack compact lesson-actions">
      <div className="stack compact lesson-download">
        <Button plain onClick={() => download(lesson.id)}>{fraction ? 'Baixar esta aula (6 MB)' : 'Baixar resumo desta aula'}</Button>
        <p className="small muted">Você vê o tamanho antes de baixar</p>
        <Button plain href={route('Estudar')}>Voltar à trilha</Button>
      </div>
      {fraction && <div className="stack compact lesson-next">{complete ? <>
        <p className="notice notice--green">Aula concluída. Você pode revisar o conteúdo quando quiser.</p>
        <p className="small muted">Próxima aula: Porcentagens · 25 minutos. Ela só será aberta quando você escolher.</p>
        <Button href={lessonHref(next)}>Escolher próxima aula</Button>
      </> : <>
        <p className="small muted">Marque a aula como concluída quando terminar. Você escolhe quando avançar.</p>
        <Button onClick={() => { setComplete(true); window.scrollTo(0, 0) }}>Marcar como concluída</Button>
      </>}</div>}
    </div>
  </div>
}

function ReplyForm({ onReply }) {
  const [file, setFile] = useState(null)
  const [sent, setSent] = useState(false)
  return <form className="stack compact reply-form" onSubmit={(event) => {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const body = fields.get('reply').trim()
    if (!body) return
    onReply({ body, attachment: file?.name, description: fields.get('description').trim() })
    event.currentTarget.reset()
    setFile(null)
    setSent(true)
  }}>
    <label>Responder à discussão<textarea name="reply" placeholder="Escreva sua explicação ou continue a conversa..." required /></label>
    <label className="button button--plain file-button">{file?.name || 'Anexar arquivo (opcional)'}<input type="file" accept="image/*" onChange={(event) => setFile(event.target.files[0] ?? null)} /></label>
    <p className="small muted">Se anexar uma imagem, você pode descrevê-la em texto. Também vale escrever toda a dúvida, sem anexos.</p>
    <label>Descrição textual do anexo (opcional)<textarea name="description" placeholder="Conte o que aparece na imagem" /></label>
    <Button type="submit">Enviar resposta</Button>
    {sent && <p role="status" className="notice notice--green">Resposta enviada.</p>}
  </form>
}

function Questions({ posts, ask, report, openForm }) {
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('Todas')
  const [order, setOrder] = useState('recent')
  const [publishing, setPublishing] = useState(openForm)
  const [expanded, setExpanded] = useState({ fracoes: true })
  const [votes, setVotes] = useSaved('votos', {})
  const [replies, setReplies] = useSaved('respostas-comunidade', {})
  const threads = [...posts, ...initialThreads].filter((item) =>
    (subject === 'Todas' || item.subject === subject) &&
    normalize([item.title, item.topic, item.body, item.subject].join(' ')).includes(normalize(query)))
  if (order === 'votes') threads.sort((a, b) => b.votes + Number(!!votes[b.id]) - a.votes - Number(!!votes[a.id]))
  const threadCards = threads.map((thread) => {
    const open = !!expanded[thread.id]
    const threadReplies = replies[thread.id] ?? []
    const count = thread.count + threadReplies.length
    const countText = count + (count === 1 ? ' resposta' : ' respostas')
    const toggle = () => setExpanded({ ...expanded, [thread.id]: !open })
    return <Card key={thread.id}>
      <p className="small topic">{thread.subject} · {thread.topic}</p>
      <p className="small muted">{thread.author}</p>
      <h3>{thread.title}</h3>
      {thread.body && <p className="muted">{thread.body}</p>}
      {thread.attachment && <p className="small muted">{thread.attachment.name} · {thread.attachment.description}</p>}
      <div className="vote-row"><Button plain className="small-button" aria-pressed={!!votes[thread.id]} onClick={() => setVotes({ ...votes, [thread.id]: !votes[thread.id] })}>↑ Útil · {thread.votes + Number(!!votes[thread.id])}</Button><span className="small muted">{countText}</span></div>
      {open && <div className="discussion">
        <strong>{countText} · Discussão aberta</strong>
        {thread.peer && <div className="quote"><p className="small muted">{thread.peer.author}</p><p>{thread.peer.body}</p><p className="small muted">3 votos úteis</p></div>}
      </div>}
      {thread.answer && <div className="teacher"><b>✓ {thread.teacher} · Professora</b><p>{thread.answer}</p></div>}
      {open ? <>
        {thread.id === 'fracoes' && <p className="small muted">Resposta da professora · hoje, 09:32</p>}
        {thread.replies?.map((reply) => <p key={reply} className="quote">{reply}</p>)}
        {threadReplies.map((reply, index) => <div key={index} className="quote"><p className="small muted">Mateus · Aluno</p><p>{reply.body}</p>{reply.attachment && <p className="small muted">{reply.attachment}{reply.description && ' · ' + reply.description}</p>}</div>)}
        <ReplyForm onReply={(reply) => setReplies({ ...replies, [thread.id]: [...threadReplies, reply] })} />
      </> : <Button plain aria-expanded={false} onClick={toggle}>{count ? 'Ver ' + countText + ' e responder' : 'Responder à discussão'}</Button>}
    </Card>
  })
  return <div className="stack page questions">
    <div className="stack questions-heading">
      <div className="page-intro"><h1>Dúvidas</h1><p className="muted">Aprenda em comunidade. Pergunte, compartilhe caminhos e converse com professores.</p></div>
      <Button aria-expanded={publishing} aria-controls="publicar" onClick={() => setPublishing(!publishing)}>Publicar uma dúvida</Button>
    </div>
    <div id="publicar" tabIndex={-1} hidden={!publishing}><QuestionForm onPublish={(title, body, attachment) => ask('Comunidade', title, body, attachment)} /></div>
    <form className="stack compact questions-search" onSubmit={(event) => { event.preventDefault(); setQuery(draft) }}>
      <div className="stack compact question-search-field">
        <h3><label htmlFor="thread-search">Buscar dúvidas</label></h3>
        <div className="stack compact question-search-controls">
          <input id="thread-search" type="search" placeholder="Ex.: equivalência de frações" value={draft} onChange={(event) => setDraft(event.target.value)} />
          <Button plain type="submit">Buscar</Button>
        </div>
      </div>
      <div className="split question-filters">
        <label>Matéria<select value={subject} onChange={(event) => setSubject(event.target.value)}><option>Todas</option>{subjects.map(([name]) => <option key={name}>{name}</option>)}</select></label>
        <label>Ordenar por<select value={order} onChange={(event) => setOrder(event.target.value)}><option value="recent">Mais recentes</option><option value="votes">Mais úteis</option></select></label>
      </div>
    </form>
    <section className="stack compact">
      <div className="stack compact questions-count">
        <h2>Conversas da comunidade</h2>
        <p role="status" className="small muted">{threads.length} {threads.length === 1 ? 'dúvida' : 'dúvidas'} · {subject === 'Todas' ? 'Todas as matérias' : subject}</p>
      </div>
      <p className="small muted">“Útil” é um voto da comunidade. A resposta de professor aparece identificada abaixo.</p>
      <div className="stack questions-layout" style={{ '--discussion-rows': Math.max(1, threadCards.length) }}>
        {threadCards.length ? threadCards : <Card><p>Nenhuma dúvida encontrada.</p><Button plain onClick={() => { setDraft(''); setQuery(''); setSubject('Todas') }}>Limpar filtros</Button></Card>}
        <section className="community"><h3>Este espaço também é seu</h3><p className="muted">Não precisa saber a resposta para participar. Respeite as pessoas e explique seu raciocínio.</p><button type="button" className="link" onClick={report}>Pedir suporte de acessibilidade</button></section>
      </div>
    </section>
  </div>
}

function Progress({ complete }) {
  return <div className="stack page progress-page">
    <h1>Meu progresso</h1>
    <div className="stack progress-overview">
      <Card><h2>Matérias concluídas</h2><p className="percent"><strong>17%</strong><span>1 de 6 matérias concluída</span></p><ProgressBar value={17} label="Matérias concluídas" /></Card>
      <Card><h2>Seu avanço em outubro</h2><p className="muted">Você passou de 2 para {complete ? 9 : 8} assuntos concluídos: mais {complete ? 7 : 6} assuntos neste mês.</p></Card>
    </div>
    <section className="stack compact">
      <h2>Assuntos por matéria</h2>
      <Card className="subjects">{subjects.map(([name, initial]) => {
        const count = initial + Number(name === 'Matemática' && complete)
        return <div key={name}><div className="spread"><h3>{name}</h3><strong>{count * 25}%</strong></div>
          <p className="muted small">{count} de 4 assuntos · {count === 4 ? '✓ Matéria concluída' : count ? 'Em andamento' : 'Não iniciada'}</p>
          <ProgressBar value={count * 25} label={'Progresso em ' + name} /></div>
      })}</Card>
    </section>
    <Card className="progress-next"><h2>Seu próximo passo</h2><h3>Porcentagens</h3><Button href={lessonHref('porcentagens')}>Abrir aula de Porcentagens</Button></Card>
  </div>
}

function Download({ kind, close }) {
  const selected = lessons.find((item) => item.id === kind)
  const fractions = ['Frações no dia a dia', ...fractionNotes, 'Exercício resolvido: 1/2 + 1/4 = 3/4.'].join('\n\n')
  const summary = (item) => [item.title, item.transcript, item.example].join('\n\n')
  const content = kind === 'hoje' ? [summary(lessons[0]), fractions].join('\n\n---\n\n')
    : kind === 'fracoes' ? fractions : summary(selected)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const save = () => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'primeira-chamada-' + kind + '.txt'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    close()
  }
  return <Modal title="Confirmar download" close={close}>
    <p>Material disponível nesta versão: resumo em texto ({(blob.size / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} KB).</p>
    <div className="split"><Button plain onClick={close}>Cancelar</Button><Button onClick={save}>Baixar resumo</Button></div>
  </Modal>
}

function Report({ close }) {
  const [sent, setSent] = useState(false)
  const [reports, setReports] = useSaved('relatos', [])
  return <Modal title="Relatar problema de acessibilidade" close={close}>
    {sent ? <p role="status" className="notice notice--green">Relato registrado neste navegador.</p> :
      <form className="stack compact" onSubmit={(event) => {
        event.preventDefault()
        const report = new FormData(event.currentTarget).get('report').trim()
        if (report) { setReports([...reports, report]); setSent(true) }
      }}>
        <label>Descreva o problema<textarea name="report" required /></label><Button type="submit">Registrar relato</Button>
      </form>}
  </Modal>
}

function App() {
  const [hash, setHash] = useState(window.location.hash)
  const [path, query = ''] = (hash.slice(2) || 'Inicio').split('?')
  const active = nav.some(([id]) => id === path.split('/')[0]) ? path.split('/')[0] : 'Inicio'
  const focus = new URLSearchParams(query).get('foco')
  const lesson = lessons.find((item) => !item.locked && path === 'Estudar/aula/' + item.id)
  const [menu, setMenu] = useState(false)
  const [saving, setSaving] = useState('')
  const [reporting, setReporting] = useState(false)
  const [complete, setComplete] = useSaved('fracoes-concluida', false)
  const [posts, setPosts] = useSaved('duvidas', [])
  useEffect(() => {
    const change = () => setHash(window.location.hash)
    window.addEventListener('hashchange', change)
    return () => window.removeEventListener('hashchange', change)
  }, [])
  useEffect(() => {
    setMenu(false)
    document.title = (lesson?.title ?? nav.find(([id]) => id === active)[1]) + ' | PrimeiraChamada'
    const target = focus && document.getElementById(focus)
    if (target) { target.focus({ preventScroll: true }); target.scrollIntoView() }
    else window.scrollTo(0, 0)
  }, [hash, lesson, active, focus])
  const ask = (topic, title, body, attachment) => setPosts((previous) => [
    { id: crypto.getRandomValues(new Uint32Array(4)).join('-'), subject: 'Matemática', topic, title, body, attachment, author: 'Mateus · Aluno · agora', votes: 0, count: 0 },
    ...previous,
  ])
  const renderNav = (label, className) => <nav aria-label={label} className={className}>{nav.map(([id, text, Icon]) =>
    <a href={route(id)} key={id} onClick={() => setMenu(false)} aria-current={active === id ? 'page' : undefined}><Icon size={20} aria-hidden="true" /><span>{text}</span>{active === id && <span className="current-label">Atual</span>}</a>
  )}</nav>
  return <div className="shell">
    <a className="skip" href="#conteudo" onClick={(event) => { event.preventDefault(); document.getElementById('conteudo').focus() }}>Pular para o conteúdo principal</a>
    <header>
      <div className="header-content">
        <div className="brand"><button type="button" className="icon-button" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={22} /> : <Menu size={22} />}</button><a href={route('Inicio')}>PrimeiraChamada</a></div>
        {renderNav('Navegação principal', 'nav nav-desktop')}
        <span className="muted small">Mateus</span>
      </div>
    </header>
    {menu && renderNav('Menu principal', 'nav menu')}
    <div className="economy"><Leaf size={16} aria-hidden="true" /> Modo economia de dados ativado</div>
    <main id="conteudo" tabIndex={-1}>
      {active === 'Inicio' && <Home complete={complete} download={setSaving} />}
      {active === 'Estudar' && (lesson ? <Lesson key={lesson.id + (focus || '')} lesson={lesson} complete={complete} setComplete={setComplete} ask={ask} download={setSaving} /> : <Trail complete={complete} />)}
      {active === 'Duvidas' && <Questions key={hash} posts={posts} ask={ask} report={() => setReporting(true)} openForm={focus === 'publicar'} />}
      {active === 'Progresso' && <Progress complete={complete} />}
    </main>
    <footer><button type="button" className="link" onClick={() => setReporting(true)}>Relatar problema de acessibilidade</button></footer>
    {renderNav('Navegação principal', 'nav bottom')}
    {saving && <Download kind={saving} close={() => setSaving('')} />}
    {reporting && <Report close={() => setReporting(false)} />}
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
