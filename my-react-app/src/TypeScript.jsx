import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

// App.tsx — Tailwind + TypeScript rewrite
// ----------------------------------------------------
// Предполагается, что Tailwind подключён через src/index.css (@tailwind base/components/utilities)
// и Vite React TS-шаблон. Этот файл можно сохранить как src/App.tsx.

// ===== Utils
const KZT = (n?: number) => new Intl.NumberFormat("ru-KZ", { style: "currency", currency: "KZT", maximumFractionDigits: 0 }).format(n || 0);

// ===== Voice hook (optional demo)
function useVoice() {
  const [isListening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const recRef = useRef<any>(null);
  useEffect(() => {
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "ru-RU";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const text = e.results?.[0]?.[0]?.transcript || "";
      setLastTranscript(text);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
  }, []);
  const start = () => {
    if (recRef.current && !isListening) {
      setListening(true);
      try { recRef.current.start(); } catch { /* noop */ }
    }
  };
  const speak = (text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ru-RU";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch { /* noop */ }
  };
  return { isListening, lastTranscript, start, speak };
}

// ===== Mini UI atoms (Tailwind)
function Button({ children, variant = "primary", className = "", ...props }: { children: any; variant?: "primary" | "outline"; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ease-out active:scale-[.98]";
  const styles = variant === "outline"
    ? "bg-white border border-zinc-200 text-zinc-900 hover:shadow-sm"
    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_6px_18px_rgba(5,150,105,.18)] hover:shadow-[0_10px_26px_rgba(5,150,105,.22)]";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>{children}</button>
  );
}
function Card({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 ${props.className || ""}`} />;
}

// ===== Header
function Header({ name, setName }: { name: string; setName: (v: string) => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 font-bold text-white shadow-md">ZA</div>
          <div className="leading-tight">
            <div className="font-semibold">Zaman AI</div>
            <div className="text-xs text-zinc-500">Голосовой / текстовый ассистент</div>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-xs text-zinc-500">Имя</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Гость" className="h-8 w-36" />
        </div>
      </div>
    </header>
  );
}

// ===== Hero
function Hero({ name }: { name: string }) {
  return (
    <section className="relative overflow-hidden pt-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_500px_at_10%_-10%,rgba(52,211,153,.12),transparent),radial-gradient(1200px_500px_at_90%_-10%,rgba(245,158,11,.12),transparent),radial-gradient(900px_420px_at_50%_120%,rgba(238,254,109,.22),transparent)] animate-[bgFloat_16s_ease-in-out_infinite_alternate]" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Банкинг будущего: говорите — ассистент делает</h1>
            <p className="mt-4 text-lg text-zinc-600">{name ? `${name}, ` : ""}персональные цели, халяль‑продукты, умная экономия и визуализация мечт — на одной странице.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#chat"><Button>Начать диалог</Button></a>
              <a href="#goals"><Button variant="outline">Поставить цель</Button></a>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[{ k: "NPS", v: "+64" }, { k: "~взнос", v: KZT(55000) }, { k: "целей", v: "12" }].map((x) => (
                <Card key={x.k}>
                  <div className="p-3">
                    <div className="text-xs text-zinc-500">{x.k}</div>
                    <div className="text-lg font-semibold">{x.v}</div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Card>
              <div className="p-5">
                <div className="text-base font-semibold">Что умеет ассистент</div>
                <div className="mt-3 space-y-2 text-sm text-zinc-600">
                  <div>• Голос ↔ текст (диктовка и озвучка)</div>
                  <div>• Калькулятор цели: взносы, сроки, автопополнение</div>
                  <div>• Сравнение с анонимными «похожими на меня»</div>
                  <div>• Подбор халяль‑депозитов/кредитов/инвестиций</div>
                  <div>• Анти‑стресс протоколы без расходов</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ===== Chat (demo)
function Chat() {
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; text: string }[]>([
    { role: "assistant", text: "Салам! Я Zaman AI. Поделитесь мечтой: квартира, обучение, путешествие? Помогу посчитать и выбрать халяль‑продукт." },
  ]);
  const { isListening, lastTranscript, start, speak } = useVoice();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (lastTranscript) setInput((v) => (v ? v + " " : "") + lastTranscript); }, [lastTranscript]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const ask = async (text: string) => {
    const t = text.toLowerCase();
    let reply = "";
    if (/(квартир|ипотек|жиль)/.test(t)) reply = "Иджара (лизинг) или Мурабаха для мебели/ремонта. Уточните бюджет и срок — посчитаю график.";
    else if (/(депозит|накоп|сбер)/.test(t)) reply = "Исламский депозит (мудариба): доход зависит от результатов. Поставим цель и автопополнение.";
    else if (/(стресс|тревог|пережив)/.test(t)) reply = "Дыхание 4–4–4, 7‑мин прогулка и стакан воды. Нужна короткая программа?";
    else if (/(путешеств|отдых|trip)/.test(t)) reply = "Создаём цель ‘Путешествие’. Укажите город, дату и бюджет — построю план.";
    else if (/(инвест|акци|фонды)/.test(t)) reply = "Подберу шариат‑совместимые варианты. Скажите горизонт и допустимую просадку.";
    else reply = "Записал. Поставим цель, посчитаем взносы и подберём халяль‑продукт. С чего начнём?";
    return reply;
  };

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    const reply = await ask(text);
    setMessages((m) => [...m, { role: "assistant", text: reply }]);
    speak(reply);
  };

  return (
    <section id="chat" className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold">Ассистент</h3>
        <div className="text-sm text-zinc-500">Демо: локальная логика + точки интеграции</div>
      </div>
      <Card>
        <div className="p-0">
          <div className="h-80 overflow-y-auto bg-gradient-to-b from-white to-emerald-50/40 p-4">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`mb-3 max-w-[80%] rounded-2xl border px-4 py-2 ${m.role === "assistant" ? "border-emerald-200 bg-emerald-50" : "border-zinc-200 bg-zinc-50"}`}>
                <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">{m.role === "assistant" ? "Zaman AI" : "Вы"}</div>
                <div className="whitespace-pre-wrap text-zinc-800">{m.text}</div>
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="flex items-center gap-2 border-t border-zinc-200 p-3">
            <Button variant="outline" onClick={start}>{isListening ? "Слушаю…" : "🎤 Диктовка"}</Button>
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Опишите мечту или вопрос…" />
            <Button onClick={send}>Отправить</Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ===== Goals
function Goals() {
  const [goalName, setName] = useState("Квартира");
  const [target, setTarget] = useState(30_000_000);
  const [deadlineMonths, setMonths] = useState(36);
  const [initial, setInitial] = useState(3_000_000);
  const [rate, setRate] = useState(0.1);
  const monthlyRate = rate / 12;
  const need = Math.max(target - initial, 0);
  const PMT = monthlyRate > 0 ? (need * monthlyRate) / (Math.pow(1 + monthlyRate, deadlineMonths) - 1) : need / deadlineMonths;

  return (
    <section id="goals" className="mx-auto max-w-6xl px-4 py-10">
      <h3 className="mb-4 text-2xl font-bold">Финансовые цели</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="grid gap-5 p-6">
            <div>
              <div className="text-sm text-zinc-700">Название цели</div>
              <Input value={goalName} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <div className="flex items-center justify-between"><div className="text-sm text-zinc-700">Стоимость цели</div><div className="text-sm font-semibold">{KZT(target)}</div></div>
              <input type="range" className="mt-2 w-full accent-emerald-600" min={500_000} max={100_000_000} step={500_000} value={target} onChange={(e) => setTarget(+e.target.value)} />
            </div>
            <div>
              <div className="flex items-center justify-between"><div className="text-sm text-zinc-700">Первоначальный взнос</div><div className="text-sm font-semibold">{KZT(initial)}</div></div>
              <input type="range" className="mt-2 w-full accent-emerald-600" min={0} max={target} step={100_000} value={initial} onChange={(e) => setInitial(+e.target.value)} />
            </div>
            <div>
              <div className="flex items-center justify-between"><div className="text-sm text-zinc-700">Срок (мес.)</div><div className="text-sm font-semibold">{deadlineMonths}</div></div>
              <input type="range" className="mt-2 w-full accent-emerald-600" min={6} max={120} step={1} value={deadlineMonths} onChange={(e) => setMonths(+e.target.value)} />
            </div>
            <div>
              <div className="flex items-center justify-between"><div className="text-sm text-zinc-700">Ожидаемая доходность</div><div className="text-sm font-semibold">{(rate * 100).toFixed(1)}%</div></div>
              <input type="range" className="mt-2 w-full accent-emerald-600" min={0} max={0.2} step={0.005} value={rate} onChange={(e) => setRate(+e.target.value)} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm text-zinc-600">Чтобы достичь цели «{goalName}» за {deadlineMonths} мес., откладывайте примерно:</p>
            <div className="mt-3 text-4xl font-extrabold">{KZT(PMT)}</div>
            <p className="mt-2 text-sm text-zinc-600">При начальном взносе {KZT(initial)} и доходности {(rate * 100).toFixed(1)}% годовых (мудариба).</p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Card><div className="p-3"><div className="text-zinc-500">Нужно накопить</div><div className="font-semibold">{KZT(need)}</div></div></Card>
              <Card><div className="p-3"><div className="text-zinc-500">Ежемесячно</div><div className="font-semibold">{KZT(PMT)}</div></div></Card>
            </div>
            <a href="#products"><Button className="mt-6">Подобрать продукт</Button></a>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ===== Viz
function Viz() {
  const milestones = [
    { y: 2026, name: "Путешествие", cost: 1_500_000 },
    { y: 2027, name: "Обучение", cost: 2_400_000 },
    { y: 2028, name: "Авто (Иджара)", cost: 12_000_000 },
    { y: 2030, name: "Квартира", cost: 45_000_000 },
  ];
  return (
    <section id="viz" className="mx-auto max-w-6xl px-4 py-10">
      <h3 className="mb-4 text-2xl font-bold">Визуализация мечт</h3>
      <Card>
        <div className="grid gap-4 p-6 md:grid-cols-4">
          {milestones.map((m) => (
            <motion.div key={m.y} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
              <Card>
                <div className="p-4">
                  <div className="text-xs text-zinc-500">{m.y}</div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-zinc-600">{KZT(m.cost)}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
      <p className="mt-4 text-sm text-zinc-600">Ассистент распределит взносы по времени и доходу, не нарушая принципы исламского финансирования.</p>
    </section>
  );
}

// ===== Products (demo)
const PRODUCTS = [
  { id: "dep_mudaraba", type: "deposit", name: "Исламский депозит — Мудараба", tags: ["HALAL", "сбережения"], minAmount: 50_000, rate: 0.1, link: "https://www.zamanbank.kz/ru/islamic-finance/islamskie-finansy", blurb: "Совместное участие в прибыли. Доход зависит от результатов инвестиций и распределяется по договору." },
  { id: "credit_murabaha", type: "credit", name: "Покупка товаров — Мурабаха", tags: ["HALAL", "рассрочка"], minAmount: 200_000, rate: 0.0, link: "https://www.zamanbank.kz/ru/islamic-finance/islamskie-finansy", blurb: "Банк покупает товар и перепродаёт клиенту с наценкой, без процентов. Платёж — по графику." },
  { id: "auto_ijara", type: "credit", name: "Авто — Иджара (лизинг)", tags: ["HALAL", "авто"], minAmount: 1_500_000, rate: 0.0, link: "https://www.zamanbank.kz/ru/islamic-finance/islamskie-finansy", blurb: "Аренда с последующим выкупом: владение переходит после закрытия договора." },
  { id: "invest_sharia", type: "invest", name: "Инвестиционный счёт — шариат-комплаенс", tags: ["HALAL", "инвестиции"], minAmount: 100_000, rate: 0.12, link: "https://www.zamanbank.kz/ru/islamic-finance/glossarij", blurb: "Диверсифицированные шариат‑совместимые активы. Доход переменный." },
];
function Products() {
  const [type, setType] = useState<"deposit" | "credit" | "invest">("deposit");
  const [amount, setAmount] = useState(2_000_000);
  const [term, setTerm] = useState(24);
  const filtered = PRODUCTS.filter((p) => p.type === type && amount >= p.minAmount);
  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-10">
      <h3 className="mb-4 text-2xl font-bold">Подбор продуктов</h3>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-5">
          <Card>
            <div className="space-y-4 p-5">
              <div>
                <div className="text-sm text-zinc-700">Тип</div>
                <div className="mt-2 grid grid-cols-3 gap-2 rounded-xl bg-zinc-100 p-1">
                  {(["deposit", "credit", "invest"] as const).map((t) => (
                    <button key={t} onClick={() => setType(t)} className={`rounded-lg border px-3 py-1.5 text-sm transition ${type===t?"border-zinc-300 bg-white shadow":"border-transparent hover:bg-white"}`}>{t==="deposit"?"Депозит":t==="credit"?"Кредит":"Инвестиции"}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between"><div className="text-sm text-zinc-700">Сумма</div><div className="text-sm font-semibold">{KZT(amount)}</div></div>
                <input type="range" className="mt-2 w-full accent-emerald-600" min={50_000} max={60_000_000} step={50_000} value={amount} onChange={(e)=>setAmount(+e.target.value)} />
              </div>
              <div>
                <div className="flex items-center justify-between"><div className="text-sm text-zinc-700">Срок (мес.)</div><div className="text-sm font-semibold">{term}</div></div>
                <input type="range" className="mt-2 w-full accent-emerald-600" min={6} max={84} step={1} value={term} onChange={(e)=>setTerm(+e.target.value)} />
              </div>
            </div>
          </Card>
        </div>
        <div className="md:col-span-2 grid gap-4">
          {filtered.length===0 && (
            <Card><div className="p-6 text-zinc-600">Нет подходящих продуктов для такой суммы. Попробуйте изменить параметры.</div></Card>
          )}
          {filtered.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between gap-6 p-5">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    {p.tags.map((t) => (<span key={t} className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">{t}</span>))}
                  </div>
                  <div className="text-xl font-semibold">{p.name}</div>
                  <p className="mt-1 text-sm text-zinc-600">{p.blurb}</p>
                  <div className="mt-2 text-xs text-zinc-500">Минимальная сумма: {KZT(p.minAmount)} {p.rate ? `· ориентир доходности ${(p.rate * 100).toFixed(0)}%` : ""}</div>
                  <a className="mt-3 inline-block text-emerald-700 underline" href={p.link} target="_blank" rel="noreferrer">Подробнее на сайте Zaman Bank</a>
                </div>
                <div className="min-w-[160px] text-right">
                  <div className="text-xs text-zinc-500">Ваша сумма</div>
                  <div className="text-lg font-semibold">{KZT(amount)}</div>
                  <div className="mt-2 text-xs text-zinc-500">Ориентир срока</div>
                  <div className="text-lg font-semibold">{term} мес.</div>
                  <Button className="mt-4">Оставить заявку</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stress() {
  const tips = [
    { k: "breathe", title: "Дыхание 4–4–4", text: "Вдох 4 сек · пауза 4 · выдох 4. Повторить 5 циклов." },
    { k: "walk", title: "7‑минутная прогулка", text: "Небольшая активность снижает кортизол и улучшает фокус." },
    { k: "water", title: "Стакан воды", text: "Лёгкая гидратация улучшает самочувствие и самоконтроль." },
  ];
  return (
    <section id="stress" className="mx-auto max-w-6xl px-4 py-10">
      <h3 className="mb-4 text-2xl font-bold">Анти‑стресс без покупок</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {tips.map((t) => (
          <Card key={t.k}>
            <div className="p-5">
              <div className="text-base font-semibold">{t.title}</div>
              <div className="text-sm text-zinc-600">{t.text}</div>
            </div>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-500">Ассистент подсказывает практики, когда распознаёт стрессовые паттерны в расходах (например, ночные импульсные покупки).</p>
    </section>
  );
}

function Islamic() {
  return (
    <section id="islamic" className="mx-auto max-w-6xl px-4 py-10">
      <h3 className="mb-4 text-2xl font-bold">Исламское финансирование</h3>
      <Card>
        <div className="space-y-3 p-6 text-sm text-zinc-700">
          <div><span className="font-semibold">Принципы:</span> запрет риба (процент), запрет гарар (чрезмерная неопределённость), запрет мейсир (азарт). Основа — торговля реальными активами и разделение прибыли/убытков.</div>
          <div><span className="font-semibold">Термины:</span> Мудараба (совместная прибыль), Мурабаха (товар + наценка), Иджара (лизинг/аренда с выкупом).</div>
          <div className="text-xs">Источники: страницы Zaman Bank по исламскому финансированию и глоссарию.</div>
        </div>
      </Card>
    </section>
  );
}

export default function App() {
  const [name, setName] = useState("Гость");
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header name={name} setName={setName} />
      <Hero name={name} />
      <main>
        <Chat />
        <Goals />
        <Viz />
        <Products />
        <Stress />
        <Islamic />
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-10 text-xs text-zinc-500">© 2025 Zaman AI HackNU Prototype · Демо‑интерфейс (голос/текст) · Не является публичной офертой.</footer>
    </div>
  );
}

// Tailwind keyframes (inline via arbitrary utility class above):
// Add this to src/index.css for global reusable version:
// @keyframes bgFloat { 0%{transform:translateY(0)} 50%{transform:translateY(14px)} 100%{transform:translateY(28px)} }
