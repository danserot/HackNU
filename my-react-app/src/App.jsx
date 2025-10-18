import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { motion } from "framer-motion";
import "./index.css"; // <-- plain CSS (no Tailwind)

// ===== Lightweight UI kit (no external deps) =====
const cx = (...cls) => cls.filter(Boolean).join(" ");
export const Button = ({ className = "", variant = "solid", ...props }) => (
  <button
    className={cx("btn", variant === "outline" && "btn--outline", className)}
    {...props}
  />
);
export const Card = ({ className = "", ...props }) => (
  <div className={cx("card", className)} {...props} />
);
export const CardHeader = ({ className = "", ...props }) => (
  <div className={cx("card__header", className)} {...props} />
);
export const CardTitle = ({ className = "", ...props }) => (
  <h4 className={cx("card__title", className)} {...props} />
);
export const CardContent = ({ className = "", ...props }) => (
  <div className={cx("card__content", className)} {...props} />
);
export const Input = ({ className = "", ...props }) => (
  <input className={cx("input", className)} {...props} />
);
export const Label = ({ className = "", ...props }) => (
  <label className={cx("label", className)} {...props} />
);
export const Badge = ({ className = "", ...props }) => (
  <span className={cx("badge", className)} {...props} />
);
export const Slider = ({
  value = [0],
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
}) => (
  <input
    type="range"
    value={value[0]}
    min={min}
    max={max}
    step={step}
    onChange={(e) => onValueChange([+e.target.value])}
    className="range"
  />
);
export const Switch = ({ checked, onCheckedChange }) => (
  <label className="switch">
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
    />
    <span className="switch__slider" />
  </label>
);
const TabsCtx = createContext({ value: "", setValue: (v) => {} });
export const Tabs = ({ value, onValueChange, children, className = "" }) => (
  <div className={cx("tabs", className)}>
    <TabsCtx.Provider value={{ value, setValue: onValueChange }}>
      {children}
    </TabsCtx.Provider>
  </div>
);
export const TabsList = ({ className = "", children }) => (
  <div className={cx("tabs__list", className)}>{children}</div>
);
export const TabsTrigger = ({ value, children }) => {
  const { value: v, setValue } = useContext(TabsCtx);
  const active = v === value;
  return (
    <button
      onClick={() => setValue?.(value)}
      className={cx("tabs__trigger", active && "is-active")}>
      {children}
    </button>
  );
};

// ===================== UTILITIES =====================
const KZT = (n) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n || 0);
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

// ===================== MOCK DATA =====================
const PRODUCTS = [
  {
    id: "dep_mudaraba",
    type: "deposit",
    name: "Исламский депозит — Мудараба",
    tags: ["HALAL", "сбережения"],
    minAmount: 50000,
    rate: 0.1,
    link: "https://www.zamanbank.kz/ru/islamic-finance/islamskie-finansy",
    blurb:
      "Совместное участие в прибыли. Доход зависит от результатов инвестиций и распределяется по договору.",
  },
  {
    id: "credit_murabaha",
    type: "credit",
    name: "Покупка товаров — Мурабаха",
    tags: ["HALAL", "рассрочка"],
    minAmount: 200000,
    rate: 0.0,
    link: "https://www.zamanbank.kz/ru/islamic-finance/islamskie-finansy",
    blurb:
      "Банк покупает товар и перепродаёт клиенту с наценкой, без процентов. Платёж — по графику.",
  },
  {
    id: "auto_ijara",
    type: "credit",
    name: "Авто — Иджара (лизинг)",
    tags: ["HALAL", "авто"],
    minAmount: 1500000,
    rate: 0.0,
    link: "https://www.zamanbank.kz/ru/islamic-finance/islamskie-finansy",
    blurb:
      "Аренда с последующим выкупом: владение переходит после закрытия договора.",
  },
  {
    id: "invest_sharia",
    type: "invest",
    name: "Инвестиционный счёт — шариат-комплаенс",
    tags: ["HALAL", "инвестиции"],
    minAmount: 100000,
    rate: 0.12,
    link: "https://www.zamanbank.kz/ru/islamic-finance/glossarij",
    blurb: "Диверсифицированные шариат‑совместимые активы. Доход переменный.",
  },
];

