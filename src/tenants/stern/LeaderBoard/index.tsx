import LeaderBoard from '../../../features/public/LeaderBoard';

interface Props {
  leaderboard: any;
}

export default function About({ leaderboard }: Props) {
  return (
    <main>
      <LeaderBoard leaderboard={leaderboard} />
    </main>
  );
}
