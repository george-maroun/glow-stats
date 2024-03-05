export default function getWeeksSinceStart() {
  const genesisTimeInSeconds = 1700352000;
  const start = new Date(genesisTimeInSeconds * 1000);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  return weeks;
};