// ===================== VOICE HOOK =====================
function useVoice() {
  const [isListening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const recRef = useRef(null);
  useEffect(() => {
    const W = window;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "ru-RU";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
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
      try {
        recRef.current.start();
      } catch (_) {}
    }
  };
  const speak = (text) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ru-RU";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (_) {}
  };
  return { isListening, lastTranscript, start, speak };
}

// ===================== SIMPLE BRAIN (stub) =====================
function useBrain() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Салам! Я Zaman AI. Поделитесь мечтой: квартира, обучение, путешествие? Помогу посчитать и выбрать халяль‑продукт.",
    },
  ]);
  const append = (role, text) => setMessages((m) => [...m, { role, text }]);
  const ask = async (text) => {
    append("user", text);
    const t = text.toLowerCase();
    let reply = "";
    if (/(квартир|ипотек|жиль)/.test(t))
      reply =
        "Для квартиры подойдёт Иджара (лизинг) либо Мурабаха для мебели/ремонта. Уточните бюджет и срок — посчитаю график платежей.";
    else if (/(депозит|накоп|сбер)/.test(t))
      reply =
        "Рассмотрите исламский депозит (мудариба): доход зависит от результатов. Можем зафиксировать цель и автопополнение.";
    else if (/(стресс|тревог|пережив)/.test(t))
      reply =
        "Подышим 4–4–4, 7‑минутная прогулка и стакан воды. Покупки не лечат стресс, привычки — да. Нужна короткая программа?";
    else if (/(путешеств|отдых|trip)/.test(t))
      reply =
        "Окей! Создадим цель ‘Путешествие’. Укажите город, дату и бюджет — построю план и автопополнение.";
    else if (/(инвест|акци|фонды)/.test(t))
      reply =
        "Подберу шариат‑совместимые варианты. Скажите горизонт и допустимую просадку — соберу портфель.";
    else
      reply =
        "Записал. Можем поставить цель, посчитать взносы, сравнить с анонимным профилем и подобрать халяль‑продукт. С чего начнём?";
    append("assistant", reply);
    return reply;
  };
  return { messages, ask };
}

