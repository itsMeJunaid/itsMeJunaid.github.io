/* =========================================================
   chatbot.js — Terminal-style RAG assistant
   Pure retrieval (TF-IDF + cosine similarity). No LLM.
   Knowledge base built from Muhammad Junaid's portfolio.
   ========================================================= */

(function () {
    'use strict';

    /* ------------------------------------------------------------
       1. KNOWLEDGE BASE
       Each entry is one retrievable "document". keywords are
       heavily weighted synonyms to improve recall.
    ------------------------------------------------------------ */
    const KB = [
        {
            id: 'identity',
            keywords: ['who', 'name', 'you', 'yourself', 'junaid', 'muhammad', 'introduce', 'about', 'bio'],
            text: `I'm Muhammad Junaid — an AI & Machine Learning Engineer with 2+ years building intelligent systems. I specialise in Deep Learning, Computer Vision, NLP and Chatbot development, and I love turning hard problems into working models.`
        },
        {
            id: 'role-current',
            keywords: ['job', 'work', 'role', 'company', 'current', 'xact', 'mind', 'employer', 'position'],
            text: `Currently working as an AI & ML Engineer at Xact Mind Pvt Ltd. (2024 – present). I build ML & deep-learning models, AI-driven automation, and focus on model optimisation, predictive analytics and ethical AI.`
        },
        {
            id: 'role-past',
            keywords: ['past', 'previous', 'experience', 'history', 'freelance', 'analyst', 'self', 'employed', 'research'],
            text: `Before Xact Mind I worked as a self-employed Data Analyst (2021–2023) turning raw data into insights with visualisation, analytics and predictive modelling, and as an AI Research Assistant (2022–2024) researching reinforcement-learning algorithms for robotics — co-authoring two papers.`
        },
        {
            id: 'education',
            keywords: ['education', 'degree', 'university', 'school', 'college', 'study', 'student', 'bs', 'bachelor', 'software', 'engineering', 'kotli'],
            text: `Pursuing a B.S. in Software Engineering at the University of Kotli AJ&K with an AI specialisation. Thesis topic: "Novel Approaches to Transfer Learning in Computer Vision."`
        },
        {
            id: 'location',
            keywords: ['location', 'where', 'based', 'live', 'city', 'country', 'pakistan', 'kashmir', 'kotli', 'remote'],
            text: `Based in Kotli, Azad Jammu & Kashmir, Pakistan — open to remote collaborations worldwide.`
        },
        {
            id: 'contact',
            keywords: ['contact', 'email', 'phone', 'reach', 'message', 'hire', 'mail', 'call', 'number'],
            text: `You can reach me at:
  ▸ email : <a href="mailto:itxjunaid22@gmail.com">itxjunaid22@gmail.com</a>
  ▸ phone : <a href="tel:+923418914317">+92 341-8914317</a>
  ▸ page  : <a href="contact.html">/contact</a>`
        },
        {
            id: 'socials',
            keywords: ['social', 'linkedin', 'github', 'twitter', 'x', 'medium', 'links', 'profile', 'handles'],
            text: `Find me online:
  ▸ linkedin : <a href="https://www.linkedin.com/in/mrzikomo/" target="_blank">linkedin.com/in/mrzikomo</a>
  ▸ github   : <a href="https://github.com/itsMeJunaid" target="_blank">github.com/itsMeJunaid</a>
  ▸ twitter  : <a href="https://x.com/itsJunaid__" target="_blank">x.com/itsJunaid__</a>
  ▸ medium   : <a href="https://medium.com/@aishortspot" target="_blank">medium.com/@aishortspot</a>`
        },
        {
            id: 'skills-lang',
            keywords: ['language', 'languages', 'programming', 'code', 'python', 'javascript', 'js', 'dart', 'flutter', 'sql', 'r', 'cpp', 'c++'],
            text: `Programming languages — Python (94%), JavaScript (75%), Flutter/Dart (65%), plus R, SQL and C++ for specific projects.`
        },
        {
            id: 'skills-ml',
            keywords: ['ml', 'machine', 'learning', 'framework', 'tensorflow', 'pytorch', 'sklearn', 'scikit', 'keras', 'libraries', 'stack'],
            text: `ML frameworks — TensorFlow (88%), PyTorch (82%), Scikit-learn (90%), Keras, plus Pandas, NumPy, XGBoost for data/modelling.`
        },
        {
            id: 'skills-cv',
            keywords: ['vision', 'cv', 'image', 'opencv', 'yolo', 'unet', 'detection', 'segmentation', 'recognition', 'camera'],
            text: `Computer Vision (85%) — OpenCV, YOLO object-detection, U-Net segmentation, face recognition, pose estimation, medical imaging.`
        },
        {
            id: 'skills-nlp',
            keywords: ['nlp', 'language', 'bert', 'transformer', 'chatbot', 'text', 'sentiment', 'classification', 'embedding'],
            text: `NLP & Chatbots (80%) — BERT, Transformer models, sentiment analysis, text classification, language generation, chatbot development.`
        },
        {
            id: 'skills-rl',
            keywords: ['reinforcement', 'rl', 'agent', 'policy', 'robotics', 'environment', 'reward'],
            text: `Reinforcement Learning (75%) — agent-based learning, policy optimisation and applications to robotics navigation.`
        },
        {
            id: 'skills-ds',
            keywords: ['data', 'science', 'analysis', 'statistics', 'visualization', 'visualisation', 'pandas', 'numpy', 'insights'],
            text: `Data Science — Pandas, NumPy, Scikit-learn, visualisation and statistical analysis to extract insights from messy datasets.`
        },
        {
            id: 'skills-cloud',
            keywords: ['cloud', 'deploy', 'docker', 'colab', 'google', 'gcp', 'hugging', 'face', 'devops', 'anaconda'],
            text: `Cloud & DevOps — Google Colab, Google Cloud, Docker, Anaconda and Hugging Face for model hosting and deployment.`
        },
        {
            id: 'project-object-detection',
            keywords: ['project', 'object', 'detection', 'yolo', 'cnn', 'recognition', 'realtime'],
            text: `Project — Advanced Object Detection: real-time object recognition with deep CNNs using PyTorch, OpenCV and YOLO.`
        },
        {
            id: 'project-sentiment',
            keywords: ['project', 'sentiment', 'analysis', 'bert', 'emotion', 'nlp', 'tensorflow'],
            text: `Project — Sentiment Analysis Platform: emotion detection & sentiment classification with transformer models (BERT, TensorFlow, spaCy).`
        },
        {
            id: 'project-predictive',
            keywords: ['project', 'predictive', 'analytics', 'forecast', 'business', 'xgboost', 'trend'],
            text: `Project — Predictive Analytics Engine: ML models for business forecasting and trend prediction (Scikit-learn, Pandas, XGBoost).`
        },
        {
            id: 'project-nst',
            keywords: ['project', 'style', 'transfer', 'gan', 'generative', 'art', 'neural'],
            text: `Project — Neural Style Transfer: artistic image transformation using generative adversarial networks (TensorFlow, GANs, Keras).`
        },
        {
            id: 'project-medical',
            keywords: ['project', 'medical', 'segmentation', 'tumor', 'unet', 'u-net', 'health', 'imaging'],
            text: `Project — Medical Image Segmentation: automated tumour detection & boundary segmentation (U-Net, PyTorch, OpenCV).`
        },
        {
            id: 'services',
            keywords: ['service', 'services', 'offer', 'help', 'do', 'what', 'capabilities'],
            text: `Services I offer: custom AI/ML algorithm development, computer-vision solutions, NLP/chatbot systems, data analysis and ML model deployment — each project tailored to the client's needs.`
        },
        {
            id: 'process',
            keywords: ['process', 'collaboration', 'work', 'together', 'how', 'workflow', 'iterate'],
            text: `Workflow: initial consultation → proposal with scope/timeline/cost → iterative delivery with regular check-ins → maintenance & support post-launch.`
        },
        {
            id: 'industries',
            keywords: ['industry', 'industries', 'sector', 'healthcare', 'finance', 'retail', 'manufacturing', 'tech'],
            text: `Industries I've worked with: healthcare, finance, retail, manufacturing and technology — each brings its own AI/ML problem space.`
        },
        {
            id: 'hobbies',
            keywords: ['hobby', 'hobbies', 'interest', 'interests', 'fun', 'reading', 'hiking', 'chess', 'crypto', 'trading', 'personal'],
            text: `Off the keyboard: reading AI-ethics & sci-fi, hiking, chess, and analysing crypto markets with data-driven strategies.`
        },
        {
            id: 'resume',
            keywords: ['resume', 'cv', 'download', 'pdf'],
            text: `Grab my resume here → <a href="resume.pdf" target="_blank">resume.pdf</a>`
        },
        {
            id: 'availability',
            keywords: ['available', 'availability', 'hire', 'freelance', 'work', 'open', 'remote'],
            text: `Yes — I'm available for freelance / contract AI-ML engagements and open to remote work worldwide. Drop a message on the <a href="contact.html">contact page</a>.`
        }
    ];

    /* ------------------------------------------------------------
       2. RAG ENGINE — TF-IDF + cosine similarity
    ------------------------------------------------------------ */
    const STOP = new Set(('a an the and or but of to in on at for with by is are was were be been being ' +
        'i you he she it we they me my your our their this that these those do does did have has had ' +
        'can could would should will shall may might must what which who whom whose when where why how ' +
        'yes no if then than so as about into onto from up down off over under again').split(' '));

    function tokenize(text) {
        return (text || '').toLowerCase()
            .replace(/[^a-z0-9\s+#.]/g, ' ')
            .split(/\s+/)
            .filter(t => t && !STOP.has(t));
    }

    // Build term frequency for each doc + document frequency for IDF
    const docTerms = KB.map(d => {
        const tokens = tokenize(d.text + ' ' + d.keywords.join(' '));
        // Boost keyword tokens (repeat them) so intent words win ties
        const boost  = d.keywords.flatMap(k => tokenize(k));
        return tokens.concat(boost, boost);
    });

    const df = {};
    docTerms.forEach(tokens => {
        new Set(tokens).forEach(t => { df[t] = (df[t] || 0) + 1; });
    });

    const N = KB.length;
    function idf(term) {
        return Math.log((N + 1) / ((df[term] || 0) + 1)) + 1;
    }

    function vectorize(tokens) {
        const tf = {};
        tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
        const v = {};
        Object.keys(tf).forEach(t => { v[t] = tf[t] * idf(t); });
        return v;
    }

    const docVectors = docTerms.map(vectorize);

    function cosine(a, b) {
        let dot = 0, na = 0, nb = 0;
        Object.keys(a).forEach(k => { na += a[k] * a[k]; if (b[k]) dot += a[k] * b[k]; });
        Object.keys(b).forEach(k => { nb += b[k] * b[k]; });
        if (!na || !nb) return 0;
        return dot / (Math.sqrt(na) * Math.sqrt(nb));
    }

    function retrieve(query) {
        const qTokens = tokenize(query);
        if (!qTokens.length) return null;
        const qVec = vectorize(qTokens);
        let bestIdx = -1, bestScore = 0;
        docVectors.forEach((dv, i) => {
            const s = cosine(qVec, dv);
            if (s > bestScore) { bestScore = s; bestIdx = i; }
        });
        if (bestIdx < 0 || bestScore < 0.08) return null; // threshold
        return { doc: KB[bestIdx], score: bestScore };
    }

    /* ------------------------------------------------------------
       2b. SMALLTALK — match before retrieval so "hi" doesn't fall
       through to the cosine-similarity fallback.
    ------------------------------------------------------------ */
    const SMALLTALK = [
        { match: /^(hi|hello|hey|yo|howdy|sup|hola|salam|salaam|assalam)[!.?\s]*$/i,
          reply: `Hey! I'm Junaid's terminal assistant. Ask me anything about his skills, projects, experience or how to hire him — or type <b>help</b> for the full command list.` },
        { match: /^(how are you|how r u|hru)[!.?\s]*$/i,
          reply: `Running smooth at 100% retrieval accuracy. What would you like to know about Junaid?` },
        { match: /^(thanks|thank you|thx|ty|thankyou)[!.?\s]*$/i,
          reply: `Anytime. Type <b>contact</b> if you want to reach out directly.` },
        { match: /^(bye|goodbye|cya|later|see you)[!.?\s]*$/i,
          reply: `Catch you later — don't forget to check out the <a href="#projects">projects</a> section.` },
        { match: /^(ok|okay|cool|nice|awesome|great|good)[!.?\s]*$/i,
          reply: `👍 Anything else? Try <b>skills</b>, <b>projects</b>, or <b>contact</b>.` },
        { match: /^(what can you do|what do you do|capabilities)[!.?\s]*$/i,
          reply: `I retrieve info about Muhammad Junaid from a local knowledge base — skills, projects, experience, contact, resume and more. Type <b>help</b> to see all commands.` }
    ];

    function smalltalk(q) {
        const s = q.trim();
        for (const item of SMALLTALK) if (item.match.test(s)) return item.reply;
        return null;
    }

    /* ------------------------------------------------------------
       3. BUILT-IN COMMANDS
    ------------------------------------------------------------ */
    const COMMANDS = {
        help: () => `Available commands:
  help       — show this menu
  whoami     — introduce Junaid
  skills     — list technical skills
  projects   — list featured projects
  contact    — how to reach out
  socials    — online profiles
  resume     — download resume
  clear      — clear the screen
Or just ask anything, e.g. "what frameworks do you use?"`,
        whoami:   () => KB.find(d => d.id === 'identity').text,
        skills:   () => [KB.find(d => d.id === 'skills-lang').text,
                         KB.find(d => d.id === 'skills-ml').text,
                         KB.find(d => d.id === 'skills-cv').text,
                         KB.find(d => d.id === 'skills-nlp').text].join('\n\n'),
        projects: () => KB.filter(d => d.id.startsWith('project-')).map(d => '• ' + d.text).join('\n\n'),
        contact:  () => KB.find(d => d.id === 'contact').text,
        socials:  () => KB.find(d => d.id === 'socials').text,
        resume:   () => KB.find(d => d.id === 'resume').text,
        about:    () => KB.find(d => d.id === 'identity').text
    };

    /* ------------------------------------------------------------
       4. UI
    ------------------------------------------------------------ */
    const HTML = `
    <div class="jb-chat-root">
      <button class="jb-chat-fab" id="jb-fab" aria-label="Open AI assistant">
        <span class="jb-chat-ping"></span>
        <i class="fas fa-terminal"></i>
      </button>
      <div class="jb-chat-window" id="jb-window" role="dialog" aria-label="Junaid AI Terminal">
        <div class="jb-chat-header">
          <div class="jb-dots">
            <span class="jb-dot-red"></span>
            <span class="jb-dot-yellow"></span>
            <span class="jb-dot-green"></span>
          </div>
          <div class="jb-chat-title">junaid@portfolio ~ <b>ai-assistant</b></div>
          <button class="jb-chat-close" id="jb-close" aria-label="Close">✕</button>
        </div>
        <div class="jb-chat-log" id="jb-log"></div>
        <div class="jb-suggestions" id="jb-suggestions"></div>
        <form class="jb-chat-input" id="jb-form" autocomplete="off">
          <span class="jb-prompt">$</span>
          <input type="text" id="jb-input" placeholder="ask anything… (type 'help')" autocomplete="off" />
          <button type="submit">RUN ▸</button>
        </form>
      </div>
    </div>`;

    function mount() {
        const host = document.createElement('div');
        host.innerHTML = HTML;
        document.body.appendChild(host.firstElementChild);
    }

    function el(id) { return document.getElementById(id); }

    function escapeHTML(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Allow our own anchor/tags that we put in KB (already safe strings)
    function isTrusted(text) {
        return /<(a|br|b|i|em|strong|code)(\s|>)/i.test(text);
    }

    function addLine(html, klass) {
        const log = el('jb-log');
        const line = document.createElement('div');
        line.className = 'jb-line ' + (klass || '');
        line.innerHTML = html;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
        return line;
    }

    function typewriter(target, text, done) {
        let i = 0;
        target.innerHTML = '<span class="jb-prompt-bot">ai ▸ </span><span class="jb-body"></span><span class="jb-cursor"></span>';
        const body = target.querySelector('.jb-body');
        const cur  = target.querySelector('.jb-cursor');
        const safe = isTrusted(text);
        const speed = Math.max(6, Math.min(18, 900 / text.length));
        const tick = () => {
            if (i >= text.length) { if (cur) cur.remove(); done && done(); return; }
            // advance one char; if trusted content, drop in raw when we reach a tag
            if (safe && text[i] === '<') {
                const end = text.indexOf('>', i);
                body.innerHTML += text.slice(i, end + 1);
                i = end + 1;
            } else {
                body.innerHTML += (safe ? text[i] : escapeHTML(text[i]));
                i++;
            }
            el('jb-log').scrollTop = el('jb-log').scrollHeight;
            setTimeout(tick, speed);
        };
        tick();
    }

    function respond(query) {
        // echo user
        addLine(`<span class="jb-prompt">$</span> <span class="jb-cmd">${escapeHTML(query)}</span>`, 'jb-user');

        const cleaned = query.trim().toLowerCase();
        if (!cleaned) return;

        if (cleaned === 'clear' || cleaned === 'cls') {
            el('jb-log').innerHTML = '';
            greet(false);
            return;
        }

        if (COMMANDS[cleaned]) {
            const ghost = addLine('', 'jb-bot');
            typewriter(ghost, COMMANDS[cleaned]());
            return;
        }

        // smalltalk / greetings before similarity retrieval
        const small = smalltalk(query);
        if (small) {
            const ghost = addLine('', 'jb-bot');
            typewriter(ghost, small);
            return;
        }

        const hit = retrieve(query);
        const ghost = addLine('', 'jb-bot');
        if (!hit) {
            typewriter(ghost, `I couldn't match that to anything in my knowledge base. Try one of these: <b>whoami</b>, <b>skills</b>, <b>projects</b>, <b>experience</b>, <b>contact</b>, <b>resume</b> — or type <b>help</b> for the full list.`);
            return;
        }
        typewriter(ghost, hit.doc.text);
    }

    /* ---------- boot ---------- */
    const SUGGESTIONS = ['whoami', 'skills', 'projects', 'contact', 'education', 'resume'];

    function renderSuggestions() {
        const host = el('jb-suggestions');
        host.innerHTML = '';
        SUGGESTIONS.forEach(s => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'jb-sugg-chip';
            b.textContent = s;
            b.addEventListener('click', () => { el('jb-input').value = s; submit(); });
            host.appendChild(b);
        });
    }

    function greet(initial) {
        addLine(`<span class="jb-prompt-bot">system ▸</span> Terminal initialised. Retrieval engine loaded with ${KB.length} memory chunks.`, 'jb-sys');
        const g = addLine('', 'jb-bot');
        typewriter(g, `Hi, I'm Junaid's AI assistant. Ask me anything about his skills, projects, experience or how to hire him. Type "help" for commands.`);
    }

    const history = [];
    let hIdx = -1;

    function submit() {
        const input = el('jb-input');
        const q = input.value;
        if (!q.trim()) return;
        history.push(q);
        hIdx = history.length;
        input.value = '';
        respond(q);
    }

    function bind() {
        el('jb-fab').addEventListener('click', () => {
            el('jb-window').classList.toggle('is-open');
            if (el('jb-window').classList.contains('is-open')) {
                setTimeout(() => el('jb-input').focus(), 300);
            }
        });
        el('jb-close').addEventListener('click', () => {
            el('jb-window').classList.remove('is-open');
        });
        el('jb-form').addEventListener('submit', e => { e.preventDefault(); submit(); });
        el('jb-input').addEventListener('keydown', e => {
            if (e.key === 'ArrowUp')   { if (hIdx > 0)               { hIdx--; el('jb-input').value = history[hIdx] || ''; } e.preventDefault(); }
            if (e.key === 'ArrowDown') { if (hIdx < history.length-1) { hIdx++; el('jb-input').value = history[hIdx] || ''; } else { hIdx = history.length; el('jb-input').value = ''; } e.preventDefault(); }
        });
        // Esc to close
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') el('jb-window').classList.remove('is-open');
            // Ctrl+/ to toggle
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                el('jb-fab').click();
            }
        });
    }

    function init() {
        mount();
        bind();
        renderSuggestions();
        greet(true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
