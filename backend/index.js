import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import axios from 'axios';
import { gql } from 'graphql-tag';

const app = express();
const PORT = 3069;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

let cachedContests = {
  data: [],
  lastFetched: 0,
};

// GraphQL Schema
const typeDefs = gql`
  type Contest {
    title: String
    titleSlug: String
    startTime: String
    duration: Int
    platform: String
    url: String
  }

  type Query {
    allUpcomingContests: [Contest]
  }
`;

// Platform Fetchers
const fetchLeetCodeContests = async () => {
  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: `
          query upcomingContests {
            upcomingContests {
              title
              titleSlug
              startTime
              duration
            }
          }
        `,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data.data.upcomingContests.map((contest) => ({
      title: contest.title,
      titleSlug: contest.titleSlug,
      startTime: new Date(parseInt(contest.startTime) * 1000).toLocaleString(),
      duration: Math.floor(contest.duration / 60),
      platform: 'LeetCode',
      url: `https://leetcode.com/contest/${contest.titleSlug}`,
    }));
  } catch (error) {
    console.error('❌ LeetCode Fetch Error:', error.message);
    return [];
  }
};

const fetchCodeChefContests = async () => {
  try {
    const response = await axios.get('https://www.codechef.com/api/list/contests/all');
    const upcoming = response.data.future_contests;

    return upcoming.map((contest) => ({
      title: contest.contest_name,
      titleSlug: contest.contest_code,
      startTime: new Date(contest.start_date).toLocaleString(),
      duration: null,
      platform: 'CodeChef',
      url: `https://www.codechef.com/${contest.contest_code}`,
    }));
  } catch (error) {
    console.error('❌ CodeChef Fetch Error:', error.message);
    return [];
  }
};

const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    const upcoming = response.data.result.filter(
      (contest) => contest.phase === 'BEFORE'
    );

    return upcoming.map((contest) => ({
      title: contest.name,
      titleSlug: contest.id.toString(),
      startTime: new Date(contest.startTimeSeconds * 1000).toLocaleString(),
      duration: Math.floor(contest.durationSeconds / 60),
      platform: 'Codeforces',
      url: `https://codeforces.com/contests/${contest.id}`,
    }));
  } catch (error) {
    console.error('❌ Codeforces Fetch Error:', error.message);
    return [];
  }
};

// Caching + Combining
const getAllContests = async () => {
  const now = Date.now();
  if (now - cachedContests.lastFetched < CACHE_DURATION_MS) {
    return cachedContests.data;
  }

  const [lc, cc, cf] = await Promise.all([
    fetchLeetCodeContests(),
    fetchCodeChefContests(),
    fetchCodeforcesContests(),
  ]);

  const combined = [...lc, ...cc, ...cf];
  combined.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  cachedContests = {
    data: combined,
    lastFetched: now,
  };

  return combined;
};

// GraphQL Resolver
const resolvers = {
  Query: {
    allUpcomingContests: async () => await getAllContests(),
  },
};

// REST Endpoint
app.get('/contests', async (_req, res) => {
  const data = await getAllContests();
  res.json(data);
});

// Start Apollo + Express
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();

  app.use(bodyParser.json());
  app.use(cors({ origin: 'http://localhost:3090' }));

  app.use('/graphql', expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL: http://localhost:${PORT}/graphql`);
    console.log(`📦 REST:     http://localhost:${PORT}/contests`);
  });
}

startServer();