// ===================== UI SECTIONS =====================
function GlassHeader({ name, setName }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__brand">
          <div className="logo">ZA</div>
          <div className="brand__text">
            <div className="brand__title">Zaman AI</div>
            <div className="brand__subtitle">
              Голосовой / текстовый ассистент
            </div>
          </div>
        </div>
        <div className="header__controls">
          <Label className="label label--muted">Имя</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input--sm w-36"
            placeholder="Гость"
          />
        </div>
      </div>
    </header>
  );
}
// Hero section
function Hero({ name }) {
  return (
    <section className="section hero">
      <div className="hero__bg" />
      <div className="container">
        <div className="grid-2 hero__grid">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <h1 className="h1">
              Банкинг будущего: говорите — ассистент делает
            </h1>
            <p className="lead">
              {name ? `${name}, ` : ""}персональные цели, халяль‑продукты, умная
              экономия и визуализация мечт — на одной странице.
            </p>
            <div className="row gap-sm">
              <a href="#chat">
                <Button>Начать диалог</Button>
              </a>
              <a href="#goals">
                <Button variant="outline">Поставить цель</Button>
              </a>
            </div>
            <div className="stats">
              {[
                { k: "NPS", v: "+64" },
                { k: "~взнос", v: KZT(55000) },
                { k: "целей", v: "12" },
              ].map((x) => (
                <Card key={x.k} className="card card--pill">
                  <CardContent className="p-3">
                    <div className="muted text-xs">{x.k}</div>
                    <div className="text-lg strong">{x.v}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            <Card className="card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Что умеет ассистент</CardTitle>
              </CardHeader>
              <CardContent className="text-sm muted space-y-2">
                <div>• Голос ↔ текст (диктовка и озвучка)</div>
                <div>• Калькулятор цели: взносы, сроки, автопополнение</div>
                <div>• Сравнение с анонимными «похожими на меня»</div>
                <div>• Подбор халяль‑депозитов/кредитов/инвестиций</div>
                <div>• Анти‑стресс протоколы без расходов</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

 // Chat section , the most important here!!!


function Chat() {
  const { messages, ask } = useBrain();
  const { isListening, lastTranscript, start, speak } = useVoice();
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => {
    if (lastTranscript) setInput((v) => (v ? v + " " : "") + lastTranscript);
  }, [lastTranscript]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const send = async () => {
    if (!input.trim()) return;
    const reply = await ask(input.trim());
    setInput("");
    speak(reply);
  };

  return (
    <section id="chat" className="section">
      <div className="container">
        <div className="row between mb-4">
          <h3 className="h3">Ассистент</h3>
          <div className="muted text-sm">
            Демо: локальная логика + точки интеграции с LLM
          </div>
        </div>
        <Card className="card card--overflow">
          <CardContent className="p-0">
            <div className="chat">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cx(
                    "bubble",
                    m.role === "assistant" ? "bubble--ai" : "bubble--me"
                  )}>
                  <div className="bubble__who">
                    {m.role === "assistant" ? "Zaman AI" : "Вы"}
                  </div>
                  <div className="bubble__text">{m.text}</div>
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="divider" />
            <div className="row gap-sm p-3">
              <Button variant="outline" onClick={start}>
                {isListening ? "Слушаю…" : "🎤 Диктовка"}
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Опишите мечту или вопрос…"
                className="flex-1"
              />
              <Button onClick={send}>Отправить</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
 // Financial goals section
function Goals() {
  const [goalName, setName] = useState("Квартира");
  const [target, setTarget] = useState(30000000);
  const [deadlineMonths, setMonths] = useState(36);
  const [initial, setInitial] = useState(3000000);
  const [rate, setRate] = useState(0.1);
  const monthlyRate = rate / 12;
  const need = Math.max(target - initial, 0);
  const PMT =
    monthlyRate > 0
      ? (need * monthlyRate) / (Math.pow(1 + monthlyRate, deadlineMonths) - 1)
      : need / deadlineMonths;
  return (
    <section id="goals" className="section">
      <div className="container">
        <h3 className="h3 mb-4">Финансовые цели</h3>
        <div className="grid-2 gap-6">
          <Card>
            <CardContent className="grid gap-5 p-6">
              <div>
                <Label>Название цели</Label>
                <Input
                  value={goalName}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <div className="row between">
                  <Label>Стоимость цели</Label>
                  <div className="strong text-sm">{KZT(target)}</div>
                </div>
                <Slider
                  value={[target]}
                  min={500000}
                  max={100000000}
                  step={500000}
                  onValueChange={(v) => setTarget(v[0])}
                />
              </div>
              <div>
                <div className="row between">
                  <Label>Первоначальный взнос</Label>
                  <div className="strong text-sm">{KZT(initial)}</div>
                </div>
                <Slider
                  value={[initial]}
                  min={0}
                  max={target}
                  step={100000}
                  onValueChange={(v) => setInitial(v[0])}
                />
              </div>
              <div>
                <div className="row between">
                  <Label>Срок (мес.)</Label>
                  <div className="strong text-sm">{deadlineMonths}</div>
                </div>
                <Slider
                  value={[deadlineMonths]}
                  min={6}
                  max={120}
                  step={1}
                  onValueChange={(v) => setMonths(v[0])}
                />
              </div>
              <div>
                <div className="row between">
                  <Label>Ожидаемая доходность</Label>
                  <div className="strong text-sm">
                    {(rate * 100).toFixed(1)}%
                  </div>
                </div>
                <Slider
                  value={[rate]}
                  min={0}
                  max={0.2}
                  step={0.005}
                  onValueChange={(v) => setRate(v[0])}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>План взносов</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="muted text-sm">
                Чтобы достичь цели «{goalName}» за {deadlineMonths} мес.,
                откладывайте примерно:
              </p>
              <div className="title-xl mt-3">{KZT(PMT)}</div>
              <p className="muted text-sm mt-2">
                При начальном взносе {KZT(initial)} и доходности{" "}
                {(rate * 100).toFixed(1)}% годовых (мудариба).
              </p>
              <div className="grid-2 gap-3 mt-6 text-sm">
                <Card className="card card--pill">
                  <CardContent className="p-3">
                    <div className="muted">Нужно накопить</div>
                    <div className="strong">{KZT(need)}</div>
                  </CardContent>
                </Card>
                <Card className="card card--pill">
                  <CardContent className="p-3">
                    <div className="muted">Ежемесячно</div>
                    <div className="strong">{KZT(PMT)}</div>
                  </CardContent>
                </Card>
              </div>
              <a href="#products">
                <Button className="mt-6">Подобрать продукт</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
 //   Peer comparison section
function PeerCompare() {
  const my = { food: 28, mobility: 15, leisure: 12, bills: 25, other: 20 };
  const peers = { food: 22, mobility: 12, leisure: 10, bills: 26, other: 30 };
  const cats = [
    { k: "food", name: "Еда" },
    { k: "mobility", name: "Транспорт" },
    { k: "leisure", name: "Досуг" },
    { k: "bills", name: "Счета" },
    { k: "other", name: "Другое" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Вы vs похожие клиенты</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="peer grid-5 gap-3 text-sm">
          {cats.map((c) => (
            <div key={c.k} className="text-center">
              <div className="peer__bar">
                <div className="peer__me" style={{ height: `${my[c.k]}%` }} />
                <div
                  className="peer__avg"
                  style={{ height: `${peers[c.k]}%` }}
                />
              </div>
              <div className="font-medium mt-2">{c.name}</div>
              <div className="muted text-xs">
                Вы {my[c.k]}% / Профиль {peers[c.k]}%
              </div>
            </div>
          ))}
        </div>
        <p className="muted text-xs mt-3">
          Серый — профиль, зелёный — вы (анонимно, по категориям трат).
        </p>
      </CardContent>
    </Card>
  );
}
//  Visualization section
function Viz() {
  const milestones = [
    { y: 2026, name: "Путешествие", cost: 1500000 },
    { y: 2027, name: "Обучение", cost: 2400000 },
    { y: 2028, name: "Авто (Иджара)", cost: 12000000 },
    { y: 2030, name: "Квартира", cost: 45000000 },
  ];
  return (
    <section id="viz" className="section">
      <div className="container">
        <h3 className="h3 mb-4">Визуализация мечт</h3>
        <Card>
          <CardContent className="p-6">
            <div className="grid-4 gap-4">
              {milestones.map((m) => (
                <motion.div
                  key={m.y}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}>
                  <Card className="card card--pill">
                    <CardContent className="p-4">
                      <div className="muted text-xs">{m.y}</div>
                      <div className="strong">{m.name}</div>
                      <div className="muted">{KZT(m.cost)}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
        <p className="muted text-sm mt-4">
          Ассистент распределит взносы по времени и доходу, не нарушая принципы
          исламского финансирования.
        </p>
      </div>
    </section>
  );
}
// Product selection section
function Products() {
  const [type, setType] = useState("deposit");
  const [amount, setAmount] = useState(2000000);
  const [term, setTerm] = useState(24);
  const filtered = PRODUCTS.filter(
    (p) => p.type === type && amount >= p.minAmount
  );
  return (
    <section id="products" className="section">
      <div className="container">
        <h3 className="h3 mb-4">Подбор продуктов</h3>
        <div className="grid-3 gap-6">
          <div className="col">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <Label>Тип</Label>
                  <Tabs
                    value={type}
                    onValueChange={(v) => setType(v)}
                    className="mt-2">
                    <TabsList className="tabs__list grid-3">
                      <TabsTrigger value="deposit">Депозит</TabsTrigger>
                      <TabsTrigger value="credit">Кредит</TabsTrigger>
                      <TabsTrigger value="invest">Инвестиции</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div>
                  <div className="row between">
                    <Label>Сумма</Label>
                    <div className="strong text-sm">{KZT(amount)}</div>
                  </div>
                  <Slider
                    value={[amount]}
                    min={50000}
                    max={60000000}
                    step={50000}
                    onValueChange={(v) => setAmount(v[0])}
                  />
                </div>
                <div>
                  <div className="row between">
                    <Label>Срок (мес.)</Label>
                    <div className="strong text-sm">{term}</div>
                  </div>
                  <Slider
                    value={[term]}
                    min={6}
                    max={84}
                    step={1}
                    onValueChange={(v) => setTerm(v[0])}
                  />
                </div>
              </CardContent>
            </Card>
            <PeerCompare />
          </div>

          <div className="col col-span-2 grid gap-4">
            {filtered.length === 0 && (
              <Card className="card card--dashed">
                <CardContent className="p-6 muted">
                  Нет подходящих продуктов для такой суммы. Попробуйте изменить
                  параметры.
                </CardContent>
              </Card>
            )}
            {filtered.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-5 row between gap-6 items-start">
                  <div>
                    <div className="row gap-sm mb-1">
                      {p.tags.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                    <div className="text-xl strong">{p.name}</div>
                    <p className="muted text-sm mt-1">{p.blurb}</p>
                    <div className="muted text-xs mt-2">
                      Минимальная сумма: {KZT(p.minAmount)}{" "}
                      {p.rate
                        ? `· ориентир доходности ${(p.rate * 100).toFixed(0)}%`
                        : ""}
                    </div>
                    <a
                      className="link mt-3"
                      href={p.link}
                      target="_blank"
                      rel="noreferrer">
                      Подробнее на сайте Zaman Bank
                    </a>
                  </div>
                  <div className="text-right minw-160">
                    <div className="muted text-xs">Ваша сумма</div>
                    <div className="strong text-lg">{KZT(amount)}</div>
                    <div className="muted text-xs mt-2">Ориентир срока</div>
                    <div className="strong text-lg">{term} мес.</div>
                    <Button className="mt-4">Оставить заявку</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
// Anti-stress section
function Stress() {
  const tips = [
    {
      k: "breathe",
      title: "Дыхание 4–4–4",
      text: "Вдох 4 сек · пауза 4 · выдох 4. Повторить 5 циклов.",
    },
    {
      k: "walk",
      title: "7‑минутная прогулка",
      text: "Небольшая активность снижает кортизол и улучшает фокус.",
    },
    {
      k: "water",
      title: "Стакан воды",
      text: "Лёгкая гидратация улучшает самочувствие и самоконтроль.",
    },
  ];
  return (
    <section id="stress" className="section">
      <div className="container">
        <h3 className="h3 mb-4">Анти‑стресс без покупок</h3>
        <div className="grid-3 gap-4">
          {tips.map((t) => (
            <Card key={t.k} className="card card--pill">
              <CardHeader>
                <CardTitle className="text-base">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="muted text-sm">{t.text}</CardContent>
            </Card>
          ))}
        </div>
        <p className="muted text-xs mt-3">
          Ассистент подсказывает практики, когда распознаёт стрессовые паттерны
          в расходах (например, ночные импульсные покупки).
        </p>
      </div>
    </section>
  );
}
//  Islamic finance section
function Islamic() {
  return (
    <section id="islamic" className="section">
      <div className="container">
        <h3 className="h3 mb-4">Исламское финансирование</h3>
        <Card>
          <CardContent className="p-6 space-y-3 muted text-sm">
            <div>
              <span className="strong">Принципы:</span> запрет риба (процент),
              запрет гарар (чрезмерная неопределённость), запрет мейсир (азарт).
              Основа — торговля реальными активами и разделение прибыли/убытков.
            </div>
            <div>
              <span className="strong">Термины:</span> Мудараба (совместная
              прибыль), Мурабаха (товар + наценка), Иджара (лизинг/аренда с
              выкупом).
            </div>
            <div className="text-xs">
              Источники: страницы Zaman Bank по исламскому финансированию и
              глоссарию (ссылки ведут на официальный сайт).
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ===================== ROOT =====================
export default function App() {
  const [name, setName] = useState("Гость");
  return (
    <div className="app">
      <GlassHeader name={name} setName={setName} />
      <Hero name={name} />
      <main>
        <Chat />
        <Goals />
        <Viz />
        <Products />
        <Stress />
        <Islamic />
      </main>
      <footer className="footer container">
        © 2025 Zaman AI HackNU Prototype · Демо‑интерфейс (голос/текст) · Не
        является публичной офертой.
      </footer>
    </div>
  );
}
