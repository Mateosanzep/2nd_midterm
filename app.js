const path = require('path');
const https = require('https');
const express = require('express');

const API_BASE = 'https://akabab.github.io/superhero-api/api';
const HEROES_URL = `${API_BASE}/all.json`;

const app = express();

function getJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (apiRes) => {
            if (apiRes.statusCode !== 200) {
                apiRes.resume();
                reject(new Error(`Error fetching data. Status: ${apiRes.statusCode}`));
                return;
            }

            let data = '';

            apiRes.on('data', (chunk) => {
                data += chunk;
            });

            apiRes.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

async function getHeroes() {
    const heroes = await getJson(HEROES_URL);
    return heroes;
}

function cleanText(value) {
    if (typeof value !== 'string') {
        return null;
    }

    const text = value.trim();
    if (!text || text === '-' || text.toLowerCase() === 'null') {
        return null;
    }

    return text;
}

function getHeroImage(hero) {
    const fallbackImg = '/images/anonimus.png';
    const heroImg = hero?.images?.md || hero?.images?.lg || hero?.images?.sm || null;
    const isDefaultImg = !heroImg || heroImg.endsWith('/no-portrait.jpg');

    return {
        src: isDefaultImg ? fallbackImg : heroImg,
        alt: isDefaultImg ? `Placeholder silhouette for ${hero.name}` : `${hero.name} portrait`,
        isPlaceholder: isDefaultImg,
    };
}

function heroSummary(hero) {
    const fullName = cleanText(hero?.biography?.fullName);
    if (fullName) {
        return fullName;
    }

    const publisherText = cleanText(hero?.biography?.publisher);
    if (publisherText) {
        return `Publisher: ${publisherText}`;
    }

    const alignmentText = cleanText(hero?.biography?.alignment);
    if (alignmentText) {
        return `Alignment: ${alignmentText}`;
    }

    return 'Info pending';
}

function makeCard(hero) {
    const image = getHeroImage(hero);

    return {
        id: hero.id,
        name: hero.name,
        subtitle: heroSummary(hero),
        imageSrc: image.src,
        imageAlt: image.alt,
        isPlaceholder: image.isPlaceholder,
    };
}

function getBio(hero) {
    return (
        cleanText(hero?.work?.occupation)
        || cleanText(hero?.biography?.firstAppearance)
        || (cleanText(hero?.biography?.alignment) ? `Alignment: ${hero.biography.alignment}` : null)
        || 'No biography available.'
    );
}

function getAliases(hero) {
    if (!Array.isArray(hero?.biography?.aliases)) {
        return [];
    }

    return hero.biography.aliases
        .map((alias) => cleanText(alias))
        .filter(Boolean);
}

function getNavIds(heroes, heroId) {
    if (!Array.isArray(heroes) || heroes.length <= 1) {
        return { prevId: null, nextId: null };
    }

    const sortedIds = heroes
        .map((hero) => hero.id)
        .filter((id) => Number.isInteger(id))
        .sort((a, b) => a - b);

    const currentPos = sortedIds.indexOf(heroId);

    if (currentPos === -1) {
        return { prevId: null, nextId: null };
    }

    const prevId = sortedIds[(currentPos - 1 + sortedIds.length) % sortedIds.length];
    const nextId = sortedIds[(currentPos + 1) % sortedIds.length];

    return {
        prevId: prevId === heroId ? null : prevId,
        nextId: nextId === heroId ? null : nextId,
    };
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    if (typeof req.query?.q === 'string') {
        res.locals.searchQuery = req.query.q.trim();
    } else {
        res.locals.searchQuery = '';
    }
    next();
});

app.get('/', (req, res) => {
    res.render('homepage');
});

app.get('/catalog', async (req, res) => {
    try {
        const heroes = await getHeroes();
        const cards = heroes.map(makeCard);
        res.render('catalog', { heroes: cards });
    } catch (error) {
        console.error('Failed to load hero catalog', error);
        res.status(502).send('Hero data is unavailable right now.');
    }
});

app.get('/search', async (req, res) => {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    if (!query) {
        res.redirect('/catalog');
        return;
    }

    const queryLower = query.toLowerCase();

    try {
        const heroes = await getHeroes();
        const match = heroes.find((hero) => typeof hero.name === 'string' && hero.name.toLowerCase() === queryLower)
            || heroes.find((hero) => typeof hero.name === 'string' && hero.name.toLowerCase().includes(queryLower));

        if (match) {
            res.redirect(`/heroes/${match.id}`);
            return;
        }

        res.status(404).render('search-error', { query, technicalError: false });
    } catch (error) {
        console.error('Failed to process hero search', error);
        res.status(502).render('search-error', { query, technicalError: true });
    }
});

app.get('/heroes/:id', async (req, res) => {
    const heroId = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(heroId) || heroId <= 0) {
        res.status(400).send('Invalid hero identifier.');
        return;
    }

    try {
        const heroes = await getHeroes();
        const hero = heroes.find((entry) => entry.id === heroId);

        if (!hero) {
            res.status(404).send('Hero not found.');
            return;
        }

        const { prevId, nextId } = getNavIds(heroes, heroId);

        res.render('hero', {
            hero,
            biographySnippet: getBio(hero),
            aliases: getAliases(hero),
            prevId,
            nextId,
            heroMedia: getHeroImage(hero),
        });
    } catch (error) {
        console.error(`Failed to fetch hero ${req.params.id}`, error);
        res.status(500).send('Unable to load hero details right now.');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});