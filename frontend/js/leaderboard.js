// leaderboard.js
// React Leaderboard Component – Fetches from backend and displays table

const e = React.createElement;

function Leaderboard() {
  const [scores, setScores] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch("http://localhost:3000/api/quiz-score");
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();
        setScores(data.scores || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, []);

  if (loading) {
    return e("p", null, "Loading leaderboard...");
  }

  if (error) {
    return e("p", { style: { color: "red" } }, "Error: " + error);
  }

  if (scores.length === 0) {
    return e("p", null, "No scores yet — be the first to play!");
  }

  return e(
    "div",
    { className: "leaderboard" },
    e(
      "table",
      { className: "leaderboard-table" },
      e(
        "thead",
        null,
        e(
          "tr",
          null,
          e("th", null, "Player"),
          e("th", null, "Score"),
          e("th", null, "Difficulty"),
          e("th", null, "Date")
        )
      ),
      e(
        "tbody",
        null,
        scores.map((s, idx) =>
          e(
            "tr",
            { key: idx },
            e("td", null, s.user_name || "Anonymous"),
            e("td", null, `${s.score}/${s.total_questions} (${s.percentage}%)`),
            e("td", null, s.difficulty),
            e("td", null, new Date(s.created_at).toLocaleDateString())
          )
        )
      )
    )
  );
}

// Mount React component
const root = document.getElementById("leaderboard-root");
if (root) {
  const reactRoot = ReactDOM.createRoot(root);
  reactRoot.render(e(Leaderboard));
}
