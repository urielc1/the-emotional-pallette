// Emotional Pallette — browser-only interaction. No information is transmitted or saved.
const artworks = [
  {
    title: 'The Starry Night', artist: 'Vincent van Gogh', date: '1889 · Oil on canvas',
    image: 'images/starry-night.jpg',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    imageAlt: 'A night sky filled with whirling blue forms and bright stars over a quiet village',
    options: [
      ['Wonder', 'The tremendous sky and luminous stars can suggest a sense of scale beyond the village.'],
      ['Stillness', 'The compact village and dark night may invite a quieter reading, even beneath the moving sky.'],
      ['Restlessness', 'The strong curves and pronounced brushwork may be read as turbulent.'],
      ['Solitude', 'The distance between the village and expansive sky might feel isolating.']
    ],
    history: 'Van Gogh painted this work in 1889 during his stay in Saint-Rémy-de-Provence. It is now in the Museum of Modern Art collection.'
  },
  {
    title: 'Bridge over a Pond of Water Lilies', artist: 'Claude Monet', date: '1899 · Oil on canvas',
    image: 'images/monet-bridge.jpg',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Bridge_over_a_Pond_of_Water_Lilies_by_Claude_Monet_(1899).jpg',
    imageAlt: 'A gently curved footbridge among dense green vegetation reflected in water',
    options: [
      ['Calm', 'The still pond and soft transitions may encourage a gentle reading.'],
      ['Nostalgia', 'A familiar garden-like space might connect with personal memories of nature.'],
      ['Curiosity', 'The layered reflections make it difficult to separate plant, water, and light at first glance.'],
      ['Enclosure', 'The dense foliage and narrow bridge might make the scene feel private or contained.']
    ],
    history: 'Monet cultivated a water garden at Giverny and returned to the subject of its bridge and pond repeatedly. This 1899 painting is in The Metropolitan Museum of Art.'
  },
  {
    title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', date: 'c. 1830–32 · Woodblock print',
    image: 'images/great-wave.jpg',
    imageSource: 'https://commons.wikimedia.org/wiki/File:GreatWave.jpg',
    imageAlt: 'A massive curling wave above small boats with Mount Fuji in the distance',
    options: [
      ['Awe', 'The wave dwarfs the boats; nature occupies almost the whole scene.'],
      ['Fear', 'The crest appears poised above the boats, inviting a reading of danger.'],
      ['Energy', 'The repeated curves and diagonals suggest force and movement.'],
      ['Balance', 'The strong shapes and repeating forms may also register as composed and rhythmic.']
    ],
    history: 'Hokusai made this woodblock print for his series Thirty-six Views of Mount Fuji. The mountain appears small in the distance, beyond the turbulent water.'
  }
];
const $ = id => document.getElementById(id);
let index = 0;
const selected = [null, null, null];
function paint() {
  const work = artworks[index];
  $('work-title').textContent = work.title;
  $('work-maker').textContent = work.artist;
  $('work-date').textContent = work.date;
  $('progress-count').textContent = `${String(index + 1).padStart(2,'0')} / 03`;
  $('progress-bar').style.width = `${(index + 1) * 100 / 3}%`;
  $('painting-caption').textContent = `${work.artist} / ${work.date}`;
  $('painting-source').href = work.imageSource;
  const image = $('painting-image');
  image.alt = work.imageAlt;
  image.hidden = false;
  $('painting-fallback').hidden = true;
  image.src = work.image;
  $('emotion-options').replaceChildren();
  work.options.forEach(([name], choiceIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'emotion-button';
    button.setAttribute('aria-pressed', String(selected[index] === choiceIndex));
    const text = document.createElement('span');
    text.textContent = name;
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    button.append(text, arrow);
    button.addEventListener('click', () => { selected[index] = choiceIndex; updateChoice(); });
    $('emotion-options').append(button);
  });
  updateChoice();
  $('previous').disabled = index === 0;
  $('next').textContent = index === 2 ? 'SEE YOUR RESPONSES ↗' : 'NEXT WORK ↗';
}
function updateChoice() {
  const choice = selected[index];
  const hasChoice = choice !== null;
  $('next').disabled = !hasChoice;
  $('reflection').hidden = !hasChoice;
  [...$('emotion-options').children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === choice)));
  $('context').hidden = true;
  $('context-trigger').hidden = false;
  if (hasChoice) {
    $('reflection-text').textContent = artworks[index].options[choice][1];
    $('context-text').textContent = artworks[index].history;
  }
}
$('painting-image').addEventListener('error', () => {
  $('painting-image').hidden = true;
  $('painting-fallback').hidden = false;
});
$('context-trigger').addEventListener('click', () => {
  $('context').hidden = false;
  $('context-trigger').hidden = true;
});
$('previous').addEventListener('click', () => { if (index > 0) { index--; paint(); } });
$('next').addEventListener('click', () => {
  if (selected[index] === null) return;
  if (index < 2) { index++; paint(); }
  else showResults();
});
function showResults() {
  const root = $('results-grid');
  root.replaceChildren();
  artworks.forEach((work, i) => {
    const item = document.createElement('div');
    item.className = 'result-item';
    const eyebrow = document.createElement('span');
    eyebrow.textContent = `0${i+1} / ${work.title}`;
    const answer = document.createElement('strong');
    answer.textContent = work.options[selected[i]][0];
    item.append(eyebrow, answer);
    root.append(item);
  });
  $('your-palette').hidden = false;
  $('your-palette').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
$('restart').addEventListener('click', () => {
  selected.fill(null);
  index = 0;
  $('your-palette').hidden = true;
  paint();
  $('experience').scrollIntoView({ behavior: 'smooth' });
});
paint();
