//  🔥 AUTO MOVIE POSTER TO TELEGRAM BOT
//  Works inside AI Studio (browser environment)

// ======== YOUR SETTINGS ========
const TMDB_KEY = "8baba8ab6b8bbe247645bcae7df63d0d";            // from themoviedb.org
const TELEGRAM_BOT_TOKEN = "8101871900:AAEMazlKqHD7DVTQ_pu30DSghTMAgYuTik8"; // from @BotFather
const CHAT_ID = "@CineflixMoviesOfficial";       // numeric ID or @channel_name
const WEBSITE_URL = "https://cineflix.netlify.app"; // your movie site
const POST_LIMIT = 5;                            // how many movies to post
const INTERVAL_HOURS = 0.5;                      // how often to repeat (0.5 = 30 minutes)
const POSTED_MOVIES_KEY = 'cineflix_posted_movies'; // localStorage key
const MAX_HISTORY_SIZE = 200;                    // Remember the last 200 posted movies
// =================================

// Helper delay
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function sendLatestMovies() {
  try {
    console.log("🎬 Fetching movies from TMDb...");

    // Fetch multiple pages to get a larger pool of potential new movies
    const fetchPage = async (page) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_KEY}&language=en-US&page=${page}`
      );
      const data = await res.json();
      return data.results || [];
    };
    
    // Fetch first two pages
    const [page1, page2] = await Promise.all([fetchPage(1), fetchPage(2)]);
    const allMovies = [...page1, ...page2];

    if (allMovies.length === 0) throw new Error("No movies found on TMDb");

    // Get IDs of movies we've already posted from browser's local storage
    let postedMovieIds = [];
    try {
      const storedIds = localStorage.getItem(POSTED_MOVIES_KEY);
      if (storedIds) {
        postedMovieIds = JSON.parse(storedIds);
      }
    } catch (e) {
      console.error("Could not parse posted movie IDs from localStorage", e);
      postedMovieIds = [];
    }
    
    // Filter out movies that have already been posted
    const newMovies = allMovies.filter(m => m.id && m.poster_path && !postedMovieIds.includes(m.id));

    if (newMovies.length === 0) {
      console.log("✅ No new movies to post at this time.");
      return;
    }
    
    const moviesToPost = newMovies.slice(0, POST_LIMIT);
    const postedIdsInThisRun = [];

    for (const m of moviesToPost) {
      const caption = `
🎬 *${m.title}*
📅 Release: ${m.release_date}
⭐ Rating: ${m.vote_average.toFixed(1)}
🔗 [Watch Now](${WEBSITE_URL}/movie/${m.id})
`;

      const body = {
        chat_id: CHAT_ID,
        photo: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
        caption,
        parse_mode: "Markdown"
      };

      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const responseData = await response.json();
      if (!responseData.ok) {
        console.error(`❌ Failed to send ${m.title}:`, responseData.description);
      } else {
        console.log(`✅ Sent: ${m.title}`);
        postedIdsInThisRun.push(m.id);
      }
      
      // Increased delay to be safer with more frequent posting
      await sleep(3000);
    }

    if (postedIdsInThisRun.length > 0) {
      const updatedPostedIds = [...postedIdsInThisRun, ...postedMovieIds].slice(0, MAX_HISTORY_SIZE);
      localStorage.setItem(POSTED_MOVIES_KEY, JSON.stringify(updatedPostedIds));
      console.log(`✅ Finished posting ${postedIdsInThisRun.length} new movies.`);
    }

  } catch (err) {
    console.error("❌ An error occurred during the process:", err);
  }
}

// Run now
sendLatestMovies();

// Repeat automatically
setInterval(sendLatestMovies, INTERVAL_HOURS * 60 * 60 * 1000);