const cfg = window.CTF_CONFIG || {};

const challenges = [
  {
    n: '01',
    id: 'Q01',
    title: 'GHOST STRING',
    diff: 'EASY',
    pts: 100,
    file: 'challenges/q1_ghost_string.exe',
    desc: 'Recover an 11-character input. The useful value is reconstructed at runtime rather than stored as readable plaintext.'
  },

  {
    n: '02',
    id: 'Q02',
    title: 'THE PACKAGE',
    diff: 'EASY',
    pts: 100,
    file: 'challenges/q2_the_package.exe',
    desc: 'Ignore decoys, find the real validation path, and recover the stage-1 token that unlocks the final flag.'
  },

  {
    n: '03',
    id: 'Q03',
    title: 'CLOCKWORK SERIAL',
    diff: 'MEDIUM',
    pts: 150,
    file: 'challenges/q3_clockwork_serial.exe',
    desc: 'Reverse a serial generator where arithmetic gates, a derived seed and byte transforms interact.'
  },

  {
    n: '04',
    id: 'Q04',
    title: 'DEAD CHANNEL',
    diff: 'MEDIUM',
    pts: 150,
    file: 'challenges/q4_dead_channel.exe',
    extra: [
      ['Captured traffic', 'challenges/dead_channel.pcap']
    ],
    desc: 'Reconstruct captured traffic, recover the decoder seed from the executable, and invert the stateful payload transformation.'
  },

  {
    n: '05',
    id: 'Q05',
    title: 'THE ARCHIVIST',
    diff: 'HARD',
    pts: 250,
    file: 'challenges/q5_the_archivist.exe',
    desc: 'Recover an embedded archive, derive its password, reproduce a runtime-dependent decoder, verify the checksum and recover the final flag.'
  }
];


function renderChallenges() {
  const grid = document.getElementById('challengeGrid');

  if (!grid) return;

  grid.innerHTML = challenges.map(c => `
    <article class="card ${c.diff.toLowerCase()}">

      <div class="card-top">
        <span>${c.id}</span>
        <b>${c.diff}</b>
      </div>

      <h3>${c.title}</h3>

      <p>${c.desc}</p>

      <div class="chips">
        <span>${c.pts} PTS</span>
      </div>

      <div class="download-row">

        <a href="${c.file}" download>
          DOWNLOAD EXE <span>↓</span>
        </a>

        ${
          (c.extra || [])
            .map(e => `
              <a href="${e[1]}" download>
                ${e[0].toUpperCase()} <span>↓</span>
              </a>
            `)
            .join('')
        }

      </div>

      <div class="stage">
        MULTI-STAGE CHALLENGE
        <span>•</span>
        CHECKPOINTS
      </div>

    </article>
  `).join('');
}


function updateLinks() {
  const submit = document.getElementById('submitBtn');
  const reg = document.getElementById('regBtn');

  if (submit) {

    if (cfg.submissionURL) {

      submit.href = cfg.submissionURL;
      submit.classList.remove('disabled');

    } else {

      submit.href = '#';
      submit.classList.add('disabled');

      submit.addEventListener('click', event => {

        event.preventDefault();

        alert(
          'Submission URL has not been configured by the organizer yet.'
        );

      });

    }
  }


  if (reg) {

    if (cfg.registrationURL) {

      reg.href = cfg.registrationURL;
      reg.style.display = '';

    } else {

      reg.style.display = 'none';

    }

  }
}


function timerTick() {

  const timer = document.getElementById('timer');
  const status = document.getElementById('timerStatus');

  if (!timer || !status) return;


  if (!cfg.eventStartISO) {

    timer.textContent = '--:--:--';
    status.textContent = 'Configure event start time';

    return;
  }


  const start =
    new Date(cfg.eventStartISO).getTime();

  const duration =
    (cfg.durationMinutes || 60) * 60 * 1000;

  const end = start + duration;

  const now = Date.now();

  let target;
  let label;


  if (now < start) {

    target = start;
    label = 'ROUND STARTS IN';

  }

  else if (now < end) {

    target = end;
    label = 'TIME REMAINING';

  }

  else {

    target = now;
    label = 'ROUND CLOSED';

  }


  const remaining =
    Math.max(0, target - now);


  const hours =
    Math.floor(remaining / 3600000);

  const minutes =
    Math.floor(
      (remaining % 3600000) / 60000
    );

  const seconds =
    Math.floor(
      (remaining % 60000) / 1000
    );


  timer.textContent =
    `${String(hours).padStart(2, '0')}:` +
    `${String(minutes).padStart(2, '0')}:` +
    `${String(seconds).padStart(2, '0')}`;


  status.textContent = label;

  status.classList.toggle(
    'closed',
    now >= end
  );
}


function terminal() {

  const terminalElement =
    document.getElementById('term');

  if (!terminalElement) return;


  const lines = [
    '$ ./round1',
    '> loading challenge index...',
    '> anti-guess layers: enabled',
    '> checkpoint scoring: enabled',
    '> source code: not provided',
    '',
    'READY_'
  ];


  let index = 0;


  setInterval(() => {

    index = (index + 1) % lines.length;

    terminalElement.textContent =
      lines
        .slice(
          0,
          index === 0
            ? lines.length
            : index + 1
        )
        .join('\n');

  }, 1400);
}


renderChallenges();

updateLinks();

timerTick();

setInterval(
  timerTick,
  1000
);

terminal();
